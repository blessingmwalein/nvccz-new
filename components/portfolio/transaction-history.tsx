"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Building2, Calendar } from "lucide-react"

const transactions = [
  {
    id: "1",
    type: "investment",
    company: "TechCorp Inc.",
    amount: "$15M",
    date: "Nov 10, 2024",
    status: "completed",
    sector: "Technology",
  },
  {
    id: "2",
    type: "exit",
    company: "RetailChain Ltd.",
    amount: "$28M",
    date: "Nov 8, 2024",
    status: "completed",
    sector: "Retail",
  },
  {
    id: "3",
    type: "investment",
    company: "HealthTech Solutions",
    amount: "$12M",
    date: "Nov 5, 2024",
    status: "pending",
    sector: "Healthcare",
  },
  {
    id: "4",
    type: "follow-on",
    company: "GreenEnergy Ltd.",
    amount: "$8M",
    date: "Nov 3, 2024",
    status: "completed",
    sector: "Clean Energy",
  },
  {
    id: "5",
    type: "investment",
    company: "FinanceAI Corp",
    amount: "$20M",
    date: "Oct 28, 2024",
    status: "completed",
    sector: "Fintech",
  },
]

export function TransactionHistory() {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "investment":
      case "follow-on":
        return <ArrowDownLeft className="w-4 h-4 text-white" />
      case "exit":
        return <ArrowUpRight className="w-4 h-4 text-white" />
      default:
        return <Building2 className="w-4 h-4 text-white" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-200 border-green-400/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
      case "failed":
        return "bg-red-500/20 text-red-200 border-red-400/30"
      default:
        return "bg-white/20 text-white border-white/30"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "investment":
        return "Investment"
      case "follow-on":
        return "Follow-on"
      case "exit":
        return "Exit"
      default:
        return type
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">{getTransactionIcon(transaction.type)}</div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-white">{transaction.company}</h4>
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                    {transaction.sector}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <span>{getTypeLabel(transaction.type)}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-white/80" />
                    {transaction.date}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-semibold text-sm text-white">{transaction.amount}</div>
              <Badge className={`text-xs border ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full bg-transparent border-white/30 text-white hover:bg-white/10">
        View All Transactions
      </Button>
    </div>
  )
}
