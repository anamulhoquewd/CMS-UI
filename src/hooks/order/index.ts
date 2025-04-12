import { CustomerSchema, OrderSchema, Pagination } from "@/interface";
import { orderRegistrationFormSchema } from "@/lib/validations/";
import api from "@/protectedApi/Interceptor";
import { handleAxiosError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { defaultPagination } from "@/utils/default";
import { format } from "date-fns";
import useCustomer from "../customer";

const useOrder = () => {
  const [orders, setOrders] = useState<OrderSchema[]>([]);
  const [ordersCount, setOrdersCount] = useState({
    dailyChange: "",
    monthlyChange: "",
    yearlyChange: "",
    todayOrders: 0,
    yesterdayOrders: 0,
    currentMonthOrders: 0,
    prevMonthOrders: 0,
    totalOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSchema | null>(null);
  const [selectDate, setSelectDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [totalLunch, setTotalLunch] = useState(0);
  const [totalDinner, setTotalDinner] = useState(0);

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

  const getOrders = async ({
    page,
    search,
    date = new Date(),
    fromDate,
    toDate,
  }: {
    fromDate?: Date;
    toDate?: Date;
    page?: number;
    search?: string;
    date?: Date;
  }) => {
    setIsLoading(true);

    try {
      const response = await api.get("/orders", {
        params: {
          page,
          search,
          date: fromDate && toDate ? "" : format(date, "yyyy-MM-dd"),
          fromDate,
          toDate,
          sortBy: "date",
          sortType: "asc",
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Orders fetched successfully");

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
  };

  const getOrdersCount = async () => {
    try {
      const response = await api.get("/orders/count");

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Orders counted");

      setOrdersCount(response.data.data || 0);
    } catch (error) {
      handleAxiosError(error);
      console.log("Error while getting orders count", error);
    }
  };

  const form = useForm<z.infer<typeof orderRegistrationFormSchema>>({
    resolver: zodResolver(orderRegistrationFormSchema),
    defaultValues: {
      customerId: "",
      price: 0,
      quantity: 1,
      item: "",
      date: selectDate,
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

  const createOrder = async () => {
    setIsLoading(true);

    try {
      const response = await api.post("/orders", {
        customerId: form.getValues().customerId,
        date: format(selectDate, "yyyy-MM-dd"),

        ...(form.getValues().item && { item: form.getValues().item }),
        ...(form.getValues().price && { price: form.getValues().price }),
        ...(form.getValues().quantity && {
          quantity: form.getValues().quantity,
        }),
        ...(form.getValues().note && { note: form.getValues().note }),
      });

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
        date: selectDate,
        note: "",
      });

      // Close modal
      setIsAddOpen(false);

      // Remove values
      setDefaultValues(null);

      // Update users table
      getOrders({ date: selectDate });
    } catch (error: any) {
      handleAxiosError(error);
      console.log("Error creating order", error);

      // Set error message
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
  };

  const updateOrder = async () => {
    // Loading spinner start
    setIsLoading(true);

    try {
      const response = await api.put(`/orders/${orderId}`, form.getValues());

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Order updated successfully");

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

      // Update editing status
      setIsEditing(false);

      // Remove values
      setDefaultValues(null);

      // Update order ID
      setOrderId(null);

      // Update users table
      getOrders({ date: selectDate });
    } catch (error: any) {
      handleAxiosError(error);
      console.log("Error while updating order", error);

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
  };

  const deleteOrder = async () => {
    // Loading spinner start
    setIsLoading(true);

    try {
      const response = await api.delete(`/orders/${orderId}`);

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Order deleted successfully");

      // Close delete modal
      setIsDelOpen(false);

      // Update order ID
      setOrderId(null);

      // Update users table
      getOrders({ date: selectDate });
    } catch (error: any) {
      handleAxiosError(error);
      console.log("Error while deleting order", error);
    } finally {
      // Loading spinner end
      setIsLoading(false);
    }
  };

  // Memoize customers who have not placed orders
  const filteredCustomers = useMemo(() => {
    // Collect customer IDs from filteredOrders
    const customersWithOrders = new Set(
      orders
        .filter((order: OrderSchema) => {
          // Check if the order date matches the selected date
          return (
            format(order.date, "yyyy-MM-dd") ===
            format(
              new Date(
                selectDate.getFullYear(),
                selectDate.getMonth(),
                selectDate.getDate(),
                6,
                0,
                0 // 6:00:00 AM
              ),
              "yyyy-MM-dd"
            )
          );
        })
        .map((order: OrderSchema) => order.customerId)
    );

    // Filter customers to exclude those who have placed orders on selected day
    return customers.filter(
      (customer: CustomerSchema) => !customersWithOrders.has(customer._id)
    );
  }, [orders, customers, selectDate]);

  const handleNextDay = useCallback(() => {
    setSelectDate((date) => {
      const nextDate = addDays(new Date(date), 1);
      return nextDate;
    });
  }, []);

  const handlePrevDay = useCallback(() => {
    setSelectDate((date) => {
      const prevDate = addDays(date, -1);
      return new Date(prevDate);
    });
  }, []);

  const handleResetFilter = () => {
    setDateRange({ from: undefined, to: undefined });
    setSelectDate(new Date());
    pagination.page = 1;
    setSearch("");
  };

  // Calculate lunch and dinner quantity
  const totalQuantity = () => {
    const lunchesAndDinners = orders.reduce((total, order) => {
      if (order.item === "lunch&dinner") {
        return total + order.quantity;
      }
      return total;
    }, 0);

    const lunches = orders.reduce((total, order) => {
      if (order.item === "lunch") {
        return total + order.quantity;
      }
      return total;
    }, lunchesAndDinners / 2);

    const dinners = orders.reduce((total, order) => {
      if (order.item === "dinner") {
        return total + order.quantity;
      }
      return total;
    }, lunchesAndDinners / 2);

    setTotalDinner(dinners);
    setTotalLunch(lunches);
  };

  useEffect(() => {
    getOrders({
      page: pagination.page,
      search: debouncedSearch,
      date: selectDate,
      fromDate: dateRange?.from ? dateRange.from : undefined,
      toDate: dateRange?.to ? dateRange.to : undefined,
    });
    totalQuantity();
  }, [pagination.page, debouncedSearch, selectDate, dateRange]);

  useEffect(() => {
    getOrdersCount();
    totalQuantity();
  }, [orders]);

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
    setSearch,
    debouncedSearch,
    setDebouncedSearch,
    createOrder,
    form,
    setSelectedCustomer,
    selectedCustomer,
    filteredCustomers,
    setDateRange,
    dateRange,
    setSelectDate,
    selectDate,
    handleNextDay,
    handlePrevDay,
    handleResetFilter,
    ordersCount,
    totalLunch,
    totalDinner,
  };
};

export default useOrder;
