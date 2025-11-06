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
  document?: File
}

export interface TermSheetUpdateRequest {
  title?: string
  investmentAmount?: number
  document?: File
}

export interface TermSheetResponse {
  success: boolean
  message: string
  data: TermSheetData
  timestamp: string
}

class TermSheetApiService {
  // Create term sheet with file upload
  async create(applicationId: string, data: TermSheetCreateRequest): Promise<TermSheetResponse> {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('investmentAmount', data.investmentAmount.toString())
    
    if (data.document) {
      formData.append('document', data.document)
    }

    return apiClient.postFormData<TermSheetResponse>(`/term-sheets/${applicationId}`, formData)
  }

  // Get term sheet by application ID
  async getByApplicationId(applicationId: string): Promise<TermSheetResponse> {
    return apiClient.get<TermSheetResponse>(`/term-sheets/${applicationId}`)
  }

  // Update term sheet with optional file upload
  async update(applicationId: string, data: TermSheetUpdateRequest): Promise<TermSheetResponse> {
    const formData = new FormData()
    
    if (data.title !== undefined) formData.append('title', data.title)
    if (data.investmentAmount !== undefined) formData.append('investmentAmount', data.investmentAmount.toString())
    
    if (data.document) {
      formData.append('document', data.document)
    }

    return apiClient.putFormData<TermSheetResponse>(`/term-sheets/${applicationId}`, formData)
  }

  // Finalize term sheet
  async finalize(applicationId: string): Promise<TermSheetResponse> {
    return apiClient.post<TermSheetResponse>(`/term-sheets/${applicationId}/finalize`, {})
  }
}

export const termSheetApi = new TermSheetApiService()