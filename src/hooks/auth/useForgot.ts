import { z } from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordFormSchema } from "@/lib/validations/auth";

const useForgot = () => {
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof forgotPasswordFormSchema>,
    {
      baseUrl,
      setIsLoading,
      setIsSuccess,
      setValue,
    }: {
      baseUrl: string;
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
      setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
      setValue: React.Dispatch<React.SetStateAction<string>>;
    }
  ) => {
    // Start loading
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/users/auth/forgot-password`,
        data
      );

      if (response.data.success) {
        console.log(response.data.message);

        setIsSuccess(true);
        setValue(data.email);

        // Reset form
        form.reset();
      }
    } catch (error: any) {
      setValue("");

      const res = error.response.data;

      if (res.fields) {
        res.fields.forEach((field: { name: string; message: string }) => {
          form.setError(field.name as "email", {
            message: field.message,
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { onSubmit, form };
};

export default useForgot;

// export type UseForgot = ReturnType<typeof useForgot>;
