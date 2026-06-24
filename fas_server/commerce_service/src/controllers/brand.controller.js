// controllers/brand.controller.js
import brandService from "../services/brand.service.js";
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";

const brandController = {
  createBrand: async (req, res, next) => {
    try {
      const brand = await brandService.createBrand(req.body);
      return res.json(
        new ApiResponse({ data: brand, message: "Brand created" })
      );
    } catch (err) {
      next(err);
    }
  },

  // Lấy tất cả brands
  getBrands: async (req, res, next) => {
    try {
      const response = await brandService.getBrands();
      return res.json(new ApiResponse({ data: response }));
    } catch (err) {
      next(err);
    }
  },

  // Lấy brand theo ID
  getBrandById: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw new ApiError(400, "Brand ID is required");

      const brand = await brandService.getBrandById(id);
      return res.json(new ApiResponse({ data: brand }));
    } catch (err) {
      next(err);
    }
  },

  // Cập nhật brand
  updateBrand: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      if (!id) throw new ApiError(400, "Brand ID is required");

      const files = req.files || [];
      const brand = await brandService.updateBrand(id, req.body, files);

      return res.json(
        new ApiResponse({
          data: brand,
          message: "Brand updated successfully",
        })
      );
    } catch (err) {
      next(err);
    }
  },

  // Xóa brand theo ID
  deleteBrand: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw new ApiError(400, "Brand ID is required");

      const result = await brandService.deleteBrand(id);
      return res.json(
        new ApiResponse({
          data: result,
          message: "Brand deleted successfully",
        })
      );
    } catch (err) {
      next(err);
    }
  },

  // Cập nhật hình ảnh brand
  updateBrandImage: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw new ApiError(400, "Brand ID is required");

      const files = req.files;
      if (!files || files.length === 0) {
        throw new ApiError(400, "Image file is required");
      }

      const brand = await brandService.updateBrandImage(id, files);
      return res.json(
        new ApiResponse({
          data: brand,
          message: "Brand image updated",
        })
      );
    } catch (err) {
      next(err);
    }
  },

  // Xóa hình ảnh brand
  removeBrandImage: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw new ApiError(400, "Brand ID is required");

      const brand = await brandService.removeBrandImage(id);
      return res.json(
        new ApiResponse({
          data: brand,
          message: "Brand image removed",
        })
      );
    } catch (err) {
      next(err);
    }
  },

  // Xóa nhiều brands (bulk)
  deleteBrands: async (req, res, next) => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Brand IDs array is required");
      }

      const results = [];
      const errors = [];

      for (const id of ids) {
        try {
          const result = await brandService.deleteBrand(id);
          results.push({ id, success: true, message: result.message });
        } catch (error) {
          errors.push({ id, success: false, message: error.message });
        }
      }

      return res.json(
        new ApiResponse({
          message: `Processed ${ids.length} brands`,
          data: {
            successful: results,
            failed: errors,
            summary: {
              total: ids.length,
              successful: results.length,
              failed: errors.length,
            },
          },
        })
      );
    } catch (err) {
      next(err);
    }
  },
};

export default brandController;
