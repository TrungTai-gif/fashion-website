import express from "express";
import { checkAccessToken } from "../middleware/auth.middleware.js";
import createServiceProxy from "../lib/proxyFactory.js";

const router = express.Router();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

const authServiceProxy = createServiceProxy(USER_SERVICE_URL);

// Public routes
router.post("/login", authServiceProxy);
router.post("/login-admin", authServiceProxy);
router.post("/google", authServiceProxy);
router.post("/refresh-token", authServiceProxy);
router.post("/forgot-password", authServiceProxy);
router.post("/reset-password", authServiceProxy);

// Protected routes
router.post("/change-password", checkAccessToken, authServiceProxy);
router.post("/logout", checkAccessToken, authServiceProxy);

export default router;
