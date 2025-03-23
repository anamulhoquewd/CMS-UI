"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";

interface CustomersTableProps {
  status?: string;
}

export function CustomersTable({ status }: CustomersTableProps) {
  const [customers, _] = useState([
    {
      id: "CUST-001",
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      orders: 12,
      spent: "$1,250.00",
      avatar: "/placeholder-user.jpg",
      avatar0: "/placeholder-user.jpg",
      avatar2: "/placeholder-user.jpg",
      avatar3: "/placeholder-user.jpg",
      avatar4: "/placeholder-user.jpg",
      avatar5: "/placeholder-user.jpg",
    },
    {
      id: "CUST-002",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "active",
      orders: 8,
      spent: "$950.00",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "CUST-003",
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "inactive",
      orders: 5,
      spent: "$550.00",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "CUST-004",
      name: "Alice Brown",
      email: "alice@example.com",
      status: "active",
      orders: 15,
      spent: "$1,850.00",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "CUST-005",
      name: "Charlie Wilson",
      email: "charlie@example.com",
      status: "inactive",
      orders: 3,
      spent: "$350.00",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "CUST-006",
      name: "David Lee",
      email: "david@example.com",
      status: "active",
      orders: 10,
      spent: "$1,150.00",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "CUST-007",
      name: "Eva Garcia",
      email: "eva@example.com",
      status: "active",
      orders: 7,
      spent: "$850.00",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "CUST-008",
      name: "Frank Martinez",
      email: "frank@example.com",
      status: "inactive",
      orders: 2,
      spent: "$250.00",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "CUST-009",
      name: "Grace Robinson",
      email: "grace@example.com",
      status: "active",
      orders: 9,
      spent: "$1,050.00",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "CUST-010",
      name: "Henry Taylor",
      email: "henry@example.com",
      status: "active",
      orders: 6,
      spent: "$750.00",
      avatar: "/placeholder-user.jpg",
    },
  ]);

  const filteredCustomers = status
    ? customers.filter((customer) => customer.status === status)
    : customers;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Total Spent</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCustomers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                  <AvatarFallback>
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {customer.id}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  customer.status === "active"
                    ? "border-green-500 text-green-500"
                    : "border-red-500 text-red-500"
                }
              >
                {customer.status}
              </Badge>
            </TableCell>
            <TableCell>{customer.orders}</TableCell>
            <TableCell>{customer.spent}</TableCell>
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
                    <span>Edit customer</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete customer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
