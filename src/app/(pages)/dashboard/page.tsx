import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/dashboard/overview";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserDistributionChart } from "@/components/dashboard/user-distribution-chart";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Business analytics dashboard overview",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Orders"
          value="45"
          description="+20.1% from yesterday"
          icon="shopping-cart"
        />
        <StatsCard
          title="Total Customers"
          value="2,350"
          description="+10.1% from last month"
          icon="users"
        />
        <StatsCard
          title="Total Users"
          value="120"
          description="24 admins, 36 managers, 60 staff"
          icon="user"
        />
        <StatsCard
          title="Total Revenue"
          value="$45,231.89"
          description="+20.1% from last month"
          icon="dollar-sign"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
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
                  <RevenueChart />
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
                <UserDistributionChart />
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
                  <Overview />
                  <ScrollBar orientation="horizontal" className="mt-1" />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
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
    </div>
  );
}
