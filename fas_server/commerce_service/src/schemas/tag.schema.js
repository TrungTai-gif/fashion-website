import Joi from "joi";

export const tagCreateSchema = Joi.object({
  name: Joi.string().required(),
});

export const tagUpdateSchema = Joi.object({
  name: Joi.string(),
}).min(1);