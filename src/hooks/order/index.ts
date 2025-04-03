import { CustomerSchema, OrderSchema, Pagination } from "@/interface";
import { orderRegistrationFormSchema } from "@/lib/validations/";
import api from "@/protectedApi/Interceptor";
import { getStorage } from "@/store/local";
import { handleAxiosError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addDays } from "date-fns";
import useCustomer from "../customer";
import { DateRange } from "react-day-picker";
import { ISODate } from "@/utils/date-converter";

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

  const [selectOrderDate, setSelectOrderDate] = useState<string>(ISODate());

  // Date for filter orders.
  const [selectDate, setSelectDate] = useState<string>(ISODate());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

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

  const getOrders = useCallback(
    async ({
      page = 1,
      search = "",
      date = "",
      fromDate = "",
      toDate = "",
    }) => {
      setIsLoading(true);

      try {
        const response = await api.get("/orders", {
          params: {
            page,
            search,
            date: fromDate && toDate ? "" : date,
            fromDate,
            toDate,
            sortBy: "date",
            sortType: "asc",
          },
          headers: {
            Authorization: `Bearer ${getStorage("accessToken")}`,
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
    },
    []
  );

  const form = useForm<z.infer<typeof orderRegistrationFormSchema>>({
    resolver: zodResolver(orderRegistrationFormSchema),
    defaultValues: {
      customerId: "",
      price: 0,
      quantity: 1,
      item: "",
      date: selectOrderDate,
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

    console.log("From value date", form.getValues().date);

    try {
      const response = await api.post(
        "/orders",
        {
          customerId: form.getValues().customerId,
          date: form.getValues().date.split("T")[0],

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
        date: new Date().toISOString(),
        note: "",
      });

      // Close modal
      setIsAddOpen(false);

      // Remove values
      setDefaultValues(null);

      // Update select date
      setSelectDate(new Date().toISOString());

      // Update users table
      getOrders({ date: selectDate.split("T")[0] });
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
            new Date(order.date).toISOString().split("T")[0] ===
            new Date(selectOrderDate).toISOString().split("T")[0]
        )
        .map((order: OrderSchema) => order.customerId)
    );

    // Filter customers to exclude those who have placed orders on selected day
    return customers.filter(
      (customer: CustomerSchema) => !customersWithOrders.has(customer._id)
    );
  }, [orders, customers, selectOrderDate]);

  const handleNextDay = useCallback(() => {
    setSelectDate((date) => {
      const nextDate = addDays(new Date(date), 1);
      return nextDate.toISOString();
    });
  }, []);

  const handlePrevDay = useCallback(() => {
    setSelectDate((date) => {
      const prevDate = addDays(date, -1);
      return new Date(prevDate).toISOString();
    });
  }, []);

  const handleResetFilter = () => {
    setDateRange({ from: undefined, to: undefined });
    setSelectDate(new Date().toISOString());
    pagination.page = 1;
    setSearch("");
  };

  useEffect(() => {
    getOrders({
      page: pagination.page,
      search: debouncedSearch,
      date: new Date(selectDate).toISOString().split("T")[0],
      fromDate: dateRange?.from
        ? new Date(dateRange.from).toISOString().split("T")[0]
        : undefined,
      toDate: dateRange?.to
        ? new Date(dateRange.to).toISOString().split("T")[0]
        : undefined,
    });
  }, [pagination.page, debouncedSearch, selectDate, dateRange]);

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
    setSelectOrderDate,
    selectOrderDate,
    setDateRange,
    dateRange,
    setSelectDate,
    selectDate,
    handleNextDay,
    handlePrevDay,
    handleResetFilter,
  };
};

export default useOrder;
