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
      console.log(res.data);
      return res.data.data;
    } catch (err) {
      toast.error("Failed upload : " + (err.response.data.message || ""));
      console.error(err);
      throw err;
    }
  };

  return { uploadImages };
};
