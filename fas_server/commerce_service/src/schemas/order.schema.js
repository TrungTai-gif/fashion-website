// src/schemas/order.schema.js
import Joi from "joi";

// Item trong đơn hàng theo model mới
const orderItemSchema = Joi.object({
  name: Joi.string().required(),
  // price: Joi.number().min(0).required(),
  image: Joi.string().uri().optional(),
  productId: Joi.string().hex().length(24).required().messages({
    "string.base": `"productId" should be a type of 'text'`,
    "string.empty": `"productId" cannot be an empty field`,
    "string.hex": `"productId" must be a valid MongoDB ObjectId`,
    "any.required": `"productId" is a required field`,
  }),

  variantId: Joi.string().hex().length(24).optional().messages({
    "string.hex": `"variantId" must be a valid MongoDB ObjectId`,
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": `"quantity" should be a type of 'number'`,
    "number.min": `"quantity" must be at least 1"`,
    "any.required": `"quantity" is a required field"`,
  }),
});

// Địa chỉ giao hàng
const shippingAddressSchema = Joi.object({
  fullName: Joi.string().min(2).required(),
  phone: Joi.string().min(6).required(),
  address: Joi.string().min(3).required(),
  ward: Joi.string().allow("", null).default(""),
  district: Joi.string().allow("", null).default(""),
  province: Joi.string().allow("", null).default(""),
});

// Schema tạo đơn hàng phù hợp với Order model mới
export const createOrderSchema = Joi.object({
  userId: Joi.string().hex().length(24).optional().allow("", null),

  // danh sách sản phẩm
  items: Joi.array().items(orderItemSchema).min(1).required().messages({
    "array.base": `"items" should be an array`,
    "array.min": `"items" cannot be an empty array`,
    "any.required": `"items" is a required field`,
  }),

  // thông tin người đặt (áp dụng cho user hoặc guest)
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),

  // địa chỉ giao hàng (snapshot)
  shippingAddress: shippingAddressSchema.required(),

  coupon: Joi.object({
    code: Joi.string().allow("", null),
    discountAmount: Joi.number().min(0).default(0),
  })
    .optional()
    .default(undefined),

  paymentMethod: Joi.string()
    .valid("COD", "VNPAY", "MOMO", "PAYPAL")
    .required()
    .default("COD"),

  totalAmount: Joi.number().min(0).required(),
  shippingFee: Joi.number().min(0).optional(),
  notes: Joi.string().allow("").optional(),
});
