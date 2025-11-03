import { apiClient } from './api-client'

interface GetGoalsParams {
  type?: 'company' | 'department' | 'individual' | ''
  department?: string
}

export const goalApiService = {
  // Get all performance goals with optional filters
  async getGoals(params: GetGoalsParams = {}): Promise<any> {
    const queryParams = new URLSearchParams()
    if (params.type && params.type !== 'all') {
      queryParams.append('type', params.type)
    }
    if (params.department && params.department !== 'all') {
      queryParams.append('department', params.department)
    }
    const queryString = queryParams.toString()
    return apiClient.get(`/performance/goals${queryString ? `?${queryString}` : ''}`)
  },

  // Get a single performance goal by ID
  async getGoal(goalId: string): Promise<any> {
    return apiClient.get(`/performance/goals/${goalId}`)
  },

  // Create a new performance goal
  async createGoal(goalData: any): Promise<any> {
    return apiClient.post('/performance/goals', goalData)
  },

  // Update a performance goal
  async updateGoal(goalId: string, updateData: any): Promise<any> {
    return apiClient.patch(`/performance/goals/${goalId}`, updateData)
  },

  // Delete a performance goal
  async deleteGoal(goalId: string): Promise<any> {
    return apiClient.delete(`/performance/goals/${goalId}`)
  },

  // Breakdown company goal to departments
  async breakdownToDepartments(data: any): Promise<any> {
    return apiClient.post('/performance/breakdown/departments', data)
  },

  // Get users for a department for breakdown
  async getUsersForBreakdown(departmentName: string): Promise<any> {
    return apiClient.get(`/performance/breakdown/users/${departmentName}`)
  },

  // Breakdown department goal to individuals
  async breakdownToIndividuals(data: any): Promise<any> {
    return apiClient.post('/performance/breakdown/individuals', data)
  },
}
