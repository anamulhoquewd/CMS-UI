"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  BarChart,
  FileText,
  Download,
  Filter,
  RefreshCw,
  ArrowUpDown,
  ChevronDown,
  BarChart2,
  LineChart,
  PieChart,
  TableIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const reportFormSchema = z.object({
  reportType: z.enum(["sales", "inventory", "customers", "orders"]),
  dateRange: z.enum(["today", "yesterday", "last7days", "last30days", "thisMonth", "lastMonth", "custom"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  groupBy: z.enum(["day", "week", "month", "year"]).optional(),
  format: z.enum(["csv", "pdf", "excel"]),
})

type ReportFormValues = z.infer<typeof reportFormSchema>

// Mock data for reports
const salesData = [
  { date: "2023-07-01", revenue: 1250.75, orders: 25, averageOrderValue: 50.03 },
  { date: "2023-07-02", revenue: 1875.5, orders: 35, averageOrderValue: 53.59 },
  { date: "2023-07-03", revenue: 2100.25, orders: 40, averageOrderValue: 52.51 },
  { date: "2023-07-04", revenue: 1950.0, orders: 38, averageOrderValue: 51.32 },
  { date: "2023-07-05", revenue: 2250.75, orders: 45, averageOrderValue: 50.02 },
  { date: "2023-07-06", revenue: 1800.5, orders: 36, averageOrderValue: 50.01 },
  { date: "2023-07-07", revenue: 2400.25, orders: 48, averageOrderValue: 50.01 },
]

const inventoryData = [
  { id: "1", name: "Smartphone X", sku: "PHONE-X-001", stock: 50, reorderLevel: 10, lastRestocked: "2023-06-15" },
  { id: "2", name: "Laptop Pro", sku: "LAPTOP-P-001", stock: 25, reorderLevel: 5, lastRestocked: "2023-06-20" },
  { id: "3", name: "Cotton T-Shirt", sku: "TSHIRT-C-001", stock: 100, reorderLevel: 20, lastRestocked: "2023-06-25" },
  { id: "4", name: "Wireless Earbuds", sku: "EARBUDS-W-001", stock: 75, reorderLevel: 15, lastRestocked: "2023-06-10" },
  { id: "5", name: "Smart Watch", sku: "WATCH-S-001", stock: 30, reorderLevel: 8, lastRestocked: "2023-06-18" },
]

export function ReportGeneration() {
  const [activeTab, setActiveTab] = useState("sales")
  const [dateRangeVisible, setDateRangeVisible] = useState(false)

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reportType: "sales",
      dateRange: "last7days",
      format: "csv",
      groupBy: "day",
    },
  })

  const dateRange = form.watch("dateRange")

  function onSubmit(data: ReportFormValues) {
   console.log("Submitted data:", data)
  }

  function handleExport(format: string) {
    console.log("Exporting report in", format)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Report Generation</h3>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Create and export custom reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="reportType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setActiveTab(value)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sales">Sales Report</SelectItem>
                          <SelectItem value="inventory">Inventory Report</SelectItem>
                          <SelectItem value="customers">Customer Report</SelectItem>
                          <SelectItem value="orders">Order Report</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Range</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setDateRangeVisible(value === "custom")
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="yesterday">Yesterday</SelectItem>
                          <SelectItem value="last7days">Last 7 Days</SelectItem>
                          <SelectItem value="last30days">Last 30 Days</SelectItem>
                          <SelectItem value="thisMonth">This Month</SelectItem>
                          <SelectItem value="lastMonth">Last Month</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {dateRangeVisible && (
                  <>
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <FormField
                  control={form.control}
                  name="groupBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group By</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grouping" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Export Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="submit">
                  <FileText className="mr-2 h-4 w-4" /> Generate Report
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Report</CardTitle>
                <CardDescription>Sales data for the selected period</CardDescription>
              </div>
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      View As
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <BarChart className="mr-2 h-4 w-4" /> Bar Chart
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LineChart className="mr-2 h-4 w-4" /> Line Chart
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PieChart className="mr-2 h-4 w-4" /> Pie Chart
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TableIcon className="mr-2 h-4 w-4" /> Table
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport("csv")}>CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("excel")}>Excel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" className="p-0 h-8 font-medium">
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 h-8 font-medium">
                        Revenue
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 h-8 font-medium">
                        Orders
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 h-8 font-medium">
                        Avg. Order Value
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>${item.revenue.toFixed(2)}</TableCell>
                      <TableCell>{item.orders}</TableCell>
                      <TableCell>${item.averageOrderValue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inventory Report</CardTitle>
                <CardDescription>Current inventory status</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport("csv")}>CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("excel")}>Excel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Last Restocked</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                      <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            item.stock <= item.reorderLevel
                              ? "bg-red-100 text-red-800"
                              : item.stock <= item.reorderLevel * 2
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.stock <= item.reorderLevel
                            ? "Low Stock"
                            : item.stock <= item.reorderLevel * 2
                              ? "Medium Stock"
                              : "In Stock"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Report</CardTitle>
              <CardDescription>Select a report type to view customer data</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div className="space-y-2">
                <BarChart className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">No Report Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a customer report type and date range to generate a report.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Report</CardTitle>
              <CardDescription>Select a report type to view order data</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-8 text-center">
              <div className="space-y-2">
                <BarChart className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">No Report Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select an order report type and date range to generate a report.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

