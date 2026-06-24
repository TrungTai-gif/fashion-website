import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    attributes: [
      {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
      },
    ],
    attributesKey: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
      index: true,
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, "Cost cannot be negative"],
      index: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
      required: true,
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index tối ưu
VariantSchema.index({ createdAt: -1 });
VariantSchema.index(
  { product: 1, attributesKey: 1 },
  { unique: true, sparse: true }
);

VariantSchema.statics.findByProduct = function (productId) {
  return this.find({ product: productId, isActive: true });
};

VariantSchema.statics.findInStock = function () {
  return this.find({ stock: { $gt: 0 }, isActive: true });
};

VariantSchema.statics.findBySku = function (sku) {
  return this.findOne({ sku: sku.toUpperCase(), isActive: true });
};

VariantSchema.statics.findLowStock = function (threshold = 10) {
  return this.find({ stock: { $lte: threshold, $gt: 0 }, isActive: true });
};

VariantSchema.methods.updateStock = async function (quantity) {
  this.stock = Math.max(this.stock + quantity, 0);
  return this.save();
};

const Variant = mongoose.model("Variant", VariantSchema);
export default Variant;
