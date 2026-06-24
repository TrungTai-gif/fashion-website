import Brand from "../models/brand.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const brandService = {
  createBrand: async (data) => {
    try {
      // Tạo brand data
      const brandData = {
        name: data.name,
        description: data.description || "",
        image: data.image,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const brand = await Brand.create(brandData);
      return brand;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả brands page
  getBrands: async () => {
    try {
      const brands = await Brand.find();
      return brands;
    } catch (error) {
      throw new ApiError(500, "Error retrieving brands", error.message);
    }
  },

  // Lấy brand theo ID
  getBrandById: async (id) => {
    try {
      const brand = await Brand.findById(id);
      if (!brand) throw new ApiError(404, "Brand not found");
      return brand;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Error retrieving brand", error.message);
    }
  },

  // Cập nhật brand
  updateBrand: async (id, data, files = []) => {
    try {
      const existingBrand = await Brand.findById(id);
      if (!existingBrand) throw new ApiError(404, "Brand not found");

      let imageData = existingBrand.image;

      if (files && files.length > 0) {
        const file = files[0];

        if (existingBrand.image?.public_id) {
          await cloudinary.uploader.destroy(existingBrand.image.public_id);
        }

        const result = await cloudinary.uploader.upload(file.path, {
          folder: "brands",
          transformation: [
            { width: 400, height: 400, crop: "limit" },
            { quality: "auto" },
          ],
        });

        imageData = {
          url: result.secure_url,
          public_id: result.public_id,
        };

        fs.unlinkSync(file.path);
      }

      const updateData = {
        name: data.name ?? existingBrand.name,
        description: data.description ?? existingBrand.description,
        image: imageData,
        updatedAt: new Date(),
      };

      const brand = await Brand.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      return brand;
    } catch (error) {
      if (files?.length) {
        files.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Error updating brand", error.message);
    }
  },

  // Xóa brand
  deleteBrand: async (id) => {
    try {
      const brand = await Brand.findById(id);
      if (!brand) throw new ApiError(404, "Brand not found");

      if (brand.image?.public_id) {
        await cloudinary.uploader.destroy(brand.image.public_id);
      }

      await Brand.findByIdAndDelete(id);
      return { id, message: "Brand deleted successfully" };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Error deleting brand", error.message);
    }
  },

  // Cập nhật chỉ hình ảnh
  updateBrandImage: async (brandId, files) => {
    try {
      if (!files?.length) throw new ApiError(400, "No image file provided");

      const brand = await Brand.findById(brandId);
      if (!brand) throw new ApiError(404, "Brand not found");

      const file = files[0];

      if (brand.image?.public_id) {
        await cloudinary.uploader.destroy(brand.image.public_id);
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "brands",
        transformation: [
          { width: 400, height: 400, crop: "limit" },
          { quality: "auto" },
        ],
      });

      brand.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
      brand.updatedAt = new Date();

      await brand.save();

      fs.unlinkSync(file.path);

      return brand;
    } catch (error) {
      if (files?.length) {
        files.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Error updating brand image", error.message);
    }
  },

  // Xóa hình ảnh
  removeBrandImage: async (brandId) => {
    try {
      const brand = await Brand.findById(brandId);
      if (!brand) throw new ApiError(404, "Brand not found");

      if (brand.image?.public_id) {
        await cloudinary.uploader.destroy(brand.image.public_id);
      }

      brand.image = null;
      brand.updatedAt = new Date();
      await brand.save();

      return brand;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Error removing brand image", error.message);
    }
  },
};

export default brandService;
