import { CustomerSchema, Pagination ,PaymentSchema} from "@/interface";
import { paymentRegistrationFormSchema } from "@/lib/validations";
import api from "@/protectedApi/Interceptor";
import { defaultPagination } from "@/utils/default";
import { handleAxiosError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useCustomerIds from "../customer/ids";

const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentSchema[]>([]);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSchema | null>(null);
  const [paymentsCount, setPaymentsCount] = useState({
    totalTransactions: 0,
    thisMonthAmounts: 0,
    prevMonthAmounts: 0,
    thisYearAmounts: 0,
    prevYearAmounts: 0,
    monthlyTransaction: "",
    yearlyTransaction: "",
    totalAmounts: 0,
  });

  const customerIds = useCustomerIds();

  const getPayments = async (page = 1) => {
    setIsLoading(true);

    try {
      const response = await api.get("/payments", {
        params: {
          page,
        },
       
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Payments fetched successfully");

      setPayments(response.data.data || []);

      setPagination({
        page: response.data.pagination.page,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        nextPage: response.data.pagination.nextPage || null,
        prevPage: response.data.pagination.prevPage || null,
      });
    } catch (error) {
      console.log("Error while getting payments", error);
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentsCount = async () => {
    try {
      const response = await api.get("/payments/count",);

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Payments counted");

      setPaymentsCount(response.data.data || 0);
    } catch (error) {
      handleAxiosError(error);
      console.log("Error while getting payments count", error);
    }
  };

  const form = useForm<z.infer<typeof paymentRegistrationFormSchema>>({
    resolver: zodResolver(paymentRegistrationFormSchema),
    defaultValues: {
      customerId: "",
      amount: 0,
      note: "",
      transactionId: "",
      bkashNumber: "",
      nagadNumber: "",
      bankName: "",
      cashReceivedBy: "",
      paymentMethod: "",
    },
  });

  const createPayment = async () => {
    setIsLoading(true);

    try {
      const response = await api.post(
        "/payments",
        {
          amount: form.getValues().amount,
          note: form.getValues().note,
          transactionId: form.getValues().transactionId,
          customerId: form.getValues().customerId,
          paymentMethod: form.getValues().paymentMethod,
          ...(form.getValues().bkashNumber && {
            bkashNumber: form.getValues().bkashNumber,
          }),
          ...(form.getValues().nagadNumber && {
            nagadNumber: form.getValues().nagadNumber,
          }),
          ...(form.getValues().bankName && {
            bankName: form.getValues().bankName,
          }),
          ...(form.getValues().cashReceivedBy && {
            cashReceivedBy: form.getValues().cashReceivedBy,
          }),
        },
       
      );

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Payment created successfully");

      // Reset form
      form.reset({
        customerId: "",
        amount: 0,
        note: "",
        transactionId: "",
        bkashNumber: "",
        nagadNumber: "",
        bankName: "",
        cashReceivedBy: "",
        paymentMethod: "",
      });

      // Close modal
      setIsAddOpen(false);

      // Remove values
      setDefaultValues(null);

      // Update payments table
      getPayments();
    } catch (error: any) {
      console.log("Error while creating payment", error);
      handleAxiosError(error);
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

  const updatePayment = async () => {};
  const deletePayment = async () => {};

  useEffect(() => {
    getPayments(pagination.page);
  }, [pagination.page]);

  useEffect(() => {
    getPaymentsCount();
  }, [payments]);

  return {
    payments,
    isLoading,
    pagination,
    setPagination,
    isAddOpen,
    setIsAddOpen,
    isEditing,
    setIsEditing,
    isDelOpen,
    setIsDelOpen,
    defaultValues,
    setDefaultValues,
    paymentId,
    setPaymentId,
    setSelectedCustomer,
    selectedCustomer,
    updatePayment,
    deletePayment,
    createPayment,
    form,
    customerIds,
    paymentsCount,
  };
};

export default usePayment;
