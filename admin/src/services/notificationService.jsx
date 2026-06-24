import api from "./api";

export const notificationService = () => {
  const resource = "/api/notifications";

  const sendForgotPasswordOTP = async (email) => {
    try {
      const res = await api.post(resource + "/forgot-password-otp", {
        email: email,
      });
      return res.data;
    } catch (err) {
      console.error(err.message);
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const verifyOTP = async ({ email, otp, type = "password_reset" }) => {
    try {
      const res = await api.post(resource + "/verify-otp", {
        email,
        otp,
        type,
      });
      return res.data;
    } catch (err) {
      console.error(err.message);
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  return {
    sendForgotPasswordOTP,
    verifyOTP,
  };
};
