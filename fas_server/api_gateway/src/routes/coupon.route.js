import express from "express";
import createServiceProxy from "../lib/proxyFactory.js";
import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const couponServiceProxy = createServiceProxy(COMMERCE_SERVICE_URL);

// PUBLIC ROUTES (Thứ tự quan trọng: specific routes trước)
// Lấy coupon hợp lệ (cho khách hàng)
router.get("/valid", couponServiceProxy);

// Lấy thông tin coupon theo mã (public để validate)
router.get("/code/:code", couponServiceProxy);

// Apply coupon (kiểm tra và tính toán giảm giá)
router.post("/apply/:code", couponServiceProxy);

// ADMIN ROUTES
// CREATE - Tạo coupon mới
router.post("/", checkAccessToken, checkRole(["admin"]), couponServiceProxy);

// READ - Lấy tất cả coupon (có phân trang, filter)
router.get("/", checkAccessToken, checkRole(["admin"]), couponServiceProxy);

// UPDATE - Cập nhật coupon
router.put("/:id", checkAccessToken, checkRole(["admin"]), couponServiceProxy);

// DELETE - Xóa coupon
router.delete(
  "/:id",
  checkAccessToken,
  checkRole(["admin"]),
  couponServiceProxy
);

export default router;
