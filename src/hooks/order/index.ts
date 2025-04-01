import { CustomerSchema, OrderSchema, Pagination } from "@/interface";
import { orderRegistrationFormSchema } from "@/lib/validations/";
import api from "@/protectedApi/Interceptor";
import { getStorage } from "@/store/local";
import { handleAxiosError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import useCustomer from "../customer";

const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSchema | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const { customers } = useCustomer();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const getOrders = useCallback(async (page = 1, search = "") => {
    setIsLoading(true);

    try {
      const response = await api.get("/orders", {
        params: {
          page,
          search,
        },
        headers: {
          Authorization: `Bearer ${getStorage("accessToken")}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Orders fetched successfully", response.data);

      setOrders(response.data.data || []);

      setPagination({
        page: response.data.pagination.page,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        nextPage: response.data.pagination.nextPage || null,
        prevPage: response.data.pagination.prevPage || null,
      });
    } catch (error: any) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const form = useForm<z.infer<typeof orderRegistrationFormSchema>>({
    resolver: zodResolver(orderRegistrationFormSchema),
    defaultValues: {
      customerId: "",
      price: 0,
      quantity: 1,
      item: "",
      date: new Date(),
      note: "",
    },
  });

  useEffect(() => {
    if (selectedCustomer) {
      form.setValue("customerId", selectedCustomer._id);
      form.setValue("item", selectedCustomer.defaultItem);
      form.setValue("price", selectedCustomer.defaultPrice);
      form.setValue("quantity", selectedCustomer.defaultQuantity);
    }
  }, [selectedCustomer, form]);

  const createOrder = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await api.post(
        "/orders",
        {
          customerId: form.getValues().customerId,
          date: format(form.getValues().date, "yyyy-MM-dd"),

          ...(form.getValues().item && { item: form.getValues().item }),
          ...(form.getValues().price && { price: form.getValues().price }),
          ...(form.getValues().quantity && {
            quantity: form.getValues().quantity,
          }),
          ...(form.getValues().note && { note: form.getValues().note }),
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

      console.log("Order created successfully");

      // Reset form
      form.reset({
        customerId: "",
        price: 0,
        quantity: 1,
        item: "",
        date: new Date(),
        note: "",
      });

      // Close modal
      setIsAddOpen(false);

      // Remove values
      setDefaultValues(null);

      // Update users table
      getOrders();

      // Update selected date
      setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    } catch (error: any) {
      handleAxiosError(error);
      console.log("Error creating order", error);

      // Set error message
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
      setIsLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async () => {}, []);
  const deleteOrder = useCallback(async () => {}, []);

  // Memoize customers who have not placed orders
  const filteredCustomers = useMemo(() => {
    // Collect customer IDs from filteredOrders
    const customersWithOrders = new Set(
      orders
        .filter(
          (order: OrderSchema) =>
            format(order.date, "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd")
        )
        .map((order: OrderSchema) => order.customerId)
    );

    console.log("Customers with orders", customersWithOrders);

    // Filter customers to exclude those who have placed orders on selected day
    const x = customers.filter(
      (customer: CustomerSchema) => !customersWithOrders.has(customer._id)
    );

    console.log("Filtered customers", x);

    return x;
  }, [orders, customers, selectedDate]);

  console.log("Selected Date", selectedDate);

  useEffect(() => {
    getOrders(pagination.page, debouncedSearch);
  }, [pagination.page, debouncedSearch]);

  return {
    updateOrder,
    deleteOrder,
    orders,
    setOrders,
    isLoading,
    setIsLoading,
    isAddOpen,
    setIsAddOpen,
    isEditing,
    setIsEditing,
    isDelOpen,
    setIsDelOpen,
    defaultValues,
    setDefaultValues,
    orderId,
    setOrderId,
    pagination,
    setPagination,
    search,
    setSearch,
    debouncedSearch,
    setDebouncedSearch,
    createOrder,
    form,
    setSelectedCustomer,
    selectedCustomer,
    filteredCustomers,
    setSelectedDate,
    selectedDate,
  };
};

export default useOrder;
