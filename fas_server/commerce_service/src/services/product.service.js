import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";
import UploadService from "./upload.service.js";

class ProductService {
  async getProducts(req) {
    const { active } = req.query;
    const filter = {};
    if (active !== "" && active !== undefined) filter.isActive = active;
    console.log(filter);
    const products = await Product.find(filter)
      .populate("brand category tags")
      .populate({
        path: "variants",
        match: { isActive: true },
      });
    return products;
  }

  async getProductsPagnition(filter = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      category,
      brand,
      minPrice,
      maxPrice,
      featured,
      search,
      color,
      size,
    } = options;

    // Build query
    let query = { isActive: true };

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (featured !== undefined) query.isFeatured = featured === "true";

    // Price range filter
    if (minPrice || maxPrice) {
      query["cachedPrice.min"] = {};
      query["cachedPrice.max"] = {};
      if (minPrice) query["cachedPrice.min"].$gte = parseInt(minPrice);
      if (maxPrice) query["cachedPrice.max"].$lte = parseInt(maxPrice);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Color & Size filter using attributes array
    if (color || size) {
      query.attributes = { $all: [] };
      if (color) {
        query.attributes.$all.push({
          $elemMatch: { name: "Màu", values: { $regex: new RegExp(`^${color}$`, "i") } }
        });
      }
      if (size) {
        query.attributes.$all.push({
          $elemMatch: { name: "Size", values: { $regex: new RegExp(`^${size}$`, "i") } }
        });
      }
    }

    // Execute query
    const products = await Product.find(query)
      .populate("brand category tags")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Build enhanced products list (ensure image consistency and compute derived fields)
    const enhancedProducts = await Promise.all(
      products.map(async (product) => {
        const variants = await Variant.find({
          product: product._id,
          isActive: true,
        });

        return {
          ...product,
          variantsCount: variants.length,
          inStock: variants.some((v) => v.stock > 0),
          displayPrice: this.formatDisplayPrice(product.cachedPrice),
          allImages: this.getAllProductImages(product, variants),
        };
      })
    );

    // Total count for pagination
    const total = await Product.countDocuments(query);

    return {
      products: enhancedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get single product với đầy đủ thông tin
  async getProductById(id) {
    const product = await Product.findById(id)
      .populate("brand category tags")
      .populate({
        path: "variants",
        match: { isActive: true },
      });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Cập nhật cached price nếu cần
    // If cachedPrice is empty, attempt to update from variants
    if (product.cachedPrice?.min === 0 && product.cachedPrice?.max === 0) {
      await product.updateCachedPrice();
      await product.populate("variants");
    }

    // Enhanced product data
    const enhancedProduct = {
      ...product.toObject(),
      displayPrice: this.formatDisplayPrice(product.cachedPrice),
      allImages: this.getAllProductImages(product, product.variants || []),
      variants: product.variants?.map((variant) => ({
        ...variant.toObject(),
        formattedPrice: variant.formattedPrice,
        stockStatus: variant.stockStatus,
        isInStock: variant.isInStock,
      })),
    };

    return enhancedProduct;
  }

  // Get product by slug
  async getProductBySlug(slug) {
    const product = await Product.findOne({ slug })
      // , isActive: true
      .populate("brand category tags")
      .populate({
        path: "variants",
        match: { isActive: true },
      });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return this.getProductById(product._id);
  }

  async getProductByCategory(id) {
    const product = await Product.find({ category: id, isActive: true })
      .populate("brand category tags")
      .populate({
        path: "variants",
        match: { isActive: true },
      });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // return this.getProductById(product._id);
    return product;
  }

  async createProduct(data) {
    try {
      const productData = this.prepareProductData(data);
      const product = await Product.create(productData);
      const variants = Product.generateVariants(product, data.basePrice || 0, data.baseStock || 0);

      console.log(variants);
      if (variants.length > 0) {
        try {
          await Variant.insertMany(variants);
        } catch (err) {
          if (err.code !== 1100)
            console.error("Error inserting generated variants:", err);
          throw err;
        }

        await product.updateCachedPrice();
      }
      console.log("Product created successfully:", product._id);
      return product;
    } catch (error) {
      throw error;
    }
  }

  // Update product
  async updateProduct(id, data) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      const updateData = this.prepareProductData(data);

      // Kiểm tra nếu ảnh mới khác ảnh cũ
      // if (updateData.image && updateData.image !== product.image) {
      //   const deleteImage = [product.image];

      // Xóa ảnh cũ song song (không chặn response)
      // (async () => {
      //   try {
      //     await UploadService.deleteImages(deleteImage);
      //   } catch (bgErr) {
      //     console.error(
      //       "Background image deletion failed for product",
      //       id,
      //       bgErr
      //     );
      //   }
      // })();
      // }

      // Cập nhật product
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    // Product chỉ có 1 ảnh duy nhất (string)
    const productImage = product.image ? [product.image] : [];

    // Lấy các variant của product
    const variants = await Variant.find({ product: id });

    // Mỗi variant cũng chỉ có 1 ảnh duy nhất (string)
    const variantImages = variants.map((v) => v.image).filter(Boolean);

    // Hợp nhất tất cả ảnh và loại trùng
    const allImages = Array.from(new Set([...productImage, ...variantImages]));

    // Xóa ảnh song song (không chặn response)
    (async () => {
      try {
        if (allImages.length > 0) {
          await UploadService.deleteImages(allImages);
        }
      } catch (bgErr) {
        console.error(
          "Background image deletion failed for product",
          id,
          bgErr
        );
      }
    })();

    // Xóa tất cả variants của product
    try {
      await Variant.deleteMany({ product: id });
    } catch (err) {
      console.error("Failed to delete variants for product", id, err);
    }

    // Xóa document product chính
    try {
      await Product.findByIdAndDelete(id);
    } catch (err) {
      console.error("Failed to delete product document", id, err);
      throw err;
    }

    return { message: "Product and related variants deleted" };
  }

  formatDisplayPrice(priceRange) {
    if (!priceRange || priceRange.min === 0) {
      return { formatted: "Liên hệ", min: 0, max: 0 };
    }

    if (priceRange.min === priceRange.max) {
      return {
        formatted: `${priceRange.min.toLocaleString()}₫`,
        min: priceRange.min,
        max: priceRange.max,
      };
    }

    return {
      formatted: `${priceRange.min.toLocaleString()}₫ - ${priceRange.max.toLocaleString()}₫`,
      min: priceRange.min,
      max: priceRange.max,
    };
  }

  getAllProductImages(product, variants) {
    // Build images list from product.image and product.images[]
    const productImages = [
      product.image || "",
      ...(Array.isArray(product.images) ? product.images : []),
    ].filter((img) => img && img !== "");

    const variantImages = (variants || [])
      .flatMap((v) => (Array.isArray(v.images) ? v.images : []))
      .filter((img) => img && img !== "");

    // Combine và loại bỏ duplicate
    const allImages = [...new Set([...productImages, ...variantImages])];

    // Ensure main image is first (nếu có)
    const sortedImages = allImages.sort((a, b) => {
      if (a === product.image) return -1;
      if (b === product.image) return 1;
      return 0;
    });

    return sortedImages.slice(0, 10);
  }

  prepareProductData(data) {
    const productData = {
      name: data.name?.trim(),
      shortDescription: data.shortDescription?.trim(),
      longDescription: data.longDescription?.trim(),
      brand: data.brand,
      category: data.category,
      isActive: data.isActive,
      tags: data.tags || [],
      image: data.image,
      gender: data.gender.trim(),
      attributes: data.attributes,
      isFeatured: data.isFeatured,
    };

    return productData;
  }

  async cleanupImages(imageUrls) {
    if (!imageUrls || imageUrls.length === 0) return;

    console.log("Cleaning up Cloudinary images:", imageUrls);

    try {
      // Lấy public_ids từ URLs
      const publicIds = imageUrls
        .map((url) => {
          const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+$/);
          return matches ? matches[1] : null;
        })
        .filter(Boolean);

      if (publicIds.length > 0) {
        // Xóa hàng loạt trên Cloudinary
        const result = await cloudinary.api.delete_resources(publicIds);
        console.log("Cleaned up images from Cloudinary:", result);
      }
    } catch (error) {
      console.error("Error cleaning up images from Cloudinary:", error);
      // Không throw error để không ảnh hưởng đến flow chính
    }
  }
}

export default new ProductService();
