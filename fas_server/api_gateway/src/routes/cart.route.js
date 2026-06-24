import express from "express";
import { checkAccessToken } from "../middleware/auth.middleware.js";
import createServiceProxy from "../lib/proxyFactory.js";

const router = express.Router();
const COMMERCE_SERVICE_URL = process.env.COMMERCE_SERVICE_URL;

const commerceProxy = createServiceProxy(COMMERCE_SERVICE_URL);

// All cart routes require auth (user-specific)
router.get("/", checkAccessToken, commerceProxy);
router.post("/items", checkAccessToken, commerceProxy);
router.patch("/items/:itemId", checkAccessToken, commerceProxy);
router.delete("/items/:itemId", checkAccessToken, commerceProxy);
router.delete("/", checkAccessToken, commerceProxy);

export default router;
