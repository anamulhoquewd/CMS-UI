import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentsTable } from "@/components/dashboard/payments-table"
import { StatsCard } from "@/components/dashboard/stats-card"

export const metadata: Metadata = {
  title: "Payments",
  description: "Manage and analyze payments",
}

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Payments" value="1,245" description="+15.3% from last month" icon="credit-card" />
        <StatsCard title="Total Revenue" value="$45,231.89" description="+20.1% from last month" icon="dollar-sign" />
        <StatsCard title="Average Payment" value="$36.33" description="+4.3% from last month" icon="credit-card" />
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="successful">Successful</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="refunded">Refunded</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Payments</CardTitle>
              <CardDescription>Manage and view all payments</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="successful" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Successful Payments</CardTitle>
              <CardDescription>View and manage successful payments</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsTable status="successful" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="failed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Failed Payments</CardTitle>
              <CardDescription>View and manage failed payments</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsTable status="failed" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="refunded" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Refunded Payments</CardTitle>
              <CardDescription>View and manage refunded payments</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsTable status="refunded" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

