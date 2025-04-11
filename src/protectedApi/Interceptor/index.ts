// import { useAuth } from "@/store/auth/useAuth";
import { getStorage, removeStorage, setStorage } from "@/store/local";
import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${getStorage("accessToken")}`,
  },
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          // console.log("Token refreshed");
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }

        removeStorage("accessToken");
        // window.location.href = "/auth/sign-in";

        return Promise.reject(new Error("Session expired please login again"));
      } catch (refreshError) {
        // console.error("Failed to refresh token", refreshError);

        removeStorage("accessToken");
        // window.location.href = "/auth/sign-in";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/users/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.data.success && response.data.tokens?.accessToken) {
      setStorage("accessToken", response.data.tokens.accessToken);
      return response.data.tokens.accessToken;
    }
    return null;
  } catch (e) {
      console.error("Failed to refresh token: ", e);
    return null;
  }
};

export default api;
