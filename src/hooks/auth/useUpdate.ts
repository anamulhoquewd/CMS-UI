import { UserSchema } from "@/interface";
import { updateUserBySelfSchema } from "@/lib/validations/";
import api from "@/protectedApi/Interceptor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useUpdate = ({ user }: { user: UserSchema | null }) => {
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

  const onSubmit = async (data: z.infer<typeof updateUserBySelfSchema>) => {
    setIsLoading(true);
    try {
      const response = await api.patch("/users/profile", data);

      if (response.data.success) {
        console.log("Profile updated successfully");
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

export default useUpdate;
