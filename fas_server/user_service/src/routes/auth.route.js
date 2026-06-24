import express from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema.js";

const router = express.Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/google", authController.googleLogin);
router.post("/login-admin", validate(loginSchema), authController.login_admin);
router.post("/logout", validate(logoutSchema), authController.logout);

router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.post(
  "/change-password",
  validate(changePasswordSchema),
  authController.changePassword
);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default router;
