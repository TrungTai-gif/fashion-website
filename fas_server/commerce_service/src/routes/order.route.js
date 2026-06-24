import express from "express";
import orderController from "../controllers/order.controller.js";
import { createOrderSchema } from "../schemas/order.schema.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

const requireUser = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(401).json({
      success: false,
      status: 401,
      title: "Unauthorized",
      message: "Missing user identity",
    });
  }
  req.userId = userId;
  next();
};

const optionalAuth = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  req.userId = userId || null;
  next();
};

router.post(
  "/",
  validate(createOrderSchema),
  optionalAuth,
  orderController.createOrder
);

// Claim guest orders after login
router.post("/claim", requireUser, orderController.claimGuestOrders);

// Get orders by email (supports both guest and logged-in users)
router.get("/by-email", optionalAuth, orderController.getOrdersByEmail);

router.get("/all", optionalAuth, orderController.getAllOrders);

router.get("/my-orders", requireUser, orderController.getMyOrders);

router.get("/:id", optionalAuth, orderController.getOrderById);

router.patch("/:id/status", requireUser, orderController.updateOrderStatus);

router.delete("/:id", optionalAuth, orderController.deleteOrderById);

export default router;
