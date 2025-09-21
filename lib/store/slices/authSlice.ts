import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient, ApiError } from '@/lib/api/api-client'
import { getAuthToken, getAuthUser, setCookie, clearAuthCookies } from '@/lib/utils/cookies'

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  permissions: Array<{
    name: string
    value: boolean
  }>
}

export interface LoginResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Use API client without authentication for login
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://nvccz-pi.vercel.app/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Login failed')
      }

      const data: LoginResponse = await response.json()

      // Store token and user data in cookies
      if (typeof document !== 'undefined') {
        const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token'
        const userKey = process.env.NEXT_PUBLIC_AUTH_USER_KEY || 'user'
        const maxAge = parseInt(process.env.NEXT_PUBLIC_AUTH_COOKIE_MAX_AGE || '604800') // 7 days

        setCookie(tokenKey, data.token, { maxAge })
        setCookie(userKey, encodeURIComponent(JSON.stringify(data.user)), { maxAge })
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Network error occurred')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Clear cookies
      clearAuthCookies()
      return true
    } catch (error) {
      return rejectWithValue('Logout failed')
    }
  }
)

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      if (typeof document === 'undefined') {
        return rejectWithValue('Server side')
      }

      const token = getAuthToken()
      const user = getAuthUser()

      if (token && user) {
        return { token, user }
      } else {
        return rejectWithValue('No valid session found')
      }
    } catch (error) {
      return rejectWithValue('Auth check failed')
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload as string
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = null
      })
      // Check auth status
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
  },
})

export const { clearError, setLoading } = authSlice.actions
export default authSlice.reducer
