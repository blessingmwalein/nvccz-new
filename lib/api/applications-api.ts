import { apiClient } from './api-client'

export interface Application {
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
  documents: Array<{
    id: string
    documentType: string
    fileName: string
    isRequired: boolean
    isSubmitted: boolean
  }>
}

export interface ApplicationCreateRequest {
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  applicantAddress: string
  businessName: string
  businessDescription: string
  industry: string
  businessStage: string
  foundingDate: string
  requestedAmount: number
  fundId?: string
  files: File[]
  documentTypes: string[]
}

export interface ApplicationsResponse {
  success: boolean
  data: {
    applications: Application[]
  }
}

export interface ApplicationCreateResponse {
  success: boolean
  data: Application
  message?: string
}

class ApplicationsApiService {
  // Get all applications
  async getAll(): Promise<ApplicationsResponse> {
    return apiClient.get<ApplicationsResponse>('/applications')
  }

  // Create a new application with FormData
  async create(applicationData: ApplicationCreateRequest): Promise<ApplicationCreateResponse> {
    const formData = new FormData()
    
    // Append text fields
    formData.append('applicantName', applicationData.applicantName)
    formData.append('applicantEmail', applicationData.applicantEmail)
    formData.append('applicantPhone', applicationData.applicantPhone)
    formData.append('applicantAddress', applicationData.applicantAddress)
    formData.append('businessName', applicationData.businessName)
    formData.append('businessDescription', applicationData.businessDescription)
    formData.append('industry', applicationData.industry)
    formData.append('businessStage', applicationData.businessStage)
    formData.append('foundingDate', applicationData.foundingDate)
    formData.append('requestedAmount', applicationData.requestedAmount.toString())
    
    if (applicationData.fundId) {
      formData.append('fundId', applicationData.fundId)
    }
    
    // Append files
    applicationData.files.forEach((file) => {
      formData.append('files', file)
    })
    
    // Append document types as JSON string
    formData.append('documentTypes', JSON.stringify(applicationData.documentTypes))
    
    // Don't set Content-Type header - let browser set it automatically with boundary
    return apiClient.post<ApplicationCreateResponse>('/applications', formData)
  }

  // Get a single application by ID
  async getById(id: string): Promise<ApplicationCreateResponse> {
    return apiClient.get<ApplicationCreateResponse>(`/applications/${id}`)
  }

  // Update an application
  async update(id: string, applicationData: Partial<ApplicationCreateRequest>): Promise<ApplicationCreateResponse> {
    return apiClient.put<ApplicationCreateResponse>(`/applications/${id}`, applicationData)
  }

  // Delete an application
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient.delete<{ success: boolean; message?: string }>(`/applications/${id}`)
  }
}

export const applicationsApi = new ApplicationsApiService()
