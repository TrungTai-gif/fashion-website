import api from "./api";
import { toast } from "react-toastify";

export const authService = () => {
  const resource = "/api/auth";
  const loginGoogle = async (credential) => {
    try {
      const res = await api.post(resource + "/google", { credential });
      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

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
      const res = await api.post(resource + "/login", {
        email,
        password,
      });
      return res.data;
    } catch (err) {
      throw err.response.data || err;
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

  const verifyOTP = async ({ email, otp, type = "password_reset" }) => {
    try {
      const res = await api.post("/api/notifications/verify-otp", {
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

  const resetPassword = async ({ email, newPassword }) => {
    try {
      const res = await api.post(resource + "/reset-password", {
        email,
        newPassword,
      });
      if (res?.data.success) {
        toast.success("Đặt lại mật khẩu thành công!");
      }
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  return {
    loginAdmin,
    loginGoogle,
    loginUser,
    logout,
    resetPassword,
    changePassword,
    verifyOTP,
  };
};
