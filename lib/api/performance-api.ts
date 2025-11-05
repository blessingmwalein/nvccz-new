import api from "@/lib/api/api"
import type { ApiResponse } from "@/lib/api/api"

export const performanceApi = {
  // ...existing methods...

  getKPIAnalytics: async (params?: {
    kpiId?: string
    department?: string
    startDate?: string
    endDate?: string
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.kpiId) queryParams.append("kpiId", params.kpiId)
    if (params?.department) queryParams.append("department", params.department)
    if (params?.startDate) queryParams.append("startDate", params.startDate)
    if (params?.endDate) queryParams.append("endDate", params.endDate)

    const response = await api.get<ApiResponse>(`/performance/analytics/kpi?${queryParams.toString()}`)
    return response.data
  },
}