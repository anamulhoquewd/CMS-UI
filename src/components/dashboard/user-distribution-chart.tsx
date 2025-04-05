"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function UserDistributionChart({
  super_admin,
  admins,
  managers,
}: {
  super_admin: number;
  admins: number;
  managers: number;
}) {
  const data = [
    { name: "SuperAdmins", value: super_admin },
    { name: "Admins", value: admins },
    { name: "Managers", value: managers },
  ];
  return (
    <ChartContainer
      config={{
        SuperAdmins: {
          label: "Super Admins",
          color: "#ef4444",
        },
        Admins: {
          label: "Admins",
          color: "#22c55e",
        },
        Managers: {
          label: "Managers",
          color: "#3b82f6",
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#e11d48"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
