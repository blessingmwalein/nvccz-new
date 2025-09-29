import { apiClient } from './api-client'

export interface KPICreateRequest {
  name: string
  description?: string
  type: 'Percentage' | 'Metric' | 'Count'
  unit?: string
  targetValue?: number
  currentValue?: number
  category: 'sales' | 'marketing' | 'operations' | 'finance' | 'hr'
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  departmentId?: string
  weightValue: number
  isActive: boolean
}

export interface KPIUpdateRequest {
  name?: string
  description?: string
  type?: 'Percentage' | 'Metric' | 'Count'
  unit?: string
  targetValue?: number
  currentValue?: number
  category?: 'sales' | 'marketing' | 'operations' | 'finance' | 'hr'
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  departmentId?: string
  weightValue?: number
  isActive?: boolean
}

export interface KPI {
  id: string
  name: string
  description?: string
  type: 'Percentage' | 'Metric' | 'Count'
  unit?: string
  targetValue?: number
  currentValue?: number
  category: 'sales' | 'marketing' | 'operations' | 'finance' | 'hr'
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  departmentId?: string
  weightValue: number
  isActive: boolean
  hasUnit: boolean
  unitCategory?: string
  unitSymbol?: string
  unitPosition?: 'prefix' | 'suffix'
  createdAt: string
  updatedAt: string
  performanceGoals?: any[]
  _count?: {
    performanceGoals: number
  }
}

export interface KPIsResponse {
  success: boolean
  count: number
  kpis: KPI[]
}

export interface KPIResponse {
  success: boolean
  kpi: KPI
}

export interface KPIFilters {
  type?: string
  category?: string
  departmentId?: string
  isActive?: boolean
  frequency?: string
}

export const kpiApiService = {
  async getKPIs(filters?: KPIFilters): Promise<KPIsResponse> {
    const queryParams = new URLSearchParams()
    if (filters?.type) {
      queryParams.append('type', filters.type)
    }
    if (filters?.category) {
      queryParams.append('category', filters.category)
    }
    if (filters?.departmentId) {
      queryParams.append('departmentId', filters.departmentId)
    }
    if (filters?.isActive !== undefined) {
      queryParams.append('isActive', filters.isActive.toString())
    }
    if (filters?.frequency) {
      queryParams.append('frequency', filters.frequency)
    }

    const queryString = queryParams.toString()
    const url = queryString ? `/kpis?${queryString}` : '/kpis'

    return apiClient.get<KPIsResponse>(url)
  },

  async getKPI(id: string): Promise<KPIResponse> {
    return apiClient.get<KPIResponse>(`/kpis/${id}`)
  },

  async createKPI(data: KPICreateRequest): Promise<KPIResponse> {
    return apiClient.post<KPIResponse>('/kpis', data)
  },

  async updateKPI(id: string, data: KPIUpdateRequest): Promise<KPIResponse> {
    return apiClient.put<KPIResponse>(`/kpis/${id}`, data)
  },

  async deleteKPI(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/kpis/${id}`)
  }
}