import authService from "../services/auth.service.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { OAuth2Client } from "google-auth-library";

const authController = {
  googleLogin: async (req, res) => {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    try {
      // Accept either 'credential' (from @react-oauth/google)
      const idToken = req.body?.credential;
      if (!idToken) {
        return res.status(400).json({ message: "Missing Google ID token" });
      }

      const client = new OAuth2Client(GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new Error("Invalid Google token payload");

      const result = await authService.loginGoogle(payload);
      return res.json(
        new ApiResponse({
          message: "login success",
          data: result,
        })
      );
    } catch (error) {
      console.error("googleLogin error:", error?.message || error);
      return res.status(401).json({ message: "Xác thực Google thất bại" });
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return res.json(
        new ApiResponse({
          message: "login success",
          data: result,
        })
      );
    } catch (error) {
      next(error);
    }
  },

  login_admin: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const result = await authService.login_admin(email, password);

      return res.json(
        new ApiResponse({
          message: "login success",
          data: result,
        })
      );
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken)
        throw new ApiError(
          400,
          "Missing refreshToken",
          "refreshToken is required"
        );

      const result = await authService.logout(refreshToken);
      return res.json(
        new ApiResponse({ message: "Logged out successfully", data: result })
      );
    } catch (error) {
      next(error);
    }
  },
  // Refresh token
  refreshToken: async (req, res, next) => {
    try {
      console.log("refesh:", req.body);
      const { refreshToken } = req.body;
      if (!refreshToken)
        throw new ApiError(400, "Refresh token is required", "Missing Token");

      const result = await authService.refreshAccessToken(refreshToken);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // Change password
  changePassword: async (req, res, next) => {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      const result = await authService.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      return res.json(
        new ApiResponse({ message: " change password success!" })
      );
    } catch (error) {
      // throw error;
      next(error);
    }
  },

  // Forgot password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);

      return res.json(new ApiResponse({ message: "ok" }));
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;
      const result = await authService.resetPassword(email, newPassword);

      res.json(
        new ApiResponse({
          data: result,
          message: "Update passwod successfully!",
        })
      );
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
