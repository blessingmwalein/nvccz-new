"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

const recentApplications = [
  {
    id: "APP-006",
    company: "AI Robotics Inc.",
    amount: "$30M",
    stage: "Initial Screening",
    submittedAt: "2 hours ago",
    sector: "AI/Robotics",
  },
  {
    id: "APP-007",
    company: "BioTech Solutions",
    amount: "$18M",
    stage: "Initial Screening",
    submittedAt: "5 hours ago",
    sector: "Biotechnology",
  },
  {
    id: "APP-008",
    company: "Quantum Computing Co.",
    amount: "$45M",
    stage: "Initial Screening",
    submittedAt: "1 day ago",
    sector: "Technology",
  },
  {
    id: "APP-009",
    company: "Sustainable Materials",
    amount: "$12M",
    stage: "Initial Screening",
    submittedAt: "2 days ago",
    sector: "Materials",
  },
  {
    id: "APP-010",
    company: "EdTech Platform",
    amount: "$8M",
    stage: "Initial Screening",
    submittedAt: "3 days ago",
    sector: "Education",
  },
]

export function RecentApplications() {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {recentApplications.map((app) => (
          <div key={app.id} className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">{app.company}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {app.sector}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{app.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{app.amount}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{app.submittedAt}</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700 text-xs">{app.stage}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full bg-transparent">
        View All Recent
      </Button>
    </div>
  )
}
