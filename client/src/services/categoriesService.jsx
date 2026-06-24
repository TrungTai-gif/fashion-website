import { toast } from "react-toastify";
import api from "./api";
export const categoriesService = () => {
  const resource = "/api/categories";
  const getAllCategories = async () => {
    try {
      const res = await api.get(resource);
      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      throw err;
    }
  };

  const createCategory = async (data) => {
    try {
      const res = await api.post(resource, data);
      return res.data;
    } catch (err) {
      toast.error("Failed to create category: " + (err.message || ""));
      console.error(err);
    }
  };

  const updateCategory = async (id, data) => {
    try {
      const res = await api.put(resource + `/${id}`, data);
      return res.data;
    } catch (err) {
      toast.error("Failed to update category: " + (err.message || ""));
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await api.delete(resource + `/${id}`);
      return res.data;
    } catch (err) {
      toast.error("Failed to delete category: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  return { getAllCategories, createCategory, deleteCategory, updateCategory };
};
