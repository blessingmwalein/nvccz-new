import { TermSheet } from "@/lib/api/application-portal-api"
import type React from "react"
// Types for the applicant timeline components
export interface TimelineStage {
  id: string
  statusCodes: string[]
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  completedColor: string
}

export interface ApplicationDocument {
  id: string
  documentType: string
  fileName: string
  isRequired: boolean
  fileUrl?: string
}

export interface ApplicationData {
  id: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  applicantAddress: string
  businessName: string
  industry: string
  businessStage: string
  businessDescription: string
  foundingDate: string
  requestedAmount: number
  currentStage: string
  updatedAt: string
  documents?: ApplicationDocument[]
  dueDiligenceReview?: DueDiligenceReview
  boardReview?: BoardReview
  termSheet: TermSheet
}

export interface DueDiligenceReview {
  status: string
  overallScore: number
  recommendation: string
  reviewer: { firstName: string; lastName: string }
  marketResearchViable: boolean
  marketResearchComments: string
  financialViable: boolean
  financialComments: string
  competitiveOpportunities: boolean
  competitiveComments: string
  managementTeamQualified: boolean
  managementComments: string
  legalCompliant: boolean
  legalComments: string
  riskTolerable: boolean
  riskComments: string
  finalComments?: string
}

export interface BoardReview {
  status: string
  overallScore: number
  investmentApproved: boolean
  investmentRejected: boolean
  conditionalApproval: boolean
  reviewer: { firstName: string; lastName: string }
  recommendationReport: string
  decisionReason: string
  nextSteps: string
  finalComments?: string
}

// export interface TermSheet {
//   status: string
//   version: string
//   investmentAmount: number
//   equityPercentage: number
//   valuation: number
// }
