import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Variant from "../models/variant.model.js";

const cartService = {
  async getOrCreateCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate([
      { path: "items.product" },
      { path: "items.variant" },
    ]);
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      });
      cart = await cart.populate([
        { path: "items.product" },
        { path: "items.variant" },
      ]);
    }
    return cart;
  },

  async recalcTotals(cart) {
    // Ensure variants are populated to access price
    if (!cart.populated || typeof cart.populated !== "function") {
      await cart.populate([
        { path: "items.product" },
        { path: "items.variant" },
      ]);
    } else {
      await cart.populate([
        { path: "items.product" },
        { path: "items.variant" },
      ]);
    }

    let totalQuantity = 0;
    let totalAmount = 0;
    for (const it of cart.items) {
      const qty = Number(it.quantity || 0);
      const price = Number(it?.variant?.price || 0);
      totalQuantity += qty;
      totalAmount += qty * price;
    }
    cart.totalQuantity = totalQuantity;
    cart.totalAmount = totalAmount;
    return cart;
  },

  async getCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    return cart;
  },

  async addItem(userId, { product, quantity = 1, variant }) {
    const cart = await this.getOrCreateCart(userId);
    // Find an existing item with same product and variant
    const existing = cart.items.find(
      (it) =>
        (it.product?._id?.toString?.() || "") === product &&
        (it.variant?._id?.toString?.() || "") === variant
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product, quantity, variant });
    }

    await this.recalcTotals(cart);
    await cart.save();
    await cart.populate([{ path: "items.product" }, { path: "items.variant" }]);
    return cart;
  },

  async updateItemQuantity(userId, itemId, quantity) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.id(new mongoose.Types.ObjectId(itemId));
    if (!item) {
      const err = new Error("Cart item not found");
      err.statusCode = 404;
      throw err;
    }
    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }
    await this.recalcTotals(cart);
    await cart.save();
    await cart.populate([{ path: "items.product" }, { path: "items.variant" }]);
    return cart;
  },

  async removeItem(userId, itemId) {
    const cart = await this.getOrCreateCart(userId);
    const before = cart.items.length;
    cart.items = cart.items.filter(
      (it) => it._id.toString() !== itemId.toString()
    );

    if (before === cart.items.length) {
      const err = new Error("Cart item not found");
      err.statusCode = 404;
      throw err;
    }
    await this.recalcTotals(cart);
    await cart.save();
    await cart.populate([{ path: "items.product" }, { path: "items.variant" }]);
    return cart;
  },

  async clearCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    await this.recalcTotals(cart);
    await cart.save();
    await cart.populate([{ path: "items.product" }, { path: "items.variant" }]);
    return cart;
  },
};

export default cartService;
