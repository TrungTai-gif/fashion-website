import express from "express";
import categoryController from "../controllers/category.controller.js";
import { categoryCreate, categoryUpdate } from "../schemas/category.schema.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/", validate(categoryCreate), categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.put("/:id", validate(categoryUpdate), categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
