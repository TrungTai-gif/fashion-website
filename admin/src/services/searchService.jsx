import { toast } from "react-toastify";
import api from "./api";

export const searchService = () => {
  const resource = "/api/search";

  const searchProducts = async ({ q, size = 10 }) => {
    if (!q || !q.trim()) return { items: [], total: 0 };
    try {
      const res = await api.get(resource + "/suggest", {
        params: { q, size },
      });
      // Backend returns { success, total, items }
      return res.data;
    } catch (err) {
      toast.error("Không thể tìm kiếm sản phẩm");
      throw err;
    }
  };

  const syncSearch = async () => {
    try {
      const res = await api.post(resource + "/sync-all");
      return res.data;
    } catch (err) {
      toast.error("Lỗi không thể đồng bộ");
      throw err;
    }
  };

  http: return { searchProducts, syncSearch };
};
