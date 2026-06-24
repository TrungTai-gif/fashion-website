import Joi from "joi";

export const categoryCreate = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
});

export const categoryUpdate = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(""),
}).min(1);