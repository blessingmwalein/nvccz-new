"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { sector: "Technology", performance: 28.5, allocation: 35 },
  { sector: "Healthcare", performance: 22.1, allocation: 25 },
  { sector: "Financial Services", performance: 18.7, allocation: 20 },
  { sector: "Clean Energy", performance: 31.2, allocation: 12 },
  { sector: "Consumer Goods", performance: 14.3, allocation: 8 },
]

export function SectorPerformanceChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
              <stop offset="50%" stopColor="#1D4ED8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="allocationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
              <stop offset="50%" stopColor="#059669" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#047857" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
          <XAxis dataKey="sector" stroke="#374151" fontSize={12} />
          <YAxis stroke="#374151" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              color: "#374151",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value, name) => [
              name === "performance" ? `${value}%` : `${value}%`,
              name === "performance" ? "Performance" : "Allocation",
            ]}
          />
          <Bar dataKey="performance" fill="url(#performanceGradient)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="allocation" fill="url(#allocationGradient)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
