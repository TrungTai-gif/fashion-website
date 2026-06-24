import express from "express";
import productController from "../controllers/product.controller.js";
import {
  productUpdateSchema,
  productCreateSchema,
} from "../schemas/product.schema.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/",
  validate(productCreateSchema),
  productController.createProduct
);

// ✅ Các route cụ thể phải đặt TRƯỚC route động /:id
router.get("/", productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/category/:id", productController.getProductsByCategory);
router.get("/brand/:brandId", productController.getProductsByBrand);

// ✅ Route động /:id phải đặt CUỐI CÙNG để không "nuốt" các route trên
router.get("/:id", productController.getProductById);

router.put(
  "/:id",
  validate(productUpdateSchema),
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

export default router;
