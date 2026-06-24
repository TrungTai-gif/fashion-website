import express from "express";
import proxy from "express-http-proxy";
import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";
import createServiceProxy from "../lib/proxyFactory.js";

const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const productServiceProxy = createServiceProxy(COMMERCE_SERVICE_URL);

// CATEGORY ROUTES
router.post("/", checkAccessToken, checkRole(["admin"]), productServiceProxy);
router.get("/", productServiceProxy);
router.put("/:id", checkAccessToken, checkRole(["admin"]), productServiceProxy);
router.delete(
  "/:id",
  checkAccessToken,
  checkRole(["admin"]),
  productServiceProxy
);

// REVIEW ROUTES
router.post("/reviews", checkAccessToken, productServiceProxy);
router.get("/reviews/product/:productId", productServiceProxy);
router.put("/reviews/:id", checkAccessToken, productServiceProxy);
router.delete("/reviews/:id", checkAccessToken, productServiceProxy);

export default router;
