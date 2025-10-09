import { apiClient } from './api-client'

export interface FundDisbursementData {
  id: string
  applicationId: string
  amount: string
  disbursementDate: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  bankDetails: {
    accountName: string
    accountNumber: string
    bankName: string
    branchCode: string
  }
  transactionReference: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  application: {
    id: string
    businessName: string
    applicantName: string
    applicantEmail: string
    currentStage: string
    requestedAmount: string
  }
}

export interface FundDisbursementCreateRequest {
  amount: number
  disbursementDate: string
  bankDetails: {
    accountName: string
    accountNumber: string
    bankName: string
    branchCode: string
  }
  notes?: string
}

export interface DisbursementCreateRequest {
  investmentImplementationId: string
  amount: number
  disbursementDate: string
  disbursementType: 'INITIAL' | 'MILESTONE' | 'FINAL'
  notes?: string
}

export interface FundDisbursementResponse {
  success: boolean
  message: string
  data: FundDisbursementData
  timestamp: string
}

class FundDisbursementApiService {
  // Create fund disbursement
  async create(applicationId: string, data: FundDisbursementCreateRequest): Promise<FundDisbursementResponse> {
    return apiClient.post<FundDisbursementResponse>(`/fund-disbursements/${applicationId}`, data)
  }

  // Get fund disbursement by application ID
  async getByApplicationId(applicationId: string): Promise<FundDisbursementResponse> {
    return apiClient.get<FundDisbursementResponse>(`/fund-disbursements/${applicationId}`)
  }

  // Update fund disbursement status
  async updateStatus(applicationId: string, status: 'PROCESSING' | 'COMPLETED' | 'FAILED'): Promise<FundDisbursementResponse> {
    return apiClient.put<FundDisbursementResponse>(`/fund-disbursements/${applicationId}/status`, { status })
  }

  // Create disbursement for existing investment implementation
  async createDisbursement(data: DisbursementCreateRequest): Promise<FundDisbursementResponse> {
    return apiClient.post<FundDisbursementResponse>('/investment-implementations/disbursements', data)
  }

  // Approve disbursement
  async approveDisbursement(disbursementId: string): Promise<FundDisbursementResponse> {
    return apiClient.post<FundDisbursementResponse>(`/investment-implementations/disbursements/${disbursementId}/approve`)
  }
}

export const fundDisbursementApi = new FundDisbursementApiService()
