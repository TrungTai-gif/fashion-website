import { toast } from "react-toastify";
import api from "./api";

export const orderService = () => {
  const resource = "/api/orders/";

  const getAllOrder = async (params = {}) => {
    try {
      const res = await api.get(resource + "all", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status !== "all" ? params.status : undefined,
        },
      });
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      toast.error("Failed to fetch orders: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const getOrderById = async (id) => {
    try {
      const res = await api.get(resource + id);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      toast.error("Failed to fetch order detail: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const deleteOrder = async (id) => {
    try {
      const res = await api.delete(resource + id);
      return res.data;
    } catch (err) {
      toast.error("Failed to delete category: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const updateOrderStatus = async ({ id, status }) => {
    try {
      const res = await api.patch(resource + id + "/status", {
        status,
      });
      return res.data;
    } catch (err) {
      toast.error("Failed to delete category: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const createOrder = async (orderData) => {
    try {
      const res = await api.post(resource, orderData);

      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }

      // toast.success("Đặt hàng thành công!");
      return res.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Đặt hàng thất bại";

      toast.error(errorMessage);
      console.error("Create order error:", err);
      throw err;
    }
  };
  const getOTP = async (data) => {
    try {
      const res = await api.post("/api/notifications/order-confirm-otp", data);

      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }

      return res.data.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Gửi otp thất bại!";

      toast.error(errorMessage);
      console.error("Get otp error:", err);
      throw err;
    }
  };

  const verifyOTP = async (data) => {
    try {
      const res = await api.post("/api/notifications/verify-otp", data);

      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }

      return res.data.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Xác thực OTP thất bại!";

      // toast.error(errorMessage);
      console.error("Verify OTP error:", err);
      throw err;
    }
  };

  const getMyOrder = async () => {
    try {
      const res = await api.get(resource + "my-orders");
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      toast.error("Failed to fetch orders: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  return {
    getMyOrder,
    getAllOrder,
    getOrderById,
    createOrder,
    deleteOrder,
    updateOrderStatus,
    getOTP,
    verifyOTP,
  };
};
