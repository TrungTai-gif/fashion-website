import express from "express";
import proxy from "express-http-proxy";
import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const productServiceProxy = proxy(COMMERCE_SERVICE_URL, {
  proxyReqPathResolver: (req) => req.originalUrl,
});

// TAG ROUTES
router.post(
  "/tags",
  checkAccessToken,
  checkRole(["admin"]),
  productServiceProxy
);
router.get("/tags", productServiceProxy);
router.put(
  "/tags/:id",
  checkAccessToken,
  checkRole(["admin"]),
  productServiceProxy
);
router.delete(
  "/tags/:id",
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
