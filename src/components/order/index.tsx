"use client";

import { Card } from "@/components/ui/card";
import DeleteAlert from "@/components/sheared/delete-alert";
import { useState } from "react";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { orderColumns } from "@/components/sheared/column";
import useOrder from "@/hooks/order";
import OrderCardHeader from "./card-header";
import OrderCardContent from "./cardContent";
import { getStorage } from "@/store/local";
import { decodeJwtPayload } from "@/utils/helper";
import { StatsCard } from "../dashboard/stats-card";

const token = getStorage("accessToken");
const { role } = decodeJwtPayload(token as string);

function Index() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    customerId: false,
    note: false,
  });

  const {
    orders,
    setIsAddOpen,
    setIsEditing,
    setIsDelOpen,
    setDefaultValues: setValues,
    setOrderId: setId,
    isAddOpen,
    isEditing,
    isDelOpen,
    setSearch,
    form,
    defaultValues: values,
    handleNextDay,
    handlePrevDay,
    setPagination,
    pagination,
    isLoading,
    createOrder: onSubmit,
    updateOrder: onUpdate,
    deleteOrder: onDelete,
    setSelectedCustomer,
    selectedCustomer,
    filteredCustomers,
    setDateRange,
    dateRange,
    setSelectDate,
    selectDate,
    handleResetFilter,
    ordersCount,
    totalLunch,
    totalDinner,
  } = useOrder();

  const columns = orderColumns({
    setIsAddOpen,
    setIsEditing,
    setIsDelOpen,
    setValues,
    setId,
    role,
  });

  const table = useReactTable({
    columns,
    data: orders,
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
        title="Today's Orders"
        value={String(ordersCount.todayOrders)}
        description={`${ordersCount.dailyChange} from yesterday`}
        icon="shopping-cart"
      />
      <StatsCard
        title="Today's Quantity"
        value={String(totalLunch + totalDinner)}
        description={`Lunches: ${totalLunch}, Dinners: ${totalDinner} | Only on this page`}
        icon="shopping-cart"
        plaintext={true}
        className="text-green-500"
      />
      <StatsCard
        title="Current Month Orders"
        value={String(ordersCount.currentMonthOrders)}
        description={`${ordersCount.monthlyChange} from last month`}
        icon="shopping-cart"
      />
      <StatsCard
        title="Total Orders"
        value={String(ordersCount.totalOrders)}
        description={`${ordersCount.yearlyChange} from last year`}
        icon="credit-card"
      />
    </div>

      <Card className="w-full overflow-hidden">
        <OrderCardHeader
          onSubmit={onSubmit}
          onUpdate={onUpdate}
          {...{
            selectDate,
            setSelectDate,
            handlePrevDay,
            handleNextDay,
            setDateRange,
            dateRange,
            handleResetFilter,
            form,
            values,
            isAddOpen,
            setIsAddOpen,
            setValues,
            setId,
            setIsEditing,
            isEditing,
            filteredCustomers,
            isLoading,
            selectedCustomer,
            setSelectedCustomer,
          }}
        />

        <OrderCardContent
          table={table}
          columns={columns}
          setSearch={setSearch}
          pagination={pagination}
          setPagination={setPagination}
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
