import { toast } from "react-toastify";
import api from "./api";

export const deliveryService = () => {
  const resource = "/api/deliveries";

  const getAllDeliveries = async (params = {}) => {
    try {
      const res = await api.get(resource, {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          isActive: true,
        },
      });

      return res.data.data;
    } catch (err) {
      toast.error(
        "Lỗi khi tải danh sách phương thức giao hàng: " + (err.message || "")
      );
      console.error(err);
      throw err;
    }
  };

  const getDeliveryById = async (id) => {
    try {
      const res = await api.get(`${resource}/${id}`);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      toast.error(
        "Lỗi khi tải thông tin phương thức giao hàng: " + (err.message || "")
      );
      console.error(err);
      throw err;
    }
  };

  const createDelivery = async (data) => {
    try {
      const res = await api.post(resource, data);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      toast.success("Tạo phương thức giao hàng thành công");
      return res.data.data;
    } catch (err) {
      toast.error("Lỗi khi tạo phương thức giao hàng: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const updateDelivery = async (id, data) => {
    try {
      const res = await api.put(`${resource}/${id}`, data);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      toast.success("Cập nhật phương thức giao hàng thành công");
      return res.data.data;
    } catch (err) {
      toast.error(
        "Lỗi khi cập nhật phương thức giao hàng: " + (err.message || "")
      );
      console.error(err);
      throw err;
    }
  };

  const deleteDelivery = async (id) => {
    try {
      const res = await api.delete(`${resource}/${id}`);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }

      return res.data;
    } catch (err) {
      toast.error("Lỗi khi xóa phương thức giao hàng: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const calculateShippingFee = async (id, orderAmount) => {
    try {
      const res = await api.post(`${resource}/${id}/calculate`, {
        orderAmount,
      });
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      toast.error("Lỗi khi tính phí giao hàng: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  return {
    getAllDeliveries,
    getDeliveryById,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    calculateShippingFee,
  };
};
