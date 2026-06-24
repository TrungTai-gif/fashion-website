import api from "./api";

const resource = "/api/cart";

const getCart = async () => {
  const res = await api.get(resource);
  return res.data?.data || res.data;
};

const addItem = async ({ product, quantity = 1, variant }) => {
  const payload = { product, quantity, variant };
  const res = await api.post(`${resource}/items`, payload);
  return res.data?.data || res.data;
};

const updateItemQuantity = async ({ itemId, quantity }) => {
  const res = await api.patch(`${resource}/items/${itemId}`, { quantity });
  return res.data?.data || res.data;
};

const removeItem = async ({ itemId }) => {
  const res = await api.delete(`${resource}/items/${itemId}`);
  return res.data?.data || res.data;
};

const clearCart = async () => {
  const res = await api.delete(resource);
  return res.data?.data || res.data;
};

export default {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
};
