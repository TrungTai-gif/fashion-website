import { toast } from "react-toastify";
import api from "./api";

export const searchService = () => {
  const resource = "/api/search";

  const searchProducts = async ({
    q,
    from = 0,
    size = 10,
    minPrice,
    maxPrice,
  }) => {
    if (!q || !q.trim()) return { items: [], total: 0 };
    try {
      const res = await api.get(resource, {
        params: { q, from, size, minPrice, maxPrice },
      });
      // Backend returns { success, total, items }
      return res.data;
    } catch (err) {
      toast.error("Không thể tìm kiếm sản phẩm");
      throw err;
    }
  };

  return { searchProducts };
};
