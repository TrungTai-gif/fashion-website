import notificationService from "../services/notification.service.js";
import ApiResponse from "../utils/apiResponse.js";

const notificationController = {
  // Send OTP (Password Reset or Email Verification)
  sendOTP: async (req, res, next) => {
    try {
      const { email, type = "password_reset" } = req.body;

      const result = await notificationService.sendOTP(email, type);

      res.json(
        new ApiResponse({
          success: true,
          message: result.message,
          data: {
            expiresIn: result.expiresIn,
            type: "password_reset",
          },
        })
      );
    } catch (error) {
      next(error);
    }
  },

  // Send Order Confirmation OTP
  sendOrderOTP: async (req, res, next) => {
    try {
      const orderData = req.body;

      const result = await notificationService.sendOrderOTP(orderData);

      res.json(
        new ApiResponse({
          success: true,
          message: result.message,
          data: {
            expiresIn: result.expiresIn,
            orderCode: result.orderCode,
            type: "order_confirmation",
          },
        })
      );
    } catch (error) {
      next(error);
    }
  },

  // Verify OTP
  verifyOTP: async (req, res, next) => {
    try {
      const { email, otp, type = "password_reset" } = req.body;

      const result = await notificationService.verifyOTP(email, otp, type);

      res.json(
        new ApiResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
      next(error);
    }
  },
};

export default notificationController;
