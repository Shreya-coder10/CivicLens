"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StatusChartProps {
  stats: {
    submitted?: number;
    underReview: number;
    inProgress: number;
    resolved: number;
    rejected: number;
  };
}

const STATUS_COLORS: Record<string, string> = {
  Submitted: "#3B82F6",
  "Under Review": "#F59E0B",
  "In Progress": "#8B5CF6",
  Resolved: "#10B981",
  Rejected: "#EF4444",
};

export function StatusBarChart({ stats }: StatusChartProps) {
  const data = [
    { name: "Submitted", count: stats.submitted || 0 },
    { name: "Under Review", count: stats.underReview || 0 },
    { name: "In Progress", count: stats.inProgress || 0 },
    { name: "Resolved", count: stats.resolved || 0 },
    { name: "Rejected", count: stats.rejected || 0 },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: any) => [`${value} complaints`, "Total"]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.name] || "#172554"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
