import express from "express";
import createServiceProxy from "../lib/proxyFactory.js";
import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const deliveryServiceProxy = createServiceProxy(COMMERCE_SERVICE_URL);

// PUBLIC ROUTES
// Lấy các phương thức giao hàng đang hoạt động (cho khách hàng)
router.get("/active", deliveryServiceProxy);

// Tính phí giao hàng cho đơn hàng
router.post("/:id/calculate", deliveryServiceProxy);

// ADMIN ROUTES
// CREATE - Tạo phương thức giao hàng mới
router.post("/", checkAccessToken, checkRole(["admin"]), deliveryServiceProxy);

// READ - Lấy tất cả phương thức giao hàng (có phân trang, filter)
router.get("/", deliveryServiceProxy);

// READ - Lấy phương thức giao hàng theo ID
router.get(
  "/:id",
  checkAccessToken,
  checkRole(["admin"]),
  deliveryServiceProxy
);

// DELETE - Xóa phương thức giao hàng
router.delete(
  "/:id",
  checkAccessToken,
  checkRole(["admin"]),
  deliveryServiceProxy
);

export default router;
