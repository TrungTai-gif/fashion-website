import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import api from "./api";

export const orderService = () => {
  const { backendUrl, token } = useContext(ShopContext);
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

  return {
    getAllOrder,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
  };
};
