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
  documents: Array<{
    documentType: string
    fileName: string
    fileUrl: string
    fileSize: number
    isRequired: boolean
  }>
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

  // Create a new application
  async create(applicationData: ApplicationCreateRequest): Promise<ApplicationCreateResponse> {
    return apiClient.post<ApplicationCreateResponse>('/applications', applicationData)
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
