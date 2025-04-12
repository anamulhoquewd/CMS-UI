"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserDistributionChart } from "@/components/dashboard/user-distribution-chart";
import useCustomer from "@/hooks/customer";
import useOrder from "@/hooks/order";
import useUser from "@/hooks/user";
import usePayment from "@/hooks/payment";

function Index() {
  const { customersCount } = useCustomer();
  const { ordersCount } = useOrder();
  const { usersCount } = useUser();
  const { paymentsCount } = usePayment();

  return (
    <>
      {/* Stats cards */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatsCard
          title="Today's Orders"
          value={String(ordersCount.todayOrders)}
          description={`${ordersCount.dailyChange} from yesterday`}
          icon="shopping-cart"
        />
        <StatsCard
          title="Total Orders Completed"
          value={String(ordersCount.totalOrders)}
          description={`${ordersCount.yearlyChange} from last year`}
          icon="shopping-cart"
        />
        <StatsCard
          title="Total Customers"
          value={String(customersCount.total)}
          description={`${customersCount.growthPercentage} from last month`}
          icon="users"
        />
        <StatsCard
          title="Total Users"
          value={String(usersCount.total)}
          description={`Super Admin: ${usersCount.super_admin}, Admins: ${usersCount.admins}, Managers: ${usersCount.managers}`}
          icon="user"
          plaintext={true}
        />
        <StatsCard
          title="Total Revenue"
          value={String(paymentsCount.totalAmounts)}
          description={`${paymentsCount.monthlyTransaction} from last month`}
          icon="credit-card"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Revenue overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-4 overflow-x-hidden">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Compare order, payment, and customer revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <ScrollArea className="w-full overflow-x-auto">
                  {/* <RevenueChart /> */}
                  <ScrollBar orientation="horizontal" className="mt-1" />
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="md:col-span-3 overflow-x-hidden">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of users by role</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <UserDistributionChart
                  admins={usersCount.admins}
                  super_admin={usersCount.super_admin}
                  managers={usersCount.managers}
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-7 overflow-x-hidden">
              <CardHeader>
                <CardTitle>Order Analytics</CardTitle>
                <CardDescription>
                  Monthly order trends and comparison
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <ScrollArea className="w-full overflow-x-auto">
                  {/* <Overview /> */}
                  <ScrollBar orientation="horizontal" className="mt-1" />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* @TODO: Add Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-7 overflow-x-hidden">
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Detailed business performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]"></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* @TODO: Add Reports */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-7 overflow-x-hidden">
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Generate and download business reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]"></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Index;
