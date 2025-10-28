"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setUserScorecards, setLoading, setError } from "@/lib/store/slices/testPerfomanceSlice"
// import { scorecardAPI } from "@/lib/api/scorecard-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CiUser, CiViewBoard, CiCircleCheck, CiRedo } from "react-icons/ci"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { scorecardAPI } from "@/lib/api/score-card-data"

export function UserScorecardsPage() {
  const dispatch = useAppDispatch()
  const { userScorecards, loading } = useAppSelector((state) => state.testPerfomance)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  useEffect(() => {
    loadUserScorecard()
  }, [])

  const loadUserScorecard = async () => {
    try {
      dispatch(setLoading(true))
      const scorecard = await scorecardAPI.getUserScorecard("user_001")
      dispatch(setUserScorecards([scorecard]))
      dispatch(setError(null))
    } catch (error: any) {
      dispatch(setError(error.message || "Failed to load user scorecards"))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const currentScorecard = userScorecards[0]

  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case "Excellent":
        return "bg-green-100 text-green-800"
      case "Good":
        return "bg-blue-100 text-blue-800"
      case "Fair":
        return "bg-yellow-100 text-yellow-800"
      case "Poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) return <div className="p-6">Loading user scorecards...</div>
  if (!currentScorecard) return <div className="p-6">No scorecard data available</div>

  const goalStatusData = [
    { name: "Completed", value: currentScorecard.completedGoals, color: "#10b981" },
    { name: "In Progress", value: currentScorecard.inProgressGoals, color: "#3b82f6" },
    { name: "Overdue", value: currentScorecard.overdueGoals, color: "#ef4444" },
  ]

  const taskProgressData = currentScorecard.tasks.map((task) => ({
    name: task.title.substring(0, 20) + "...",
    progress: task.progress,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">User Scorecards</h1>
          <p className="text-gray-600 font-normal">Track individual performance metrics, goals, and task completion</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadUserScorecard}
            variant="outline"
            className="rounded-full bg-gradient-to-br from-gray-50 to-gray-100"
          >
            <CiRedo className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <CiUser className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{currentScorecard.userName}</h2>
              <p className="text-gray-600">{currentScorecard.department} Department</p>
            </div>
            <Badge className={getPerformanceColor(currentScorecard.performanceRating)} className="text-lg px-4 py-2">
              {currentScorecard.performanceRating}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <CiViewBoard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentScorecard.totalGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">Assigned goals</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
            <CiCircleCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{currentScorecard.completedGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully achieved</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <CiViewBoard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{currentScorecard.inProgressGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently working on</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <CiViewBoard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{currentScorecard.averageProgress.toFixed(1)}%</div>
            <div className="relative mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                style={{ width: `${currentScorecard.averageProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl">
          <CardHeader>
            <CardTitle>Goal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {goalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="progress" fill="#8b5cf6" name="Progress %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CiViewBoard className="w-5 h-5" />
              Active Goals ({currentScorecard.goals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentScorecard.goals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Target:</span>
                      <span className="font-medium">
                        {goal.targetValue} {goal.targetUnit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Current:</span>
                      <span className="font-medium">
                        {goal.currentValue} {goal.targetUnit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Progress:</span>
                      <span className="font-medium">{goal.progressPercentage}%</span>
                    </div>
                    <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden mt-2">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <Badge variant="outline" className="text-xs">
                      {goal.priority} priority
                    </Badge>
                    <span className="text-xs text-gray-500">Due: {new Date(goal.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CiCircleCheck className="w-5 h-5" />
              Tasks ({currentScorecard.tasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentScorecard.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Progress:</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-blue-500"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <Badge variant="outline" className="text-xs">
                      {task.priority} priority
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {task.completedAt
                        ? `Completed: ${new Date(task.completedAt).toLocaleDateString()}`
                        : `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
