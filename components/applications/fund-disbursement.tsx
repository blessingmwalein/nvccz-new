"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, CheckCircle, Clock, AlertTriangle, Send, FileText, Calendar, Building2 } from "lucide-react"

export function FundDisbursement() {
  const disbursements = [
    {
      id: "FD-001",
      company: "TechCorp Inc.",
      amount: "$15M",
      totalCommitted: "$15M",
      disbursed: "$10M",
      remaining: "$5M",
      status: "in_progress",
      nextTranche: "$5M",
      nextDate: "Dec 1, 2024",
      conditions: ["Product milestone achieved", "Hiring targets met"],
    },
    {
      id: "FD-002",
      company: "GreenEnergy Solutions",
      amount: "$25M",
      totalCommitted: "$25M",
      disbursed: "$25M",
      remaining: "$0",
      status: "completed",
      nextTranche: null,
      nextDate: null,
      conditions: [],
    },
    {
      id: "FD-003",
      company: "FinanceAI Corp",
      amount: "$20M",
      totalCommitted: "$20M",
      disbursed: "$0",
      remaining: "$20M",
      status: "pending",
      nextTranche: "$8M",
      nextDate: "Nov 20, 2024",
      conditions: ["Legal documentation complete", "Bank account verification"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "in_progress":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "on_hold":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3" />
      case "in_progress":
        return <Clock className="w-3 h-3" />
      case "pending":
        return <AlertTriangle className="w-3 h-3" />
      case "on_hold":
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <DollarSign className="w-3 h-3" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fund Disbursement</h1>
          <p className="text-muted-foreground">Manage and track investment fund disbursements</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-transparent">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button className="gradient-primary text-white">
            <Send className="w-4 h-4 mr-2" />
            Process Payment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Total Committed</span>
            </div>
            <div className="text-2xl font-bold mt-1">$60M</div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Disbursed</span>
            </div>
            <div className="text-2xl font-bold mt-1">$35M</div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold mt-1">$25M</div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Active Deals</span>
            </div>
            <div className="text-2xl font-bold mt-1">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Disbursements */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Active Disbursements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {disbursements.map((disbursement) => (
            <div
              key={disbursement.id}
              className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-lg">{disbursement.company}</h4>
                    <Badge className={`text-xs ${getStatusColor(disbursement.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(disbursement.status)}
                        {disbursement.status.replace("_", " ")}
                      </div>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Total:</span> {disbursement.totalCommitted}
                    </div>
                    <div>
                      <span className="font-medium">Disbursed:</span> {disbursement.disbursed}
                    </div>
                    <div>
                      <span className="font-medium">Remaining:</span> {disbursement.remaining}
                    </div>
                    {disbursement.nextDate && (
                      <div>
                        <span className="font-medium">Next:</span> {disbursement.nextDate}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  {disbursement.status !== "completed" && (
                    <Button size="sm" className="gradient-primary text-white">
                      Process
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Disbursement Progress</span>
                  <span className="font-medium">
                    {Math.round(
                      (Number.parseFloat(disbursement.disbursed.replace("$", "").replace("M", "")) /
                        Number.parseFloat(disbursement.totalCommitted.replace("$", "").replace("M", ""))) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (Number.parseFloat(disbursement.disbursed.replace("$", "").replace("M", "")) /
                      Number.parseFloat(disbursement.totalCommitted.replace("$", "").replace("M", ""))) *
                    100
                  }
                  className="h-2"
                />
              </div>

              {/* Conditions */}
              {disbursement.conditions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Pending Conditions:</h5>
                  <div className="space-y-1">
                    {disbursement.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Tranche Info */}
              {disbursement.nextTranche && (
                <div className="mt-3 p-3 rounded-lg bg-accent/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Next Tranche: {disbursement.nextTranche}</span>
                      <p className="text-xs text-muted-foreground">Scheduled for {disbursement.nextDate}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* New Disbursement Form */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Process New Disbursement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-select">Company</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="techcorp">TechCorp Inc.</SelectItem>
                  <SelectItem value="financeai">FinanceAI Corp</SelectItem>
                  <SelectItem value="biotech">BioTech Solutions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Disbursement Amount</Label>
              <Input id="amount" placeholder="$0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tranche-type">Tranche Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial Funding</SelectItem>
                  <SelectItem value="milestone">Milestone Payment</SelectItem>
                  <SelectItem value="follow-on">Follow-on Investment</SelectItem>
                  <SelectItem value="bridge">Bridge Funding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wire">Wire Transfer</SelectItem>
                  <SelectItem value="ach">ACH Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="outline" className="bg-transparent">
              Save Draft
            </Button>
            <Button variant="outline" className="bg-transparent">
              <FileText className="w-4 h-4 mr-2" />
              Generate Documents
            </Button>
            <Button className="gradient-primary text-white">
              <Send className="w-4 h-4 mr-2" />
              Process Disbursement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
