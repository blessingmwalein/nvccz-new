import { apiClient, type ApiResponse } from '@/lib/api/api-client'

export interface PostAuthor {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  expiresAt: string | null
  isNotified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  author: PostAuthor
  replies: any[]
}

export const postsApi = {
  getAll: async (): Promise<ApiResponse<Post[]>> => {
    return apiClient.get<ApiResponse<Post[]>>('/posts')
  },
  create: async (data: {
    title: string
    content: string
    expiresAt?: string | null
    isNotified?: boolean
  }): Promise<ApiResponse<Post>> => {
    return apiClient.post<ApiResponse<Post>>('/posts', data)
  },
  update: async (id: string, data: Partial<{ title: string; content: string; expiresAt: string | null; isNotified: boolean }>): Promise<ApiResponse<Post>> => {
    return apiClient.put<ApiResponse<Post>>(`/posts/${id}`, data)
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/posts/${id}`)
  },
}


