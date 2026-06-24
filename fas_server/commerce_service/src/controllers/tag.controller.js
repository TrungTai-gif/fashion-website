// controllers/tag.controller.js
import tagService from "../services/tag.service.js";
import ApiResponse from "../utils/apiResponse.js";

const tagController = {
  createTag: async (req, res, next) => {
    try {
      console.log('Creating tag with body:', req.body);
      const response = await tagService.createTag(req.body);
      console.log('Tag created:', response);
      return res.json(new ApiResponse({ data: response }));
    } catch (err) {
      console.error('Error in createTag controller:', err);
      next(err);
    }
  },

  getTags: async (req, res, next) => {
    try {
      const response = await tagService.getTags();
      return res.json(new ApiResponse({ data: response }));
    } catch (err) {
      next(err);
    }
  },

  updateTag: async (req, res, next) => {
    try {
      const response = await tagService.updateTag(req.params.id, req.body);
      return res.json(new ApiResponse({ data: response }));
    } catch (err) {
      next(err);
    }
  },

  deleteTag: async (req, res, next) => {
    try {
      const response = await tagService.deleteTag(req.params.id);
      return res.json(new ApiResponse({ data: response }));
    } catch (err) {
      next(err);
    }
  }
};

export default tagController;