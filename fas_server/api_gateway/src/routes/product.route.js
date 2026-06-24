import express from "express";

import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";
import createServiceProxy from "../lib/proxyFactory.js";

const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const productServiceProxy = createServiceProxy(COMMERCE_SERVICE_URL);

// PRODUCT ROUTES
router.post("/", checkAccessToken, checkRole(["admin"]), productServiceProxy);

// ✅ Route cụ thể phải đặt TRƯỚC route động /:id
router.get("/", productServiceProxy);
router.get("/featured", productServiceProxy);
router.get("/slug/:slug", productServiceProxy);
router.get("/category/:id", productServiceProxy);
router.get("/brand/:brandId", productServiceProxy);

// REVIEW ROUTES
router.post("/reviews", checkAccessToken, productServiceProxy);
router.get("/reviews/product/:productId", productServiceProxy);
router.put("/reviews/:id", checkAccessToken, productServiceProxy);
router.delete("/reviews/:id", checkAccessToken, productServiceProxy);

// ✅ Route động /:id phải đặt CUỐI CÙNG
router.get("/:id", productServiceProxy);
router.put("/:id", checkAccessToken, productServiceProxy);
router.delete("/:id", checkAccessToken, productServiceProxy);

export default router;

