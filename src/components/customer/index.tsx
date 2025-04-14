"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreditCard, Package, Phone, User } from "lucide-react";
import CustomerInfo from "./customer-info";
import {
  CustomerSchema,
  OrderSchema,
  Pagination,
  PaymentSchema,
} from "@/interface";
import { useParams } from "next/navigation";
import { StatsCard } from "../dashboard/stats-card";
import OrderCardContent from "../order/cardContent";
import { orderColumns, paymentColumns } from "../sheared/column";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { defaultPagination } from "@/utils/default";
import { handleAxiosError } from "@/utils/error";
import api from "@/protectedApi/Interceptor";
import { getStorage } from "@/store/local";
import PaymentCardContent from "../payment/card-content";
import { decodeJwtPayload } from "@/utils/helper";

const token = getStorage("accessToken");
const { role } = decodeJwtPayload(token as string);

export default function CustomerProfile() {
  const customerId = useParams().customer as string;
  const [ordersCount, setOrdersCount] = useState({
    totalOrders: 0,
  });
  const [activeTab, setActiveTab] = useState("info");
  const [orders, setOrders] = useState<OrderSchema[]>([]);
  const [payments, setPayments] = useState<PaymentSchema[]>([]);
  const [self, setSelf] = useState<CustomerSchema>({
    _id: "",
    name: "",
    phone: "",
    address: "",
    defaultItem: "dinner",
    defaultPrice: 0,
    defaultQuantity: 0,
    defaultOffDays: [],
    paymentStatus: "pending",
    paymentSystem: "monthly",
    active: false,
    accessKey: "",
    accessKeyExpiredAt: new Date(),
    createdAt: new Date(),
    amount: 0,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    customerId: false,
    note: false,
  });
  const [orderPagination, setOrderPagination] =
    useState<Pagination>(defaultPagination);
  const [paymentPagination, setPaymentPagination] =
    useState<Pagination>(defaultPagination);

  const getCustomerById = async ({
    oPage,
    pPage,
  }: {
    oPage: number;
    pPage?: number;
  }) => {
    try {
      const response = await api.get(`/customers/${customerId}`, {
        params: {
          oPage,
          pPage,
          sortBy: "date",
          sortType: "asc",
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customer fetched successfully");

      const data = response.data.data;
      setSelf(data.customer);
      setOrders(data.orders.data);
      setPayments(data.payments.data);
      setOrderPagination({
        page: data.orders.pagination.page,
        total: data.orders.pagination.total,
        totalPages: data.orders.pagination.totalPages,
        nextPage: data.orders.pagination.nextPage || null,
        prevPage: data.orders.pagination.prevPage || null,
      });
      setPaymentPagination({
        page: data.payments.pagination.page,
        total: data.payments.pagination.total,
        totalPages: data.payments.pagination.totalPages,
        nextPage: data.payments.pagination.nextPage || null,
        prevPage: data.payments.pagination.prevPage || null,
      });
    } catch (error) {
      console.log("Error while getting customer", error);
      handleAxiosError(error);
    }
  };

  const getOrderCount = async (id?: string) => {
    try {
      const response = await api.get("/orders/count", {
        params: {
          ...(id && { customerId: id }),
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Orders counted");

      setOrdersCount(response.data.data);
    } catch (error) {
      console.log("Error while getting orders count", error);
      handleAxiosError(error);
    }
  };

  useEffect(() => {
    getCustomerById({
      oPage: orderPagination.page,
      pPage: paymentPagination.page,
    });
    getOrderCount(customerId);
  }, [orderPagination.page, paymentPagination.page, customerId]);

  const columnsForOrder = orderColumns({ hasAction: false, role });

  const columnsForPayment = paymentColumns({ hasAction: false });

  const tableForOrder = useReactTable({
    columns: columnsForOrder,
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
        pageSize: orderPagination.page,
      },
    },
  });

  const tableForPayment = useReactTable({
    columns: columnsForPayment,
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
        pageSize: paymentPagination.page,
      },
    },
  });

  return (
    <div className="w-full mx-auto space-y-6 mb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row md:items-center justify-between gap-4 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-full bg-primary/5">
            <span className="text-primary text-2xl font-bold">
              {self.name[0]}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-4 m-0">
              <h1 className="text-2xl font-bold">{self.name}</h1>
              <span className={self.active ? "text-green-500" : "text-red-500"}>
                ◉
              </span>
            </div>
            <span className="text-gray-500 text-sm">{self._id}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <a
            href={`tel:${self.phone}`}
            className="flex items-center gap-2 text-sm text-gray-500"
          >
            <Phone className="w-4 h-4" />
            {self.phone}
          </a>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <StatsCard
          description="Last order placed on June 12, 2023"
          icon="shopping-cart"
          title="Total Orders"
          value={String(ordersCount.totalOrders)}
          plaintext={true}
        />
        <StatsCard
          title="Due Amount"
          value={String(self.amount < 0 ? 0 : self.amount)}
          description={`${
            self.amount <= 0
              ? "You have no due amount"
              : "Please pay your due amount as soon as possible"
          }`}
          icon="credit-card"
          className={`${self.amount <= 0 ? "text-green-500" : "text-red-500"}`}
          plaintext={true}
        />
        <StatsCard
          title="Advanced Amount"
          value={String(self.amount > 0 ? 0 : Math.abs(self.amount))}
          description={"Advanced Amount to be paid"}
          icon="credit-card"
          className={`${self.amount > 0 ? "" : "text-green-500"}`}
          plaintext={true}
        />
      </div>

      {/* Tabbed Interface */}
      <Card>
        <Tabs
          defaultValue="info"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="info"
                className="cursor-pointer text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground"
              >
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Self Info</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="cursor-pointer text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground"
              >
                <Package className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Total Orders</span>
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="cursor-pointer text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Total Payments</span>
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-6">
            <TabsContent value="info">
              <CustomerInfo customer={self} />
            </TabsContent>
            <TabsContent value="orders">
              {/* Table for orders */}
              <OrderCardContent
                table={tableForOrder}
                columns={columnsForOrder}
                pagination={orderPagination}
                setPagination={setOrderPagination}
              />
            </TabsContent>
            <TabsContent value="payments">
              {/* Table for payments */}
              <PaymentCardContent
                table={tableForPayment}
                columns={columnsForPayment}
                pagination={paymentPagination}
                setPagination={setPaymentPagination}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
