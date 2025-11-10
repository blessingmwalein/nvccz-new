import { apiClient, ApiResponse } from './api-client'

export interface PortfolioFinancialReport {
  id: string
  portfolioCompanyId: string
  submittedById: string
  reportType: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASHFLOW_STATEMENT'
  periodType: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY'
  periodStart: string
  periodEnd: string
  title: string
  description: string
  reportUrl: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  reviewerId: string | null
  reviewedAt: string | null
  reviewerComment: string | null
  createdAt: string
  updatedAt: string
  submittedByFirstName: string
  submittedByLastName: string
}

export interface ReviewFinancialReportRequest {
  action: 'ACCEPT' | 'REJECT'
  comment: string
}

class PortfolioApiService {
  async getCompanyFinancialReports(companyId: string): Promise<ApiResponse<PortfolioFinancialReport[]>> {
    return apiClient.get(`/portfolio-companies/${companyId}/financial-reports`)
  }

  async reviewFinancialReport(companyId: string, reportId: string, data: ReviewFinancialReportRequest): Promise<ApiResponse> {
    return apiClient.post(`/portfolio-companies/${companyId}/financial-reports/${reportId}/review`, data)
  }
}

export const portfolioApi = new PortfolioApiService()
