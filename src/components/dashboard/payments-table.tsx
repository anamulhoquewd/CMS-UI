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
import { MoreHorizontal, Eye, DownloadCloud, RotateCcw } from "lucide-react"

interface PaymentsTableProps {
  status?: string
}

export function PaymentsTable({ status }: PaymentsTableProps) {
  const [payments, setPayments] = useState([
    {
      id: "PAY-001",
      orderId: "ORD-001",
      customer: "John Doe",
      date: "2023-06-01",
      status: "successful",
      amount: "$250.00",
      method: "Credit Card",
    },
    {
      id: "PAY-002",
      orderId: "ORD-002",
      customer: "Jane Smith",
      date: "2023-06-02",
      status: "successful",
      amount: "$150.00",
      method: "PayPal",
    },
    {
      id: "PAY-003",
      orderId: "ORD-003",
      customer: "Bob Johnson",
      date: "2023-06-03",
      status: "failed",
      amount: "$350.00",
      method: "Credit Card",
    },
    {
      id: "PAY-004",
      orderId: "ORD-004",
      customer: "Alice Brown",
      date: "2023-06-04",
      status: "successful",
      amount: "$450.00",
      method: "Bank Transfer",
    },
    {
      id: "PAY-005",
      orderId: "ORD-005",
      customer: "Charlie Wilson",
      date: "2023-06-05",
      status: "refunded",
      amount: "$550.00",
      method: "Credit Card",
    },
    {
      id: "PAY-006",
      orderId: "ORD-006",
      customer: "David Lee",
      date: "2023-06-06",
      status: "successful",
      amount: "$650.00",
      method: "PayPal",
    },
    {
      id: "PAY-007",
      orderId: "ORD-007",
      customer: "Eva Garcia",
      date: "2023-06-07",
      status: "successful",
      amount: "$750.00",
      method: "Credit Card",
    },
    {
      id: "PAY-008",
      orderId: "ORD-008",
      customer: "Frank Martinez",
      date: "2023-06-08",
      status: "failed",
      amount: "$850.00",
      method: "Bank Transfer",
    },
    {
      id: "PAY-009",
      orderId: "ORD-009",
      customer: "Grace Robinson",
      date: "2023-06-09",
      status: "successful",
      amount: "$950.00",
      method: "Credit Card",
    },
    {
      id: "PAY-010",
      orderId: "ORD-010",
      customer: "Henry Taylor",
      date: "2023-06-10",
      status: "refunded",
      amount: "$1050.00",
      method: "PayPal",
    },
  ])

  const filteredPayments = status ? payments.filter((payment) => payment.status === status) : payments

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payment ID</TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPayments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.id}</TableCell>
            <TableCell>{payment.orderId}</TableCell>
            <TableCell>{payment.customer}</TableCell>
            <TableCell>{payment.date}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  payment.status === "successful"
                    ? "border-green-500 text-green-500"
                    : payment.status === "failed"
                      ? "border-red-500 text-red-500"
                      : "border-yellow-500 text-yellow-500"
                }
              >
                {payment.status}
              </Badge>
            </TableCell>
            <TableCell>{payment.amount}</TableCell>
            <TableCell>{payment.method}</TableCell>
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
                    <DownloadCloud className="mr-2 h-4 w-4" />
                    <span>Download receipt</span>
                  </DropdownMenuItem>
                  {payment.status === "successful" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        <span>Refund payment</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

