import api from "@/protectedApi/Interceptor";
import { useAuth } from "@/store/auth/useAuth";
import { getStorage } from "@/store/local";
import { useState } from "react";

const useMe = () => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [error, setError] = useState("");

  // store
  const user = useAuth((state) => state.user);
  const updateUserData = useAuth((state) => state.update);

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

    console.log("Called in upload handler. out of try");

    try {
      console.log("Called in upload handler. in try block. before api call");

      const response = await api.post(
        `/users/uploads-avatar?filename=${
          user ? user.name.split(" ").join("-") : "user"
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getStorage("accessToken")}`,
          },
        }
      );

      console.log("Called in upload handler. in try block. after api call");

      if (response.data.success && user) {
        updateUserData({ ...user, avatar: response.data.data });
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

export default useMe;
