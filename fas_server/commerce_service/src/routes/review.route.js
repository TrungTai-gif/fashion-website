import express from "express";
import reviewController from "../controllers/review.controller.js";
import { reviewCreateSchema, reviewUpdateSchema } from "../schemas/review.schema.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/", validate(reviewCreateSchema), reviewController.createReview);
router.get("/product/:productId", reviewController.getReviewsByProduct);
router.put("/:id", validate(reviewUpdateSchema), reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export default router;