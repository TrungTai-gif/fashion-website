import Joi from "joi";

// Send OTP Schema
export const sendOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  type: Joi.string()
    .valid("password_reset", "email_verification")
    .default("password_reset")
    .messages({
      "any.only":
        "Type must be either 'password_reset' or 'email_verification'",
    }),
});

// Send Order OTP Schema
export const sendOrderOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  customerName: Joi.string().required().messages({
    "any.required": "Customer name is required",
  }),
  orderCode: Joi.string().required().messages({
    "any.required": "Order code is required",
  }),
  orderItems: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        // price: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one order item is required",
      "any.required": "Order items are required",
    }),
  totalAmount: Joi.number().min(0).required().messages({
    "number.min": "Total amount must be greater than or equal to 0",
    "any.required": "Total amount is required",
  }),
});

// Verify OTP Schema
export const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 digits",
    "any.required": "OTP is required",
  }),
  type: Joi.string()
    .valid("password_reset", "email_verification", "order_confirmation")
    .default("password_reset")
    .messages({
      "any.only":
        "Type must be either 'password_reset', 'email_verification', or 'order_confirmation'",
    }),
});
