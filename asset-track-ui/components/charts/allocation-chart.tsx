"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Stocks", value: 65, color: "hsl(var(--primary))" },
  { name: "Mutual Funds", value: 20, color: "hsl(var(--secondary))" },
  { name: "Crypto", value: 10, color: "#8b5cf6" },
  { name: "Bonds", value: 5, color: "#06b6d4" },
]

export function AllocationChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`${value}%`, "Allocation"]}
          />
          <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-sm">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
