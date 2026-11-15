"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatCategoryName } from "@/lib/utils";

const COLORS = [
  "#EA580C", // ROADS: Orange
  "#16A34A", // GARBAGE: Green
  "#0284C7", // WATER: Sky Blue
  "#CA8A04", // STREETLIGHTS: Amber
  "#9333EA", // DRAINAGE: Purple
  "#DC2626", // INFRASTRUCTURE: Red
  "#64748B", // OTHER: Slate
];

interface CategoryChartProps {
  data: { category: string; count: number }[];
}

export function CategoryPieChart({ data }: CategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        No category data available yet.
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: formatCategoryName(item.category),
    value: item.count,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [`${value} Reports`, "Count"]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
