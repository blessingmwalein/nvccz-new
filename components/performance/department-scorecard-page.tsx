"use client"

import { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchDepartmentScorecard } from "@/lib/store/slices/scorecardSlice"
import { fetchAvailableDepartments } from "@/lib/store/slices/performanceSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CiViewBoard, CiUser, CiRedo, CiTrophy, CiFileOn } from "react-icons/ci"
import { TbTarget } from "react-icons/tb"
import { toast } from "sonner"

const DepartmentScorecardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-64 bg-muted rounded"></div>
        <div className="h-4 w-96 bg-muted rounded mt-2"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-10 w-48 bg-muted rounded"></div>
        <div className="h-10 w-28 bg-muted rounded"></div>
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <div className="h-32 bg-muted rounded-xl"></div>
      <div className="h-32 bg-muted rounded-xl"></div>
      <div className="h-32 bg-muted rounded-xl"></div>
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <div className="h-96 bg-muted rounded-xl"></div>
      <div className="h-96 bg-muted rounded-xl"></div>
    </div>
  </div>
)

export function DepartmentScorecardsPage() {
  const dispatch = useAppDispatch()
  const { departmentScorecard, loading, error } = useAppSelector((state) => state.scorecard)
  const { availableDepartments } = useAppSelector((state) => state.performance)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [isClient, setIsClient] = useState(false)
  const [PDFComponents, setPDFComponents] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    // Dynamically import PDF components only on client
    import("@react-pdf/renderer").then((pdfModule) => {
      import("./department-scorecard-pdf").then((pdfComponent) => {
        setPDFComponents({
          PDFDownloadLink: pdfModule.PDFDownloadLink,
          DepartmentScorecardPDF: pdfComponent.default,
        })
      })
    })
  }, [])

  useEffect(() => {
    dispatch(fetchAvailableDepartments())
  }, [dispatch])

  useEffect(() => {
    if (availableDepartments.length > 0 && !selectedDepartment) {
      setSelectedDepartment(availableDepartments[0].name)
    }
  }, [availableDepartments, selectedDepartment])

  useEffect(() => {
    if (selectedDepartment) {
      dispatch(fetchDepartmentScorecard(selectedDepartment))
    }
  }, [selectedDepartment, dispatch])

  useEffect(() => {
    if (error) {
      toast.error("Failed to load scorecard", { description: error })
    }
  }, [error])

  const handleRefresh = () => {
    if (selectedDepartment) {
      dispatch(fetchDepartmentScorecard(selectedDepartment))
    }
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

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-emerald-600 dark:text-emerald-400"
    if (percentage >= 60) return "text-blue-600 dark:text-blue-400"
    if (percentage >= 40) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500"
    if (percentage >= 60) return "bg-blue-500"
    if (percentage >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  if (loading && !departmentScorecard) return <DepartmentScorecardSkeleton />

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-normal text-balance">Department Performance Scorecard</h1>
          <p className="text-muted-foreground font-normal mt-1">
            Comprehensive performance metrics and goal achievement tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {availableDepartments?.map((dept: any) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" disabled={loading}>
            <CiRedo className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {isClient && departmentScorecard && PDFComponents && (
            <PDFComponents.PDFDownloadLink
              document={<PDFComponents.DepartmentScorecardPDF data={departmentScorecard} />}
              fileName={`${departmentScorecard.department.replace(/\s+/g, "-")}-Scorecard-${new Date()
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

      {!departmentScorecard ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <CiViewBoard className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Scorecard Found</h3>
          <p className="text-muted-foreground">
            {selectedDepartment
              ? `No scorecard data available for the ${selectedDepartment} department.`
              : "Please select a department to view its scorecard."}
          </p>
        </div>
      ) : (
        <>
          {/* Performance Overview Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl gradient-primary text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">Overall Score</p>
                    <p className="text-4xl font-normal mt-1">{departmentScorecard.scorecard.finalScore.total}</p>
                    <Badge className="mt-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
                      {departmentScorecard.scorecard.finalScore.performanceBand}
                    </Badge>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <CiTrophy className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                    <p className="text-4xl font-normal mt-1">{departmentScorecard.scorecard.summary.totalGoals}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {departmentScorecard.scorecard.summary.completedGoals} completed
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <TbTarget className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl gradient-primary text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">Team Members</p>
                    <p className="text-4xl font-normal mt-1">{departmentScorecard.scorecard.summary.totalUsers}</p>
                    <p className="text-sm text-white/80 mt-2">
                      {departmentScorecard.scorecard.summary.managers} managers,{" "}
                      {departmentScorecard.scorecard.summary.officers} officers
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <CiUser className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Scorecard Sections */}
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
                {/* Outcomes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Outcomes</p>
                      <p className="text-xs text-muted-foreground">
                        {departmentScorecard.scorecard.sections.outcomes.outcomeGoals} goals •{" "}
                        {departmentScorecard.scorecard.sections.outcomes.completionRate}% complete
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-normal ${getScoreColor(
                          Number.parseFloat(departmentScorecard.scorecard.sections.outcomes.totalScore),
                          departmentScorecard.scorecard.sections.outcomes.maxScore
                        )}`}
                      >
                        {departmentScorecard.scorecard.sections.outcomes.totalScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        of {departmentScorecard.scorecard.sections.outcomes.maxScore}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={
                      (Number.parseFloat(departmentScorecard.scorecard.sections.outcomes.totalScore) /
                        departmentScorecard.scorecard.sections.outcomes.maxScore) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* Outputs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Outputs</p>
                      <p className="text-xs text-muted-foreground">
                        {departmentScorecard.scorecard.sections.outputs.outputGoals} goals •{" "}
                        {departmentScorecard.scorecard.sections.outputs.completionRate}% complete
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-normal ${getScoreColor(
                          Number.parseFloat(departmentScorecard.scorecard.sections.outputs.totalScore),
                          departmentScorecard.scorecard.sections.outputs.maxScore
                        )}`}
                      >
                        {departmentScorecard.scorecard.sections.outputs.totalScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        of {departmentScorecard.scorecard.sections.outputs.maxScore}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={
                      (Number.parseFloat(departmentScorecard.scorecard.sections.outputs.totalScore) /
                        departmentScorecard.scorecard.sections.outputs.maxScore) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* Service Delivery */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Service Delivery</p>
                      <p className="text-xs text-muted-foreground">
                        {departmentScorecard.scorecard.sections.serviceDelivery.serviceGoals} goals •{" "}
                        {departmentScorecard.scorecard.sections.serviceDelivery.userSatisfaction}% satisfaction
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-normal ${getScoreColor(
                          Number.parseFloat(departmentScorecard.scorecard.sections.serviceDelivery.totalScore),
                          departmentScorecard.scorecard.sections.serviceDelivery.maxScore
                        )}`}
                      >
                        {departmentScorecard.scorecard.sections.serviceDelivery.totalScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        of {departmentScorecard.scorecard.sections.serviceDelivery.maxScore}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={
                      (Number.parseFloat(departmentScorecard.scorecard.sections.serviceDelivery.totalScore) /
                        departmentScorecard.scorecard.sections.serviceDelivery.maxScore) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* Management */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Management</p>
                      <p className="text-xs text-muted-foreground">Financial & Organizational Capacity</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-normal ${getScoreColor(
                          Number.parseFloat(departmentScorecard.scorecard.sections.management.totalScore),
                          departmentScorecard.scorecard.sections.management.maxScore
                        )}`}
                      >
                        {departmentScorecard.scorecard.sections.management.totalScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        of {departmentScorecard.scorecard.sections.management.maxScore}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={
                      (Number.parseFloat(departmentScorecard.scorecard.sections.management.totalScore) /
                        departmentScorecard.scorecard.sections.management.maxScore) *
                      100
                    }
                    className="h-2"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2 pl-4">
                    <div className="text-xs">
                      <p className="text-muted-foreground">Financial</p>
                      <p className="font-medium">
                        {departmentScorecard.scorecard.sections.management.financialManagement.score}/
                        {departmentScorecard.scorecard.sections.management.financialManagement.maxScore}
                      </p>
                    </div>
                    <div className="text-xs">
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium">
                        {departmentScorecard.scorecard.sections.management.organizationalCapacity.score}/
                        {departmentScorecard.scorecard.sections.management.organizationalCapacity.maxScore}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cross-Cutting */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Cross-Cutting Priorities</p>
                      <p className="text-xs text-muted-foreground">
                        {departmentScorecard.scorecard.sections.crossCutting.priorities.join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-normal ${getScoreColor(
                          Number.parseFloat(departmentScorecard.scorecard.sections.crossCutting.totalScore),
                          departmentScorecard.scorecard.sections.crossCutting.maxScore
                        )}`}
                      >
                        {departmentScorecard.scorecard.sections.crossCutting.totalScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        of {departmentScorecard.scorecard.sections.crossCutting.maxScore}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={
                      (Number.parseFloat(departmentScorecard.scorecard.sections.crossCutting.totalScore) /
                        departmentScorecard.scorecard.sections.crossCutting.maxScore) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Goals & Team */}
            <div className="space-y-6">
              {/* Goals */}
              {departmentScorecard.goals.length > 0 && (
                <Card className="bg-white rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                        <TbTarget className="w-5 h-5 text-white" />
                      </div>
                      Department Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {departmentScorecard.goals.map((goal) => (
                      <div key={goal.id} className="p-4 rounded-lg bg-muted/50 border space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm leading-tight">{goal.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {goal.kpi.unitPosition === "prefix" ? goal.kpi.unitSymbol : ""}
                              {Number.parseFloat(goal.currentValue).toLocaleString()}
                              {goal.kpi.unitPosition === "suffix" ? goal.kpi.unitSymbol : ""} /{" "}
                              {goal.kpi.unitPosition === "prefix" ? goal.kpi.unitSymbol : ""}
                              {Number.parseFloat(goal.targetValue).toLocaleString()}
                              {goal.kpi.unitPosition === "suffix" ? goal.kpi.unitSymbol : ""}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {goal.stage.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              {Number.parseFloat(goal.progressPercentage).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${getProgressColor(Number.parseFloat(goal.progressPercentage))}`}
                              style={{ width: `${Math.min(Number.parseFloat(goal.progressPercentage), 100)}%` }}
                            />
                          </div>
                        </div>
                        {goal.individualGoals && goal.individualGoals.length > 0 && (
                          <div className="pt-2 border-t">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Individual Contributors ({goal.individualGoals.length})
                            </p>
                            <div className="space-y-1">
                              {goal.individualGoals.slice(0, 3).map((indGoal) => (
                                <div key={indGoal.id} className="flex items-center justify-between text-xs">
                                  <span className="truncate">
                                    {indGoal.assignedTo.firstName} {indGoal.assignedTo.lastName}
                                  </span>
                                  <span className="text-muted-foreground ml-2">
                                    {Number.parseFloat(indGoal.progressPercentage).toFixed(0)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Team Members */}
              <Card className="bg-white rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <CiUser className="w-5 h-5 text-white" />
                    </div>
                    Team Members ({departmentScorecard.users.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departmentScorecard.users.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performance Summary */}
          <Card className="rounded-2xl bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CiTrophy className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{departmentScorecard.scorecard.finalScore.rating}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {departmentScorecard.scorecard.finalScore.performanceBand}
                  </p>
                </div>
                <Badge
                  className={`${getPerformanceColor(departmentScorecard.scorecard.finalScore.performanceBand)} text-sm px-4 py-2`}
                >
                  Performance Summary
                </Badge>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}