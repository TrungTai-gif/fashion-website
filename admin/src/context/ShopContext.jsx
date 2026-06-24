import { createContext } from "react";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const { accessToken, refreshToken, user, login, logout } = useAuth();
  const currency = "đ";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const value = {
    accessToken,
    login,
    backendUrl,
    logout,
    currency,
    navigate,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
