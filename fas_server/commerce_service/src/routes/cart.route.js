import express from "express";
import validate from "../middlewares/validate.middleware.js";
import {
  addItemSchema,
  updateQuantitySchema,
  removeItemSchema,
} from "../schemas/cart.schema.js";
import cartController from "../controllers/cart.controller.js";

const router = express.Router();

// Simple auth extractor: requires x-user-id header (forwarded by API Gateway)
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

// Get current user's cart
router.get("/", requireUser, cartController.getCart);

// Add item to cart
router.post(
  "/items",
  requireUser,
  validate(addItemSchema),
  cartController.addItem
);

// Update quantity of a cart item
router.patch(
  "/items/:itemId",
  requireUser,
  validate(updateQuantitySchema),
  cartController.updateItemQuantity
);

// Remove a cart item
router.delete("/items/:itemId", requireUser, cartController.removeItem);

// Clear cart
router.delete("/", requireUser, cartController.clearCart);

export default router;
