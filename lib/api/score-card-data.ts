import type { DepartmentScorecard, UserScorecard } from "../store/slices/performanceSlice"

// Mock API for department scorecards
export const scorecardAPI = {
  getDepartmentScorecard: async (departmentName: string): Promise<DepartmentScorecard> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock data
    const mockScorecards: Record<string, DepartmentScorecard> = {
      Finance: {
        departmentId: "dept_001",
        departmentName: "Finance",
        totalGoals: 3,
        completedGoals: 1,
        inProgressGoals: 2,
        overdueGoals: 0,
        averageProgress: 45.5,
        performanceRating: "Good",
        goals: [
          {
            id: "goal_002",
            title: "Finance: Achieve $2M AUM Growth",
            description: "Finance department responsible for $2M of the $5M AUM target",
            type: "department",
            category: "financial",
            targetValue: 2000000,
            currentValue: 800000,
            targetUnit: "USD",
            progressPercentage: 40,
            status: "active",
            stage: "execution",
            priority: "high",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            departmentId: "dept_001",
            departmentName: "Finance",
            targetOperator: ">=",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        teamMembers: [
          {
            userId: "user_001",
            name: "John Doe",
            totalTasks: 5,
            completedTasks: 2,
            inProgressTasks: 3,
            performanceRating: "Good",
          },
          {
            userId: "user_002",
            name: "Jane Smith",
            totalTasks: 8,
            completedTasks: 6,
            inProgressTasks: 2,
            performanceRating: "Excellent",
          },
        ],
      },
      Sales: {
        departmentId: "dept_002",
        departmentName: "Sales",
        totalGoals: 2,
        completedGoals: 0,
        inProgressGoals: 2,
        overdueGoals: 0,
        averageProgress: 64,
        performanceRating: "Good",
        goals: [
          {
            id: "goal_003",
            title: "Sales: Acquire 50 New Clients",
            description: "Sales department to acquire 50 new clients",
            type: "department",
            category: "sales",
            targetValue: 50,
            currentValue: 32,
            targetUnit: "clients",
            progressPercentage: 64,
            status: "active",
            stage: "execution",
            priority: "high",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            departmentId: "dept_002",
            departmentName: "Sales",
            targetOperator: ">=",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        teamMembers: [
          {
            userId: "user_003",
            name: "Mike Johnson",
            totalTasks: 12,
            completedTasks: 8,
            inProgressTasks: 4,
            performanceRating: "Excellent",
          },
        ],
      },
      Operations: {
        departmentId: "dept_003",
        departmentName: "Operations",
        totalGoals: 4,
        completedGoals: 2,
        inProgressGoals: 2,
        overdueGoals: 0,
        averageProgress: 72,
        performanceRating: "Excellent",
        goals: [],
        teamMembers: [
          {
            userId: "user_004",
            name: "Sarah Williams",
            totalTasks: 10,
            completedTasks: 9,
            inProgressTasks: 1,
            performanceRating: "Excellent",
          },
        ],
      },
    }

    return mockScorecards[departmentName] || mockScorecards.Finance
  },

  getAllDepartmentScorecards: async (): Promise<DepartmentScorecard[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const departments = ["Finance", "Sales", "Operations"]
    return Promise.all(departments.map((dept) => scorecardAPI.getDepartmentScorecard(dept)))
  },

  getUserScorecard: async (userId: string): Promise<UserScorecard> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      userId: "user_001",
      userName: "John Doe",
      department: "Finance",
      totalGoals: 2,
      completedGoals: 0,
      inProgressGoals: 2,
      overdueGoals: 0,
      averageProgress: 45.5,
      performanceRating: "Good",
      goals: [
        {
          id: "goal_005",
          title: "Finance Manager: Process $2M in AUM Transactions",
          description: "Finance Manager responsible for processing $2M in AUM transactions",
          type: "individual",
          category: "financial",
          targetValue: 2000000,
          currentValue: 500000,
          targetUnit: "USD",
          progressPercentage: 25,
          status: "active",
          stage: "execution",
          priority: "high",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          departmentId: "dept_001",
          departmentName: "Finance",
          assignedUserId: "user_001",
          assignedUserName: "John Doe",
          targetOperator: ">=",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      tasks: [
        {
          id: "task_001",
          title: "Process AUM Transaction Batch 1",
          description: "Process first batch of $500K AUM transactions",
          assignedUserId: "user_001",
          assignedUserName: "John Doe",
          goalId: "goal_005",
          isPerformanceTask: true,
          status: "completed",
          priority: "high",
          progress: 100,
          dueDate: "2024-01-15",
          completedAt: "2024-01-15T16:00:00.000Z",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "task_002",
          title: "Process AUM Transaction Batch 2",
          description: "Process second batch of $500K AUM transactions",
          assignedUserId: "user_001",
          assignedUserName: "John Doe",
          goalId: "goal_005",
          isPerformanceTask: true,
          status: "in_progress",
          priority: "high",
          progress: 50,
          dueDate: "2024-01-30",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }
  },
}
