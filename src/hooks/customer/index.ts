import { customerRegistrationFormSchema } from "@/lib/validations/auth";
import api from "@/protectedApi/Interceptor";
import { getStorage } from "@/store/local";
import { logToShort } from "@/utils/date-converter";
import { handleAxiosError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useCustomer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [customerId, setCustomerId] = useState("");

  const getCustomers = async () => {
    // Loading spinner start
    setIsLoading(true);

    try {
      const response = await api.get("/customers", {
        headers: {
          Authorization: `Bearer ${getStorage("accessToken")}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customers fetched successfully");

      setCustomers(response.data.data || []);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      // Loading spinner end
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof customerRegistrationFormSchema>>({
    resolver: zodResolver(customerRegistrationFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      phone: "",
      address: "",
      defaultPrice: 0,
      defaultQuantity: 1,
      defaultOffDays: [],
      paymentStatus: "pending",
      defaultItem: "lunch",
      paymentSystem: "weekly",
      active: true,
    },
  });

  const createCustomer = async () => {
    // Loading spinner start
    setIsLoading(true);

    try {
      const response = await api.post(
        "/customers/auth/register",
        {
          ...form.getValues(),
          defaultOffDays: logToShort(form.getValues().defaultOffDays || []),
        },
        {
          headers: {
            Authorization: `Bearer ${getStorage("accessToken")}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customer created successfully");

      // Reset form
      form.reset();

      // Close modal
      setIsAddOpen(false);

      // Update customer table
      getCustomers();
    } catch (error: any) {
      handleAxiosError(error);

      // Set form errors
      if (error.response && error.response.data) {
        const res = error.response.data;

        if (res.fields) {
          // Set form errors
          res.fields.forEach((field: any) => {
            form.setError(field.name as any, {
              message: field.message,
            });
          });
        }
      }
    } finally {
      // Loading spinner end
      setIsLoading(false);
    }
  };

  const updateCustomer = async () => {
    // Loading spinner start
    setIsLoading(true);

    try {
      const response = await api.put(
        `/customers/${customerId}`,
        {
          ...form.getValues(),
          defaultOffDays: logToShort(form.getValues().defaultOffDays || []),
        },
        {
          headers: {
            Authorization: `Bearer ${getStorage("accessToken")}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customer updated successfully");

      // Reset form
      form.reset();

      // Close modal
      setIsEditing(false);

      // Update customer table
      getCustomers();
    } catch (error: any) {
      handleAxiosError(error);

      // Set form errors
      if (error.response && error.response.data) {
        const res = error.response.data;

        if (res.fields) {
          // Set form errors
          res.fields.forEach((field: any) => {
            form.setError(field.name as any, {
              message: field.message,
            });
          });
        }
      }
    } finally {
      // Loading spinner end
      setIsLoading(false);
    }
  };

  const getSingleCustomer = async () => {};
  const deleteCustomer = async () => {};

  useEffect(() => {
    getCustomers();
  }, []);

  return {
    isLoading,
    customers,

    form,

    setIsAddOpen,
    isAddOpen,
    setIsEditing,
    isEditing,
    setIsDelOpen,
    setCustomerId,
    setDefaultValues,
    defaultValues,

    getSingleCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};

export default useCustomer;
