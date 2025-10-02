import { apiClient } from './api-client'

export interface BoardReviewData {
  id: string
  applicationId: string
  reviewerId: string
  investmentApproved: boolean
  investmentRejected: boolean
  conditionalApproval: boolean
  recommendationReport: string
  additionalInformation: string | null
  decisionReason: string
  conditions: string | null
  nextSteps: string
  overallScore: string
  finalComments: string
  status: 'IN_PROGRESS' | 'COMPLETED'
  createdAt: string
  updatedAt: string
  completedAt: string | null
  reviewer: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  application: {
    id: string
    businessName: string
    applicantName: string
    applicantEmail: string
    currentStage: string
    requestedAmount: string
  }
}

export interface BoardReviewCreateRequest {
  investmentApproved: boolean
  investmentRejected: boolean
  conditionalApproval: boolean
  recommendationReport: string
  decisionReason: string
  nextSteps: string
  overallScore: number
  finalComments: string
}

export interface BoardReviewUpdateRequest {
  recommendationReport?: string
  decisionReason?: string
  nextSteps?: string
  overallScore?: number
  finalComments?: string
}

export interface BoardReviewResponse {
  success: boolean
  message: string
  data: BoardReviewData
  timestamp: string
}

class BoardReviewApiService {
  // Create board review
  async create(applicationId: string, data: BoardReviewCreateRequest): Promise<BoardReviewResponse> {
    return apiClient.post<BoardReviewResponse>(`/board-reviews/${applicationId}`, data)
  }

  // Get board review by application ID
  async getByApplicationId(applicationId: string): Promise<BoardReviewResponse> {
    return apiClient.get<BoardReviewResponse>(`/board-reviews/${applicationId}`)
  }

  // Update board review
  async update(applicationId: string, data: BoardReviewUpdateRequest): Promise<BoardReviewResponse> {
    return apiClient.put<BoardReviewResponse>(`/board-reviews/${applicationId}`, data)
  }

  // Complete board review
  async complete(applicationId: string): Promise<BoardReviewResponse> {
    return apiClient.post<BoardReviewResponse>(`/board-reviews/${applicationId}/complete`, {})
  }
}

export const boardReviewApi = new BoardReviewApiService()
