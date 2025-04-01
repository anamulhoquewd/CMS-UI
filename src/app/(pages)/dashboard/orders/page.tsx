"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import PaginationForTable from "@/components/sheared/paginationToTable";
import DeleteAlert from "@/components/sheared/delete-alert";
import UsersTable from "@/components/sheared/table";
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
import RegistrationForm from "@/components/order/registrationForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";

export default function OrdersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    customerId: false,
    customerName: true,
    customerPhone: true,
    price: true,
    quantity: true,
    total: true,
    item: true,
    date: true,
    note: false,
    actions: true,
  });
  const [date, setDate] = useState({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
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
    setPagination,
    pagination,
    isLoading,
    createOrder: onSubmit,
    updateOrder: onUpdate,
    deleteOrder: onDelete,
    setSelectedCustomer,
    selectedCustomer,
    filteredCustomers,
    setSelectedDate,
    selectedDate,
  } = useOrder();

  const columns = orderColumns({
    setIsAddOpen,
    setIsEditing,
    setIsDelOpen,
    setValues,
    setId,
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
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Customers"
          value={"0"}
          description="+10.1% from last month"
          icon="users"
        />
        <StatsCard
          title="Active Customers"
          value={"0"}
          description="+5.2% from last month"
          icon="users"
        />
        <StatsCard
          title="Customer Increments"
          value="5"
          description="+20.1% from last month"
          icon="users"
        />
      </div>

      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-3 space-y-0">
          <div className="space-y-2">
            <CardTitle>All Orders</CardTitle>
            <CardDescription>Manage and view all orders</CardDescription>
          </div>

          <div className="flex items-center justify-between w-fit gap-2">
            <Button
              // onClick={handlePreviousDay}
              variant="outline"
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-40 sm:w-[250px] cursor-pointer"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 hidden sm:block" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(selectedDate)}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between w-fit gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="date" variant={"outline"} className={"w-[150px]"}>
                    <Filter className="mr-2 h-4 w-4" />

                    <span>Date Range</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Dialog
              open={isAddOpen}
              onOpenChange={(open) => {
                if (!open) {
                  form.reset({
                    customerId: "",
                    price: 0,
                    quantity: 1,
                    item: "",
                    date: new Date(),
                    note: "",
                  });
                  setValues(null);
                  setId("");
                  setIsEditing(false);
                }
                setIsAddOpen(open);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  onChange={() => setIsAddOpen(true)}
                  className="w-full sm:w-auto cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add new
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Customer Registration Form</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to complete new customer
                    registration.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="sm:max-w-[525px] h-[65dvh] overflow-hidden pr-2 md:px-4">
                  <RegistrationForm
                    form={form}
                    values={values}
                    onSubmit={isEditing ? onUpdate : onSubmit}
                    isEditing={isEditing}
                    isLoading={isLoading}
                    customers={filteredCustomers}
                    setSelectedCustomer={setSelectedCustomer}
                    selectedCustomer={selectedCustomer}
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                  />
                  <ScrollBar orientation="vertical" className="w-2.5" />
                  <ScrollBar orientation="horizontal" className="w-2.5" />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable table={table} columns={columns} setSearch={setSearch} />
          {pagination.total > 0 && (
            <PaginationForTable
              pagination={pagination}
              setPagination={setPagination}
            />
          )}
        </CardContent>
      </Card>
      <DeleteAlert
        isOpen={isDelOpen}
        setIsOpen={setIsDelOpen}
        cb={onDelete}
        setId={setId}
      />
    </div>
  );
}
