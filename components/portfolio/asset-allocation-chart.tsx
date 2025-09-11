"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Technology", value: 35, color: "#3B82F6" },
  { name: "Healthcare", value: 25, color: "#8B5CF6" },
  { name: "Financial Services", value: 20, color: "#F59E0B" },
  { name: "Clean Energy", value: 12, color: "#10B981" },
  { name: "Consumer Goods", value: 8, color: "#EF4444" },
]

export function AssetAllocationChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="techGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="financeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="consumerGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => {
              const gradientId = entry.name === "Technology" ? "techGradient" :
                                entry.name === "Healthcare" ? "healthGradient" :
                                entry.name === "Financial Services" ? "financeGradient" :
                                entry.name === "Clean Energy" ? "energyGradient" : "consumerGradient"
              return <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />
            })}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, "Allocation"]}
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "#FFFFFF",
            }}
          />
          <Legend 
            wrapperStyle={{ color: "#FFFFFF" }}
            formatter={(value) => <span style={{ color: "black" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
