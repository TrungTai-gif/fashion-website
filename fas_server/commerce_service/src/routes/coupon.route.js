import express from "express";
import CouponController from "../controllers/coupon.controller.js";
import {
  createCouponSchema,
  updateCouponSchema,
  applyCouponSchema,
  couponCodeSchema,
} from "../schemas/coupon.schema.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

const optionalAuth = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  req.userId = userId || null;
  next();
};

// PUBLIC ROUTES
// Lấy coupon hợp lệ (cho khách hàng)
router.get("/valid", CouponController.getValidCoupons);

// Apply coupon (kiểm tra và tính toán giảm giá)
router.post(
  "/apply/:code",
  validate(applyCouponSchema),
  optionalAuth,
  CouponController.applyCoupon
);

// Lấy thông tin coupon theo mã (public để validate)
router.get(
  "/code/:code",
  validate(couponCodeSchema, "params"),
  CouponController.getCouponByCode
);

// ADMIN ROUTES
// CREATE - Tạo coupon mới
router.post(
  "/",

  // validate(createCouponSchema),

  CouponController.createCoupon
);

// READ - Lấy tất cả coupon (có phân trang, filter)
router.get("/", CouponController.getAllCoupons);

// UPDATE - Cập nhật coupon
router.put("/:id", CouponController.updateCoupon);

// DELETE - Xóa coupon
router.delete("/:id", CouponController.deleteCoupon);

export default router;
