import { apiClient, type ApiResponse } from '@/lib/api/api-client'

export interface EventAuthor {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface AppEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  authorId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  author: EventAuthor
}

export const eventsApi = {
  getAll: async (): Promise<ApiResponse<AppEvent[]>> => {
    return apiClient.get<ApiResponse<AppEvent[]>>('/events')
  },
  getUpcoming: async (): Promise<ApiResponse<AppEvent[]>> => {
    return apiClient.get<ApiResponse<AppEvent[]>>('/events/upcoming')
  },
  create: async (data: {
    title: string
    description: string
    startDate: string
    endDate: string
    location: string
  }): Promise<ApiResponse<AppEvent>> => {
    return apiClient.post<ApiResponse<AppEvent>>('/events', data)
  },
  update: async (id: string, data: Partial<{
    title: string
    description: string
    startDate: string
    endDate: string
    location: string
  }>): Promise<ApiResponse<AppEvent>> => {
    return apiClient.put<ApiResponse<AppEvent>>(`/events/${id}`, data)
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/events/${id}`)
  }
}


