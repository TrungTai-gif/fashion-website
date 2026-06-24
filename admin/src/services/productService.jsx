import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import api from "./api";

export const productService = () => {
  const resource = "/api/products/";

  const getAllProducts = async () => {
    try {
      const res = await api.get(resource);
      return res.data.data;
    } catch (err) {
      toast.error("Failed to fetch products: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const getProductBySlug = async (slug) => {
    try {
      const res = await api.get(resource + "slug/" + slug);

      if (res.data.success) return res.data.data;
      else throw new Error(res.data.message || "Failed to fetch product");
    } catch (err) {
      toast.error("Failed to fetch product: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const getProductById = async (id) => {
    try {
      const res = await api.get(resource + id);
      if (res.data.success) return res.data.data;
      throw new Error(res.data.message || "Failed to fetch product");
    } catch (err) {
      toast.error("Failed to fetch product: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const createProduct = async ({ data }) => {
    try {
      const res = await api.post(resource, data);
      if (res.data.success) {
        return res.data;
      } else {
        throw new Error(res.data.message || "Failed to create product");
      }
    } catch (err) {
      toast.error("Failed to create product: " + (err.message || ""));

      throw err;
    }
  };

  const updateProduct = async ({ id, data }) => {
    try {
      const res = await api.put(resource + id, data);
      if (res.data.success) {
        return res.data;
      } else {
        throw new Error(res.data.message || "Failed to update product");
      }
    } catch (err) {
      toast.error("Failed to update product: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const deleteProduct = async ({ id }) => {
    try {
      const res = await api.delete(resource + id);
      return res.data;
    } catch (err) {
      toast.error("Failed to delete product: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };

  const blockProduct = async ({ id, block = "false" }) => {
    try {
      console.log(id);
      const res = await api.post(resource + "/block/" + id, {
        isActive: block,
      });
      return res.data;
    } catch (err) {
      toast.error("Failed to delete product: " + (err.message || ""));
      console.error(err);
      throw err;
    }
  };
  return {
    getProductBySlug,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    blockProduct,
  };
};
