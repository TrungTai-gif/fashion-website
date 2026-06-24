import Joi from "joi";

// Đăng nhập
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Refresh token
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Logout
export const logoutSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Đổi mật khẩu
export const changePasswordSchema = Joi.object({
  userId: Joi.string().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

// Quên mật khẩu
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Reset mật khẩu
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).required(),
});

// guest checkout
export const guestCheckoutSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("user", "admin").default("user"),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
    isDefault: Joi.boolean().optional(),
  })
    .optional()
    .required(),
});
