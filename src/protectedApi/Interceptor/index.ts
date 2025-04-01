// import { useAuth } from "@/store/auth/useAuth";
import { removeStorage, setStorage } from "@/store/local";
import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshToken = async () => {
  try {
    const response = await api.post(`/users/auth/refresh`);

    console.log("response in refresh token function", response);

    if (response.data.success) {
      console.log("Refreshed token");
      setStorage("accessToken", response.data.tokens.accessToken);
      return response.data.tokens.accessToken;
    }

    return null;
  } catch (error: any) {
    console.error("Failed to refresh token", error);
    return null;
  }
};

// Interceptor - Token Refresh or Redirect
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("Error in interceptor:", error);

    // Check if the error is due to an expired access token (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true; // Mark the request as retried
      console.error("Access token expired. Attempting to refresh...");

      try {
        const newAccessToken = await refreshToken();

        if (!newAccessToken) {
          console.error(
            "Refresh token invalid or expired. Redirecting to login..."
          );
          removeStorage("accessToken");

          // const logout = useAuth.getState().logout;
          // logout();

          // await api.post("/users/auth/logout");

          window.location.href = "/auth/sign-in"; // Redirect to login
          return Promise.reject(error);
        }

        console.log("New access token received:", newAccessToken);

        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired or invalid:", refreshError);

        removeStorage("accessToken");

        window.location.href = "/auth/sign-in"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
