import Joi from "joi";

export const variantCreateSchema = Joi.object({
  product: objectId.required(), // SPU ID
  sku: Joi.string().trim().min(1).max(100).required(),
  attributes: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().required(),
        value: Joi.string().trim().required(),
      })
    )
    .min(1)
    .required(),
  price: Joi.number().min(0).required(),
  cost: Joi.number().min(0).default(0),
  stock: Joi.number().integer().min(0).default(0),
  images: Joi.array().items(Joi.string().uri()).default([]),
});

// Review Schema
export const reviewSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  user: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(""),
}).min(1);

// Tag Schema
export const tagSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
}).min(1);

// Variant Schema
export const variantSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().min(0).default(0),
  attributes: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
}).min(1);
