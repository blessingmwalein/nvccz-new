// KPI API Service for Backend Integration with Authentication
import { apiClient, ApiResponse } from './api-client'

export interface KPICreateRequest {
  name: string
  description?: string
  type: "Percentage" | "Number" | "Currency" | "Ratio" | "Metric"
  unit?: string
  targetValue?: number
  currentValue?: number
  category?: "sales" | "financial" | "operational" | "investment"
  frequency?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  departmentId?: string
  weightValue?: number
  isActive?: boolean
}

export interface KPICreateResponse extends ApiResponse {
  kpi: {
    id: string
    name: string
    type: string
    branch: string | null
    weightValue: string
    hasUnit: boolean
    unitCategory: string | null
    unit: string
    unitSymbol: string | null
    unitPosition: "prefix" | "suffix"
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

export interface KPIsResponse extends ApiResponse {
  count: number
  kpis: Array<{
    id: string
    name: string
    type: string
    branch: string | null
    weightValue: string
    hasUnit: boolean
    unitCategory: string | null
    unit: string
    unitSymbol: string | null
    unitPosition: "prefix" | "suffix"
    isActive: boolean
    createdAt: string
    updatedAt: string
    performanceGoals: Array<{
      id: string
      title: string
      status: string
      stage: string
    }>
    _count: {
      performanceGoals: number
    }
  }>
}

class KPIApiService {
  // Get all KPIs
  async getKPIs(): Promise<KPIsResponse> {
    return apiClient.get<KPIsResponse>('/kpis')
  }

  // Create a new KPI
  async createKPI(kpiData: KPICreateRequest): Promise<KPICreateResponse> {
    return apiClient.post<KPICreateResponse>('/kpis', kpiData)
  }

  // Update an existing KPI
  async updateKPI(id: string, kpiData: Partial<KPICreateRequest>): Promise<KPICreateResponse> {
    return apiClient.put<KPICreateResponse>(`/kpis/${id}`, kpiData)
  }

  // Delete a KPI
  async deleteKPI(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/kpis/${id}`)
  }

  // Get a single KPI by ID
  async getKPI(id: string): Promise<KPICreateResponse> {
    return apiClient.get<KPICreateResponse>(`/kpis/${id}`)
  }
}

export const kpiApiService = new KPIApiService()
