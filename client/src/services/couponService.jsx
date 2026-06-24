import { toast } from "react-toastify";
import api from "./api";

export const couponService = () => {
  const resource = "/api/coupons";

  const getAllCoupons = async (params = {}) => {
    try {
      const res = await api.get(resource, {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          isActive: params.isActive,
          type: params.type,
          status: params.status,
          search: params.search,
        },
      });

      return res.data;
    } catch (err) {
      toast.error("Lỗi khi tải danh sách coupon: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const getCouponById = async (id) => {
    try {
      const res = await api.get(`${resource}/${id}`);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      toast.error("Lỗi khi tải thông tin coupon: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const getCouponByCode = async (code) => {
    try {
      const res = await api.get(`${resource}/code/${code}`);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      toast.error("Lỗi khi tải thông tin coupon: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const getValidCoupons = async () => {
    try {
      const res = await api.get(`${resource}/valid`);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      toast.error("Lỗi khi tải coupon hợp lệ: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const createCoupon = async (data) => {
    try {
      const res = await api.post(resource, data);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      toast.success("Tạo coupon thành công");
      return res.data.data;
    } catch (err) {
      toast.error("Lỗi khi tạo coupon: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const updateCoupon = async (id, data) => {
    try {
      const res = await api.put(`${resource}/${id}`, data);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      toast.success("Cập nhật coupon thành công");
      return res.data.data;
    } catch (err) {
      toast.error("Lỗi khi cập nhật coupon: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const deleteCoupon = async (id) => {
    try {
      const res = await api.delete(`${resource}/${id}`);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      toast.success("Xóa coupon thành công");
      return res.data;
    } catch (err) {
      toast.error("Lỗi khi xóa coupon: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const applyCoupon = async ({ code, orderAmount }) => {
    try {
      const res = await api.post(`${resource}/apply/${code}`, {
        orderAmount,
      });
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      console.log(err.response.data);
      throw err.response.data;
    }
  };

  return {
    getAllCoupons,
    getCouponById,
    getCouponByCode,
    getValidCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
  };
};
