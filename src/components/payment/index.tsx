"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import usePayment from "@/hooks/payment";
import { paymentColumns } from "../sheared/column";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import UsersTable from "../sheared/table";
import PaginationForTable from "../sheared/paginationToTable";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import RegistrationForm from "./registerForm";
import DeleteAlert from "../sheared/delete-alert";
import PaymentCarts from "./carts";
import PaymentCardHeader from "./card-header";
import PaymentCardContent from "./card-content";

function Index() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    customerId: false,
    note: false,
  });

  const {
    payments,
    pagination,
    setPagination,
    setIsAddOpen,
    setIsEditing,
    setIsDelOpen,
    defaultValues: values,
    setDefaultValues: setValues,
    setPaymentId: setId,
    isAddOpen,
    isEditing,
    isLoading,
    isDelOpen,
    form,
    createPayment: onSubmit,
    updatePayment: onUpdate,
    deletePayment: onDelete,
    setSelectedCustomer,
    customerIds,
    paymentsCount,
  } = usePayment();

  const columns = paymentColumns({
    setIsAddOpen,
    setIsEditing,
    setIsDelOpen,
    setValues,
    setId,
  });

  const table = useReactTable({
    columns,
    data: payments,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },

    manualPagination: true,

    initialState: {
      pagination: {
        pageSize: pagination.page,
      },
    },
  });

  return (
    <>
      <PaymentCarts paymentsCount={paymentsCount} />

      <Card>
        <PaymentCardHeader
          {...{
            isLoading,
            isAddOpen,
            setIsAddOpen,
            isEditing,
            setIsEditing,
            values,
            setValues,
            form,
            setId,
            setSelectedCustomer,
            customerIds,
            onSubmit,
            onUpdate,
          }}
        />
        <PaymentCardContent
          {...{
            table,
            columns,
            pagination,
            setPagination,
          }}
        />
      </Card>
      <DeleteAlert
        isOpen={isDelOpen}
        setIsOpen={setIsDelOpen}
        cb={onDelete}
        setId={setId}
      />
    </>
  );
}

export default Index;
