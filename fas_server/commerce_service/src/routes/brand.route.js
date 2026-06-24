import express from "express";
import brandController from "../controllers/brand.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { brandCreate, brandUpdate } from "../schemas/brand.schema.js";

const router = express.Router();

// Tạo brand mới
router.post("/", validate(brandCreate), brandController.createBrand);

// Lấy danh sách brands
router.get("/", brandController.getBrands);

// Lấy brand theo ID (nếu cần)
router.get("/:id", brandController.getBrandById);

// Cập nhật brand (thay đổi text hoặc hình ảnh)
router.put(
  "/:id",
  upload.any(), // hoặc upload.fields([{ name: "image", maxCount: 1 }]) nếu chỉ hình
  validate(brandUpdate),
  brandController.updateBrand
);

// Xóa brand
router.delete("/:id", brandController.deleteBrand);

// Cập nhật hình ảnh riêng (nếu muốn tách chức năng này)
router.patch("/:id/image", upload.any(), brandController.updateBrandImage);

export default router;
