import express from "express";
import DeliveryController from "../controllers/delivery.controller.js";
import {
  createDeliverySchema,
  calculateShippingSchema,
  objectIdSchema,
} from "../schemas/delivery.schema.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

const requireAdmin = (req, res, next) => {
  // TODO: Implement admin authentication
  next();
};

// PUBLIC ROUTES
// Tính phí giao hàng cho đơn hàng
router.post(
  "/:id/calculate",
  validate(objectIdSchema, "params"),
  validate(calculateShippingSchema),
  DeliveryController.calculateShippingFee
);

// ADMIN ROUTES
// READ - Lấy tất cả phương thức giao hàng
router.get("/", requireAdmin, DeliveryController.getAllDeliveries);

// READ - Lấy phương thức giao hàng theo ID
router.get(
  "/:id",
  requireAdmin,
  validate(objectIdSchema, "params"),
  DeliveryController.getDeliveryById
);

// CREATE - Tạo phương thức giao hàng mới
router.post(
  "/",
  requireAdmin,
  validate(createDeliverySchema),
  DeliveryController.createDelivery
);

// UPDATE - Cập nhật phương thức giao hàng
router.put(
  "/:id",
  requireAdmin,

  validate(createDeliverySchema),
  DeliveryController.updateDelivery
);

// DELETE - Xóa phương thức giao hàng
router.delete("/:id", requireAdmin, DeliveryController.deleteDelivery);

export default router;
