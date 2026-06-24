import express from "express";
import tagController from "../controllers/tag.controller.js";
import { tagCreateSchema, tagUpdateSchema } from "../schemas/tag.schema.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/", validate(tagCreateSchema), tagController.createTag);
router.get("/", tagController.getTags);
router.put("/:id", validate(tagUpdateSchema), tagController.updateTag);
router.delete("/:id", tagController.deleteTag);

export default router;