"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  {
    name: "Jan",
    total: 1200,
    previous: 900,
  },
  {
    name: "Feb",
    total: 1900,
    previous: 1200,
  },
  {
    name: "Mar",
    total: 1500,
    previous: 1600,
  },
  {
    name: "Apr",
    total: 2200,
    previous: 1800,
  },
  {
    name: "May",
    total: 2600,
    previous: 2000,
  },
  {
    name: "Jun",
    total: 2400,
    previous: 2400,
  },
  {
    name: "Jul",
    total: 3100,
    previous: 2300,
  },
  {
    name: "Aug",
    total: 3400,
    previous: 2900,
  },
  {
    name: "Sep",
    total: 3200,
    previous: 3100,
  },
  {
    name: "Oct",
    total: 2800,
    previous: 3200,
  },
  {
    name: "Nov",
    total: 3300,
    previous: 3000,
  },
  {
    name: "Dec",
    total: 3900,
    previous: 3300,
  },
];

export function Overview() {
  return (
    <ChartContainer
      config={{
        total: {
          label: "Current Period",
          color: "hsl(var(--chart-1))",
        },
        previous: {
          label: "Previous Period",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px] md:w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <XAxis
            dataKey="name"
            stroke="#888"
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
            stroke="#888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            width={40}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="total" fill="#d1d5db" radius={[4, 4, 0, 0]} />
          <Bar dataKey="previous" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
