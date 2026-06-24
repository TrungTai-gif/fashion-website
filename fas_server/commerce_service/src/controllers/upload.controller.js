import UploadService from "../services/upload.service.js";
import ApiResponse from "../utils/apiResponse.js";

const uploadController = {
  uploadImages: async (req, res, next) => {
    try {
      const files = req.files || [];
      if (!files || files.length === 0) {
        return res
          .status(400)
          .json(new ApiResponse({ message: "No files provided", status: 400 }));
      }

      const urls = await UploadService.uploadImages(files, "uploads");

      return res.json(
        new ApiResponse({ data: urls, message: "Images uploaded", status: 201 })
      );
    } catch (err) {
      next(err);
    }
  },

  deleteImages: async (req, res, next) => {
    try {
      const { imageUrl, imageUrls } = req.body;

      const urls = [];
      if (imageUrl) urls.push(imageUrl);
      if (Array.isArray(imageUrls)) urls.push(...imageUrls);

      if (urls.length === 0) {
        return res
          .status(400)
          .json(
            new ApiResponse({ message: "No imageUrl(s) provided", status: 400 })
          );
      }

      await UploadService.deleteImages(urls);
      return res.json(new ApiResponse({ message: "Images deleted" }));
    } catch (err) {
      next(err);
    }
  },
};

export default uploadController;
