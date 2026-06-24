import jwt from "jsonwebtoken";
import Notification from "../models/notification.model.js";
import ApiError from "./apiError.js";

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const generateUniqueOTP = async (maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    const otp = generateOTP();
    const exists = await Notification.findOne({
      otp,
      expiresAt: { $gt: new Date() },
    });
    if (!exists) return otp;
  }
  throw new ApiError(500, "Failed to generate unique OTP", "OTPError");
};

// Generate JWT token
export const generateToken = (payload, expiresIn = "5m") => {
  return jwt.sign(payload, process.env.JWT_SECRET || "notification_secret", {
    expiresIn,
  });
};
// Clean expired OTPs
export const cleanExpiredOTPs = async () => {
  try {
    await Notification.deleteMany({
      expiresAt: { $lt: new Date() },
      status: { $ne: "verified" },
    });
    console.log("Expired OTPs cleaned up");
  } catch (error) {
    console.error("Error cleaning expired OTPs:", error);
  }
};
