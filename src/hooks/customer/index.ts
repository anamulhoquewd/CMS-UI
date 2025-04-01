import { Pagination } from "@/interface";
import { customerRegistrationFormSchema } from "@/lib/validations/";
import api from "@/protectedApi/Interceptor";
import { getStorage } from "@/store/local";
import { logToShort } from "@/utils/date-converter";
import { handleAxiosError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
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
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });
  const [search, setSearch] = useState(""); // Name or Phone
  const [debouchedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const getCustomers = useCallback(async (page = 1, search = "") => {
    setIsLoading(true);

    try {
      const response = await api.get(
        `/customers?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${getStorage("accessToken")}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customers fetched successfully");

      setCustomers(response.data.data || []);

      setPagination(() => ({
        page: response.data.pagination.page,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        nextPage: response.data.pagination.nextPage || null,
        prevPage: response.data.pagination.prevPage || null,
      }));
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const form = useForm<z.infer<typeof customerRegistrationFormSchema>>({
    resolver: zodResolver(customerRegistrationFormSchema),
    defaultValues: {
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

      // Remove values
      setDefaultValues(null);

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
      setIsAddOpen(false);

      // Remove values
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

  const deleteCustomer = async () => {
    // Loading spinner start
    setIsLoading(true);

    try {
      const response = await api.delete(`/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${getStorage("accessToken")}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customer deleted successfully");

      // Close delete modal
      setIsDelOpen(false);

      // Update customer table
      getCustomers();
    } catch (error: any) {
      const res = handleAxiosError(error);

      console.error("Error deleting customer:", res.message);
    } finally {
      // Loading spinner end
      setIsLoading(false);
    }
  };

  const getSingleCustomer = async () => {};

  useEffect(() => {
    getCustomers(pagination.page, debouchedSearch);
  }, [pagination.page, debouchedSearch]);

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
    isDelOpen,
    pagination,
    setPagination,
    search,
    setSearch,
  };
};

export default useCustomer;
