import api from "./api";
import { toast } from "react-toastify";

export const variantsService = () => {
  const resource = "/api/variants";

  const create = async (data) => {
    try {
      const res = await api.post(resource, data);
      return res.data;
    } catch (err) {
      toast.error("Failed to create variant: " + (err.message || ""));
      console.log(err);
      throw err;
    }
  };

  const getByProduct = async (productId) => {
    try {
      const res = await api.get(`${resource}/product/${productId}`);
      return res.data.data;
    } catch (err) {
      toast.error("Failed to fetch variants: " + (err.message || ""));
      throw err;
    }
  };

  const getAll = async () => {
    try {
      const res = await api.get(resource);
      return res.data.data;
    } catch (err) {
      toast.error("Failed to fetch variants: " + (err.message || ""));
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      const res = await api.delete(`${resource}/${id}`);
      return res.data;
    } catch (err) {
      toast.error("Failed to delete variant: " + (err.message || ""));
      throw err;
    }
  };

  const update = async ({ id, data }) => {
    try {
      const res = await api.put(`${resource}/${id}`, data);
      return res.data;
    } catch (err) {
      toast.error("Failed to update variant: " + (err.message || ""));
      throw err;
    }
  };

  return { create, getByProduct, getAll, remove, update };
};

export default variantsService;
