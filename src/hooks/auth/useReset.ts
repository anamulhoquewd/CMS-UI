import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { redirect } from "next/navigation";
import { resetPasswordFormSchema } from "@/lib/validations/";
import { handleAxiosError } from "@/utils/error";

const useReset = () => {
  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof resetPasswordFormSchema>,
    {
      baseUrl,
      setIsLoading,
      setIsSuccess,
      key,
    }: {
      baseUrl: string;
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
      setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
      key: string;
    }
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${baseUrl}/users/auth/reset-password/${key}`,
        {
          password: data.newPassword,
        }
      );

      if (response.data.success) {
        setIsSuccess(true);

        // Redirect to sign in page
        setTimeout(() => {
          redirect("/auth/sign-in");
        }, 2000);

        console.log(response.data.message);
      }
    } catch (error: any) {
      handleAxiosError(error);

      const res = error.response.data;

      form.setError("newPassword", {
        message: res.error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit };
};

export default useReset;
