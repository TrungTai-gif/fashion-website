import api from "./api";
import { toast } from "react-toastify";

export const authService = () => {
  const resource = "/api/auth";
  const loginAdmin = async ({ email, password }) => {
    try {
      const res = await api.post(resource + "/login-admin", {
        email,
        password,
      });
      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const loginUser = async ({ email, password }) => {
    try {
      const res = await api.post(resource + "api/auth/login-admin", {
        email,
        password,
      });
      return res.data;
    } catch (err) {
      throw err.response || err;
    }
  };

  const logout = async (refreshToken) => {
    try {
      const res = await api.post(resource + "/logout", {
        refreshToken: refreshToken,
      });
      return res.data;
    } catch (err) {
      throw err.response || err;
    }
  };
  const sendOTP = async (data) => {
    try {
      const res = await api.post(resource + "send-otp", { email: data });
      return res.data;
    } catch (err) {
      console.error(err.message);
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const verifyOTP = async ({ tokenOTP, confirmOTP }) => {
    try {
      const res = await api.post(resource + "verify-otp", {
        otpToken: tokenOTP,
        OTP: confirmOTP,
      });
      return res.data;
    } catch (err) {
      toast.error(err.message);
      throw new Error(err.message);
    }
  };
  const changePassword = async ({ userId, oldPassword, newPassword }) => {
    console.log(userId);
    try {
      const res = await api.post(resource + "/change-password", {
        userId,
        oldPassword,
        newPassword,
      });
      if (res.data.success) {
        return res.data;
      } else {
        console.log(res.data);
        toast.error(res.data.message);
      }
      return [];
    } catch (err) {
      throw err.response.data;
    }
  };

  return {
    loginAdmin,
    loginUser,
    logout,
    changePassword,
    sendOTP,
    verifyOTP,
  };
};
