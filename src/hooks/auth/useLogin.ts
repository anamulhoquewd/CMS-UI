import { loginFormSchema } from "@/lib/validations/";
import api from "@/protectedApi/Interceptor";
import { setStorage } from "@/store/local";
import { handleAxiosError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
// import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const { login } = useAuth();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    // Start loading
    setIsLoading(true);

    try {
      console.log("data", data);

      // Send login request
      const response = await api.post(`/users/auth/login`, {
        ...(data.email.includes("@")
          ? { email: data.email }
          : { phone: data.email }),
        password: data.password,
      });

      console.log("response", response);

      // if response is successful

      if (!response.data.success) {
        throw new Error(response.data?.error?.message || "Login failed");
      }
      // Set access token
      const accessToken = response.data.tokens.accessToken;

      // Set access token in local storage
      setStorage("accessToken", accessToken);

      // Decode access token
      // const { id }: { id: string } = jwtDecode(accessToken);

      // Get user data from API
      // const res = await api.get(`/users/${id}`);
      // const user: UserSchema = res.data.data;

      // Set user in Zustand store
      // login({
      //   NID: user.NID,
      //   address: user.address,
      //   active: user.active,
      //   email: user.email,
      //   name: user.name,
      //   phone: user.phone,
      //   role: user.role,
      //   id: user.id,
      //   avatar: user.avatar || "",
      // });

      // Clear form
      form.reset();

      // Redirect to home page
      window.location.href = "/";
    } catch (error: any) {
      // Handle error
      handleAxiosError(error);

      // Set form errors
      if (error.response && error.response.data) {
        const res = error.response.data;

        if (res.fields) {
          // Set form errors
          res.fields.forEach((field: { name: string; message: string }) => {
            form.setError(field.name as "email" | "password", {
              message: field.message,
            });
          });
        }
      }
    } finally {
      // Stop loading
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
};

export default useLogin;
