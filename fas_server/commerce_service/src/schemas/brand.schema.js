import Joi from "joi";

export const brandCreate = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  image: Joi.string().uri(),
});

export const brandUpdate = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(""),
  image: Joi.string().uri(),
}).min(1);

export const updateAvtBrand = Joi.object({
  image: Joi.string().uri(),
});
