import { create } from "zustand";

export const useAuth = create((set) => ({
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  user: JSON.parse(localStorage.getItem("user") || "null"),

  login: ({ accessToken, refreshToken, user }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.removeItem("fashion-cart-storage");
    set({
      accessToken,
      refreshToken: refreshToken,
      user,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("fashion-cart-storage");

    set({
      accessToken: "",
      refreshToken: "",
      user: null,
    });
  },
}));
