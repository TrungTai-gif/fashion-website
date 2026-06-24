import axios from "axios";
import { useAuth } from "../store/authStore";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL,
  withCredentials: false,
});

let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

api.interceptors.request.use(
  (config) => {
    try {
      const state = useAuth.getState?.();
      const accessToken = state?.accessToken;

      //  Nếu có token thì gắn vào header
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] =
          config.headers["Content-Type"] || "application/json";
      }
    } catch (err) {}

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const code = error.response?.data?.code;

    // Không xử lý lại chính request refresh hoặc request không hợp lệ
    if (
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/api/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    if (status === 401) {
      switch (code) {
        case "TOKEN_EXPIRED": {
          // Token hết hạn => thử refresh
          originalRequest._retry = true;

          const { logout, user, login } = useAuth.getState();
          const refreshToken = localStorage.getItem("refreshToken");
          const accessToken = localStorage.getItem("accessToken");

          if (!refreshToken) {
            logout?.();
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              addSubscriber((accessToken) => {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                resolve(api(originalRequest));
              });
            });
          }

          isRefreshing = true;
          try {
            const resp = await axios.post(`${baseURL}/api/auth/refresh-token`, {
              refreshToken,
            });

            console.log("result:", resp.data);

            const newAccess = resp.data.data.accessToken;
            const newRefresh = resp.data.data.refreshToken;

            login({
              accessToken: newAccess,
              refreshToken: newRefresh,
              user,
            });
            // cập nhật global header
            api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
            onRefreshed(newAccess);
            isRefreshing = false;

            // Retry request ban đầu
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          } catch (err) {
            isRefreshing = false;
            logout?.();
            return Promise.reject(err);
          }
        }

        case "TOKEN_INVALID":
        case "MISSING_ACCESS_TOKEN":
        case "MISSING_AUTH_HEADER":
        case "TOKEN_ERROR": {
          const { logout } = useAuth.getState();
          logout?.();
          return Promise.reject(error);
        }

        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
