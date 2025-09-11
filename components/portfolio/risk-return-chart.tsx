"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

const data = [
  { risk: 0, return: 0 },
  { risk: 2, return: 4 },
  { risk: 4, return: 8 },
  { risk: 6, return: 12 },
  { risk: 8, return: 16 },
  { risk: 10, return: 20 },
  { risk: 12, return: 24 },
  { risk: 14, return: 28 },
  { risk: 16, return: 32 },
  { risk: 18, return: 36 },
  { risk: 20, return: 40 },
]

export function RiskReturnChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <defs>
            <linearGradient id="riskReturnGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#7C3AED" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#6D28D9" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
          <XAxis
            type="number"
            dataKey="risk"
            name="Risk"
            unit="%"
            stroke="#374151"
            fontSize={12}
            label={{ value: "Risk (%)", position: "insideBottom", offset: -10 }}
            domain={[0, 20]}
          />
          <YAxis
            type="number"
            dataKey="return"
            name="Return"
            unit="%"
            stroke="#374151"
            fontSize={12}
            label={{ value: "Return (%)", angle: -90, position: "insideLeft" }}
            domain={[0, 40]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              color: "#374151",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value, name) => [`${value}%`, name === "risk" ? "Risk" : "Return"]}
          />
          <Area 
            type="monotone" 
            dataKey="return" 
            stroke="#8B5CF6" 
            strokeWidth={4} 
            fill="url(#riskReturnGradient)" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
