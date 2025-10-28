"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setLoading, setError, setKPIs, setGoals, setTasks } from "@/lib/store/slices/performanceSlice"
import { performanceAPI } from "@/lib/api/performance-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CiCircleCheck, CiViewTimeline, CiViewBoard, CiGrid41, CiUser, CiCalendar } from "react-icons/ci"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export function PerformanceDashboard() {
  const dispatch = useAppDispatch()
  const { kpis, goals, tasks, loading, error } = useAppSelector((state) => state.performance)

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true))
      try {
        const fetchedKPIs = await performanceAPI.getKPIs()
        dispatch(setKPIs(fetchedKPIs))
        const fetchedGoals = await performanceAPI.getGoals()
        dispatch(setGoals(fetchedGoals))
        const fetchedTasks = await performanceAPI.getTasks()
        dispatch(setTasks(fetchedTasks))
        dispatch(setError(null))
      } catch (err) {
        dispatch(setError("Failed to fetch performance data."))
        console.error(err)
      } finally {
        dispatch(setLoading(false))
      }
    }
    fetchData()
  }, [dispatch])

  const totalKPIs = kpis?.length || 0
  const activeKPIs = (kpis || []).filter((k: any) => k.isActive).length
  const completedGoals = (goals || []).filter((g: any) => g.status === "completed").length
  const totalGoals = goals?.length || 0
  const completedTasks = (tasks || []).filter((t: any) => t.status === "completed").length
  const totalTasks = tasks?.length || 0

  const companyGoals = (goals || []).filter((g: any) => g.type === "company")
  const departmentGoals = (goals || []).filter((g: any) => g.type === "department")
  const individualGoals = (goals || []).filter((g: any) => g.type === "individual")

  // Mock data for charts
  const rsvpTrendData = [
    { month: "Jan", rate: 65 },
    { month: "Feb", rate: 72 },
    { month: "Mar", rate: 78 },
    { month: "Apr", rate: 85 },
    { month: "May", rate: 88 },
    { month: "Jun", rate: 92 },
  ]

  const goalProgressData = [
    {
      type: "Company",
      total: companyGoals.length,
      completed: companyGoals.filter((g) => g.status === "completed").length,
    },
    {
      type: "Department",
      total: departmentGoals.length,
      completed: departmentGoals.filter((g) => g.status === "completed").length,
    },
    {
      type: "Individual",
      total: individualGoals.length,
      completed: individualGoals.filter((g) => g.status === "completed").length,
    },
  ]

  // Recent activity
  const recentActivity = [
    { id: 1, type: "goal", title: "New company goal created", time: "2 hours ago", user: "Executive Team" },
    { id: 2, type: "task", title: "Task completed: Process AUM Batch 1", time: "5 hours ago", user: "John Doe" },
    { id: 3, type: "kpi", title: "KPI updated: Client Acquisition Rate", time: "1 day ago", user: "Sales Team" },
    { id: 4, type: "goal", title: "Department goal achieved", time: "2 days ago", user: "Finance Dept" },
  ]

  // Upcoming deadlines
  const upcomingDeadlines = (goals || [])
    .filter((g: any) => g.status === "active")
    .sort((a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 5)

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="p-6 space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl text-gray-900 mb-2">Performance Management Dashboard</h1>
        <p className="text-gray-600 font-normal">
          Comprehensive overview of organizational performance, goals, and key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
        <Card className="rounded-2xl gradient-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total KPIs</CardTitle>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <CiViewTimeline className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl">{totalKPIs}</div>
            <p className="text-xs text-white/80">{activeKPIs} active</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <CiViewBoard className="h-4 w-4 text-gray-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl">
              {completedGoals}/{totalGoals}
            </div>
            <div className="relative mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                style={{ width: `${totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(0) : 0}% completed
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl gradient-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Tasks Completion</CardTitle>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <CiCircleCheck className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl">
              {completedTasks}/{totalTasks}
            </div>
            <div className="relative mt-2 h-2 rounded-full bg-white/30 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white"
                style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-white/80 mt-1">
              {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0}% completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department Performance</CardTitle>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <CiUser className="h-4 w-4 text-gray-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl">{departmentGoals.length}</div>
            <p className="text-xs text-muted-foreground">Active department goals</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <CiViewBoard className="w-5 h-5 text-white" />
            </div>
            Goal Hierarchy Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-blue-900">Company Goals</h3>
                  <Badge className="bg-blue-600 text-white">{companyGoals.length}</Badge>
                </div>
                <p className="text-sm text-blue-700">Strategic organizational objectives</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-purple-900">Department Goals</h3>
                  <Badge className="bg-purple-600 text-white">{departmentGoals.length}</Badge>
                </div>
                <p className="text-sm text-purple-700">Departmental targets and KPIs</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-green-900">Individual Goals</h3>
                  <Badge className="bg-green-600 text-white">{individualGoals.length}</Badge>
                </div>
                <p className="text-sm text-green-700">Personal performance goals</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl">
          <CardHeader>
            <CardTitle>Goal Progress by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={goalProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8b5cf6" name="Total Goals" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rsvpTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} name="Completion Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link href="/performance/tasks">
              <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    {activity.type === "goal" && <CiViewBoard className="w-4 h-4 text-white" />}
                    {activity.type === "task" && <CiCircleCheck className="w-4 h-4 text-white" />}
                    {activity.type === "kpi" && <CiViewTimeline className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Deadlines</CardTitle>
            <Link href="/performance/goals">
              <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {upcomingDeadlines.map((goal: any) => (
                <li key={goal.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <CiCalendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">{goal.departmentName || "Company"}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(goal.endDate).toLocaleDateString()}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/performance/kpis">
              <Button variant="outline" className="w-full rounded-full bg-white hover:bg-gray-50">
                <CiViewTimeline className="w-4 h-4 mr-2" />
                Manage KPIs
              </Button>
            </Link>
            <Link href="/performance/goals">
              <Button variant="outline" className="w-full rounded-full bg-white hover:bg-gray-50">
                <CiViewBoard className="w-4 h-4 mr-2" />
                View Goals
              </Button>
            </Link>
            <Link href="/performance/department-scorecards">
              <Button variant="outline" className="w-full rounded-full bg-white hover:bg-gray-50">
                <CiGrid41 className="w-4 h-4 mr-2" />
                Department Scorecards
              </Button>
            </Link>
            <Link href="/performance/user-scorecards">
              <Button variant="outline" className="w-full rounded-full bg-white hover:bg-gray-50">
                <CiUser className="w-4 h-4 mr-2" />
                User Scorecards
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
