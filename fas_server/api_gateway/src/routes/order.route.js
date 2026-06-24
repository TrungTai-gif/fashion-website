import express from "express";

import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";
import createServiceProxy from "../lib/proxyFactory.js";

const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const productServiceProxy = createServiceProxy(COMMERCE_SERVICE_URL);

// PRODUCT ROUTES
// router.post("/", checkAccessToken, checkRole(["admin"]), productServiceProxy);
router.post("/", productServiceProxy);

// Claim guest orders after login
router.post("/claim", checkAccessToken, productServiceProxy);
// Get orders by email (supports both guest and logged-in users)
router.get("/by-email", productServiceProxy);

// checkRole(["admin"]);
router.get("/all", checkAccessToken, productServiceProxy);

router.get("/my-orders", checkAccessToken, productServiceProxy);

router.get("/:id", productServiceProxy);

router.patch(
  "/:id/status",
  checkAccessToken,
  checkRole(["admin"]),
  productServiceProxy
);
router.delete("/:id", productServiceProxy);

export default router;
