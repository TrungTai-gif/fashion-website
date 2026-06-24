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

    calculateShippingFee,
  };
};
