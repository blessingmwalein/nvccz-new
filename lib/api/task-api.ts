import { apiClient } from "./api-client"

// --- Interfaces ---

export interface User {
  id: string
  firstName: string
  lastName?: string
  email?: string
}

export interface Goal {
  id: string
  title: string
  parentGoal?: Goal
  progressPercentage?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  stage: "completed" | "in_progress" | "todo" | "pending" | "blocked"
  priority: "critical" | "high" | "medium" | "low"
  date: string // Due Date
  creator: User
  goalId?: string
  goal?: Goal
}

export interface TaskActivity {
  id: string
  userId: string
  activityType: string
  title: string
  description: string
  goalId: string
  taskId: string
  createdAt: string
  user: User
  goal: Goal
}

export interface CreateActivityPayload {
  title: string
  description?: string
  activityType: "task"
  taskId: string
  goalId: string
  valueCollected?: number
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

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  tasks?: T // Add optional tasks property
}

// --- API Service ---

export const taskApiService = {
  async getTasks(filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString())
        }
      })
    }
    const queryString = queryParams.toString()
    const url = queryString ? `/tasks?${queryString}` : "/tasks"
    return apiClient.get<ApiResponse<Task[]>>(url)
  },

  async getMyTasks(): Promise<ApiResponse<Task[]>> {
    return apiClient.get<ApiResponse<Task[]>>("/tasks/my")
  },

  async getDepartmentTasks(department: string): Promise<ApiResponse<Task[]>> {
    return apiClient.get<ApiResponse<Task[]>>(
      `/performance/individual-goals/departments/${department}/performance-tasks`,
    )
  },

  async getTaskActivities(taskId: string): Promise<ApiResponse<TaskActivity[]>> {
    return apiClient.get<ApiResponse<TaskActivity[]>>(`/activities/task/${taskId}`)
  },

  async createActivity(payload: CreateActivityPayload): Promise<ApiResponse<TaskActivity>> {
    return apiClient.post<ApiResponse<TaskActivity>>("/activities", payload)
  },

  async addTaskActivity(
    taskId: string,
    activityData: { title: string; description?: string },
  ): Promise<ApiResponse<{ task: Task }>> {
    return apiClient.post<ApiResponse<{ task: Task }>>(`/tasks/${taskId}/activity`, activityData)
  },

  async createTask(taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return apiClient.post<ApiResponse<Task>>("/tasks", taskData)
  },

  async updateTask(taskId: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return apiClient.put<ApiResponse<Task>>(`/tasks/${taskId}`, taskData)
  },

  async updateTaskStage(
    taskId: string,
    stage: string,
    notes?: string,
  ): Promise<ApiResponse<Task>> {
    return apiClient.put<ApiResponse<Task>>(`/tasks/${taskId}/stage`, { stage, notes })
  },

  async deleteTask(taskId: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/tasks/${taskId}`)
  },
}
