import { apiClient } from './api-client'

export interface InvestmentImplementationData {
  id: string
  portfolioCompanyId: string
  applicationId: string
  fundId: string
  implementationPlan: string
  notes: string
  disbursementMode: 'MILESTONE_BASED' | 'ONE_TIME'
  totalCommittedAmount: number
  status: 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
  milestones?: MilestoneData[]
  checklist?: ChecklistData,
  fundDisbursements?: any[]
}

export interface MilestoneData {
  id: string
  investmentImplementationId: string
  title: string
  description: string
  amount: number
  dueDate: string
  deliverables: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ChecklistData {
  id: string
  investmentImplementationId: string
  finalDueDiligence: boolean
  contractsSigned: boolean
  fundsDisbursed: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DisbursementSummaryData {
  totalCommittedAmount: number
  totalDisbursedAmount: number
  remainingCommittedAmount: number
  disbursementCount: number
  disbursementMode: string
  disbursements: any[]
}

export interface InvestmentImplementationCreateRequest {
  portfolioCompanyId: string
  applicationId: string
  fundId: string
  implementationPlan: string
  notes?: string
  disbursementMode: 'MILESTONE_BASED' | 'ONE_TIME'
  totalCommittedAmount: number
}

export interface MilestoneCreateRequest {
  title: string
  description: string
  amount: number
  dueDate: string
  deliverables: string
}

export interface ChecklistUpdateRequest {
  finalDueDiligence: boolean
  contractsSigned: boolean
  fundsDisbursed: boolean
  notes?: string
}

export interface InvestmentImplementationResponse {
  success: boolean
  message: string
  data: InvestmentImplementationData
  timestamp: string
}

export interface DisbursementSummaryResponse {
  success: boolean
  message: string
  data: DisbursementSummaryData
}

class InvestmentImplementationApiService {
  // Initiate investment implementation
  async initiate(data: InvestmentImplementationCreateRequest): Promise<InvestmentImplementationResponse> {
    return apiClient.post<InvestmentImplementationResponse>('/investment-implementations/initiate', data)
  }

  // Get investment implementation by application ID
  async getByApplicationId(applicationId: string): Promise<InvestmentImplementationResponse> {
    return apiClient.get<InvestmentImplementationResponse>(`/investment-implementations/${applicationId}`)
  }

  // Get investment implementation by ID
  async getById(id: string): Promise<InvestmentImplementationResponse> {
    return apiClient.get<InvestmentImplementationResponse>(`/investment-implementations/${id}`)
  }

  // Update investment implementation
  async update(applicationId: string, data: Partial<InvestmentImplementationCreateRequest>): Promise<InvestmentImplementationResponse> {
    return apiClient.put<InvestmentImplementationResponse>(`/investment-implementations/${applicationId}`, data)
  }

  // Create milestone
  async createMilestone(implementationId: string, data: MilestoneCreateRequest): Promise<any> {
    return apiClient.post<any>(`/investment-implementations/${implementationId}/milestones`, data)
  }

  // Update checklist
  async updateChecklist(implementationId: string, data: ChecklistUpdateRequest): Promise<any> {
    return apiClient.put<any>(`/investment-implementations/${implementationId}/checklist`, data)
  }

  // Get disbursement summary
  async getDisbursementSummary(implementationId: string): Promise<DisbursementSummaryResponse> {
    return apiClient.get<DisbursementSummaryResponse>(`/investment-implementations/${implementationId}/disbursement-summary`)
  }
}

export const investmentImplementationApi = new InvestmentImplementationApiService()

