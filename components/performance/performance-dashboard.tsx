"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setLoading, setError, setKPIs, setGoals, setTasks } from "@/lib/store/slices/performanceSlice"
import { performanceAPI } from "@/lib/api/performance-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  CiCircleCheck,
  CiCircleMinus,
  CiViewTimeline,
  CiViewBoard,
  CiGrid41
} from "react-icons/ci"

export function PerformanceDashboard() {
  const dispatch = useAppDispatch()
  const { kpis, goals, tasks, loading, error, metrics } = useAppSelector((state) => (state as any).performance)

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

  if (loading) return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`rounded-2xl ${i % 2 === 0 ? 'gradient-primary p-4' : 'bg-white p-4'}`}>
            <div className="flex items-center justify-between mb-3">
              <Skeleton className={`${i % 2 === 0 ? 'bg-white/30' : ''} h-4 w-24`} />
              <div className={`w-8 h-8 rounded-full ${i % 2 === 0 ? 'bg-white/20' : 'bg-gray-100'}`} />
            </div>
            <Skeleton className={`${i % 2 === 0 ? 'bg-white/30' : ''} h-10 w-24`} />
            <Skeleton className={`${i % 2 === 0 ? 'bg-white/20' : ''} h-2 w-full mt-3`} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full gradient-primary" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="rounded-2xl border border-gray-200 p-4">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-56 mb-3" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, k) => (
              <div key={k} className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-48 mb-1" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  const totalKPIs = kpis?.length || 0
  const activeKPIs = (kpis || []).filter((k: any) => k.isActive).length
  const completedGoals = (goals || []).filter((g: any) => g.status === "completed").length
  const totalGoals = goals?.length || 0
  const completedTasks = (tasks || []).filter((t: any) => t.status === "completed").length
  const totalTasks = tasks?.length || 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CiCircleCheck className="w-4 h-4" />
      case 'in_progress': return <CiCircleMinus className="w-4 h-4" />
      case 'not_started': return <CiCircleMinus className="w-4 h-4" />
      case 'cancelled': return <CiCircleMinus className="w-4 h-4" />
      default: return <CiCircleMinus className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl text-gray-900 mb-2">Performance Management Dashboard</h1>
        <p className="text-gray-600 font-normal">Overview of key performance indicators, goals, and tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
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
            <div className="text-4xl">{completedGoals}/{totalGoals}</div>
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
            <div className="text-4xl">{completedTasks}/{totalTasks}</div>
            <div className="relative mt-2 h-2 rounded-full bg-white/30 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-white via-white to-white/70"
                style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-white/80 mt-1">
              {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0}% completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* KPIs Section */}
      <Card className="bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <CiGrid41 className="w-5 h-5 text-white" />
            </div>
            Key Performance Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(kpis || []).slice(0, 6).map((kpi: any) => (
              <div key={kpi.id} className="rounded-2xl p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{kpi.name}</p>
                    <p className="text-sm text-muted-foreground">{kpi.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Current: {kpi.currentValue}{kpi.unit}</span>
                  <span>Target: {kpi.targetValue}{kpi.unit}</span>
                </div>
                <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${(kpi.currentValue / kpi.targetValue) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  {(kpi.currentValue >= kpi.targetValue) ? (
                    <CiCircleCheck className="w-4 h-4 text-green-600" />
                  ) : (
                    <CiCircleMinus className="w-4 h-4 text-red-600" />
                  )}
                  <span className={kpi.currentValue >= kpi.targetValue ? "text-green-600" : "text-red-600"}>
                    {kpi.currentValue >= kpi.targetValue ? "On Track" : "Behind Target"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals & Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent KPIs</CardTitle>
            <Link href="/performance/kpis">
              <Button variant="outline" size="sm" className="rounded-full">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(kpis || []).slice(0, 5).map((kpi: any) => (
                <li key={kpi.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{kpi.name}</p>
                    <p className="text-sm text-muted-foreground">{kpi.description}</p>
                  </div>
                  <span className={`${kpi.currentValue >= kpi.targetValue ? "text-green-600" : "text-orange-600"} text-sm font-semibold`}>
                    {kpi.currentValue}{kpi.unit} / {kpi.targetValue}{kpi.unit}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Goals & Tasks</CardTitle>
            <Link href="/performance/goals">
              <Button variant="outline" size="sm" className="rounded-full">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[...(goals || []).slice(0, 3), ...(tasks || []).slice(0, 2)]
                .sort((a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
                .map((item: any) => (
                <li key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${item.status === "completed" ? "text-green-600" : item.status === "overdue" ? "text-red-600" : "text-blue-600"}`}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
