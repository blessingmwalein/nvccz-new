import { KPI, Department, PerformanceGoal, Task, PerformanceMetrics } from "@/lib/store/slices/performanceSlice"

// Mock Data for KPIs
export const mockKPIs: KPI[] = [
  {
    id: "kpi_1",
    name: "Deal Conversion Rate",
    description: "Percentage of deals that convert from initial contact to closed",
    type: "Percentage",
    unit: "%",
    targetValue: 25.0,
    currentValue: 18.5,
    category: "sales",
    frequency: "monthly",
    departmentId: "dept_1",
    weightValue: 0.3,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "kpi_2",
    name: "Portfolio IRR",
    description: "Internal Rate of Return for the entire portfolio",
    type: "Percentage",
    unit: "%",
    targetValue: 15.0,
    currentValue: 12.3,
    category: "financial",
    frequency: "quarterly",
    departmentId: "dept_1",
    weightValue: 0.4,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "kpi_3",
    name: "Deal Sourcing Volume",
    description: "Number of new deals sourced per month",
    type: "Number",
    unit: "deals",
    targetValue: 50,
    currentValue: 42,
    category: "operational",
    frequency: "monthly",
    departmentId: "dept_2",
    weightValue: 0.2,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "kpi_4",
    name: "Due Diligence Completion Time",
    description: "Average time to complete due diligence process",
    type: "Number",
    unit: "days",
    targetValue: 30,
    currentValue: 35,
    category: "operational",
    frequency: "monthly",
    departmentId: "dept_2",
    weightValue: 0.1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

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

// API Service Functions (Mock implementations)
export const performanceAPI = {
  // KPI APIs
  getKPIs: async (): Promise<KPI[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    return mockKPIs
  },
  
  createKPI: async (kpi: Omit<KPI, 'id' | 'createdAt' | 'updatedAt'>): Promise<KPI> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newKPI: KPI = {
      ...kpi,
      id: `kpi_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newKPI
  },
  
  updateKPI: async (id: string, updates: Partial<KPI>): Promise<KPI> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const kpi = mockKPIs.find(k => k.id === id)
    if (!kpi) throw new Error('KPI not found')
    return { ...kpi, ...updates, updatedAt: new Date().toISOString() }
  },
  
  deleteKPI: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    // Mock deletion
  },
  
  // Department APIs
  getDepartments: async (): Promise<Department[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDepartments
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
