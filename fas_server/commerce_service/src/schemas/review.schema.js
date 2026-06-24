import Joi from "joi";

export const reviewCreateSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  user: Joi.string().hex().length(24).allow(null), // Cho phép null
  username: Joi.string().trim().max(50).required(),
  comment: Joi.string().trim().max(1000).required(),
  rating: Joi.number().min(1).max(5).required(),
  isVerified: Joi.boolean().default(false),
});

export const reviewUpdateSchema = Joi.object({
  user: Joi.string().hex().length(24).allow(null),
  username: Joi.string().trim().max(50),
  comment: Joi.string().trim().max(1000),
  rating: Joi.number().min(1).max(5),
  isVerified: Joi.boolean(),
}).min(1);