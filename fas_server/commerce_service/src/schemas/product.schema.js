import Joi from "joi";

const objectId = Joi.string().hex().length(24);

export const productCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required(),
  shortDescription: Joi.string().trim().min(1).max(500).required(),
  longDescription: Joi.string().trim().min(1).max(5000).required(),
  brand: objectId.required(),
  category: objectId.required(),
  // tags: Joi.array().items(objectId).default([]),
  gender: Joi.string().trim().min(1).required(),
  image: Joi.string().uri(),
  basePrice: Joi.number().min(0).optional(),
  baseStock: Joi.number().min(0).optional(),
  // Thuộc tính để sinh biến thể (SPU)
  attributes: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().min(1).max(50).required(),
        values: Joi.array()
          .items(Joi.string().trim().min(1).max(50))
          .min(1)
          .required(),
      })
    )
    .default([]),

  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(true),
});

export const productUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200),
  shortDescription: Joi.string().trim().min(1).max(500),
  longDescription: Joi.string().trim().min(1).max(5000),
  gender: Joi.string().trim().min(1).required(),
  brand: objectId,
  category: objectId,
  tags: Joi.array().items(objectId),
  image: Joi.string().uri(),
  // attributes: Joi.array().items(
  //   Joi.object({
  //     name: Joi.string().trim().min(1).max(50).required(),
  //     values: Joi.array()
  //       .items(Joi.string().trim().min(1).max(50))
  //       .min(1)
  //       .required(),
  //   })
  // ),

  isActive: Joi.boolean(),
  isFeatured: Joi.boolean(),
});
