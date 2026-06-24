import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    isVerified: {
      type: Boolean,
      default: false,
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

ReviewSchema.index({ product: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ isActive: 1 });
ReviewSchema.index({ isVerified: 1 });
ReviewSchema.index({ createdAt: -1 });

// Compound index for unique user review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true, sparse: true });

ReviewSchema.virtual("displayName").get(function () {
  return `Review by ${this.username}`;
});

ReviewSchema.virtual("ratingStars").get(function () {
  return "★".repeat(this.rating) + "☆".repeat(5 - this.rating);
});

ReviewSchema.statics.findByProduct = function (productId) {
  return this.find({ product: productId, isActive: true })
    .populate("user", "username email")
    .sort({ createdAt: -1 });
};

ReviewSchema.statics.findByRating = function (rating) {
  return this.find({ rating, isActive: true });
};

ReviewSchema.statics.findVerified = function () {
  return this.find({ isVerified: true, isActive: true });
};

ReviewSchema.statics.getProductStats = function (productId) {
  return this.aggregate([
    { $match: { product: productId, isActive: true } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);
};

ReviewSchema.methods.softDelete = function () {
  this.isActive = false;
  return this.save();
};

ReviewSchema.methods.restore = function () {
  this.isActive = true;
  return this.save();
};

ReviewSchema.methods.verify = function () {
  this.isVerified = true;
  return this.save();
};

ReviewSchema.methods.unverify = function () {
  this.isVerified = false;
  return this.save();
};

const Review = mongoose.model("Review", ReviewSchema);
export default Review;