import { updateUserBySelfSchema } from "@/lib/validations/auth";
import api from "@/protectedApi/Interceptor";
import { useAuth, UserSchema } from "@/store/auth/useAuth";
import { getStorage } from "@/store/local";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useProfile = () => {
  const user = useAuth((state) => state.user) as UserSchema;
  const updateUserData = useAuth((state) => state.update);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof updateUserBySelfSchema>>({
    resolver: zodResolver(updateUserBySelfSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      NID: "",
      role: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        NID: user.NID,
        role: user.role,
      });
    }
  }, [user, form]);

  const onSubmit = async (
    data: z.infer<typeof updateUserBySelfSchema>,
    {
      setIsLoading,
    }: { setIsLoading: React.Dispatch<React.SetStateAction<boolean>> }
  ) => {
    setIsLoading(true);
    try {
      const response = await api.patch("/users/profile", data, {
        headers: {
          Authorization: `Bearer ${getStorage("accessToken")}`,
        },
      });

      if (response.data.success) {
        updateUserData({
          ...user,
          name: response.data.data.name as string,
          email: response.data.data.email as string,
          phone: response.data.data.phone as string,
          address: response.data.data.address as string,
        });
      }

      setIsEditing(false);
    } catch (error: any) {
      console.warn(error);
      if (error.response.data.success === false) {
        error.response.data.fields.forEach((field: any) => {
          form.setError(field.name, {
            type: "manual",
            message: field.message,
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    form,
    onSubmit,
    setIsEditing,
    isEditing,
    isLoading,
    setIsLoading,
  };
};

export default useProfile;
