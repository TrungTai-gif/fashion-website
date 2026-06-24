import express from "express";
import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";
import createServiceProxy from "../lib/proxyFactory.js";

const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const productServiceProxy = createServiceProxy(COMMERCE_SERVICE_URL);

// VARIANT ROUTES
router.post("/", checkAccessToken, checkRole(["admin"]), productServiceProxy);
router.get("/product/:id", productServiceProxy);
router.get("/", productServiceProxy);
router.put("/:id", checkAccessToken, checkRole(["admin"]), productServiceProxy);
router.delete(
  "/:id",
  checkAccessToken,
  checkRole(["admin"]),
  productServiceProxy
);

export default router;
