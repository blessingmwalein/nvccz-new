"use client"

import { ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, LineChart, Line } from "recharts"

interface MonthlyData {
  month: string
  fundsDisbursed: number
  companiesInvested: number
}

interface PerformanceChartProps {
  data: MonthlyData[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-white/70">
        No performance data available
      </div>
    )
  }

  // Check if there's any data to display
  const hasData = data.some(d => d.fundsDisbursed > 0 || d.companiesInvested > 0)

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-[300px] text-white/70">
        No disbursements recorded yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis 
          dataKey="month" 
          stroke="#fff"
          tick={{ fill: '#fff', fontSize: 12 }}
        />
        <YAxis 
          stroke="#fff"
          tick={{ fill: '#fff', fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.98)', 
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            color: '#000'
          }}
          formatter={(value: number, name: string) => [
            `$${value.toLocaleString()}`, 
            name
          ]}
          labelStyle={{ 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: '#000',
            fontSize: '14px'
          }}
          itemStyle={{
            color: '#000',
            fontSize: '13px',
            padding: '4px 0'
          }}
        />
        <Legend 
          wrapperStyle={{ 
            paddingTop: '20px',
            color: '#fff'
          }}
          iconType="line"
        />
        <Line 
          type="monotone" 
          dataKey="fundsDisbursed" 
          stroke="#fff" 
          strokeWidth={3}
          name="Funds Disbursed"
          dot={{ fill: '#fff', r: 5 }}
          activeDot={{ r: 7 }}
        />
        <Line 
          type="monotone" 
          dataKey="companiesInvested" 
          stroke="rgba(255,255,255,0.6)" 
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Companies Invested"
          dot={{ fill: 'rgba(255,255,255,0.6)', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
