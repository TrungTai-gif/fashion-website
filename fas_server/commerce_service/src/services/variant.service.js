import Variant from "../models/variant.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import UploadService from "./upload.service.js";
class VariantService {
  // Create variant với auto-update product cache
  async createVariant(data) {
    try {
      // Check if product exists and is active
      const product = await Product.findOne({
        _id: data.product,
        isActive: true,
      });
      if (!product) {
        throw new ApiError(404, "Product not found or inactive");
      }

      // await Product.findByIdAndUpdate(product._id, {}, { new: true });
      // await Product.findById(product._id).then(
      //   (p) => p && p.updateCachedPrice()
      // );

      console.log("Variants created successfully:");
      return "Chưa phát triển";
    } catch (error) {
      throw error;
    }
  }

  // Get variant by ID
  async getVariantById(id) {
    const variant = await Variant.findById(id).populate("product");

    if (!variant) {
      throw new ApiError(404, "Variant not found");
    }

    return variant;
  }

  // Get variants với filter
  async getVariants(filter = {}, options = {}) {
    try {
      const { page = 1, limit = 10, sort = "-createdAt", productId } = options;

      // Xây query lọc
      const query = { ...filter };
      if (productId) query.product = productId;

      // Thực thi query với phân trang
      const variants = await Variant.find(query)
        // .populate("product")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean();

      // Tổng số bản ghi
      const total = await Variant.countDocuments(query);
      // Trả về dữ liệu
      return {
        variants,
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      };
    } catch (error) {
      throw error;
    }
  }
  // Update variant
  async updateVariant(id, data) {
    const variant = await Variant.findById(id);
    if (!variant) {
      throw new ApiError(404, "Variant not found");
    }
    try {
      const product = await Product.findById(data.product);
      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      variant.price = data.price;
      variant.cost = data.cost;
      variant.stock = data.stock;
      variant.isActive = data.isActive;

      if (variant.image && variant.image !== data.image) {
        const deleteImage = [variant.image];

        // Xóa ảnh cũ song song (không chặn response)
        (async () => {
          try {
            await UploadService.deleteImages(deleteImage);
          } catch (bgErr) {
            console.error(
              "Background image deletion failed for product",
              id,
              bgErr
            );
          }
        })();
      }
      variant.image = data.image;

      // Cập nhật variant
      const updatedVariant = await Variant.findByIdAndUpdate(id, variant, {
        new: true,
        runValidators: true,
      });

      // Cập nhật lại khoảng giá của product sau khi variant thay đổi
      if (product) {
        await product.updateCachedPrice();
      }

      return updatedVariant;
    } catch (error) {
      throw error;
    }
  }

  // Delete variant (hard delete)
  async deleteVariant(id) {
    const variant = await Variant.findById(id);
    if (!variant) {
      throw new ApiError(404, "Variant not found");
    }
    const productId = variant.product;
    const product = await Product.findById(productId);
    if (variant.image != product.image) {
      const allImages = [variant.image];
      // Cleanup images from cloudinary
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
    }
    // Xóa hoàn toàn variant khỏi database
    await Variant.findByIdAndDelete(id);

    if (product) {
      await product.updateCachedPrice();
    }
    return { message: "Variant deleted successfully" };
  }

  async updateStock(id, quantity) {
    const variant = await Variant.findById(id);
    if (!variant) {
      throw new ApiError(404, "Variant not found");
    }

    variant.stock += quantity;
    if (variant.stock < 0) variant.stock = 0;

    await variant.save();
    return this.enhanceVariantData(variant);
  }

  // Bulk update stocks
  async bulkUpdateStocks(updates) {
    const results = [];

    for (const update of updates) {
      try {
        const variant = await this.updateStock(
          update.variantId,
          update.quantity
        );
        results.push({
          variantId: update.variantId,
          success: true,
          data: variant,
        });
      } catch (error) {
        results.push({
          variantId: update.variantId,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }

  // Helper methods
  async uploadImages(files, folder) {
    const uploadedImages = [];

    for (const file of files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder,
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto" },
            { format: "webp" },
          ],
        });

        uploadedImages.push(result.secure_url);

        // Delete temp file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (uploadError) {
        console.error("Error uploading variant image:", uploadError);
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        throw new Error(`Variant image upload failed: ${uploadError.message}`);
      }
    }

    return uploadedImages;
  }

  async prepareVariantData(data, uploadedImages = [], existing = null) {
    // Build normalized variant object
    const variantData = {
      product: data.product,
      sku: data.sku || undefined,
      attributes: Array.isArray(data.attributes) ? data.attributes : [],
      price: data.price !== undefined ? Number(data.price) : 0,
      cost: data.cost !== undefined ? Number(data.cost) : 0,
      stock: data.stock !== undefined ? Number(data.stock) : 0,
      image:
        data.image ||
        (Array.isArray(uploadedImages) && uploadedImages[0]) ||
        (existing && existing.image) ||
        "",
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    };

    // Ensure attributes are normalized: array of {name, value}
    variantData.attributes = (variantData.attributes || []).map((a) => ({
      name: String(a.name || "").trim(),
      value: String(a.value || "").trim(),
    }));

    // Validate
    this.validateVariantData(variantData);

    return variantData;
  }

  validateVariantData(data) {
    if (!data.product) throw new Error("Product reference is required");
    if (!Array.isArray(data.attributes) || data.attributes.length === 0)
      throw new Error("Attributes array is required for variant");
    if (
      data.price === undefined ||
      data.price === null ||
      isNaN(data.price) ||
      data.price < 0
    )
      throw new Error("Valid price is required");
    if (data.stock < 0) throw new Error("Stock cannot be negative");
  }

  async checkDuplicateVariant(variantData, excludeId = null) {
    // Use attributesKey uniqueness first
    const query = {
      product: variantData.product,
    };
    const key =
      variantData.attributesKey ||
      (variantData.attributes || [])
        .map(
          (a) =>
            `${String(a.name).trim().toLowerCase()}:${String(a.value)
              .trim()
              .toLowerCase()}`
        )
        .join("|");

    if (key) query.attributesKey = key;

    if (excludeId) query._id = { $ne: excludeId };

    const existingVariant = await Variant.findOne(query);
    if (existingVariant) {
      throw new Error(
        "Variant with the same attribute combination already exists for this product"
      );
    }

    // Check SKU uniqueness if provided
    if (variantData.sku) {
      const skuQuery = {
        sku: { $regex: new RegExp(`^${variantData.sku}$`, "i") },
      };
      if (excludeId) skuQuery._id = { $ne: excludeId };
      const existingSku = await Variant.findOne(skuQuery);
      if (existingSku) throw new Error("SKU already exists");
    }
  }

  enhanceVariantData(variant) {
    return {
      ...(variant.toObject ? variant.toObject() : variant),
      formattedPrice: variant.formattedPrice,
    };
  }

  async cleanupImages(imageUrls) {
    if (!imageUrls || imageUrls.length === 0) return;
    console.log("Cleaning up variant images:", imageUrls);
    try {
      const publicIds = imageUrls
        .map((url) => {
          const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+$/);
          return matches ? matches[1] : null;
        })
        .filter(Boolean);

      if (publicIds.length > 0) {
        const result = await cloudinary.api.delete_resources(publicIds);
        console.log("Cloudinary cleaned:", result);
      }
    } catch (err) {
      console.error("Error cleaning up variant images:", err);
    }
  }
}

export default new VariantService();
