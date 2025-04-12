import api from "@/protectedApi/Interceptor";
import { removeStorage } from "@/store/local";
import { useCallback } from "react";

function useLogout() {
  const logout = useCallback(async () => {
    try {
      const response = await api.post("/users/auth/logout", null);

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Logout successful");
      removeStorage("accessToken");

      // Redirect to sign in page
      window.location.href = "/auth/sign-in";
    } catch (error: any) {
      console.warn(error);
    }
  }, []);

  return { logout };
}

export default useLogout;
