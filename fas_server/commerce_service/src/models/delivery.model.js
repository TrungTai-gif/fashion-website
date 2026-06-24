import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },

    // Loại giao hàng: thông thường hoặc cấp tốc
    type: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxLength: 500,
    },

    // Phí giao hàng cơ bản (áp dụng cho standard)
    baseFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Phí thêm cho express (cộng vào baseFee)
    extraFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Số tiền tối thiểu để miễn phí giao hàng
    freeShippingMinAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Thời gian giao hàng (ngày)
    deliveryDays: {
      type: Number,
      required: true,
      min: 1,
      default: 3,
    },

    maxDeliveryDays: {
      type: Number,
      required: true,
      min: 1,
      default: 7,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // regions: [
    //   {
    //     type: String,
    //     trim: true,
    //   },
    // ],

    notes: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: thời gian giao hàng
DeliverySchema.virtual("deliveryTimeRange").get(function () {
  if (this.deliveryDays === this.maxDeliveryDays) {
    return `${this.deliveryDays} ngày`;
  }
  return `${this.deliveryDays} - ${this.maxDeliveryDays} ngày`;
});

// Instance: tính phí
DeliverySchema.methods.calculateShippingFee = function (orderAmount) {
  // miễn phí
  if (orderAmount >= this.freeShippingMinAmount) {
    return 0;
  }

  // tính phí theo loại
  if (this.type === "express") {
    return this.baseFee + this.extraFee;
  }

  return this.baseFee;
};

// Instance: kiểm tra miễn phí
DeliverySchema.methods.isFreeShipping = function (orderAmount) {
  return orderAmount >= this.freeShippingMinAmount;
};

DeliverySchema.index({ type: 1 });
DeliverySchema.index({ isActive: 1 });

const Delivery = mongoose.model("Delivery", DeliverySchema);
export default Delivery;
