import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    // Mã coupon (unique)
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxLength: 20,
      match: /^[A-Z0-9]+$/,
    },

    // Mô tả coupon
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },

    // Loại giảm giá: theo phần trăm hoặc số tiền cố định
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    // Giảm giá tối đa (cho loại percentage)
    maxDiscountAmount: {
      type: Number,
      min: 0,
      default: null,
    },

    // Điều kiện áp dụng
    conditions: {
      minOrderAmount: {
        type: Number,
        min: 0,
        default: 0,
      },

      maxOrderAmount: {
        type: Number,
        min: 0,
        default: null,
      },

      newUserOnly: {
        type: Boolean,
        default: false,
      },
    },

    // Thời gian hiệu lực
    validFrom: {
      type: Date,
      required: true,
    },

    validTo: {
      type: Date,
      required: true,
    },

    // Giới hạn sử dụng
    usageLimit: {
      totalUsageLimit: {
        type: Number,
        min: 1,
        default: null, // null = không giới hạn
      },

      perUserLimit: {
        type: Number,
        min: 1,
        default: 1,
      },
    },

    // Thống kê sử dụng
    usage: {
      totalUsed: {
        type: Number,
        default: 0,
        min: 0,
      },

      userUsage: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          usedCount: {
            type: Number,
            default: 0,
          },
          lastUsed: {
            type: Date,
          },
        },
      ],
    },

    // Trạng thái
    isActive: {
      type: Boolean,
      default: true,
    },

    // Ghi chú
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

// Indexes
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, validFrom: 1, validTo: 1 });

// Virtual fields
CouponSchema.virtual("isExpired").get(function () {
  return new Date() > this.validTo;
});

CouponSchema.virtual("isValid").get(function () {
  const now = new Date();
  return this.isActive && now >= this.validFrom && now <= this.validTo;
});

CouponSchema.virtual("remainingUsage").get(function () {
  if (!this.usageLimit.totalUsageLimit) return null;
  return Math.max(0, this.usageLimit.totalUsageLimit - this.usage.totalUsed);
});

// Instance methods
CouponSchema.methods.canUse = function (userId = null, orderAmount = 0) {
  if (!this.isValid)
    return { canUse: false, reason: "Coupon không hợp lệ hoặc đã hết hạn" };

  if (orderAmount < this.conditions.minOrderAmount) {
    return {
      canUse: false,
      reason: `Đơn hàng tối thiểu ${this.conditions.minOrderAmount.toLocaleString()}đ`,
    };
  }

  if (
    this.conditions.maxOrderAmount &&
    orderAmount > this.conditions.maxOrderAmount
  ) {
    return {
      canUse: false,
      reason: `Đơn hàng tối đa ${this.conditions.maxOrderAmount.toLocaleString()}đ`,
    };
  }

  if (
    this.usageLimit.totalUsageLimit &&
    this.usage.totalUsed >= this.usageLimit.totalUsageLimit
  ) {
    return { canUse: false, reason: "Coupon đã hết lượt sử dụng" };
  }

  if (userId) {
    const userUsage = this.usage.userUsage.find(
      (u) => u.userId.toString() === userId.toString()
    );
    if (userUsage && userUsage.usedCount >= this.usageLimit.perUserLimit) {
      return {
        canUse: false,
        reason: "Bạn đã sử dụng hết lượt cho coupon này",
      };
    }
  }

  return { canUse: true };
};

CouponSchema.methods.calculateDiscount = function (orderAmount) {
  if (this.type === "percentage") {
    let discount = (orderAmount * this.discountValue) / 100;
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
    return Math.round(discount);
  } else {
    return Math.min(this.discountValue, orderAmount);
  }
};

CouponSchema.methods.markAsUsed = async function (userId = null) {
  this.usage.totalUsed += 1;

  if (userId) {
    const userUsageIndex = this.usage.userUsage.findIndex(
      (u) => u.userId.toString() === userId.toString()
    );
    if (userUsageIndex >= 0) {
      this.usage.userUsage[userUsageIndex].usedCount += 1;
      this.usage.userUsage[userUsageIndex].lastUsed = new Date();
    } else {
      this.usage.userUsage.push({
        userId,
        usedCount: 1,
        lastUsed: new Date(),
      });
    }
  }

  await this.save();
};

const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
