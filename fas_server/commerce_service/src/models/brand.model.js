import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index cho search và performance
// name đã có unique index tự động, không cần index riêng
BrandSchema.index({ isActive: 1 });
BrandSchema.index({ createdAt: -1 });

BrandSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

const Brand = mongoose.model("Brand", BrandSchema);

export default Brand;
