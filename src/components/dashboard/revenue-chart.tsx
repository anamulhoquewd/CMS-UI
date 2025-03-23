"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  {
    name: "Jan",
    orderRevenue: 4000,
    paymentRevenue: 2400,
    customerRevenue: 2400,
  },
  {
    name: "Feb",
    orderRevenue: 3000,
    paymentRevenue: 1398,
    customerRevenue: 2210,
  },
  {
    name: "Mar",
    orderRevenue: 2000,
    paymentRevenue: 9800,
    customerRevenue: 2290,
  },
  {
    name: "Apr",
    orderRevenue: 2780,
    paymentRevenue: 3908,
    customerRevenue: 2000,
  },
  {
    name: "May",
    orderRevenue: 1890,
    paymentRevenue: 4800,
    customerRevenue: 2181,
  },
  {
    name: "Jun",
    orderRevenue: 2390,
    paymentRevenue: 3800,
    customerRevenue: 2500,
  },
  {
    name: "Jul",
    orderRevenue: 3490,
    paymentRevenue: 4300,
    customerRevenue: 2100,
  },
  {
    name: "Aug",
    orderRevenue: 4000,
    paymentRevenue: 2400,
    customerRevenue: 2400,
  },
  {
    name: "Sep",
    orderRevenue: 3000,
    paymentRevenue: 1398,
    customerRevenue: 2210,
  },
  {
    name: "Oct",
    orderRevenue: 2000,
    paymentRevenue: 9800,
    customerRevenue: 2290,
  },
  {
    name: "Nov",
    orderRevenue: 2780,
    paymentRevenue: 3908,
    customerRevenue: 2000,
  },
  {
    name: "Dec",
    orderRevenue: 1890,
    paymentRevenue: 4800,
    customerRevenue: 2181,
  },
];

export function RevenueChart() {
  return (
    <ChartContainer
      config={{
        orderRevenue: {
          label: "Order Revenue",
          color: "hsl(var(--chart-1))",
        },
        paymentRevenue: {
          label: "Payment Revenue",
          color: "hsl(var(--chart-2))",
        },
        customerRevenue: {
          label: "Customer Revenue",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px] md:w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            stroke="#888 "
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              // On small screens, show only first letter
              return window.innerWidth < 500 ? value.charAt(0) : value;
            }}
          />
          <YAxis
            stroke="#888 "
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            width={50}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="orderRevenue"
            stroke="#93c5fd"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="paymentRevenue"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="customerRevenue"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
