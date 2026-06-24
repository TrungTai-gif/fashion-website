import productService from "../services/product.service.js";
import ApiResponse from "../utils/apiResponse.js";

const productController = {
  createProduct: async (req, res, next) => {
    try {
      if (req.body.attributes && typeof req.body.attributes === "string") {
        try {
          req.body.attributes = JSON.parse(req.body.attributes);
        } catch (e) {}
      }

      const result = await productService.createProduct(req.body);

      return res.json(
        new ApiResponse({
          status: 201,
          data: result,
          message: "Product created successfully",
        })
      );
    } catch (error) {
      console.error("Error in createProduct controller:", error);
      next(error);
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const product = await productService.getProductById(req.params.id);
      return res.json(
        new ApiResponse({
          data: product,
          message: "Product retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getProductBySlug: async (req, res, next) => {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      return res.json(
        new ApiResponse({
          data: product,
          message: "Product retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getProductsPagition: async (req, res, next) => {
    try {
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
      } = req.query;

      const result = await productService.getProducts(
        {},
        {
          page: parseInt(page),
          limit: parseInt(limit),
          sort,
          category,
          brand,
          minPrice,
          maxPrice,
          featured,
          search,
          color,
          size,
        }
      );

      return res.json(
        new ApiResponse({
          data: result.products,
          pagination: result.pagination,
          message: "Products retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getProducts: async (req, res, next) => {
    try {
      const result = await productService.getProducts(req);

      return res.json(
        new ApiResponse({
          data: result,

          message: "Products retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getFeaturedProducts: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await productService.getProducts(
        {},
        {
          page: parseInt(page),
          limit: parseInt(limit),
          featured: true,
          sort: "-createdAt",
        }
      );

      return res.json(
        new ApiResponse({
          data: result.products,
          pagination: result.pagination,
          message: "Featured products retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body
      );

      return res.json(
        new ApiResponse({
          data: product,
          message: "Product updated successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const product = await productService.deleteProduct(req.params.id);
      return res.json(
        new ApiResponse({
          data: product,
          message: "Product deleted successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getProductsByCategory: async (req, res, next) => {
    try {
      const category = req.params.id;

      const products = await productService.getProductByCategory(category);

      return res.json(
        new ApiResponse({
          data: products,

          message: "Products by category retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getProductsByBrand: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

      const result = await productService.getProducts(
        {},
        {
          page: parseInt(page),
          limit: parseInt(limit),
          sort,
          brand: req.params.brandId,
        }
      );

      return res.json(
        new ApiResponse({
          data: result.products,
          pagination: result.pagination,
          message: "Products by brand retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },
};

export default productController;
