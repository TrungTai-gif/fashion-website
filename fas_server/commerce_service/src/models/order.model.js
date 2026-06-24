// models/order.model.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const ShippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    ward: { type: String, default: "" },
    district: { type: String, default: "" },
    province: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    // Nếu có use
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Lưu trực tiếp thông tin người đặt hàng (dù là user hay guest)
    name: { type: String, required: true },
    email: { type: String, required: true },

    coupon: {
      type: {
        code: { type: String },
        discountAmount: { type: Number, default: 0 },
      },
      required: false,
      default: null,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY", "MOMO", "PAYPAL"],
      required: true,
      default: "COD",
    },
    shippingFee: { type: Number, required: false, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    notes: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
