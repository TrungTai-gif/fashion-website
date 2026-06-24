// controllers/review.controller.js
import reviewService from "../services/review.service.js";
import ApiResponse from "../utils/apiResponse.js";

const reviewController = {
  createReview: async (req, res, next) => {
    try {
      const response = await reviewService.createReview(req.body);
      return res.json(new ApiResponse({ data: response }));
    } catch (err) {
      next(err);
    }
  },

  getReviewsByProduct: async (req, res, next) => {
    try {
      const response = await reviewService.getReviewsByProduct(
        req.params.productId
      );
      return res.json(new ApiResponse({ data: response }));
    } catch (err) {
      next(err);
    }
  },

  updateReview: async (req, res, next) => {
    try {
      const response = await reviewService.updateReview(
        req.params.id,
        req.body
      );
      return res.json(new ApiResponse({ data: response }));
    } catch (err) {
      next(err);
    }
  },

  deleteReview: async (req, res, next) => {
    try {
      const response = await reviewService.deleteReview(req.params.id);
      return res.json(new ApiResponse({ data: response }));
    } catch (err) {
      next(err);
    }
  },
};

export default reviewController;
