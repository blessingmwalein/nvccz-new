"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Users, Download } from "lucide-react"

const performanceData = [
  {
    company: "TechFlow Solutions",
    revenue: "$2.4M",
    growth: "+23%",
    employees: 45,
    valuation: "$15M",
    trend: "up",
    kpis: [
      { metric: "ARR", value: "$2.1M", change: "+18%" },
      { metric: "CAC", value: "$450", change: "-12%" },
      { metric: "LTV", value: "$5.2K", change: "+8%" },
    ],
  },
  {
    company: "GreenEnergy Corp",
    revenue: "$1.8M",
    growth: "+18%",
    employees: 32,
    valuation: "$8M",
    trend: "up",
    kpis: [
      { metric: "Revenue", value: "$1.8M", change: "+18%" },
      { metric: "Margin", value: "32%", change: "+5%" },
      { metric: "Contracts", value: "24", change: "+12%" },
    ],
  },
]

export default function CompanyPerformancePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">Track portfolio company performance metrics</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Portfolio Revenue</p>
                <p className="text-2xl font-bold text-green-900">$12.8M</p>
                <p className="text-sm text-green-600 mt-1">+19% vs last quarter</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Avg Growth Rate</p>
                <p className="text-2xl font-bold text-blue-900">+20.5%</p>
                <p className="text-sm text-blue-600 mt-1">Across all companies</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Employees</p>
                <p className="text-2xl font-bold text-purple-900">342</p>
                <p className="text-sm text-purple-600 mt-1">+15% headcount growth</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Performance Cards */}
      <div className="space-y-6">
        {performanceData.map((company, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{company.company}</CardTitle>
                <Badge variant="outline" className="bg-white">
                  {company.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  )}
                  {company.growth}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{company.revenue}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Valuation</p>
                  <p className="text-2xl font-bold text-gray-900">{company.valuation}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{company.employees}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Growth</p>
                  <p className="text-2xl font-bold text-green-600">{company.growth}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Key Performance Indicators</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {company.kpis.map((kpi, kpiIndex) => (
                    <div key={kpiIndex} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{kpi.metric}</p>
                          <p className="text-lg font-semibold text-gray-900">{kpi.value}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            kpi.change.startsWith("+")
                              ? "text-green-600 border-green-200"
                              : "text-red-600 border-red-200"
                          }
                        >
                          {kpi.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
