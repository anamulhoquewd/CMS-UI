import { UserSchema } from "@/interface";
import api from "@/protectedApi/Interceptor";
import { useEffect, useState } from "react";

const useAvatar = () => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserSchema | null>(null);

  // store
  // const user = useAuth((state) => state.user);
  // const updateUserData = useAuth((state) => state.update);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me", );

        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error: any) {
        console.warn(error);
      }
    };

    fetchUser();
  }, []);

  // upload avatar handler
  const uploadHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0]) {
      return;
    }

    const file = files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSize) {
      setError("File size is too large. Maximum size is 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {

      const response = await api.post(
        `/users/uploads-avatar?filename=${
          user ? user.name.split(" ").join("-") : "user"
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
           
          },
        }
      );

      if (response.data.success && user) {
        setUser({
          ...user,
          avatar: response.data.data,
        });
      }

      setIsAvatarOpen(false);
    } catch (error: any) {
      console.log("Error uploading avatar", error);
      if (!error.response.data.success) {
        setError(error.response.data.fields[0].message);
      }
    }
  };

  return {
    user,
    uploadHandler,
    error,
    setError,
    isAvatarOpen,
    setIsAvatarOpen,
  };
};

export default useAvatar;
