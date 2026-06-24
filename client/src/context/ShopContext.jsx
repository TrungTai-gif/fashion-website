import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { assets } from "../assets/assets";
import useCartStore from "../store/cartStore";
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "đ";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const {
    cartItems: storeItems,
    totalQuantity,
    addToCart: addToCartStore,
    initializeCart,
  } = useCartStore();
  const navigate = useNavigate();
  const [unRead, setUnRead] = useState();
  const addToCart = async (product = {}, variant = {}, quantity = 1) => {
    try {
      await addToCartStore(product, variant, quantity);
    } catch (e) {
      console.error(e);
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  const cartItems = storeItems;
  const value = {
    currency,
    delivery_fee,
    search,
    setSearch,
    cartItems,
    addToCart,
    totalQuantity,
    navigate,
    unRead,
    setUnRead,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
