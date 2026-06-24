import Joi from "joi";

export const variantCreateSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  size: Joi.string().trim().max(5).required(),
  color: Joi.string().trim().max(50).required(),
  price: Joi.number().min(0).required(),
  cost: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  sku: Joi.string().trim().max(100).optional(),
  image: Joi.string().uri().optional(),
});

export const variantUpdateSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  price: Joi.number().min(0).required(),
  cost: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  isActive: Joi.boolean().default(true),
  image: Joi.string().uri().optional(),
});
