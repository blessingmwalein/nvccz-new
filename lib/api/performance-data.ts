import { KPI, Department, PerformanceGoal, Task, PerformanceMetrics } from "@/lib/store/slices/performanceSlice"
import { kpiApiService, KPICreateRequest } from "./kpi-api"
import { departmentApiService } from "./department-api"

// Transform backend KPI data to frontend format
const transformKPIData = (backendKPI: any): KPI => {
  return {
    id: backendKPI.id,
    name: backendKPI.name,
    description: backendKPI.description || "",
    type: backendKPI.type as KPI['type'],
    branch: backendKPI.branch,
    weightValue: backendKPI.weightValue,
    hasUnit: backendKPI.hasUnit,
    unitCategory: backendKPI.unitCategory,
    unit: backendKPI.unit,
    unitSymbol: backendKPI.unitSymbol,
    unitPosition: backendKPI.unitPosition,
    isActive: backendKPI.isActive,
    createdAt: backendKPI.createdAt,
    updatedAt: backendKPI.updatedAt,
    performanceGoals: backendKPI.performanceGoals || [],
    _count: backendKPI._count,
    // Add default values for frontend compatibility
    targetValue: 0,
    currentValue: 0,
    category: "sales" as const,
    frequency: "monthly" as const,
    departmentId: "default",
  }
}

// Mock Data for Departments
export const mockDepartments: Department[] = [
  {
    id: "dept_1",
    name: "Investment Team",
    description: "Team responsible for deal sourcing and portfolio management",
    branch: "main_office",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "dept_2",
    name: "Due Diligence Team",
    description: "Team responsible for conducting due diligence on potential investments",
    branch: "main_office",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "dept_3",
    name: "Portfolio Management",
    description: "Team responsible for managing existing portfolio companies",
    branch: "main_office",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "dept_4",
    name: "Operations",
    description: "Team responsible for operational support and administration",
    branch: "main_office",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

// Mock Data for Performance Goals
export const mockGoals: PerformanceGoal[] = [
  {
    id: "goal_1",
    title: "Increase Portfolio Value by 20%",
    description: "Achieve 20% growth in portfolio valuation by end of year",
    type: "company",
    category: "financial",
    departmentId: "dept_1",
    monetaryValue: 10000000,
    percentValue: 20.0,
    priority: "high",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    assignedToId: "user_1",
    status: "in_progress",
    progress: 45,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "goal_2",
    title: "Complete 15 Due Diligence Reviews",
    description: "Complete due diligence reviews for 15 potential investments",
    type: "department",
    category: "operational",
    departmentId: "dept_2",
    monetaryValue: 5000000,
    priority: "medium",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    assignedToId: "user_2",
    status: "in_progress",
    progress: 60,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "goal_3",
    title: "Improve Deal Conversion Rate",
    description: "Increase deal conversion rate from 18.5% to 25%",
    type: "individual",
    category: "operational",
    departmentId: "dept_1",
    percentValue: 6.5,
    priority: "high",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    assignedToId: "user_3",
    status: "in_progress",
    progress: 30,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "goal_4",
    title: "Reduce Due Diligence Time",
    description: "Reduce average due diligence completion time to 25 days",
    type: "department",
    category: "operational",
    departmentId: "dept_2",
    priority: "medium",
    startDate: "2025-01-01",
    endDate: "2025-04-30",
    assignedToId: "user_4",
    status: "not_started",
    progress: 0,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

// Mock Data for Tasks
export const mockTasks: Task[] = [
  {
    id: "task_1",
    title: "Complete Due Diligence for TechCorp",
    description: "Conduct comprehensive due diligence for TechCorp Series A investment",
    category: "investment",
    priority: "high",
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    assignedToId: "user_1",
    team: ["user_2", "user_3"],
    goalId: "goal_2",
    performanceCategory: "due_diligence",
    isPerformanceTask: true,
    monetaryValue: 5000000,
    percentValue: 10.0,
    kpi: {
      type: "Metric",
      target: 5000000,
      unit: "USD",
    },
    ruleset: ">=",
    status: "in_progress",
    progress: 65,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "task_2",
    title: "Review Q4 Portfolio Performance",
    description: "Analyze and report on Q4 portfolio performance metrics",
    category: "operational",
    priority: "medium",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    assignedToId: "user_4",
    team: ["user_5"],
    goalId: "goal_1",
    performanceCategory: "portfolio_management",
    isPerformanceTask: true,
    monetaryValue: 2000000,
    kpi: {
      type: "Currency",
      target: 2000000,
      unit: "USD",
    },
    ruleset: ">=",
    status: "completed",
    progress: 100,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-31T00:00:00Z",
  },
  {
    id: "task_3",
    title: "Source 10 New Investment Opportunities",
    description: "Identify and evaluate 10 new potential investment opportunities",
    category: "investment",
    priority: "high",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    assignedToId: "user_6",
    team: ["user_7", "user_8"],
    goalId: "goal_1",
    performanceCategory: "deal_sourcing",
    isPerformanceTask: true,
    monetaryValue: 10000000,
    kpi: {
      type: "Number",
      target: 10,
      unit: "deals",
    },
    ruleset: ">=",
    status: "in_progress",
    progress: 40,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "task_4",
    title: "Update Investment Committee Presentation",
    description: "Prepare and update presentation materials for investment committee",
    category: "operational",
    priority: "low",
    startDate: "2025-01-20",
    endDate: "2025-01-25",
    assignedToId: "user_9",
    team: [],
    performanceCategory: "reporting",
    isPerformanceTask: false,
    status: "not_started",
    progress: 0,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
]

// Mock Data for Performance Metrics
export const mockMetrics: PerformanceMetrics = {
  totalKPIs: 4,
  activeKPIs: 4,
  completedGoals: 0,
  totalGoals: 4,
  completedTasks: 1,
  totalTasks: 4,
  averageGoalProgress: 33.75,
  averageTaskProgress: 51.25,
  departmentPerformance: [
    {
      departmentId: "dept_1",
      departmentName: "Investment Team",
      kpiCount: 2,
      goalCount: 2,
      taskCount: 2,
      averageProgress: 37.5,
    },
    {
      departmentId: "dept_2",
      departmentName: "Due Diligence Team",
      kpiCount: 2,
      goalCount: 2,
      taskCount: 1,
      averageProgress: 30,
    },
    {
      departmentId: "dept_3",
      departmentName: "Portfolio Management",
      kpiCount: 0,
      goalCount: 0,
      taskCount: 1,
      averageProgress: 100,
    },
    {
      departmentId: "dept_4",
      departmentName: "Operations",
      kpiCount: 0,
      goalCount: 0,
      taskCount: 0,
      averageProgress: 0,
    },
  ],
}

// Transform backend Department data to frontend format
const transformDepartmentData = (backendDepartment: any): Department => {
  return {
    id: backendDepartment.id,
    name: backendDepartment.name,
    description: backendDepartment.description,
    branch: backendDepartment.branch,
    isActive: backendDepartment.isActive,
    createdAt: backendDepartment.createdAt,
    updatedAt: backendDepartment.updatedAt,
    users: backendDepartment.users || [],
    goals: backendDepartment.goals || [],
    _count: backendDepartment._count || { users: 0, goals: 0 }
  }
}

// API Service Functions (Real backend integration)
export const performanceAPI = {
  // KPI APIs
  getKPIs: async (): Promise<KPI[]> => {
    try {
      const response = await kpiApiService.getKPIs()
      return response.kpis.map(transformKPIData)
    } catch (error) {
      console.error('Failed to fetch KPIs:', error)
      throw new Error('Failed to fetch KPIs')
    }
  },
  
  createKPI: async (kpi: Omit<KPI, 'id' | 'createdAt' | 'updatedAt'>): Promise<KPI> => {
    try {
      const createRequest: KPICreateRequest = {
        name: kpi.name,
        description: kpi.description,
        type: kpi.type,
        unit: kpi.unit,
        targetValue: kpi.targetValue,
        currentValue: kpi.currentValue,
        category: kpi.category,
        frequency: kpi.frequency,
        departmentId: kpi.departmentId,
        weightValue: parseFloat(kpi.weightValue),
        isActive: kpi.isActive,
      }
      
      const response = await kpiApiService.createKPI(createRequest)
      return transformKPIData(response.kpi)
    } catch (error) {
      console.error('Failed to create KPI:', error)
      throw new Error('Failed to create KPI')
    }
  },
  
  updateKPI: async (id: string, updates: Partial<KPI>): Promise<KPI> => {
    try {
      const updateRequest: Partial<KPICreateRequest> = {
        name: updates.name,
        description: updates.description,
        type: updates.type,
        unit: updates.unit,
        targetValue: updates.targetValue,
        currentValue: updates.currentValue,
        category: updates.category,
        frequency: updates.frequency,
        departmentId: updates.departmentId,
        weightValue: updates.weightValue ? parseFloat(updates.weightValue) : undefined,
        isActive: updates.isActive,
      }
      
      const response = await kpiApiService.updateKPI(id, updateRequest)
      return transformKPIData(response.kpi)
    } catch (error) {
      console.error('Failed to update KPI:', error)
      throw new Error('Failed to update KPI')
    }
  },
  
  deleteKPI: async (id: string): Promise<void> => {
    try {
      await kpiApiService.deleteKPI(id)
    } catch (error) {
      console.error('Failed to delete KPI:', error)
      throw new Error('Failed to delete KPI')
    }
  },

  // Department APIs
  getDepartments: async (): Promise<Department[]> => {
    try {
      const response = await departmentApiService.getDepartments()
      return response.departments.map(transformDepartmentData)
    } catch (error) {
      console.error('Failed to fetch departments:', error)
      throw new Error('Failed to fetch departments')
    }
  },

  createDepartment: async (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'users' | 'goals' | '_count'>): Promise<Department> => {
    try {
      const response = await departmentApiService.createDepartment(department)
      return transformDepartmentData(response.department)
    } catch (error) {
      console.error('Failed to create department:', error)
      throw new Error('Failed to create department')
    }
  },

  updateDepartment: async (id: string, updates: Partial<Department>): Promise<Department> => {
    try {
      const response = await departmentApiService.updateDepartment(id, updates)
      return transformDepartmentData(response.department)
    } catch (error) {
      console.error('Failed to update department:', error)
      throw new Error('Failed to update department')
    }
  },

  deleteDepartment: async (id: string): Promise<void> => {
    try {
      await departmentApiService.deleteDepartment(id)
    } catch (error) {
      console.error('Failed to delete department:', error)
      throw new Error('Failed to delete department')
    }
  },
  
  createDepartment: async (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newDepartment: Department = {
      ...department,
      id: `dept_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newDepartment
  },
  
  // Goal APIs
  getGoals: async (): Promise<PerformanceGoal[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockGoals
  },
  
  createGoal: async (goal: Omit<PerformanceGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<PerformanceGoal> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newGoal: PerformanceGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newGoal
  },
  
  // Task APIs
  getTasks: async (): Promise<Task[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockTasks
  },
  
  createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newTask
  },
  
  // Metrics API
  getMetrics: async (): Promise<PerformanceMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockMetrics
  },
}
