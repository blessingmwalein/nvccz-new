"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Wallet, 
  Calculator
} from "lucide-react"
import { cn } from "@/lib/utils"
import { IncomeStatementView } from "./income-statement-view"

const tabs = [
  {
    id: "income-statement",
    label: "Income Statement",
    icon: FileText,
    description: "Profit and Loss Report",
    gradient: "from-green-400 to-green-600"
  },
  {
    id: "balance-sheet",
    label: "Balance Sheet", 
    icon: BarChart3,
    description: "Assets, Liabilities & Equity",
    gradient: "from-blue-400 to-blue-600"
  },
  {
    id: "cash-flow",
    label: "Cash Flow",
    icon: DollarSign,
    description: "Cash Inflows and Outflows",
    gradient: "from-purple-400 to-purple-600"
  }
]

export function FinancialReports() {
  const [activeTab, setActiveTab] = useState("income-statement")

  const renderTabContent = () => {
    switch (activeTab) {
      case "income-statement":
        return <IncomeStatementView />
      case "balance-sheet":
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Balance Sheet</h3>
            <p className="text-gray-500">Coming soon...</p>
          </div>
        )
      case "cash-flow":
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cash Flow Statement</h3>
            <p className="text-gray-500">Coming soon...</p>
          </div>
        )
      default:
        return <IncomeStatementView />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal">Financial Reports</h1>
          <p className="text-muted-foreground">Generate and view comprehensive financial statements</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center overflow-x-auto border-b">
            <div className="flex space-x-1 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200",
                      isActive
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br transition-all duration-200",
                      isActive ? tab.gradient : "from-gray-300 to-gray-400"
                    )}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {renderTabContent()}
        </CardContent>
      </Card>
    </div>
  )
}
