import Joi from "joi";

// Schema cho tạo delivery mới
export const createDeliverySchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Tên phương thức giao hàng không được để trống",
  }),
  type: Joi.string().trim().min(3).max(50).required(),

  description: Joi.string().trim().max(500).allow("").messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),

  baseFee: Joi.number().min(0).required().messages({
    "number.min": "Phí giao hàng phải lớn hơn hoặc bằng 0",
    "any.required": "Phí giao hàng cơ bản là bắt buộc",
  }),

  extraFee: Joi.number().min(0).required(),

  freeShippingMinAmount: Joi.number().min(0).required().messages({
    "number.min": "Số tiền tối thiểu miễn phí phải lớn hơn hoặc bằng 0",
    "any.required": "Số tiền tối thiểu để miễn phí giao hàng là bắt buộc",
  }),

  deliveryDays: Joi.number().integer().min(1).required().messages({
    "number.min": "Thời gian giao hàng phải ít nhất 1 ngày",
  }),

  maxDeliveryDays: Joi.number()
    .integer()
    .min(1)
    .required()
    .when("deliveryDays", {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref("deliveryDays")),
      otherwise: Joi.number().min(1),
    })
    .messages({
      "number.min":
        "Thời gian giao hàng tối đa phải lớn hơn hoặc bằng thời gian tối thiểu",
      "number.integer": "Thời gian giao hàng phải là số nguyên",
      "any.required": "Thời gian giao hàng tối đa là bắt buộc",
    }),

  isActive: Joi.boolean().default(true),

  notes: Joi.string().trim().max(1000).allow("").messages({
    "string.max": "Ghi chú không được vượt quá 1000 ký tự",
  }),
});

// Schema cho tính phí giao hàng
export const calculateShippingSchema = Joi.object({
  orderAmount: Joi.number().min(0).required().messages({
    "number.min": "Giá trị đơn hàng phải lớn hơn hoặc bằng 0",
    "any.required": "Giá trị đơn hàng là bắt buộc",
  }),
});

// Schema cho query parameters
export const deliveryQuerySchema = Joi.object({
  isActive: Joi.string().valid("true", "false"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

// Schema cho MongoDB ObjectId
export const objectIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "ID không hợp lệ",
      "any.required": "ID là bắt buộc",
    }),
});
