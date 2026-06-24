import Cart from "../models/cart.model.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";

// ---------- CART ----------
const addToCart = async (userId, productId, quantity = 1) => {
  const existing = await Cart.findOne({
    user_id: userId,
    product_id: productId,
  });
  if (existing) {
    existing.quantity += quantity;
    return await existing.save();
  }
  return await Cart.create({
    user_id: userId,
    product_id: productId,
    quantity,
  });
};

const updateCart = async (userId, productId, quantity) => {
  return await Cart.findOneAndUpdate(
    { user_id: userId, product_id: productId },
    { $set: { quantity } },
    { new: true }
  );
};

const removeFromCart = async (userId, productId) => {
  return await Cart.findOneAndDelete({
    user_id: userId,
    product_id: productId,
  });
};

const getCart = async (userId) => {
  return await Cart.find({ user_id: userId }).populate("product_id");
};

const getCartCount = async (userId) => {
  const result = await Cart.aggregate([
    { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: "$quantity" } } },
  ]);
  return result[0]?.total || 0;
};

export default {
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
  getCartCount,
};
