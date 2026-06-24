import express from "express";
import SearchController from "../controllers/search.controller.js";

const router = express.Router();

// Public endpoints for search service
router.get("/", SearchController.search);
router.post("/index", SearchController.indexOne);
router.post("/bulk", SearchController.bulkIndex);
router.post("/sync/:id", SearchController.syncProductById);
router.post("/sync-all", SearchController.syncAllProducts);
router.delete("/reset", SearchController.resetIndex); // dev-only

export default router;
