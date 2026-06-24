import express from "express";
import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";
import createServiceProxy from "../lib/proxyFactory.js";

const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const productServiceProxy = createServiceProxy(COMMERCE_SERVICE_URL);

// upload image ROUTES
router.post("/images", checkAccessToken, productServiceProxy);
router.delete("/images", checkAccessToken, productServiceProxy);

export default router;
