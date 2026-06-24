import express from "express";
import variantController from "../controllers/variant.controller.js";
import {
  variantCreateSchema,
  variantUpdateSchema,
} from "../schemas/variant.schema.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

// Variant creation với ảnh
router.post(
  "/",
  validate(variantCreateSchema),
  variantController.createVariant
);

// Get variants với các filter
router.get("/", variantController.getVariants);

router.get("/product/:id", variantController.getVariantsByProduct);
router.get("/low-stock", variantController.getLowStockVariants);
// Get single variant
router.get("/:id", variantController.getVariantById);

// Update variant
router.put(
  "/:id",
  validate(variantUpdateSchema),
  variantController.updateVariant
);

// Delete variant
router.delete("/:id", variantController.deleteVariant);

export default router;
