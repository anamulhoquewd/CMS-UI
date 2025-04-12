import { UserSchema } from "@/interface";
import api from "@/protectedApi/Interceptor";
import { useEffect, useState } from "react";

function useGetMe() {
  const [user, setUser] = useState<UserSchema | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");

        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error: any) {
        console.warn(error);
      }
    };

    fetchUser();
  }, []);

  return { user };
}

export default useGetMe;
