// schemas/address.schema.js
import Joi from "joi";

export const addressSchema = Joi.object({
  // street: Joi.string().min(3).max(255).required(),
  // city: Joi.string().min(2).max(100).required(),
  // state: Joi.string().min(2).max(100).required(),
  // zipCode: Joi.string().min(2).max(20).required(),
  // country: Joi.string().min(2).max(100).default("Vietnam"),
  label: Joi.string().min(3).max(255).required(),
  detail: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(2).max(10).required(),
  isDefault: Joi.boolean().default(false),
});

export const updateAddressSchema = Joi.object({
  label: Joi.string().min(3).max(255).required(),
  detail: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(2).max(10).required(),
  isDefault: Joi.boolean().default(false),
}).min(1);
