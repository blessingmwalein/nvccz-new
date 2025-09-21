// API Client with Authentication Interceptor
import { getAuthToken, clearAuthCookies } from '@/lib/utils/cookies'

// API Response interface
interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  [key: string]: any
}

// API Error class
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// API Client class
class ApiClient {
  private baseURL: string

  constructor(baseURL?: string) {
    this.baseURL = baseURL || 'https://nvccz-pi.vercel.app/api'
  }

  // Make authenticated request
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get token from cookies
    const token = getAuthToken()
    
    // Default headers
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add authorization header if token exists
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    // Merge headers
    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      // Handle unauthorized responses
      if (response.status === 401) {
        // Clear invalid token from cookies
        clearAuthCookies()
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        
        throw new ApiError('Unauthorized - Please login again', 401)
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        )
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      console.error('API request failed:', error)
      throw new ApiError('Network error occurred', 0)
    }
  }

  // GET request
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  // POST request
  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Export types
export { ApiResponse, ApiError }
