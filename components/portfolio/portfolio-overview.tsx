"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Users,
  Calendar,
  Filter,
} from "lucide-react"
import { AssetAllocationChart } from "./asset-allocation-chart"
import { PerformanceChart } from "./performance-chart"
import { TransactionHistory } from "./transaction-history"

export function PortfolioOverview() {
  const portfolioMetrics = [
    {
      title: "Total Portfolio Value",
      value: "$2.4B",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Net IRR",
      value: "18.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Active Investments",
      value: "156",
      change: "+12",
      trend: "up",
      icon: Building2,
    },
    {
      title: "Cash Available",
      value: "$340M",
      change: "-5.2%",
      trend: "down",
      icon: PieChart,
    },
  ]

  const topPerformers = [
    { name: "TechCorp Inc.", sector: "Technology", value: "$45M", return: "+28.5%" },
    { name: "GreenEnergy Ltd.", sector: "Clean Energy", value: "$32M", return: "+24.1%" },
    { name: "HealthTech Solutions", sector: "Healthcare", value: "$28M", return: "+19.8%" },
    { name: "FinanceAI Corp", sector: "Fintech", value: "$38M", return: "+17.2%" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal">Portfolio Overview</h1>
          <p className="text-muted-foreground">Comprehensive view of your investment portfolio</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="bg-transparent">
            <Calendar className="w-4 h-4 mr-2" />
            Q4 2024
          </Button>
          <Button className="gradient-primary text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioMetrics.map((metric, index) => {
          const Icon = metric.icon
          const isPositive = metric.trend === "up"

          return (
            <Card key={index} className={`border border-gray-200 hover:border-gray-300 transition-all duration-300 ${index % 2 === 0 ? 'gradient-primary' : 'bg-white'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${index % 2 === 0 ? 'text-white' : ''}`}>{metric.title}</CardTitle>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index % 2 === 0 ? 'bg-white/20' : 'gradient-primary'}`}>
                  <Icon className={`h-4 w-4 ${index % 2 === 0 ? 'text-white' : 'text-white'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-5xl font-normal ${index % 2 === 0 ? 'text-white' : ''}`}>{metric.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {isPositive ? (
                    <ArrowUpRight className={`w-3 h-3 ${index % 2 === 0 ? 'text-white/80' : 'text-green-600'}`} />
                  ) : (
                    <ArrowDownRight className={`w-3 h-3 ${index % 2 === 0 ? 'text-white/80' : 'text-red-600'}`} />
                  )}
                  <p className={`text-sm font-medium ${index % 2 === 0 ? 'text-white/80' : isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} from last quarter
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div className="border border-gray-200 rounded-2xl p-3 ng white hover:border-gray-300 transition-all duration-300 ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-white" />
              </div>
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AssetAllocationChart />
          </CardContent>
        </div>

        {/* Performance Chart */}
        <div className="border border-gray-200 rounded-2xl p-3 hover:border-gray-300 transition-all duration-300 gradient-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              Portfolio Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </div>
      </div>

      {/* Top Performers & Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((company, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{company.name}</h4>
                  <p className="text-xs text-muted-foreground">{company.sector}</p>
                  <p className="text-sm font-semibold mt-1">{company.value}</p>
                </div>
                <Badge className="bg-green-100 text-green-700">{company.return}</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              View All Holdings
            </Button>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 gradient-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionHistory />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Portfolio Health Indicators */}
      <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
        <CardHeader>
          <CardTitle>Portfolio Health Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Diversification Score</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">Well diversified across sectors</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Risk-Adjusted Return</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">Excellent risk-return profile</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Liquidity Ratio</span>
                <span className="font-medium">68%</span>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground">Moderate liquidity position</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
