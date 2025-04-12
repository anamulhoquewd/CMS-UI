import { Pagination } from "@/interface";
import { userRegistrationFormSchema } from "@/lib/validations/";
import api from "@/protectedApi/Interceptor";
import { defaultPagination } from "@/utils/default";
import { handleAxiosError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [usersCount, setUsersCount] = useState({
    active: 0,
    total: 0,
    admins: 0,
    super_admin: 0,
    managers: 0,
  });
  const [users, setUsers] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [search, setSearch] = useState(""); // Name or Phone or Email or NID
  const [debouchedSearch, setDebouncedSearch] = useState("");
  const [filterWithStatus, setFilterWithStatus] = useState<
    "active" | "inactive" | ""
  >("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const getUsers = async (page = 1, search = "", status = "") => {
    setIsLoading(true);

    const active =
      status === "active" ? true : status === "inactive" ? false : "";

    try {
      const response = await api.get("/users", {
        params: {
          search,
          page,
          active,
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
  };

  const getUsersCount = async () => {
    setIsLoading(true);

    try {
      const response = await api.get("/users/count");

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      setUsersCount(response.data.data || 0);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await api.post("/users/auth/register", form.getValues());

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Users created successfully");

      // Reset form
      form.reset({
        name: "",
        email: "",
        NID: "",
        role: "manager",
        phone: "",
        address: "",
        active: true,
      });

      // Close modal
      setIsAddOpen(false);

      // Remove values
      setDefaultValues(null);

      // Update users table
      getUsers();
    } catch (error: any) {
      handleAxiosError(error);
      console.log("error in create user", error);

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
      const response = await api.put(`/users/${userId}`, form.getValues());

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

      // Remove values
      setDefaultValues(null);

      // Update users ID
      setUserId(null);

      // Close delete modal
      setIsDelOpen(false);

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

  const deleteUsers = async () => {
    // Loading spinner start
    setIsLoading(true);

    try {
      const response = await api.delete(`/users/${userId}`);

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Users deleted successfully");

      // Close delete modal
      setIsDelOpen(false);

      // Update Users table
      getUsers();
    } catch (error: any) {
      const res = handleAxiosError(error);

      console.error("Error deleting Users:", res.message);
    } finally {
      // Loading spinner end
      setIsLoading(false);
    }
  };

  const getSingleUsers = async () => {};

  useEffect(() => {
    getUsers(pagination.page, debouchedSearch, filterWithStatus);
  }, [pagination.page, debouchedSearch, filterWithStatus]);

  useEffect(() => {
    getUsersCount();
  }, [users]);

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
    getSingleUsers,
    deleteUsers,
    updateUsers,
    createUsers,
    pagination,
    setPagination,
    search,
    setSearch,
    usersCount,
    setFilterWithStatus,
  };
};

export default useUser;
