import { apiClient } from './api-client'

export interface InvestmentImplementationData {
  id: string
  portfolioCompanyId: string
  applicationId: string
  fundId: string
  implementationPlan: string
  notes: string
  status: 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

export interface InvestmentImplementationCreateRequest {
  portfolioCompanyId: string
  applicationId: string
  fundId: string
  implementationPlan: string
  notes?: string
}

export interface InvestmentImplementationResponse {
  success: boolean
  message: string
  data: InvestmentImplementationData
  timestamp: string
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

  // Update investment implementation
  async update(applicationId: string, data: Partial<InvestmentImplementationCreateRequest>): Promise<InvestmentImplementationResponse> {
    return apiClient.put<InvestmentImplementationResponse>(`/investment-implementations/${applicationId}`, data)
  }
}

export const investmentImplementationApi = new InvestmentImplementationApiService()
