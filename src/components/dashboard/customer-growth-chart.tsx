"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    newCustomers: 100,
    returningCustomers: 400,
  },
  {
    name: "Feb",
    newCustomers: 120,
    returningCustomers: 420,
  },
  {
    name: "Mar",
    newCustomers: 170,
    returningCustomers: 430,
  },
  {
    name: "Apr",
    newCustomers: 140,
    returningCustomers: 450,
  },
  {
    name: "May",
    newCustomers: 190,
    returningCustomers: 470,
  },
  {
    name: "Jun",
    newCustomers: 230,
    returningCustomers: 500,
  },
  {
    name: "Jul",
    newCustomers: 210,
    returningCustomers: 520,
  },
  {
    name: "Aug",
    newCustomers: 280,
    returningCustomers: 550,
  },
  {
    name: "Sep",
    newCustomers: 250,
    returningCustomers: 570,
  },
  {
    name: "Oct",
    newCustomers: 300,
    returningCustomers: 600,
  },
  {
    name: "Nov",
    newCustomers: 340,
    returningCustomers: 620,
  },
  {
    name: "Dec",
    newCustomers: 380,
    returningCustomers: 650,
  },
]

export function CustomerGrowthChart() {
  return (
    <ChartContainer
      config={{
        newCustomers: {
          label: "New Customers",
          color: "hsl(var(--chart-1))",
        },
        returningCustomers: {
          label: "Returning Customers",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="newCustomers"
            stackId="1"
            stroke="var(--color-newCustomers)"
            fill="var(--color-newCustomers)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="returningCustomers"
            stackId="1"
            stroke="var(--color-returningCustomers)"
            fill="var(--color-returningCustomers)"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

