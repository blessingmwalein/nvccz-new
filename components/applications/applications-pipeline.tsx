"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Building2, ArrowRight } from "lucide-react"

const applications = [
  {
    id: "APP-001",
    company: "TechCorp Inc.",
    sector: "Technology",
    stage: "Due Diligence",
    amount: "$15M",
    lead: "Sarah Chen",
    leadAvatar: "SC",
    daysInStage: 12,
    nextMilestone: "Management Presentation",
    priority: "high",
  },
  {
    id: "APP-002",
    company: "GreenEnergy Solutions",
    sector: "Clean Energy",
    stage: "Board Review",
    amount: "$25M",
    lead: "Michael Rodriguez",
    leadAvatar: "MR",
    daysInStage: 5,
    nextMilestone: "Investment Committee",
    priority: "high",
  },
  {
    id: "APP-003",
    company: "HealthTech Innovations",
    sector: "Healthcare",
    stage: "Initial Screening",
    amount: "$8M",
    lead: "Emma Thompson",
    leadAvatar: "ET",
    daysInStage: 3,
    nextMilestone: "Initial Review",
    priority: "medium",
  },
  {
    id: "APP-004",
    company: "FinanceAI Corp",
    sector: "Fintech",
    stage: "Term Sheet",
    amount: "$20M",
    lead: "David Kim",
    leadAvatar: "DK",
    daysInStage: 8,
    nextMilestone: "Legal Review",
    priority: "high",
  },
  {
    id: "APP-005",
    company: "RetailTech Solutions",
    sector: "Retail",
    stage: "Due Diligence",
    amount: "$12M",
    lead: "Lisa Wang",
    leadAvatar: "LW",
    daysInStage: 18,
    nextMilestone: "Financial Analysis",
    priority: "medium",
  },
]

const getStageColor = (stage: string) => {
  switch (stage) {
    case "Initial Screening":
      return "bg-blue-100 text-blue-700"
    case "Due Diligence":
      return "bg-orange-100 text-orange-700"
    case "Board Review":
      return "bg-purple-100 text-purple-700"
    case "Term Sheet":
      return "bg-green-100 text-green-700"
    case "Fund Disbursement":
      return "bg-emerald-100 text-emerald-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700"
    case "medium":
      return "bg-yellow-100 text-yellow-700"
    case "low":
      return "bg-green-100 text-green-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export function ApplicationsPipeline() {
  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div
          key={app.id}
          className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{app.company}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {app.sector}
                  </Badge>
                  <Badge className={`text-xs ${getPriorityColor(app.priority)}`}>{app.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{app.id}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-semibold text-sm">{app.amount}</div>
              <Badge className={`text-xs ${getStageColor(app.stage)}`}>{app.stage}</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={`/avatar-${app.lead.toLowerCase().replace(" ", "-")}.png`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {app.leadAvatar}
                  </AvatarFallback>
                </Avatar>
                <span>{app.lead}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{app.daysInStage} days in stage</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Next: {app.nextMilestone}</span>
              <Button size="sm" variant="ghost" className="h-6 px-2">
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" className="w-full bg-transparent">
        View All Applications
      </Button>
    </div>
  )
}
