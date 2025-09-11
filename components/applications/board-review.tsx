"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, FileText, Download, Clock, Vote } from "lucide-react"

export function BoardReview() {
  const boardMeetings = [
    {
      id: "BM-001",
      date: "Nov 15, 2024",
      time: "2:00 PM - 4:00 PM",
      applications: [
        { company: "GreenEnergy Solutions", amount: "$25M", recommendation: "approve" },
        { company: "HealthTech Innovations", amount: "$8M", recommendation: "conditional" },
      ],
      attendees: 8,
      status: "scheduled",
    },
    {
      id: "BM-002",
      date: "Nov 22, 2024",
      time: "10:00 AM - 12:00 PM",
      applications: [{ company: "FinanceAI Corp", amount: "$20M", recommendation: "approve" }],
      attendees: 7,
      status: "scheduled",
    },
  ]

  const boardMembers = [
    { name: "John Anderson", role: "Chairman", avatar: "JA", status: "confirmed" },
    { name: "Sarah Mitchell", role: "Managing Partner", avatar: "SM", status: "confirmed" },
    { name: "David Chen", role: "Investment Partner", avatar: "DC", status: "confirmed" },
    { name: "Lisa Rodriguez", role: "External Board Member", avatar: "LR", status: "pending" },
    { name: "Michael Thompson", role: "Investment Committee", avatar: "MT", status: "confirmed" },
  ]

  const votingResults = [
    {
      company: "TechCorp Inc.",
      amount: "$15M",
      votes: { approve: 6, reject: 1, abstain: 1 },
      decision: "approved",
      conditions: ["Board seat required", "Quarterly reporting"],
    },
    {
      company: "RetailTech Solutions",
      amount: "$12M",
      votes: { approve: 3, reject: 4, abstain: 1 },
      decision: "rejected",
      conditions: ["Insufficient market traction"],
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Board Review</h1>
          <p className="text-muted-foreground">Investment committee decisions and board meeting management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-transparent">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button className="gradient-primary text-white">
            <FileText className="w-4 h-4 mr-2" />
            Board Package
          </Button>
        </div>
      </div>

      {/* Upcoming Board Meetings */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Board Meetings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {boardMeetings.map((meeting) => (
            <div key={meeting.id} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-lg">Board Meeting {meeting.id}</h4>
                    <Badge className="bg-blue-100 text-blue-700">{meeting.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{meeting.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{meeting.attendees} attendees</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Agenda
                  </Button>
                  <Button size="sm" className="gradient-primary text-white">
                    Join Meeting
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-sm">Applications for Review:</h5>
                {meeting.applications.map((app, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-accent/30">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{app.company}</span>
                      <Badge variant="secondary" className="text-xs">
                        {app.amount}
                      </Badge>
                    </div>
                    <Badge
                      className={
                        app.recommendation === "approve"
                          ? "bg-green-100 text-green-700"
                          : app.recommendation === "conditional"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }
                    >
                      {app.recommendation}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Board Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Board Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {boardMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`/avatar-${member.name.toLowerCase().replace(" ", "-")}.png`} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Badge
                  className={
                    member.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {member.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Voting Results */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-primary" />
              Recent Voting Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {votingResults.map((result, index) => (
              <div key={index} className="p-3 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{result.company}</h4>
                    <p className="text-xs text-muted-foreground">{result.amount}</p>
                  </div>
                  <Badge
                    className={
                      result.decision === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }
                  >
                    {result.decision}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-green-600">Approve: {result.votes.approve}</span>
                    <span className="text-red-600">Reject: {result.votes.reject}</span>
                    <span className="text-gray-600">Abstain: {result.votes.abstain}</span>
                  </div>

                  {result.conditions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Conditions:</p>
                      {result.conditions.map((condition, condIndex) => (
                        <p key={condIndex} className="text-xs text-muted-foreground">
                          • {condition}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Board Package Preparation */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Board Package Preparation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border">
              <h4 className="font-medium text-sm mb-2">Investment Memos</h4>
              <p className="text-xs text-muted-foreground mb-3">Detailed analysis for each application</p>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                <Download className="w-3 h-3 mr-2" />
                Download All
              </Button>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <h4 className="font-medium text-sm mb-2">Financial Models</h4>
              <p className="text-xs text-muted-foreground mb-3">Projections and valuation analysis</p>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                <Download className="w-3 h-3 mr-2" />
                Download All
              </Button>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <h4 className="font-medium text-sm mb-2">Due Diligence Reports</h4>
              <p className="text-xs text-muted-foreground mb-3">Comprehensive DD findings</p>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                <Download className="w-3 h-3 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
