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
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { userColumns } from "@/components/sheared/column";
import UsersTable from "@/components/sheared/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RegistrationForm from "@/components/user/registerForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useUser from "@/hooks/user";
import DeleteAlert from "@/components/sheared/delete-alert";
import PaginationForTable from "@/components/sheared/paginationToTable";

// export const metadata: Metadata = {
//   title: "Customers",
//   description: "Manage and analyze customers",
// };

export default function UsersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    name: true,
    email: true,
    phone: true,
    address: false,
    role: true,
    NID: false,
    active: true,
    actions: true,
  });

  const {
    users,
    setIsAddOpen,
    setIsEditing,
    setUserId,
    isEditing,
    setDefaultValues: setValues,
    defaultValues: values,
    isLoading,
    form,
    isAddOpen,
    updateUsers: onUpdate,
    createUsers: onSubmit,
    isDelOpen,
    setIsDelOpen,
    deleteCustomer: onDelete,
    pagination,
    setPagination,
    setSearch,
  } = useUser();

  const columns = userColumns({
    setIsAddOpen,
    setIsEditing,
    setIsDelOpen,
    setValues,
    setId: setUserId,
  });

  const table = useReactTable({
    columns,
    data: users,
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
          value={pagination.total.toString() || "0"}
          description="+10.1% from last month"
          icon="users"
        />
        <StatsCard
          title="Active Customers"
          value={
            users
              .filter((user: { active: boolean }) => user.active)
              .length.toString() || "0"
          }
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
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Manage and view all users (Admins and Managers)
            </CardDescription>
          </div>
          <Dialog
            open={isAddOpen}
            onOpenChange={(open) => {
              if (!open) {
                form.reset({
                  name: "",
                  email: "",
                  phone: "",
                  address: "",
                  NID: "",
                  role: "manager",
                  active: true,
                });
                setValues(null);
                setUserId("");
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
                <DialogTitle>Users Registration Form</DialogTitle>
                <DialogDescription>
                  Fill out the form below to complete new user registration.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="sm:max-w-[525px] h-[65dvh] overflow-hidden pr-2 md:px-4">
                <RegistrationForm
                  form={form}
                  values={values}
                  onSubmit={isEditing ? onUpdate : onSubmit}
                  isLoading={isLoading}
                />
                <ScrollBar orientation="vertical" className="w-2.5" />
                <ScrollBar orientation="horizontal" className="w-2.5" />
              </ScrollArea>
            </DialogContent>
          </Dialog>
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
        setId={setUserId}
      />
    </div>
  );
}
