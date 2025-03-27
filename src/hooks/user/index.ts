import { Pagination } from "@/interface";
import { userRegistrationFormSchema } from "@/lib/validations/auth";
import api from "@/protectedApi/Interceptor";
import { getStorage } from "@/store/local";
import { handleAxiosError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [userId, setUserId] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });
  const [search, setSearch] = useState(""); // Name or Phone or Email or NID
  const [debouchedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const getUsers = useCallback(async (page = 1, search = "") => {
    setIsLoading(true);

    try {
      const response = await api.get(`/users?page=${page}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${getStorage("accessToken")}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Users fetched successfully");

      setUsers(response.data.data || []);

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

  const form = useForm<z.infer<typeof userRegistrationFormSchema>>({
    resolver: zodResolver(userRegistrationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      NID: "",
      role: "manager",
      phone: "",
      address: "",
      active: true,
    },
  });

  const createUsers = async () => {
    // Loading spinner start
    setIsLoading(true);

    try {
      const response = await api.post(
        "/users/auth/register",
        form.getValues(),
        {
          headers: {
            Authorization: `Bearer ${getStorage("accessToken")}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Users created successfully");

      // Reset form
      form.reset();

      // Close modal
      setIsAddOpen(false);

      // Remove values
      setDefaultValues(null);

      // Update users table
      getUsers();
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

  const updateUsers = async () => {
    // Loading spinner start
    setIsLoading(true);

    try {
      const response = await api.put(`/users/${userId}`, form.getValues(), {
        headers: {
          Authorization: `Bearer ${getStorage("accessToken")}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Users updated successfully");

      // Reset form
      form.reset();

      // Update editing status
      setIsEditing(false);

      // Close modal
      setIsAddOpen(false);

      // Close delete modal
      setIsDelOpen(false);

      // Update customer table
      getUsers();
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
      const response = await api.delete(`/users/${userId}`, {
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
      getUsers();
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
    getUsers(pagination.page, debouchedSearch);
  }, [pagination.page, debouchedSearch]);

  return {
    isLoading,
    users,

    form,

    setIsAddOpen,
    isAddOpen,
    setIsEditing,
    isEditing,
    setIsDelOpen,
    isDelOpen,
    setDefaultValues,
    defaultValues,

    setUserId,

    getSingleCustomer,

    deleteCustomer,
    updateUsers,
    createUsers,
    pagination,
    setPagination,
    search,
    setSearch,
  };
};

export default useUser;
