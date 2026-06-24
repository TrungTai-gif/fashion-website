import Joi from "joi";

export const addItemSchema = Joi.object({
  product: Joi.string().required(), // ObjectId as string
  quantity: Joi.number().integer().min(1).default(1),
  variant: Joi.string().required(), // ObjectId as string
});

export const updateQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(0).required(),
});

export const removeItemSchema = Joi.object({
  // params validation can be done in route-level if desired; keeping body empty
});

export default {
  addItemSchema,
  updateQuantitySchema,
  removeItemSchema,
};
