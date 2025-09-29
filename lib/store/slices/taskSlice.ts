import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// Task Types
export interface Task {
  id: string
  title: string
  description?: string
  team: string[]
  stage: "todo" | "in_progress" | "completed" | "overdue"
  date: string
  priority: "low" | "medium" | "high" | "critical"
  assets?: string | null
  branch?: string | null
  department?: string | null
  ruleset?: string | null
  goalId?: string | null
  performanceCategory?: string | null
  isPerformanceTask: boolean
  isOverdue: boolean
  overdueStatus?: string | null
  originalStage?: string | null
  monetaryValue?: string | null
  percentValue?: string | null
  monetaryValueAchieved?: string
  percentValueAchieved?: string
  kpi?: any
  activities: Activity[]
  status?: string | null
  isTrashed: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  creator: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  goal?: {
    id: string
    title: string
    type: string
    category: string
  } | null
}

export interface Activity {
  by: string
  date: string
  type: string
  activity: string
}

export interface ActivityLog {
  id: string
  userId: string
  activityType: string
  title: string
  description: string
  goalId?: string
  taskId?: string
  kpiId?: string
  monetaryValueAchieved?: number | null
  percentValueAchieved?: number | null
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  goal?: {
    id: string
    title: string
    type: string
    category: string
  }
  task?: {
    id: string
    title: string
    stage: string
    priority: string
  }
  kpi?: {
    id: string
    name: string
    type: string
    unitSymbol?: string | null
  }
}

export interface TaskFilters {
  category?: string
  priority?: string
  assignedToId?: string
  goalId?: string
  status?: string
  stage?: string
  isPerformanceTask?: boolean
}

export interface TaskState {
  tasks: Task[]
  activityLogs: ActivityLog[]
  loading: boolean
  error: string | null
  filters: TaskFilters
  searchTerm: string
  currentPage: number
  totalPages: number
  selectedTask: Task | null
}

const initialState: TaskState = {
  tasks: [],
  activityLogs: [],
  loading: false,
  error: null,
  filters: {},
  searchTerm: "",
  currentPage: 1,
  totalPages: 1,
  selectedTask: null
}

// API Base URL
const API_BASE_URL = "https://nvccz-pi.vercel.app/api"

// Get auth token from localStorage or cookies (client-side only)
const getAuthToken = () => {
  try {
    if (typeof window !== "undefined") {
      const lsToken = window.localStorage?.getItem("authToken") || ""
      if (lsToken) return lsToken

      // Fallback: try cookies
      const cookieString = document.cookie || ""
      const cookies = Object.fromEntries(
        cookieString.split(";")
          .map((c) => c.trim())
          .filter(Boolean)
          .map((c) => {
            const idx = c.indexOf("=")
            return [decodeURIComponent(c.substring(0, idx)), decodeURIComponent(c.substring(idx + 1))]
          })
      ) as Record<string, string>

      return (
        cookies["authToken"] ||
        cookies["token"] ||
        cookies["Authorization"] ||
        ""
      )
    }
  } catch (_err) {
    // ignore
  }
  return ""
}

// Async Thunks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters: TaskFilters = {}, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      const queryParams = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString())
        }
      })

      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`
      
      const response = await fetch(`${API_BASE_URL}/tasks?${queryParams}`, { headers })

      if (!response.ok) {
        // Return empty array instead of throwing error to show skeleton
        console.warn(`API request failed with status ${response.status}`)
        return []
      }

      const data = await response.json()
      return data || []
    } catch (error) {
      console.warn("Failed to fetch tasks:", error)
      // Return empty array instead of rejecting to show skeleton
      return []
    }
  },
  {
    // Prevent duplicate requests (e.g., React Strict Mode double-invocation in dev)
    condition: (_filters, { getState }) => {
      try {
        const state: any = getState()
        return !state?.tasks?.loading
      } catch {
        return true
      }
    }
  }
)

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: Partial<Task>) => {
    const token = getAuthToken()
    const createHeaders: Record<string, string> = { "Content-Type": "application/json" }
    if (token) createHeaders["Authorization"] = `Bearer ${token}`
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: createHeaders,
      body: JSON.stringify(taskData)
    })

    if (!response.ok) {
      throw new Error("Failed to create task")
    }

    const data = await response.json()
    return data.task
  }
)

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, taskData }: { taskId: string; taskData: Partial<Task> }) => {
    const token = getAuthToken()
    const updateHeaders: Record<string, string> = { "Content-Type": "application/json" }
    if (token) updateHeaders["Authorization"] = `Bearer ${token}`
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: updateHeaders,
      body: JSON.stringify(taskData)
    })

    if (!response.ok) {
      throw new Error("Failed to update task")
    }

    const data = await response.json()
    return data.task
  }
)

export const updateTaskStage = createAsyncThunk(
  "tasks/updateTaskStage",
  async ({ taskId, stage, notes }: { taskId: string; stage: string; notes?: string }) => {
    const token = getAuthToken()
    const stageHeaders: Record<string, string> = { "Content-Type": "application/json" }
    if (token) stageHeaders["Authorization"] = `Bearer ${token}`
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/stage`, {
      method: "PUT",
      headers: stageHeaders,
      body: JSON.stringify({ stage, notes })
    })

    if (!response.ok) {
      throw new Error("Failed to update task stage")
    }

    const data = await response.json()
    return data.task
  }
)

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    const token = getAuthToken()
    const deleteHeaders: Record<string, string> = { "Content-Type": "application/json" }
    if (token) deleteHeaders["Authorization"] = `Bearer ${token}`
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: deleteHeaders
    })

    if (!response.ok) {
      throw new Error("Failed to delete task")
    }

    return taskId
  }
)

export const fetchActivityLogs = createAsyncThunk(
  "tasks/fetchActivityLogs",
  async (filters: any = {}) => {
    const token = getAuthToken()
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString())
      }
    })

    const logsHeaders: Record<string, string> = { "Content-Type": "application/json" }
    if (token) logsHeaders["Authorization"] = `Bearer ${token}`
    const response = await fetch(`${API_BASE_URL}/activity-logs?${queryParams}`, { headers: logsHeaders })

    if (!response.ok) {
      throw new Error("Failed to fetch activity logs")
    }

    const data = await response.json()
    return data
  }
)

export const createActivityLog = createAsyncThunk(
  "tasks/createActivityLog",
  async (activityData: any) => {
    const token = getAuthToken()
    const createLogHeaders: Record<string, string> = { "Content-Type": "application/json" }
    if (token) createLogHeaders["Authorization"] = `Bearer ${token}`
    const response = await fetch(`${API_BASE_URL}/activity-logs`, {
      method: "POST",
      headers: createLogHeaders,
      body: JSON.stringify(activityData)
    })

    if (!response.ok) {
      throw new Error("Failed to create activity log")
    }

    const data = await response.json()
    return data.activityLog
  }
)

export const addTaskActivity = createAsyncThunk(
  "tasks/addTaskActivity",
  async ({ taskId, activityData }: { taskId: string; activityData: any }) => {
    const token = getAuthToken()
    const addActivityHeaders: Record<string, string> = { "Content-Type": "application/json" }
    if (token) addActivityHeaders["Authorization"] = `Bearer ${token}`
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/activity`, {
      method: "POST",
      headers: addActivityHeaders,
      body: JSON.stringify(activityData)
    })

    if (!response.ok) {
      throw new Error("Failed to add task activity")
    }

    const data = await response.json()
    return data
  }
)

export const updateActivityLog = createAsyncThunk(
  "tasks/updateActivityLog",
  async ({ id, updates }: { id: string; updates: any }) => {
    const token = getAuthToken()
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    const response = await fetch(`${API_BASE_URL}/activity-logs/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updates)
    })
    if (!response.ok) {
      throw new Error("Failed to update activity log")
    }
    const data = await response.json()
    return data.activityLog
  }
)

export const deleteActivityLog = createAsyncThunk(
  "tasks/deleteActivityLog",
  async (id: string) => {
    const token = getAuthToken()
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    const response = await fetch(`${API_BASE_URL}/activity-logs/${id}`, {
      method: "DELETE",
      headers
    })
    if (!response.ok) {
      throw new Error("Failed to delete activity log")
    }
    return id
  }
)

// Task Slice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TaskFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        // Accept both array and object payloads to avoid runtime errors and loops
        if (Array.isArray(action.payload)) {
          state.tasks = action.payload
          state.totalPages = 1
        } else if (action.payload && typeof action.payload === "object") {
          const maybeTasks = (action.payload as any).tasks
          const maybeCount = (action.payload as any).count
          state.tasks = Array.isArray(maybeTasks) ? maybeTasks : []
          state.totalPages = Math.ceil((Number(maybeCount) || 0) / 10) || 1
        } else {
          state.tasks = []
          state.totalPages = 1
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch tasks"
      })
      
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks.unshift(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create task"
      })
      
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false
        const index = state.tasks.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update task"
      })
      
      // Update Task Stage
      .addCase(updateTaskStage.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
      })
      
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload)
      })
      
      // Fetch Activity Logs
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.activityLogs = action.payload.activityLogs || []
      })
      
      // Create Activity Log
      .addCase(createActivityLog.fulfilled, (state, action) => {
        state.activityLogs.unshift(action.payload)
      })

      // Add Task Activity (updates the task with new activity)
      .addCase(addTaskActivity.fulfilled, (state, action) => {
        const returned = action.payload as any
        const updatedTask = returned?.task || null
        if (updatedTask) {
          const idx = state.tasks.findIndex(t => t.id === updatedTask.id)
          if (idx !== -1) {
            state.tasks[idx] = updatedTask
          }
        }
      })

      // Update Activity Log
      .addCase(updateActivityLog.fulfilled, (state, action) => {
        const index = state.activityLogs.findIndex((log) => log.id === action.payload.id)
        if (index !== -1) {
          state.activityLogs[index] = action.payload
        }
      })

      // Delete Activity Log
      .addCase(deleteActivityLog.fulfilled, (state, action) => {
        state.activityLogs = state.activityLogs.filter((log) => log.id !== action.payload)
      })
  }
})

export const {
  setFilters,
  setSearchTerm,
  setCurrentPage,
  setSelectedTask,
  clearError
} = taskSlice.actions

export default taskSlice.reducer
