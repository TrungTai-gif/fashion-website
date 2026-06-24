import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant",
    required: true,
  },
});

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [CartItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0, default: 0 },
    totalQuantity: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
