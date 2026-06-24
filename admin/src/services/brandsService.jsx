import { toast } from "react-toastify";
import api from "./api";
export const brandsService = () => {
  const resource = "/api/brands";
  const getAllBrands = async () => {
    try {
      const res = await api.get(resource);
      return res.data.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const createBrand = async (data) => {
    try {
      const res = await api.post(resource, data);

      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data;
    } catch (err) {
      toast.error("Failed to create category: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const updateBrand = async (_id, data) => {
    try {
      const res = await api.put(resource + `/${_id}`, data);
      return res.data;
    } catch (err) {
      toast.error("Failed to update category: " + (err.message || ""));
      console.error(err);
    }
  };

  const deleteBrand = async (id) => {
    try {
      const res = await api.delete(resource + `/${id}`);
      return res.data;
    } catch (err) {
      toast.error("Failed to delete brand: " + (err.message || ""));
      throw err;
    }
  };

  return { getAllBrands, createBrand, updateBrand, deleteBrand };
};
