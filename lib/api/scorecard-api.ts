import { apiClient } from "./api-client"

// --- Common Interfaces ---
interface Goal {
  id: string
  title: string
  type: string
  category: string
  targetValue: string | null
  currentValue: string
  progressPercentage: string
  stage: string
  kpi?: {
    id: string
    name: string
    type: string
    unitSymbol?: string
    unitPosition?: string
  }
  parentGoal?: {
    id: string
    title: string
    type: string
  }
  individualGoals?: any[]
}

interface User {
  id: string
  name: string
  email: string
  role: string | null
  roleCode: string | null
}

// --- Department Scorecard Interfaces ---
export interface DepartmentScorecard {
  department: string
  goals: Goal[]
  users: User[]
  scorecard: {
    sections: {
      outcomes: { maxScore: number; totalScore: string; outcomeGoals: number; completionRate: string }
      outputs: { maxScore: number; totalScore: string; outputGoals: number; completionRate: string }
      serviceDelivery: { maxScore: number; totalScore: string; serviceGoals: number; userSatisfaction: string }
      management: {
        maxScore: number
        totalScore: string
        financialManagement: { maxScore: number; score: string }
        organizationalCapacity: { maxScore: number; score: string }
      }
      crossCutting: { maxScore: number; totalScore: string; priorities: string[] }
    }
    finalScore: { total: string; performanceBand: string; rating: string }
    summary: { totalGoals: number; completedGoals: number; totalUsers: number; managers: number; officers: number }
  }
}

// --- User Scorecard Interfaces ---
export interface UserScorecard {
  user: {
    id: string
    name: string
    email: string
    department: string | null
    role: string | null
    roleCode: string | null
  }
  goals: Goal[]
  tasks: any[] // Define task interface if needed
  scorecard: {
    sections: {
      resultsDelivery: { maxScore: number; totalScore: string; outputs: any[]; completionRate: string }
      budgetPerformance: {
        maxScore: number
        totalScore: string
        budgetUtilization: string
        targetUtilization: number
        variance: string
        rating: number
      }
    }
    finalScore: { total: string; performanceBand: string; rating: string }
    summary: {
      totalGoals: number
      completedGoals: number
      totalTasks: number
      completedTasks: number
      overdueTasks: number
    }
  }
}

// --- API Response Interfaces ---
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// --- API Service ---
export const scorecardApiService = {
  async getAllDepartmentScorecards(): Promise<ApiResponse<DepartmentScorecard[]>> {
    // Assuming an endpoint that returns all department scorecards
    return apiClient.get(`/performance/scorecards/departments`)
  },

  async getDepartmentScorecard(departmentName: string): Promise<ApiResponse<DepartmentScorecard>> {
    return apiClient.get(`/performance/scorecards/department/${departmentName}`)
  },

  async getUserScorecard(): Promise<ApiResponse<UserScorecard>> {
    return apiClient.get("/performance/scorecards/user")
  },
}
