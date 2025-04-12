"use client";

import {
  Card,
} from "@/components/ui/card";
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
import DeleteAlert from "../sheared/delete-alert";
import PaymentCardHeader from "./card-header";
import PaymentCardContent from "./card-content";
import { StatsCard } from "../dashboard/stats-card";

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
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <StatsCard
        title="Total Transactions"
        value={String(paymentsCount.totalTransactions)}
        description={`${paymentsCount.monthlyTransaction} from last month`}
        icon="credit-card"
      />
      <StatsCard
        title="This Month's Revenue"
        value={String(paymentsCount.thisMonthAmounts)}
        description={`${paymentsCount.yearlyTransaction} from last year`}
        icon="credit-card"
      />
      <StatsCard
        title="This Year's Revenue"
        value={String(paymentsCount.thisYearAmounts)}
        description="This Year's Revenue"
        icon="credit-card"
        plaintext={true}
      />
      <StatsCard
        title="Total Revenue"
        value={String(paymentsCount.totalAmounts)}
        description="Total Revenue"
        icon="credit-card"
        plaintext={true}
      />
    </div>

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
