import express from "express";
import createServiceProxy from "../lib/proxyFactory.js";
import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const productServiceProxy = createServiceProxy(COMMERCE_SERVICE_URL);

// BRAND ROUTES
router.post("/", checkAccessToken, checkRole(["admin"]), productServiceProxy);
router.get("/", productServiceProxy);
router.put("/:id", checkAccessToken, checkRole(["admin"]), productServiceProxy);

router.delete(
  "/:id",
  checkAccessToken,
  checkRole(["admin"]),
  productServiceProxy
);
router.patch(
  "/:id/avatar",
  checkAccessToken,
  checkRole(["admin"]),
  productServiceProxy
);

export default router;
