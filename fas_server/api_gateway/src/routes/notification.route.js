import express from "express";
import createServiceProxy from "../lib/proxyFactory.js";
import { checkAccessToken, checkRole } from "../middleware/auth.middleware.js";

const router = express.Router();

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL;
const notificationServiceProxy = createServiceProxy(NOTIFICATION_SERVICE_URL);

// ================= PUBLIC ROUTES =================
// Send Order OTP (called from Order Service or directly)
router.post("/order-confirm-otp", notificationServiceProxy);

// Send Forgot Password OTP (called from Auth flow)
router.post("/forgot-password-otp", notificationServiceProxy);

// Verify OTP (public - can be called during order/auth flow)
router.post("/verify-otp", notificationServiceProxy);

export default router;
