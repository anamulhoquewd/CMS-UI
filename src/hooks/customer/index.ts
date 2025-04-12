import { CustomerSchema, Pagination } from "@/interface";
import { customerRegistrationFormSchema } from "@/lib/validations/";
import api from "@/protectedApi/Interceptor";
import { logToShort } from "@/utils/date-converter";
import { defaultPagination } from "@/utils/default";
import { handleAxiosError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useCustomer = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<CustomerSchema[]>([]);
  const [customersCount, setCustomersCount] = useState({
    active: 0,
    total: 0,
    currentMonthNew: 0,
    prevMonthNew: 0,
    growth: 0,
    growthPercentage: "",
    activePercentage: "",
  });
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDelOpen, setIsDelOpen] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [search, setSearch] = useState<string>(""); // Name or Phone
  const [debouchedSearch, setDebouncedSearch] = useState<string>("");
  const [filterWithStatus, setFilterWithStatus] = useState<
    "active" | "inactive" | ""
  >("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const getCustomers = async (page = 1, search = "", status = "") => {
    setIsLoading(true);

    const active =
      status === "active" ? true : status === "inactive" ? false : "";

    try {
      const response = await api.get(`/customers`, {
        params: {
          search,
          page,
          active,
        },
      });

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
  };

  const getCustomersCount = async () => {
    setIsLoading(true);

    try {
      const response = await api.get("/customers/count");

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customers counted");

      setCustomersCount(response.data.data || 0);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCustomerById = async (id: string) => {
    setIsLoading(true);

    try {
      const response = await api.get(`/customers/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customer fetched successfully");

      return response.data.data;
    } catch (error) {
      console.log("Error while getting customer", error);
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await api.post("/customers/auth/register", {
        ...form.getValues(),
        defaultOffDays: logToShort(form.getValues().defaultOffDays || []),
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customer created successfully");

      // Reset form
      form.reset({
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
      });

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
      const response = await api.put(`/customers/${customerId}`, {
        ...form.getValues(),
        defaultOffDays: logToShort(form.getValues().defaultOffDays || []),
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customer updated successfully");

      // Reset form
      form.reset();

      // Close modal
      setIsAddOpen(false);

      // Remove values
      setDefaultValues(null);

      // Update customer ID
      setCustomerId(null);

      // Update editing status
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
      const response = await api.delete(`/customers/${customerId}`);

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

  useEffect(() => {
    getCustomers(pagination.page, debouchedSearch, filterWithStatus);
  }, [pagination.page, debouchedSearch, filterWithStatus]);

  useEffect(() => {
    getCustomersCount();
  }, [customers]);

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
    createCustomer,
    updateCustomer,
    deleteCustomer,
    isDelOpen,
    pagination,
    setPagination,
    search,
    setSearch,
    customersCount,
    setFilterWithStatus,
    getCustomerById,
  };
};

export default useCustomer;
