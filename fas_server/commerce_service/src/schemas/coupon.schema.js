import Joi from "joi";

// Schema cho tạo coupon mới
export const createCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(20).required().messages({
    "string.empty": "Mã coupon không được để trống",
  }),

  description: Joi.string().trim().min(10).max(500).required().messages({
    "string.empty": "Mô tả không được để trống",
    "string.min": "Mô tả phải có ít nhất 10 ký tự",
  }),

  type: Joi.string().valid("percentage", "fixed").required().messages({
    "any.only": "Loại giảm giá phải là 'percentage' hoặc 'fixed'",
    "any.required": "Loại giảm giá là bắt buộc",
  }),

  discountValue: Joi.number()
    .min(0)
    .required()
    .when("type", {
      is: "percentage",
      then: Joi.number().max(100).messages({
        "number.max": "Phần trăm giảm giá không được vượt quá 100%",
      }),
      otherwise: Joi.number().min(1000).messages({
        "number.min": "Giá trị giảm giá tối thiểu là 1,000đ",
      }),
    })
    .messages({
      "number.min": "Giá trị giảm giá phải lớn hơn 0",
      "any.required": "Giá trị giảm giá là bắt buộc",
    }),

  maxDiscountAmount: Joi.number()
    .min(0)
    .allow(null)
    .when("type", {
      is: "percentage",
      then: Joi.number().min(1000).messages({
        "number.min": "Giá trị giảm giá tối đa phải ít nhất 1,000đ",
      }),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "number.min": "Giá trị giảm giá tối đa phải lớn hơn 0",
    }),

  conditions: Joi.object({
    minOrderAmount: Joi.number().min(0).default(0).messages({
      "number.min": "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0",
    }),

    maxOrderAmount: Joi.number()
      .min(0)
      .allow(null)
      .when("minOrderAmount", {
        is: Joi.exist(),
        then: Joi.number().min(Joi.ref("minOrderAmount")),
        otherwise: Joi.number().min(0),
      })
      .messages({
        "number.min": "Giá trị đơn hàng tối đa phải lớn hơn giá trị tối thiểu",
      }),

    newUserOnly: Joi.boolean().default(false),
  }).default({}),

  validFrom: Joi.date().required().messages({
    "date.base": "Ngày bắt đầu không hợp lệ",
    "any.required": "Ngày bắt đầu là bắt buộc",
  }),

  validTo: Joi.date().required().min(Joi.ref("validFrom")).messages({
    "date.base": "Ngày kết thúc không hợp lệ",
    "date.min": "Ngày kết thúc phải sau ngày bắt đầu",
    "any.required": "Ngày kết thúc là bắt buộc",
  }),

  usageLimit: Joi.object({
    totalUsageLimit: Joi.number().integer().min(1).allow(null).messages({
      "number.min": "Giới hạn sử dụng tổng phải ít nhất 1",
      "number.integer": "Giới hạn sử dụng phải là số nguyên",
    }),

    perUserLimit: Joi.number().integer().min(1).default(1).messages({
      "number.min": "Giới hạn sử dụng mỗi người dùng phải ít nhất 1",
      "number.integer": "Giới hạn sử dụng phải là số nguyên",
    }),
  }).default({}),

  isActive: Joi.boolean().default(true),

  notes: Joi.string().trim().max(1000).allow("").messages({
    "string.max": "Ghi chú không được vượt quá 1000 ký tự",
  }),
});

// Schema cho apply coupon
export const applyCouponSchema = Joi.object({
  orderAmount: Joi.number().min(0).required().messages({
    "number.min": "Giá trị đơn hàng phải lớn hơn 0",
    "any.required": "Giá trị đơn hàng là bắt buộc",
  }),
});

// Schema cho cập nhật coupon (tất cả fields đều optional)
export const updateCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(20).messages({
    "string.empty": "Mã coupon không được để trống",
  }),

  description: Joi.string().trim().min(10).max(500).messages({
    "string.empty": "Mô tả không được để trống",
    "string.min": "Mô tả phải có ít nhất 10 ký tự",
  }),

  type: Joi.string().valid("percentage", "fixed").messages({
    "any.only": "Loại giảm giá phải là 'percentage' hoặc 'fixed'",
  }),

  discountValue: Joi.number()
    .min(0)
    .when("type", {
      is: "percentage",
      then: Joi.number().max(100).messages({
        "number.max": "Phần trăm giảm giá không được vượt quá 100%",
      }),
      otherwise: Joi.number().min(1000).messages({
        "number.min": "Giá trị giảm giá tối thiểu là 1,000đ",
      }),
    })
    .messages({
      "number.min": "Giá trị giảm giá phải lớn hơn 0",
    }),

  maxDiscountAmount: Joi.number()
    .min(0)
    .allow(null)
    .when("type", {
      is: "percentage",
      then: Joi.number().min(1000).messages({
        "number.min": "Giá trị giảm giá tối đa phải ít nhất 1,000đ",
      }),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "number.min": "Giá trị giảm giá tối đa phải lớn hơn 0",
    }),

  conditions: Joi.object({
    minOrderAmount: Joi.number().min(0).messages({
      "number.min": "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0",
    }),

    maxOrderAmount: Joi.number()
      .min(0)
      .allow(null)
      .when("minOrderAmount", {
        is: Joi.exist(),
        then: Joi.number().min(Joi.ref("minOrderAmount")),
        otherwise: Joi.number().min(0),
      })
      .messages({
        "number.min": "Giá trị đơn hàng tối đa phải lớn hơn giá trị tối thiểu",
      }),

    newUserOnly: Joi.boolean(),
  }),

  validFrom: Joi.date().messages({
    "date.base": "Ngày bắt đầu không hợp lệ",
  }),

  validTo: Joi.date().min(Joi.ref("validFrom")).messages({
    "date.base": "Ngày kết thúc không hợp lệ",
    "date.min": "Ngày kết thúc phải sau ngày bắt đầu",
  }),

  usageLimit: Joi.object({
    totalUsageLimit: Joi.number().integer().min(1).allow(null).messages({
      "number.min": "Giới hạn sử dụng tổng phải ít nhất 1",
      "number.integer": "Giới hạn sử dụng phải là số nguyên",
    }),

    perUserLimit: Joi.number().integer().min(1).messages({
      "number.min": "Giới hạn sử dụng mỗi người dùng phải ít nhất 1",
      "number.integer": "Giới hạn sử dụng phải là số nguyên",
    }),
  }),

  isActive: Joi.boolean(),

  notes: Joi.string().trim().max(1000).allow("").messages({
    "string.max": "Ghi chú không được vượt quá 1000 ký tự",
  }),
})
  .min(1)
  .messages({
    "object.min": "Phải có ít nhất một trường để cập nhật",
  });

// Schema cho coupon code
export const couponCodeSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(20).required().messages({
    "string.empty": "Mã coupon không được để trống",
    "any.required": "Mã coupon là bắt buộc",
  }),
});
