"use client"

import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchUserScorecard } from "@/lib/store/slices/scorecardSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CiUser, CiViewBoard, CiCircleCheck, CiRedo, CiTrophy, CiFileOn } from "react-icons/ci"
import { TbTarget } from "react-icons/tb"
import { toast } from "sonner"
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

const UserScorecardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="h-4 w-80 bg-muted rounded mt-2"></div>
      </div>
      <div className="h-10 w-28 bg-muted rounded"></div>
    </div>
    <div className="grid gap-4 md:grid-cols-4">
      <div className="h-32 bg-muted rounded-2xl"></div>
      <div className="h-32 bg-muted rounded-2xl"></div>
      <div className="h-32 bg-muted rounded-2xl"></div>
      <div className="h-32 bg-muted rounded-2xl"></div>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-96 bg-muted rounded-2xl"></div>
      <div className="h-96 bg-muted rounded-2xl"></div>
    </div>
  </div>
)

export function UserScorecardsPage() {
  const dispatch = useAppDispatch()
  const { userScorecard, loading, error } = useAppSelector((state) => state.scorecard)
  const scorecardRef = useRef<HTMLDivElement>(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [PDFComponents, setPDFComponents] = useState<any>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      dispatch(fetchUserScorecard())
    }
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error("Failed to load user scorecard", { description: error })
    }
  }, [error])

  useEffect(() => {
    setIsClient(true)
    // Dynamically import PDF components only on client
    import("@react-pdf/renderer").then((pdfModule) => {
      import("./user-scorecard-pdf").then((pdfComponent) => {
        setPDFComponents({
          PDFDownloadLink: pdfModule.PDFDownloadLink,
          UserScorecardPDF: pdfComponent.default,
        })
      })
    })
  }, [])

  const handleRefresh = () => {
    hasFetched.current = false
    dispatch(fetchUserScorecard()).finally(() => {
      hasFetched.current = true
    })
  }

  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case "Excellent":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      case "Good":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "Fair":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
      case "Poor":
      case "Unsatisfactory":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
      case "in_progress":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "pending":
        return "bg-amber-500/10 text-amber-700 border-amber-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500"
    if (percentage >= 60) return "bg-blue-500"
    if (percentage >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  if (loading && !userScorecard) return <UserScorecardSkeleton />

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-normal text-balance">Individual Performance Scorecard</h1>
          <p className="text-muted-foreground font-normal mt-1">
            Track your performance metrics and goal achievement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" disabled={loading}>
            <CiRedo className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {isClient && userScorecard && PDFComponents && (
            <PDFComponents.PDFDownloadLink
              document={<PDFComponents.UserScorecardPDF data={userScorecard} />}
              fileName={`${userScorecard.user.name.replace(/\s+/g, "-")}-Scorecard-${new Date()
                .toISOString()
                .split("T")[0]}.pdf`}
            >
              {({ loading: pdfLoading }: any) => (
                <Button variant="outline" disabled={pdfLoading}>
                  <CiFileOn className={`w-4 h-4 mr-2 ${pdfLoading ? "animate-spin" : ""}`} />
                  {pdfLoading ? "Generating..." : "Export PDF"}
                </Button>
              )}
            </PDFComponents.PDFDownloadLink>
          )}
        </div>
      </div>

      <div ref={scorecardRef}>
        {!userScorecard ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <CiUser className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Scorecard Data</h3>
            <p className="text-muted-foreground">Your scorecard data is not yet available.</p>
          </div>
        ) : (
          <>
            {/* User Info Card */}
            <Card className="rounded-2xl bg-muted/30 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <CiUser className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{userScorecard.user.name}</h2>
                    <p className="text-muted-foreground">
                      {userScorecard.user.department || "No Department"}
                      {userScorecard.user.role && ` • ${userScorecard.user.role}`}
                    </p>
                  </div>
                  <Badge
                    className={`${getPerformanceColor(userScorecard.scorecard.finalScore.performanceBand)} text-sm px-4 py-2`}
                  >
                    {userScorecard.scorecard.finalScore.performanceBand}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card className="rounded-2xl gradient-primary text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/80">Total Goals</p>
                      <p className="text-4xl font-bold mt-1">{userScorecard.scorecard.summary.totalGoals}</p>
                      <p className="text-sm text-white/80 mt-2">Assigned goals</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <TbTarget className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-2xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed Goals</p>
                      <p className="text-4xl font-bold mt-1 text-emerald-600">
                        {userScorecard.scorecard.summary.completedGoals}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">Successfully achieved</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <CiCircleCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl gradient-primary text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/80">Total Tasks</p>
                      <p className="text-4xl font-bold mt-1">{userScorecard.scorecard.summary.totalTasks}</p>
                      <p className="text-sm text-white/80 mt-2">
                        {userScorecard.scorecard.summary.completedTasks} completed
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <CiViewBoard className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-2xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Final Score</p>
                      <p className="text-4xl font-bold mt-1 text-primary">{userScorecard.scorecard.finalScore.total}</p>
                      <p className="text-sm text-muted-foreground mt-2">{userScorecard.scorecard.finalScore.rating}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <CiTrophy className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              {/* Performance Sections */}
              <Card className="bg-white rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <CiViewBoard className="w-5 h-5 text-white" />
                    </div>
                    Performance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Results Delivery */}
                  {userScorecard.scorecard.sections.resultsDelivery && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Results Delivery</p>
                          <p className="text-xs text-muted-foreground">
                            {userScorecard.scorecard.sections.resultsDelivery.completionRate}% completion rate
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {userScorecard.scorecard.sections.resultsDelivery.totalScore}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            of {userScorecard.scorecard.sections.resultsDelivery.maxScore}
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={
                          (Number.parseFloat(userScorecard.scorecard.sections.resultsDelivery.totalScore) /
                            userScorecard.scorecard.sections.resultsDelivery.maxScore) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Budget Performance */}
                  {userScorecard.scorecard.sections.budgetPerformance && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Budget Performance</p>
                          <p className="text-xs text-muted-foreground">
                            {userScorecard.scorecard.sections.budgetPerformance.budgetUtilization}% utilization
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {userScorecard.scorecard.sections.budgetPerformance.totalScore}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            of {userScorecard.scorecard.sections.budgetPerformance.maxScore}
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={
                          (Number.parseFloat(userScorecard.scorecard.sections.budgetPerformance.totalScore) /
                            userScorecard.scorecard.sections.budgetPerformance.maxScore) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Charts */}
              <div className="space-y-6">
                {/* Goal Status Distribution */}
                {userScorecard.scorecard.summary.totalGoals > 0 && (
                  <Card className="bg-white rounded-2xl">
                    <CardHeader>
                      <CardTitle>Goal Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Completed",
                                value: userScorecard.scorecard.summary.completedGoals,
                                color: "#10b981",
                              },
                              {
                                name: "In Progress",
                                value:
                                  userScorecard.scorecard.summary.totalGoals -
                                  userScorecard.scorecard.summary.completedGoals,
                                color: "#3b82f6",
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[{ color: "#10b981" }, { color: "#3b82f6" }].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Task Status */}
                {userScorecard.scorecard.summary.totalTasks > 0 && (
                  <Card className="bg-white rounded-2xl">
                    <CardHeader>
                      <CardTitle>Task Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={[
                            {
                              name: "Tasks",
                              Completed: userScorecard.scorecard.summary.completedTasks,
                              Overdue: userScorecard.scorecard.summary.overdueTasks,
                              Pending:
                                userScorecard.scorecard.summary.totalTasks -
                                userScorecard.scorecard.summary.completedTasks -
                                userScorecard.scorecard.summary.overdueTasks,
                            },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Completed" fill="#10b981" />
                          <Bar dataKey="Pending" fill="#3b82f6" />
                          <Bar dataKey="Overdue" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Goals and Tasks */}
            {(userScorecard.goals.length > 0 || userScorecard.tasks.length > 0) && (
              <div className="grid gap-6 lg:grid-cols-2 mb-6">
                {/* Active Goals */}
                {userScorecard.goals.length > 0 && (
                  <Card className="bg-white rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                          <TbTarget className="w-5 h-5 text-white" />
                        </div>
                        Active Goals ({userScorecard.goals.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userScorecard.goals.map((goal) => (
                          <div key={goal.id} className="p-4 rounded-lg bg-muted/50 border space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm leading-tight flex-1">{goal.title}</h4>
                              <Badge variant="outline" className={`${getStatusColor(goal.stage)} text-xs shrink-0`}>
                                {goal.stage.replace("_", " ")}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{goal.progressPercentage}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${getProgressColor(Number.parseFloat(goal.progressPercentage))}`}
                                  style={{ width: `${Math.min(Number.parseFloat(goal.progressPercentage), 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tasks */}
                {userScorecard.tasks.length > 0 && (
                  <Card className="bg-white rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                          <CiCircleCheck className="w-5 h-5 text-white" />
                        </div>
                        Tasks ({userScorecard.tasks.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userScorecard.tasks.map((task: any) => (
                          <div key={task.id} className="p-4 rounded-lg bg-muted/50 border space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm leading-tight flex-1">{task.title}</h4>
                              <Badge variant="outline" className={`${getStatusColor(task.stage)} text-xs shrink-0`}>
                                {task.stage.replace("_", " ")}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <Badge variant="outline" className="text-xs">
                                {task.priority} priority
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Due: {new Date(task.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Performance Summary */}
            <Card className="rounded-2xl bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CiTrophy className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Performance Summary</p>
                    <p className="text-sm text-muted-foreground mt-1">{userScorecard.scorecard.finalScore.rating}</p>
                  </div>
                  <Badge
                    className={`${getPerformanceColor(userScorecard.scorecard.finalScore.performanceBand)} text-sm px-4 py-2`}
                  >
                    {userScorecard.scorecard.finalScore.performanceBand}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
