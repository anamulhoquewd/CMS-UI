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
import UserFilter from "@/components/user/users-filter";

function Index() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    address: false,
    NID: false,
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
    deleteUsers: onDelete,
    pagination,
    setPagination,
    setSearch,
    usersCount,
    setFilterWithStatus,
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
    <>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatsCard
          title="Total Users in System"
          value={String(usersCount.total)}
          description={`Total Users in System`}
          icon="users"
          plaintext={true}
        />
        <StatsCard
          title="Active Users in System"
          value={String(usersCount.active)}
          description={`Super Admin: ${usersCount.super_admin}, Admins: ${usersCount.admins}, Managers: ${usersCount.managers}`}
          icon="users"
          plaintext={true}
        />
      </div>
      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-2">
          <div className="space-y-2">
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Manage and view all users
            </CardDescription>
          </div>
          <UserFilter onFilterChange={setFilterWithStatus} />
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
                  isEditing={isEditing}
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
    </>
  );
}

export default Index;
