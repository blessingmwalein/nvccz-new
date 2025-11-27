import { FileText, Eye, Users, DollarSign, X } from "lucide-react"

export const stages = [
  {
    id: "APPLICATION_SUBMISSION",
    statusCodes: ["SUBMITTED", "INITIAL_SCREENING", "SHORTLISTED"],
    title: "Application Submission",
    description: "Application received and under initial review",
    icon: FileText,
    color: "bg-blue-500",
    completedColor: "bg-green-500",
  },
  {
    id: "DUE_DILIGENCE_GROUP",
    statusCodes: ["UNDER_DUE_DILIGENCE", "DUE_DILIGENCE_COMPLETED"],
    title: "Due Diligence",
    description: "Comprehensive analysis and review in progress",
    icon: Eye,
    color: "bg-amber-500",
    completedColor: "bg-green-500",
  },
  {
    id: "TERM_SHEET_GROUP",
    statusCodes: ["TERM_SHEET", "TERM_SHEET_SIGNED"],
    title: "Term Sheet",
    description: "Investment terms being finalized and signed",
    icon: FileText,
    color: "bg-indigo-500",
    completedColor: "bg-green-500",
  },
  {
    id: "BOARD_GROUP",
    statusCodes: ["UNDER_BOARD_REVIEW", "BOARD_APPROVED", "BOARD_CONDITIONAL", "BOARD_REJECTED"],
    title: "Board Review & Decision",
    description: "Application under board evaluation",
    icon: Users,
    color: "bg-purple-500",
    completedColor: "bg-green-500",
  },
  {
    id: "INVESTMENT_GROUP",
    statusCodes: ["INVESTMENT_IMPLEMENTATION", "DISBURSED", "FUND_DISBURSED", "FUNDED"],
    title: "Investment & Disbursement",
    description: "Investment implementation and fund disbursement",
    icon: DollarSign,
    color: "bg-emerald-500",
    completedColor: "bg-green-500",
  },
  {
    id: "REJECTION_PATH",
    statusCodes: ["REJECTED", "BELOW_THRESHOLD"],
    title: "Rejection Path",
    description: "Application did not meet criteria",
    icon: X,
    color: "bg-red-500",
    completedColor: "bg-red-500",
  },
]

export const getStageColor = (stage: string) => {
  if (stage.includes("FUND_DISBURSED") || stage.includes("DISBURSED") || stage.includes("FUNDED"))
    return "bg-green-100 text-green-800"
  if (stage.includes("BOARD")) return "bg-purple-100 text-purple-800"
  if (stage.includes("DILIGENCE")) return "bg-amber-100 text-amber-800"
  if (stage.includes("SCREEN")) return "bg-amber-100 text-amber-800"
  if (stage.includes("SHORTLIST")) return "bg-cyan-100 text-cyan-800"
  if (stage.includes("TERM_SHEET")) return "bg-indigo-100 text-indigo-800"
  if (stage.includes("REJECTED") || stage.includes("BELOW_THRESHOLD")) return "bg-red-100 text-red-800"
  return "bg-gray-100 text-gray-800"
}
