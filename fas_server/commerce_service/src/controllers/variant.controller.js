import variantService from "../services/variant.service.js";
import ApiResponse from "../utils/apiResponse.js";

const variantController = {
  createVariant: async (req, res, next) => {
    try {
      const variant = await variantService.createVariant(req.body);

      return res.json(
        new ApiResponse({
          data: variant,
          message: "Variant created successfully",
        })
      );
    } catch (error) {
      console.error("Error in createVariant controller:", error);
      next(error);
    }
  },

  getVariantById: async (req, res, next) => {
    try {
      const variant = await variantService.getVariantById(req.params.id);
      return res.json(
        new ApiResponse({
          data: variant,
          message: "Variant retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getVariants: async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "-createdAt",
        productId,
        inStock,
        lowStock,
      } = req.query;

      const result = await variantService.getVariants(
        {},
        {
          page: parseInt(page),
          limit: parseInt(limit),
          sort,
          productId,
          inStock,
          lowStock,
        }
      );

      return res.json(
        new ApiResponse({
          data: result.variants,
          pagination: result.pagination,
          message: "Variants retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  updateVariant: async (req, res, next) => {
    try {
      const variant = await variantService.updateVariant(
        req.params.id,
        req.body
      );

      return res.json(
        new ApiResponse({
          data: variant,
          message: "Variant updated successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  deleteVariant: async (req, res, next) => {
    try {
      const variant = await variantService.deleteVariant(req.params.id);
      return res.json(
        new ApiResponse({
          data: variant,
          message: "Variant deleted successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },
  // New endpoints for stock management
  updateStock: async (req, res, next) => {
    try {
      const { quantity } = req.body;
      const variant = await variantService.updateStock(
        req.params.id,
        parseInt(quantity)
      );

      return res.json(
        new ApiResponse({
          data: variant,
          message: "Stock updated successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  bulkUpdateStocks: async (req, res, next) => {
    try {
      const { updates } = req.body;
      const results = await variantService.bulkUpdateStocks(updates);

      return res.json(
        new ApiResponse({
          data: results,
          message: "Bulk stock update completed",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getVariantsByProduct: async (req, res, next) => {
    try {
      const { page = 1, limit = 30, sort = "size" } = req.query;

      const result = await variantService.getVariants(
        {},
        {
          page: parseInt(page),
          limit: parseInt(limit),
          sort,
          productId: req.params.id,
        }
      );

      return res.json(
        new ApiResponse({
          data: result,
          message: "Product variants retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  getLowStockVariants: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, sort = "stock" } = req.query;

      const result = await variantService.getVariants(
        {},
        {
          page: parseInt(page),
          limit: parseInt(limit),
          sort,
          lowStock: true,
        }
      );

      return res.json(
        new ApiResponse({
          data: result.variants,
          pagination: result.pagination,
          message: "Low stock variants retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  },
};

export default variantController;
