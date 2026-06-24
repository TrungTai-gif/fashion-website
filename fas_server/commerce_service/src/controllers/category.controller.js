import categoryService from "../services/category.service.js";
import ApiResponse from "../utils/apiResponse.js";

const categoryController = {
  createCategory: async (req, res, next) => {
    try {
      console.log(req.body);
      const response = await categoryService.createCategory(req.body);
      console.log(response);
      return res.json(
        new ApiResponse({
          data: response,
          message: "Category created successfully",
        })
      );
    } catch (err) {
      next(err);
    }
  },

  getCategories: async (req, res, next) => {
    try {
      const response = await categoryService.getCategories();
      return res.json(
        new ApiResponse({
          data: response,
          message: "Categories retrieved successfully",
        })
      );
    } catch (err) {
      next(err);
    }
  },

  updateCategory: async (req, res, next) => {
    try {
      const response = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.json(
        new ApiResponse({
          data: response,
          message: "Category updated successfully",
        })
      );
    } catch (err) {
      next(err);
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const response = await categoryService.deleteCategory(req.params.id);
      res.json(
        new ApiResponse({
          data: response,
          message: "Category deleted successfully",
        })
      );
    } catch (err) {
      next(err);
    }
  },
};

export default categoryController;
