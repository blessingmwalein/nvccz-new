"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

const data = [
  { month: "Jan", portfolio: 0, benchmark: 0 },
  { month: "Feb", portfolio: 650, benchmark: 580 },
  { month: "Mar", portfolio: 1300, benchmark: 1200 },
  { month: "Apr", portfolio: 1950, benchmark: 1800 },
  { month: "May", portfolio: 2600, benchmark: 2400 },
  { month: "Jun", portfolio: 2200, benchmark: 2100 },
  { month: "Jul", portfolio: 2800, benchmark: 2600 },
  { month: "Aug", portfolio: 2400, benchmark: 2300 },
  { month: "Sep", portfolio: 3000, benchmark: 2800 },
  { month: "Oct", portfolio: 3200, benchmark: 3000 },
  { month: "Nov", portfolio: 2900, benchmark: 2850 },
]

export function PerformanceChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#1D4ED8" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.6} />
              <stop offset="50%" stopColor="#059669" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#047857" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.2)" />
          <XAxis dataKey="month" stroke="#000000" fontSize={16} />
          <YAxis stroke="#000000" fontSize={16} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              color: "#374151",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value, name) => [`$${value}M`, name === "portfolio" ? "Portfolio Value" : "Benchmark"]}
          />
          <Area 
            type="monotone" 
            dataKey="benchmark" 
            stroke="#10B981" 
            strokeWidth={5} 
            fill="url(#benchmarkGradient)" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Area 
            type="monotone" 
            dataKey="portfolio" 
            stroke="#3B82F6" 
            strokeWidth={6} 
            fill="url(#portfolioGradient)" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
