"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "Jan", value: 85000 },
  { date: "Feb", value: 89000 },
  { date: "Mar", value: 92000 },
  { date: "Apr", value: 88000 },
  { date: "May", value: 95000 },
  { date: "Jun", value: 102000 },
  { date: "Jul", value: 108000 },
  { date: "Aug", value: 115000 },
  { date: "Sep", value: 118000 },
  { date: "Oct", value: 122000 },
  { date: "Nov", value: 119000 },
  { date: "Dec", value: 124500 },
]

export function PortfolioChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs" />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
