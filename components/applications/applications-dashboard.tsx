"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CiFileOn, 
  CiUser, 
  CiCircleCheck, 
  CiDollar, 
  CiClock1, 
  CiCircleChevUp, 
  CiFilter, 
  CiCirclePlus, 
  CiSearch 
} from "react-icons/ci"
import { Input } from "@/components/ui/input"
import { ApplicationsPipeline } from "./applications-pipeline"
import { RecentApplications } from "./recent-applications"

export function ApplicationsDashboard() {
  const pipelineStats = [
    {
      stage: "Initial Screening",
      count: 24,
      value: "$180M",
      icon: CiFileOn,
      color: "oklch(0.60 0.18 252)", // Primary blue
    },
    {
      stage: "Due Diligence",
      count: 8,
      value: "$95M",
      icon: CiUser,
      color: "oklch(0.72 0.12 225)", // Light blue
    },
    {
      stage: "Board Review",
      count: 4,
      value: "$65M",
      icon: CiCircleCheck,
      color: "oklch(0.58 0.09 260)", // Dark blue
    },
    {
      stage: "Fund Disbursement",
      count: 2,
      value: "$25M",
      icon: CiDollar,
      color: "oklch(0.78 0.12 190)", // Cyan
    },
  ]

  const keyMetrics = [
    {
      title: "Applications This Month",
      value: "38",
      change: "+15%",
      trend: "up",
    },
    {
      title: "Average Processing Time",
      value: "45 days",
      change: "-8%",
      trend: "down",
    },
    {
      title: "Approval Rate",
      value: "68%",
      change: "+5%",
      trend: "up",
    },
    {
      title: "Total Pipeline Value",
      value: "$365M",
      change: "+22%",
      trend: "up",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applications Management</h1>
          <p className="text-muted-foreground">Track and manage investment applications through the pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <CiSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search applications..." className="pl-10 w-64" />
          </div>
          <Button variant="outline" className="bg-transparent">
            <CiFilter size={20} className="mr-2" />
            Filter
          </Button>
          <Button className="gradient-primary text-white">
            <CiCirclePlus size={20} className="mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className={`card-shadow hover:card-shadow-hover transition-all duration-300 ${index % 2 === 0 ? 'gradient-primary' : 'bg-white'}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${index % 2 === 0 ? 'text-white' : ''}`}>{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`text-3xl ${index % 2 === 0 ? 'text-white' : ''}`}>{metric.value}</div>
                <div className="flex items-center gap-1">
                  {metric.trend === "up" ? (
                    <CiCircleChevUp size={16} className={index % 2 === 0 ? 'text-white/80' : 'text-green-600'} />
                  ) : (
                    <CiClock1 size={16} className={index % 2 === 0 ? 'text-white/80' : 'text-green-600'} />
                  )}
                  <p className={`text-xs ${index % 2 === 0 ? 'text-white/80' : 'text-green-600'}`}>{metric.change} from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pipelineStats.map((stage, index) => {
          const Icon = stage.icon

          return (
            <Card key={index} className={`card-shadow hover:card-shadow-hover transition-all duration-300 ${index % 2 === 0 ? 'gradient-primary' : 'bg-white'}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${index % 2 === 0 ? 'bg-white/20' : 'gradient-primary'}`}
                    style={index % 2 === 1 ? { backgroundColor: stage.color } : {}}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <CardTitle className={`text-sm font-medium ${index % 2 === 0 ? 'text-white' : ''}`}>{stage.stage}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-3xl ${index % 2 === 0 ? 'text-white' : ''}`}>{stage.count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {stage.value}
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={(stage.count / 38) * 100} 
                      className="h-3 bg-white/20" 
                    />
                    <div 
                      className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-80"
                      style={{ width: `${(stage.count / 38) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs ${index % 2 === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {Math.round((stage.count / 38) * 100)}% of total applications
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Pipeline */}
        <div className="lg:col-span-2">
          <Card className="card-shadow hover:card-shadow-hover transition-all duration-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <CiFileOn size={24} className="text-white" />
                </div>
                Applications Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationsPipeline />
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card className="card-shadow hover:card-shadow-hover transition-all duration-300 gradient-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <CiClock1 size={24} className="text-white" />
              </div>
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentApplications />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-shadow bg-white">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <CiFileOn size={32} className="text-primary" />
              <span className="text-sm">New Screening</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <CiUser size={32} className="text-primary" />
              <span className="text-sm">Schedule DD</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <CiCircleCheck size={32} className="text-primary" />
              <span className="text-sm">Board Package</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <CiDollar size={32} className="text-primary" />
              <span className="text-sm">Process Funding</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
