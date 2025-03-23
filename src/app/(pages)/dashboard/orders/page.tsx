import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrdersTable } from "@/components/dashboard/orders-table"
import { OrdersFilter } from "@/components/dashboard/orders-filter"
import { StatsCard } from "@/components/dashboard/stats-card"

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage and analyze orders",
}

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Today's Orders" value="45" description="+20.1% from yesterday" icon="shopping-cart" />
        <StatsCard title="Weekly Orders" value="345" description="+12.2% from last week" icon="shopping-cart" />
        <StatsCard title="Monthly Orders" value="1,245" description="+15.3% from last month" icon="shopping-cart" />
        <StatsCard title="Yearly Orders" value="15,245" description="+18.4% from last year" icon="shopping-cart" />
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <OrdersFilter />
        </div>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Manage and view all customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>View and manage pending orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable status="pending" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processing Orders</CardTitle>
              <CardDescription>View and manage orders in processing</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable status="processing" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
              <CardDescription>View and manage completed orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable status="completed" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cancelled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Orders</CardTitle>
              <CardDescription>View and manage cancelled orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable status="cancelled" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

