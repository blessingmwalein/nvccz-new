import { apiClient } from './api-client'

export interface TermSheetData {
  id: string
  applicationId: string
  createdById: string
  title: string
  version: string
  status: 'DRAFT' | 'FINAL' | 'SIGNED'
  investmentAmount: string
  equityPercentage: string
  valuation: string
  keyTerms: string
  conditions: string
  timeline: string
  documentUrl: string | null
  documentFileName: string | null
  documentSize: number | null
  isDraft: boolean
  isFinal: boolean
  isSigned: boolean
  signedAt: string | null
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
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface TermSheetCreateRequest {
  title: string
  investmentAmount: number
  equityPercentage: number
  valuation: number
  keyTerms: string
  conditions: string
  timeline: string
  documentUrl?: string
  documentFileName?: string
  documentSize?: number
}

export interface TermSheetUpdateRequest {
  title?: string
  investmentAmount?: number
  equityPercentage?: number
  valuation?: number
  keyTerms?: string
  conditions?: string
  timeline?: string
  documentUrl?: string
  documentFileName?: string
  documentSize?: number
}

export interface TermSheetResponse {
  success: boolean
  message: string
  data: TermSheetData
  timestamp: string
}

class TermSheetApiService {
  // Create term sheet
  async create(applicationId: string, data: TermSheetCreateRequest): Promise<TermSheetResponse> {
    return apiClient.post<TermSheetResponse>(`/term-sheets/${applicationId}`, data)
  }

  // Get term sheet by application ID
  async getByApplicationId(applicationId: string): Promise<TermSheetResponse> {
    return apiClient.get<TermSheetResponse>(`/term-sheets/${applicationId}`)
  }

  // Update term sheet
  async update(applicationId: string, data: TermSheetUpdateRequest): Promise<TermSheetResponse> {
    return apiClient.put<TermSheetResponse>(`/term-sheets/${applicationId}`, data)
  }

  // Finalize term sheet
  async finalize(applicationId: string): Promise<TermSheetResponse> {
    return apiClient.post<TermSheetResponse>(`/term-sheets/${applicationId}/finalize`, {})
  }
}

export const termSheetApi = new TermSheetApiService()