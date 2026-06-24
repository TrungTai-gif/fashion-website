import { toast } from "react-toastify";
import api from "./api";

export const uploadService = () => {
  const resource = "/api/uploads";

  const uploadImages = async (data) => {
    try {
      // FormData: images
      const res = await api.post(resource + "/images", data);

      if (!res.data.success) {
        toast.error(res.data.message);
        return null;
      }
      return res.data.data;
    } catch (err) {
      toast.error("Failed to create category: " + (err.message || ""));
      console.error(err);
    }
  };

  return { uploadImages };
};
