// src/controllers/search.controller.js
import { esClient, ES_INDEX } from "../config/es.js";

class SearchController {
  async search(req, res, next) {
    try {
      const { q = "", from = 0, size = 10, minPrice, maxPrice } = req.query;

      // ✅ 1. Tạo các điều kiện tìm kiếm
      const must = [];
      const filter = [];

      // --- Tìm kiếm full-text ---
      const queryTerm = q.toString();
      if (queryTerm && queryTerm.trim() !== "") {
        must.push({
          multi_match: {
            query: queryTerm,
            fields: [
              "name^3", // chỉ tìm theo name
              "shortDescription^2", // và shortDescription
            ],
            type: "best_fields",
            fuzziness: "AUTO", // cho phép tìm gần đúng ("ao thun" ra "áo thun")
            operator: "and",
          },
        });
      }

      // --- Bộ lọc khoảng giá ---
      if (minPrice || maxPrice) {
        const range = {};
        if (minPrice) range.gte = Number(minPrice);
        if (maxPrice) range.lte = Number(maxPrice);
        filter.push({ range: { price: range } });
      }

      // ✅ 2. Tạo body truy vấn
      const body = {
        query: {
          bool: {
            must: must.length ? must : [{ match_all: {} }],
            filter,
          },
        },
        from: Number(from),
        size: Number(size),
        sort: [{ _score: "desc" }, { createdAt: "desc" }],
      };

      // ✅ 3. Gửi truy vấn
      const result = await esClient.search({
        index: ES_INDEX,
        body,
      });

      const hits = result.hits?.hits || [];

      // ✅ 4. Trả về dữ liệu
      res.json({
        success: true,
        total: result.hits?.total?.value || 0,
        items: hits.map((h) => ({
          id: h._id,
          score: h._score,
          ...h._source,
        })),
      });
    } catch (err) {
      console.error("Elasticsearch search error:", err.meta?.body || err);
      next(err);
    }
  }

  async indexOne(req, res, next) {
    try {
      const { id } = req.body;
      const doc = req.body;
      if (!id)
        return res
          .status(400)
          .json({ success: false, message: "id is required" });

      await esClient.index({
        index: ES_INDEX,
        id: String(id),
        document: doc,
        refresh: "wait_for",
      });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  async bulkIndex(req, res, next) {
    try {
      const { items } = req.body; // items: array of { id, ...fields }
      if (!Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "items must be a non-empty array" });
      }

      const ops = [];
      for (const it of items) {
        if (!it || !it.id) continue;
        ops.push({ index: { _index: ES_INDEX, _id: String(it.id) } });
        ops.push(it);
      }

      const resp = await esClient.bulk({
        refresh: "wait_for",
        operations: ops,
      });
      const errored = resp.items?.filter((it) => it.index?.error) || [];
      res.json({
        success: true,
        items: items.length,
        errors: errored.length,
        errorItems: errored,
      });
    } catch (err) {
      next(err);
    }
  }

  async resetIndex(req, res, next) {
    try {
      // Danger: delete and recreate index (dev-only)
      const exists = await esClient.indices.exists({ index: ES_INDEX });
      if (exists) {
        await esClient.indices.delete({ index: ES_INDEX });
      }
      // re-create with ensureIndex mapping
      // To avoid circular import, inline minimal mapping here
      await esClient.indices.create({
        index: ES_INDEX,
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
        },
        mappings: {
          properties: {
            id: { type: "keyword" },
            name: { type: "text", fields: { keyword: { type: "keyword" } } },
            description: { type: "text" },
            brand: { type: "keyword" },
            category: { type: "keyword" },
            price: { type: "float" },
            inStock: { type: "boolean" },
            createdAt: { type: "date" },
            updatedAt: { type: "date" },
          },
        },
      });

      res.json({ success: true, message: `Index ${ES_INDEX} reset` });
    } catch (err) {
      next(err);
    }
  }

  // Sync a single product by calling commerce_service then index into ES
  async syncProductById(req, res, next) {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({ success: false, message: "id is required" });

      const base =
        process.env.COMMERCE_SERVICE_URL || "http://commerce_service:8002";
      const url = `${base}/api/products/${encodeURIComponent(id)}`;

      const resp = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!resp.ok) {
        return res.status(502).json({
          success: false,
          message: `Failed to fetch product from commerce_service: ${resp.status}`,
        });
      }
      const payload = await resp.json();
      const product = payload?.data || payload?.product || payload; // handle ApiResponse or raw
      if (!product?._id) {
        return res.status(404).json({
          success: false,
          message: "Product not found or invalid response",
        });
      }

      // Build search document
      const doc = {
        id: String(product._id),
        name: product.name,
        slug: product.slug,
        image: product.image || "",
        shortDescription: product.shortDescription || "",
        description: `${product.shortDescription || ""}\n\n${
          product.longDescription || ""
        }`.trim(),
        brand: String(product.brand?._id || product.brand || "").toLowerCase(),
        category: String(
          product.category?._id || product.category || ""
        ).toLowerCase(),
        price: product.cachedPrice?.min ?? 0,
        inStock: Array.isArray(product.variants)
          ? product.variants.some(
              (v) =>
                v?.isInStock || (typeof v?.stock === "number" && v.stock > 0)
            )
          : false,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };

      await esClient.index({
        index: ES_INDEX,
        id: doc.id,
        document: doc,
        refresh: "wait_for",
      });
      return res.json({ success: true, message: "Indexed", doc });
    } catch (err) {
      next(err);
    }
  }

  async syncAllProducts(req, res, next) {
    try {
      const base =
        process.env.COMMERCE_SERVICE_URL || "http://commerce_service:8002";
      const limit = Number(req.query.limit) || 200; // import chunk size when pagination is supported
      const sort = encodeURIComponent(req.query.sort || "-createdAt");

      let totalFetched = 0;
      let totalIndexed = 0;
      let totalErrors = 0;

      // Attempt to use a paginated endpoint first
      const tryPage = async (page) => {
        const url = `${base}/api/products?page=${page}&limit=${limit}&sort=${sort}`;
        const resp = await fetch(url, {
          headers: { Accept: "application/json" },
        });
        if (!resp.ok) throw new Error(`Fetch failed ${resp.status}`);
        const payload = await resp.json();
        // Two possible shapes:
        // 1) { data: { products: [...], pagination: {...} } }
        // 2) { data: [ ... ] }
        let products = [];
        let pagination = undefined;
        if (Array.isArray(payload?.data)) {
          // Non-paginated shape (entire dataset)
          products = payload.data;
        } else if (payload?.data?.products) {
          products = payload.data.products;
          pagination = payload.data.pagination || payload.pagination;
        } else if (Array.isArray(payload)) {
          products = payload;
        }

        return { products, pagination };
      };

      // Fetch first page to detect shape
      const first = await tryPage(1);
      if (first.products.length === 0) {
        return res.json({
          success: true,
          message: "No products to index",
          totalFetched: 0,
          totalIndexed: 0,
        });
      }

      const docsFrom = (product) => ({
        id: String(product._id),
        name: product.name,
        slug: product.slug,
        image: product.image || "",
        shortDescription: product.shortDescription || "",
        description: `${product.shortDescription || ""}\n\n${
          product.longDescription || ""
        }`.trim(),
        brand: String(product.brand?._id || product.brand || "").toLowerCase(),
        category: String(
          product.category?._id || product.category || ""
        ).toLowerCase(),
        price: product.cachedPrice?.min ?? 0,
        inStock: false, // unknown without variants; can be updated later via events
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });

      const bulkIndex = async (items) => {
        if (!items.length) return { errors: 0 };
        const ops = [];
        for (const it of items) {
          if (!it?.id) continue;
          ops.push({ index: { _index: ES_INDEX, _id: String(it.id) } });
          ops.push(it);
        }
        const resp = await esClient.bulk({
          refresh: "wait_for",
          operations: ops,
        });
        const errored = resp.items?.filter((it) => it.index?.error) || [];
        return { errors: errored.length };
      };

      if (!first.pagination && first.products.length > 0) {
        // Assume full dataset
        const products = first.products;
        totalFetched = products.length;
        // chunking
        const chunkSize = 1000;
        for (let i = 0; i < products.length; i += chunkSize) {
          const batch = products.slice(i, i + chunkSize).map(docsFrom);
          const { errors } = await bulkIndex(batch);
          totalIndexed += batch.length - errors;
          totalErrors += errors;
        }

        return res.json({
          success: true,
          totalFetched,
          totalIndexed,
          totalErrors,
        });
      }

      // Paginated path
      let page = 1;
      const chunkSize = 1000; // ES bulk chunk
      let currentProducts = first.products;
      let hasMore = true;

      while (hasMore) {
        totalFetched += currentProducts.length;
        // bulk in chunks
        for (let i = 0; i < currentProducts.length; i += chunkSize) {
          const batch = currentProducts.slice(i, i + chunkSize).map(docsFrom);
          const { errors } = await bulkIndex(batch);
          totalIndexed += batch.length - errors;
          totalErrors += errors;
        }

        // next page
        page += 1;
        const next = await tryPage(page);
        currentProducts = next.products;
        // If pagination object exists, check if we reached the end
        if (next.pagination) {
            hasMore = page < next.pagination.totalPages;
        } else {
            // Fallback: stop if we get fewer items than limit, or no items
            hasMore = Array.isArray(currentProducts) && currentProducts.length === limit;
        }
      }

      return res.json({
        success: true,
        totalFetched,
        totalIndexed,
        totalErrors,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new SearchController();
