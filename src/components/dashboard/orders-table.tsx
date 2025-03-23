"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react"

interface OrdersTableProps {
  status?: string
}

export function OrdersTable({ status }: OrdersTableProps) {
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: "John Doe",
      date: "2023-06-01",
      status: "completed",
      amount: "$250.00",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      date: "2023-06-02",
      status: "processing",
      amount: "$150.00",
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      date: "2023-06-03",
      status: "pending",
      amount: "$350.00",
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      date: "2023-06-04",
      status: "completed",
      amount: "$450.00",
    },
    {
      id: "ORD-005",
      customer: "Charlie Wilson",
      date: "2023-06-05",
      status: "cancelled",
      amount: "$550.00",
    },
    {
      id: "ORD-006",
      customer: "David Lee",
      date: "2023-06-06",
      status: "completed",
      amount: "$650.00",
    },
    {
      id: "ORD-007",
      customer: "Eva Garcia",
      date: "2023-06-07",
      status: "processing",
      amount: "$750.00",
    },
    {
      id: "ORD-008",
      customer: "Frank Martinez",
      date: "2023-06-08",
      status: "pending",
      amount: "$850.00",
    },
    {
      id: "ORD-009",
      customer: "Grace Robinson",
      date: "2023-06-09",
      status: "completed",
      amount: "$950.00",
    },
    {
      id: "ORD-010",
      customer: "Henry Taylor",
      date: "2023-06-10",
      status: "cancelled",
      amount: "$1050.00",
    },
  ])

  const filteredOrders = status ? orders.filter((order) => order.status === status) : orders

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  order.status === "completed"
                    ? "border-green-500 text-green-500"
                    : order.status === "processing"
                      ? "border-blue-500 text-blue-500"
                      : order.status === "pending"
                        ? "border-yellow-500 text-yellow-500"
                        : "border-red-500 text-red-500"
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{order.amount}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit order</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete order</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

