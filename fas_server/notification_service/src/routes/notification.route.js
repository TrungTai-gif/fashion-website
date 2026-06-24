import express from "express";
import notificationController from "../controllers/notification.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  sendOTPSchema,
  sendOrderOTPSchema,
  verifyOTPSchema,
} from "../schemas/notification.schema.js";

const router = express.Router();

// Send OTP (Password Reset)
router.post(
  "/forgot-password-otp",
  validate(sendOTPSchema),
  notificationController.sendOTP
);

// Send Order Confirmation OTP
router.post(
  "/order-confirm-otp",
  validate(sendOrderOTPSchema),
  notificationController.sendOrderOTP
);

// Verify OTP
router.post(
  "/verify-otp",
  validate(verifyOTPSchema),
  notificationController.verifyOTP
);

export default router;
