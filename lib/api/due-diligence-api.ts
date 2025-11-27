import { apiClient } from './api-client'

export interface DueDiligenceTask {
  id: string
  title: string
  description: string
  category: string | null
  stage: string
  priority: string
  date: string
  team: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
  }>
  creator: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  isOverdue: boolean
  activities: Array<{
    by: string
    date: string
    type: string
    activity: string
  }>
  activityLogs?: Array<{
    id: string
    userId: string
    activityType: string
    title: string
    description: string
    goalId: string | null
    taskId: string
    kpiId: string | null
    monetaryValueAchieved: string | null
    percentValueAchieved: string | null
    createdAt: string
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
    documents?: Array<{
      fileName: string
      fileUrl: string
      fileSize: number
    }>
    byUser: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
    by: string
  }>
}

export interface DueDiligenceData {
  id: string
  applicationId: string
  reviewerId: string
  marketResearchViable: boolean
  marketResearchComments: string | null
  financialViable: boolean
  financialComments: string | null
  competitiveOpportunities: boolean
  competitiveComments: string | null
  managementTeamQualified: boolean
  managementComments: string | null
  legalCompliant: boolean
  legalComments: string | null
  riskTolerable: boolean
  riskComments: string | null
  overallScore: string | null
  recommendation: string | null
  finalComments: string | null
  status: 'IN_PROGRESS' | 'COMPLETED'
  createdAt: string
  updatedAt: string
  completedAt: string | null
  application: {
    id: string
    applicantName: string
    applicantEmail: string
    applicantPhone: string
    applicantAddress: string
    businessName: string
    businessDescription: string
    industry: string
    businessStage: string
    foundingDate: string
    requestedAmount: string
    currentStage: string
    submittedAt: string | null
    updatedAt: string
    createdAt: string
  }
  reviewer: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  tasks?: DueDiligenceTask[]
}

export interface DueDiligenceUpdateRequest {
  marketResearchViable: boolean
  marketResearchComments?: string
  financialViable: boolean
  financialComments?: string
  competitiveOpportunities: boolean
  competitiveComments?: string
  managementTeamQualified: boolean
  managementComments?: string
  legalCompliant: boolean
  legalComments?: string
  riskTolerable: boolean
  riskComments?: string
  recommendation: 'APPROVE' | 'REJECT' | 'CONDITIONAL'
  finalComments?: string
}

export interface DueDiligenceResponse {
  success: boolean
  message: string
  data: DueDiligenceData
  timestamp: string
}

class DueDiligenceApiService {
  // Initiate due diligence
  async initiate(applicationId: string): Promise<DueDiligenceResponse> {
    return apiClient.post<DueDiligenceResponse>(`/applications/${applicationId}/due-diligence/initiate`, {})
  }

  // Get due diligence by application ID
  async getByApplicationId(applicationId: string): Promise<DueDiligenceResponse> {
    return apiClient.get<DueDiligenceResponse>(`/applications/${applicationId}/due-diligence`)
  }

  // Update due diligence
  async update(applicationId: string, data: DueDiligenceUpdateRequest): Promise<DueDiligenceResponse> {
    return apiClient.put<DueDiligenceResponse>(`/applications/${applicationId}/due-diligence`, data)
  }

  // Complete due diligence
  async complete(applicationId: string): Promise<DueDiligenceResponse> {
    return apiClient.post<DueDiligenceResponse>(`/applications/${applicationId}/due-diligence/complete`, {})
  }
}

export const dueDiligenceApi = new DueDiligenceApiService()
