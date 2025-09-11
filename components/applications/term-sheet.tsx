"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Send, Edit, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export function TermSheet() {
  const termSheets = [
    {
      id: "TS-001",
      company: "FinanceAI Corp",
      amount: "$20M",
      valuation: "$80M",
      status: "draft",
      lastModified: "Nov 10, 2024",
      assignedTo: "David Kim",
    },
    {
      id: "TS-002",
      company: "BioTech Solutions",
      amount: "$18M",
      valuation: "$72M",
      status: "sent",
      lastModified: "Nov 8, 2024",
      assignedTo: "Sarah Chen",
    },
    {
      id: "TS-003",
      company: "Quantum Computing Co.",
      amount: "$45M",
      valuation: "$180M",
      status: "negotiating",
      lastModified: "Nov 5, 2024",
      assignedTo: "Michael Rodriguez",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "sent":
        return "bg-blue-100 text-blue-700"
      case "negotiating":
        return "bg-yellow-100 text-yellow-700"
      case "signed":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Edit className="w-3 h-3" />
      case "sent":
        return <Send className="w-3 h-3" />
      case "negotiating":
        return <Clock className="w-3 h-3" />
      case "signed":
        return <CheckCircle className="w-3 h-3" />
      case "rejected":
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <FileText className="w-3 h-3" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Term Sheet Management</h1>
          <p className="text-muted-foreground">Create, negotiate, and finalize investment term sheets</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button className="gradient-primary text-white">
            <FileText className="w-4 h-4 mr-2" />
            New Term Sheet
          </Button>
        </div>
      </div>

      {/* Active Term Sheets */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Active Term Sheets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {termSheets.map((ts) => (
            <div key={ts.id} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-lg">{ts.company}</h4>
                    <Badge className={`text-xs ${getStatusColor(ts.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(ts.status)}
                        {ts.status}
                      </div>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Investment:</span> {ts.amount}
                    </div>
                    <div>
                      <span className="font-medium">Valuation:</span> {ts.valuation}
                    </div>
                    <div>
                      <span className="font-medium">Assigned to:</span> {ts.assignedTo}
                    </div>
                    <div>
                      <span className="font-medium">Modified:</span> {ts.lastModified}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" className="gradient-primary text-white">
                    <Send className="w-3 h-3 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Term Sheet Builder */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            Term Sheet Builder - FinanceAI Corp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Investment Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investment-amount">Investment Amount</Label>
                <Input id="investment-amount" placeholder="$20,000,000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pre-money-valuation">Pre-Money Valuation</Label>
                <Input id="pre-money-valuation" placeholder="$80,000,000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="security-type">Security Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select security type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preferred">Preferred Stock</SelectItem>
                    <SelectItem value="convertible">Convertible Note</SelectItem>
                    <SelectItem value="safe">SAFE</SelectItem>
                    <SelectItem value="common">Common Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="liquidation-preference">Liquidation Preference</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1x-non-participating">1x Non-Participating</SelectItem>
                    <SelectItem value="1x-participating">1x Participating</SelectItem>
                    <SelectItem value="2x-non-participating">2x Non-Participating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Governance Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Governance & Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="board-seats">Board Composition</Label>
                <Input id="board-seats" placeholder="e.g., 2 Investor, 2 Founder, 1 Independent" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voting-rights">Voting Rights</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voting rights" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pro-rata">Pro Rata</SelectItem>
                    <SelectItem value="super-majority">Super Majority Required</SelectItem>
                    <SelectItem value="veto-rights">Veto Rights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="anti-dilution">Anti-Dilution Protection</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select protection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weighted-average">Weighted Average</SelectItem>
                    <SelectItem value="full-ratchet">Full Ratchet</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="drag-along">Drag-Along Rights</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rights" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Economic Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Economic Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dividend-rate">Dividend Rate</Label>
                <Input id="dividend-rate" placeholder="8% cumulative" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="option-pool">Employee Option Pool</Label>
                <Input id="option-pool" placeholder="15% (pre-money)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pro-rata-rights">Pro Rata Rights</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rights" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Pro Rata</SelectItem>
                    <SelectItem value="limited">Limited Pro Rata</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-along">Tag-Along Rights</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rights" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Special Provisions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Special Provisions</h3>
            <div className="space-y-2">
              <Label htmlFor="special-provisions">Additional Terms & Conditions</Label>
              <Textarea
                id="special-provisions"
                placeholder="Enter any special provisions, milestones, or conditions..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="outline" className="bg-transparent">
              Save Draft
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button className="gradient-primary text-white">
              <Send className="w-4 h-4 mr-2" />
              Send to Company
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
