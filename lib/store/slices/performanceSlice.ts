import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// KPI Types
export interface KPI {
  id: string
  name: string
  description?: string
  type: "Percentage" | "Number" | "Currency" | "Ratio" | "Metric"
  branch?: string | null
  weightValue: string
  hasUnit: boolean
  unitCategory?: string | null
  unit: string
  unitSymbol?: string | null
  unitPosition: "prefix" | "suffix"
  isActive: boolean
  createdAt: string
  updatedAt: string
  performanceGoals?: PerformanceGoal[]
  _count?: {
    performanceGoals: number
  }
  // Additional fields for frontend compatibility
  targetValue?: number
  currentValue?: number
  category?: "sales" | "financial" | "operational" | "investment"
  frequency?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  departmentId?: string
}

// Department Types
export interface Department {
  id: string
  name: string
  description: string
  branch: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  users: any[]
  goals: PerformanceGoal[]
  _count: {
    users: number
    goals: number
  }
}

// Performance Goal Types
export interface PerformanceGoal {
  id: string
  title: string
  description: string
  type: "company" | "department" | "individual"
  category: "financial" | "operational" | "strategic"
  departmentId: string
  monetaryValue?: number
  percentValue?: number
  priority: "low" | "medium" | "high" | "critical"
  startDate: string
  endDate: string
  assignedToId: string
  status: "not_started" | "in_progress" | "completed" | "cancelled"
  progress: number
  createdAt: string
  updatedAt: string
}

// Task Types
export interface Task {
  id: string
  title: string
  description: string
  category: "investment" | "operational" | "strategic" | "compliance"
  priority: "low" | "medium" | "high" | "critical"
  startDate: string
  endDate: string
  assignedToId: string
  team: string[]
  goalId?: string
  performanceCategory: "deal_sourcing" | "due_diligence" | "portfolio_management" | "reporting"
  isPerformanceTask: boolean
  monetaryValue?: number
  percentValue?: number
  kpi?: {
    type: "Metric" | "Percentage" | "Currency"
    target: number
    unit: string
  }
  ruleset: ">=" | "<=" | "=" | ">" | "<"
  status: "not_started" | "in_progress" | "completed" | "cancelled"
  progress: number
  createdAt: string
  updatedAt: string
}

// Performance Dashboard Metrics
export interface PerformanceMetrics {
  totalKPIs: number
  activeKPIs: number
  completedGoals: number
  totalGoals: number
  completedTasks: number
  totalTasks: number
  averageGoalProgress: number
  averageTaskProgress: number
  departmentPerformance: {
    departmentId: string
    departmentName: string
    kpiCount: number
    goalCount: number
    taskCount: number
    averageProgress: number
  }[]
}

interface PerformanceState {
  // Data
  kpis: KPI[]
  departments: Department[]
  goals: PerformanceGoal[]
  tasks: Task[]
  metrics: PerformanceMetrics | null
  
  // UI State
  loading: boolean
  crudLoading: boolean
  error: string | null
  
  // Filters
  selectedDepartment: string
  selectedCategory: string
  selectedPriority: string
  selectedStatus: string
  searchTerm: string
  
  // KPI Filters
  selectedKPIType: string
  selectedKPICategory: string
  selectedKPIDepartment: string
  selectedKPIStatus: string
  kpiSearchTerm: string
  
  // Goal Filters
  selectedGoalType: string
  selectedGoalCategory: string
  selectedGoalDepartment: string
  selectedGoalAssignedTo: string
  
  // Pagination
  currentPage: number
  itemsPerPage: number
}

const initialState: PerformanceState = {
  // Data
  kpis: [],
  departments: [],
  goals: [],
  tasks: [],
  metrics: null,
  
  // UI State
  loading: false,
  crudLoading: false,
  error: null,
  
  // Filters
  selectedDepartment: "all",
  selectedCategory: "all",
  selectedPriority: "all",
  selectedStatus: "all",
  searchTerm: "",
  
  // KPI Filters
  selectedKPIType: "all",
  selectedKPICategory: "all",
  selectedKPIDepartment: "all",
  selectedKPIStatus: "all",
  kpiSearchTerm: "",
  
  // Goal Filters
  selectedGoalType: "all",
  selectedGoalCategory: "all",
  selectedGoalDepartment: "all",
  selectedGoalAssignedTo: "all",
  
  // Pagination
  currentPage: 1,
  itemsPerPage: 10,
}

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    // Loading and Error
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setCrudLoading: (state, action: PayloadAction<boolean>) => {
      state.crudLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    // KPIs
    setKPIs: (state, action: PayloadAction<KPI[]>) => {
      state.kpis = action.payload
    },
    addKPI: (state, action: PayloadAction<KPI>) => {
      state.kpis.unshift(action.payload)
    },
    updateKPI: (state, action: PayloadAction<{ id: string; updates: Partial<KPI> }>) => {
      const index = state.kpis.findIndex((kpi) => kpi.id === action.payload.id)
      if (index !== -1) {
        state.kpis[index] = { ...state.kpis[index], ...action.payload.updates }
      }
    },
    removeKPI: (state, action: PayloadAction<string>) => {
      state.kpis = state.kpis.filter((kpi) => kpi.id !== action.payload)
    },
    
    // Departments
    setDepartments: (state, action: PayloadAction<Department[]>) => {
      state.departments = action.payload
    },
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.unshift(action.payload)
    },
    updateDepartment: (state, action: PayloadAction<{ id: string; updates: Partial<Department> }>) => {
      const index = state.departments.findIndex((dept) => dept.id === action.payload.id)
      if (index !== -1) {
        state.departments[index] = { ...state.departments[index], ...action.payload.updates }
      }
    },
    removeDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter((dept) => dept.id !== action.payload)
    },
    
    // Goals
    setGoals: (state, action: PayloadAction<PerformanceGoal[]>) => {
      state.goals = action.payload
    },
    addGoal: (state, action: PayloadAction<PerformanceGoal>) => {
      state.goals.unshift(action.payload)
    },
    updateGoal: (state, action: PayloadAction<{ id: string; updates: Partial<PerformanceGoal> }>) => {
      const index = state.goals.findIndex((goal) => goal.id === action.payload.id)
      if (index !== -1) {
        state.goals[index] = { ...state.goals[index], ...action.payload.updates }
      }
    },
    removeGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((goal) => goal.id !== action.payload)
    },
    
    // Tasks
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload)
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload.updates }
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
    },
    
    // Metrics
    setMetrics: (state, action: PayloadAction<PerformanceMetrics>) => {
      state.metrics = action.payload
    },
    
    // Filters
    setSelectedDepartment: (state, action: PayloadAction<string>) => {
      state.selectedDepartment = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
    setSelectedPriority: (state, action: PayloadAction<string>) => {
      state.selectedPriority = action.payload
    },
    setSelectedStatus: (state, action: PayloadAction<string>) => {
      state.selectedStatus = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    
    // KPI Filters
    setSelectedKPIType: (state, action: PayloadAction<string>) => {
      state.selectedKPIType = action.payload
    },
    setSelectedKPICategory: (state, action: PayloadAction<string>) => {
      state.selectedKPICategory = action.payload
    },
    setSelectedKPIDepartment: (state, action: PayloadAction<string>) => {
      state.selectedKPIDepartment = action.payload
    },
    setSelectedKPIStatus: (state, action: PayloadAction<string>) => {
      state.selectedKPIStatus = action.payload
    },
    setKPISearchTerm: (state, action: PayloadAction<string>) => {
      state.kpiSearchTerm = action.payload
    },
    
    // Goal Filters
    setSelectedGoalType: (state, action: PayloadAction<string>) => {
      state.selectedGoalType = action.payload
    },
    setSelectedGoalCategory: (state, action: PayloadAction<string>) => {
      state.selectedGoalCategory = action.payload
    },
    setSelectedGoalDepartment: (state, action: PayloadAction<string>) => {
      state.selectedGoalDepartment = action.payload
    },
    setSelectedGoalAssignedTo: (state, action: PayloadAction<string>) => {
      state.selectedGoalAssignedTo = action.payload
    },
    
    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload
    },
    
    // Reset filters
    resetFilters: (state) => {
      state.selectedDepartment = "all"
      state.selectedCategory = "all"
      state.selectedPriority = "all"
      state.selectedStatus = "all"
      state.searchTerm = ""
      state.currentPage = 1
    },
    
    // Reset KPI filters
    resetKPIFilters: (state) => {
      state.selectedKPIType = "all"
      state.selectedKPICategory = "all"
      state.selectedKPIDepartment = "all"
      state.selectedKPIStatus = "all"
      state.kpiSearchTerm = ""
      state.currentPage = 1
    },
  },
})

export const {
  // Loading and Error
  setLoading,
  setCrudLoading,
  setError,
  
  // KPIs
  setKPIs,
  addKPI,
  updateKPI,
  removeKPI,
  
  // Departments
  setDepartments,
  addDepartment,
  updateDepartment,
  removeDepartment,
  
  // Goals
  setGoals,
  addGoal,
  updateGoal,
  removeGoal,
  
  // Tasks
  setTasks,
  addTask,
  updateTask,
  removeTask,
  
  // Metrics
  setMetrics,
  
  // Filters
  setSelectedDepartment,
  setSelectedCategory,
  setSelectedPriority,
  setSelectedStatus,
  setSearchTerm,
  
  // KPI Filters
  setSelectedKPIType,
  setSelectedKPICategory,
  setSelectedKPIDepartment,
  setSelectedKPIStatus,
  setKPISearchTerm,
  
  // Goal Filters
  setSelectedGoalType,
  setSelectedGoalCategory,
  setSelectedGoalDepartment,
  setSelectedGoalAssignedTo,
  
  // Pagination
  setCurrentPage,
  setItemsPerPage,
  
  // Reset
  resetFilters,
  resetKPIFilters,
} = performanceSlice.actions

export default performanceSlice.reducer
