"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setDepartmentScorecards, setLoading, setError } from "@/lib/store/slices/testPerfomanceSlice"
// import { scorecardAPI } from "@/lib/api/scorecard-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CiViewBoard, CiUser, CiRedo } from "react-icons/ci"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { scorecardAPI } from "@/lib/api/score-card-data"

export function DepartmentScorecardsPage() {
  const dispatch = useAppDispatch()
  const { departmentScorecards, departments, loading } = useAppSelector((state) => state.testPerfomance)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  useEffect(() => {
    loadScorecards()
  }, [])

  const loadScorecards = async () => {
    try {
      dispatch(setLoading(true))
      const scorecards = await scorecardAPI.getAllDepartmentScorecards()
      dispatch(setDepartmentScorecards(scorecards))
      dispatch(setError(null))
    } catch (error: any) {
      dispatch(setError(error.message || "Failed to load department scorecards"))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const filteredScorecards =
    selectedDepartment === "all"
      ? departmentScorecards
      : departmentScorecards.filter((s) => s.departmentName === selectedDepartment)

  const comparisonData = departmentScorecards.map((scorecard) => ({
    department: scorecard.departmentName,
    completed: scorecard.completedGoals,
    inProgress: scorecard.inProgressGoals,
    overdue: scorecard.overdueGoals,
  }))

  const radarData = departmentScorecards.map((scorecard) => ({
    department: scorecard.departmentName,
    progress: scorecard.averageProgress,
  }))

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

  if (loading) return <div className="p-6">Loading department scorecards...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Department Scorecards</h1>
          <p className="text-gray-600 font-normal">
            Track and compare department-level performance metrics and goal achievement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={loadScorecards}
            variant="outline"
            className="rounded-full bg-gradient-to-br from-gray-50 to-gray-100"
          >
            <CiRedo className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl">
          <CardHeader>
            <CardTitle>Department Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                <Bar dataKey="overdue" fill="#ef4444" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader>
            <CardTitle>Average Progress by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="department" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Progress %" dataKey="progress" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScorecards.map((scorecard) => (
          <Card key={scorecard.departmentId} className="bg-white rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{scorecard.departmentName}</CardTitle>
                <Badge className={getPerformanceColor(scorecard.performanceRating)}>
                  {scorecard.performanceRating}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <p className="text-xs text-blue-600 mb-1">Total Goals</p>
                  <p className="text-2xl font-bold text-blue-900">{scorecard.totalGoals}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <p className="text-xs text-green-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{scorecard.completedGoals}</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <p className="text-xs text-yellow-600 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-900">{scorecard.inProgressGoals}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <p className="text-xs text-red-600 mb-1">Overdue</p>
                  <p className="text-2xl font-bold text-red-900">{scorecard.overdueGoals}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Average Progress</span>
                  <span className="text-sm font-medium">{scorecard.averageProgress.toFixed(1)}%</span>
                </div>
                <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${scorecard.averageProgress}%` }}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <CiUser className="w-4 h-4" />
                  Team Members ({scorecard.teamMembers.length})
                </h4>
                <div className="space-y-2">
                  {scorecard.teamMembers.slice(0, 3).map((member) => (
                    <div key={member.userId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{member.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {member.completedTasks}/{member.totalTasks}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {member.performanceRating}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {scorecard.goals.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <CiViewBoard className="w-4 h-4" />
                    Active Goals ({scorecard.goals.length})
                  </h4>
                  <div className="space-y-2">
                    {scorecard.goals.slice(0, 2).map((goal) => (
                      <div key={goal.id} className="p-2 rounded-lg bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{goal.progressPercentage}% complete</span>
                          <Badge variant="outline" className="text-xs">
                            {goal.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredScorecards.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
            <CiViewBoard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scorecards Found</h3>
          <p className="text-gray-600">No department scorecards available for the selected filter.</p>
        </div>
      )}
    </div>
  )
}
