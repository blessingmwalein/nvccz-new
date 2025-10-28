"use client"

import { useState } from "react"
import { useAppSelector } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  CiEdit,
  CiTrash,
  CiSearch,
  CiFlag1 as CiFlag,
  CiCirclePlus as CiPlus,
  CiCircleCheck as CiTarget,
  CiCircleCheck,
  CiRedo,
  CiViewList,
} from "react-icons/ci"
import { toast } from "sonner"
import { Drawer } from "../ui/drawer"
import { GoalFormModal } from "./goal-form-modal"
// import { Drawer, FormModal } from "@/components/ui"

export function GoalsManagement() {
  const { goals, departments } = useAppSelector((state) => state.testPerfomance)

  const [activeTab, setActiveTab] = useState<"all" | "company" | "department" | "individual">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)

  const handleCreateGoal = () => {
    setShowCreateModal(true)
  }

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal)
    setShowCreateModal(true)
  }

  const handleViewGoal = (goal: any) => {
    setSelectedGoalId(goal.id)
  }

  const handleDeleteGoal = (goal: any) => {
    toast.info(`Delete goal: ${goal.title} - using dummy data`)
  }

  const handleRefresh = () => {
    toast.success("Data refreshed from Redux store")
  }

  const filteredGoals = goals.filter(
    (goal) =>
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const displayGoals = activeTab === "all" ? filteredGoals : filteredGoals.filter((g) => g.type === activeTab)

  const companyGoals = displayGoals.filter((g) => g.type === "company")
  const departmentGoals = displayGoals.filter((g) => g.type === "department")
  const individualGoals = displayGoals.filter((g) => g.type === "individual")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
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
      case "active":
        return "bg-blue-100 text-blue-800"
      case "not_started":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const renderGoalCard = (goal: any) => {
    const department = departments.find((d) => d.id === goal.departmentId)
    const progress = Number.parseFloat(goal.percentValueAchieved || "0")

    return (
      <Card
        key={goal.id}
        className="bg-white border border-gray-200 rounded-2xl shadow-none hover:shadow-lg transition-shadow duration-200"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-normal">{goal.title}</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleViewGoal(goal)}
                title="View Details"
              >
                <CiViewList className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleEditGoal(goal)}
                title="Edit Goal"
              >
                <CiEdit className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleDeleteGoal(goal)}
                title="Delete Goal"
              >
                <CiTrash className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
            <Badge className={getStatusColor(goal.status)}>{goal.status.replace("_", " ")}</Badge>
            <Badge variant="outline" className="capitalize">
              {goal.type}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {goal.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{goal.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CiTarget className="w-4 h-4" />
                <span>Department</span>
              </div>
              <p className="text-sm font-medium">{department?.name || "Company-wide"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CiCircleCheck className="w-4 h-4" />
                <span>Owner</span>
              </div>
              <p className="text-sm font-medium">{goal.owner || "Unassigned"}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-gray-900">{progress}%</span>
            </div>
            <div className="relative">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Target vs Current */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-gray-500">Target</span>
              <p className="text-sm font-semibold">{goal.targetValue}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500">Current</span>
              <p className="text-sm font-semibold">{goal.currentValue}</p>
            </div>
          </div>

          {goal.parentGoalId && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <CiFlag className="w-4 h-4" />
                <span className="font-medium">
                  Child of: {goals.find((g) => g.id === goal.parentGoalId)?.title || "Parent Goal"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Goals Management</h1>
          <p className="text-gray-600 font-normal">Create and track performance goals across the organization</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="rounded-full bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-300"
          >
            <CiRedo className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleCreateGoal}
            className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <CiPlus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
              activeTab === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Goals
            <Badge variant="secondary" className="ml-1">
              {filteredGoals.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
              activeTab === "company" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Company Goals
            <Badge variant="secondary" className="ml-1">
              {companyGoals.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab("department")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
              activeTab === "department"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Department Goals
            <Badge variant="secondary" className="ml-1">
              {departmentGoals.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab("individual")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
              activeTab === "individual"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Individual Goals
            <Badge variant="secondary" className="ml-1">
              {individualGoals.length}
            </Badge>
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {displayGoals.length > 0 ? (
        <div className="space-y-6">
          {/* Company Goals Section */}
          {(activeTab === "all" || activeTab === "company") && companyGoals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">Company Goals</h2>
                <Badge className="bg-purple-100 text-purple-800">{companyGoals.length}</Badge>
              </div>
              <div className="space-y-4">{companyGoals.map(renderGoalCard)}</div>
            </div>
          )}

          {/* Department Goals Section */}
          {(activeTab === "all" || activeTab === "department") && departmentGoals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">Department Goals</h2>
                <Badge className="bg-blue-100 text-blue-800">{departmentGoals.length}</Badge>
              </div>
              <div className="space-y-4 pl-8 border-l-2 border-blue-200">{departmentGoals.map(renderGoalCard)}</div>
            </div>
          )}

          {/* Individual Goals Section */}
          {(activeTab === "all" || activeTab === "individual") && individualGoals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">Individual Goals</h2>
                <Badge className="bg-green-100 text-green-800">{individualGoals.length}</Badge>
              </div>
              <div className="space-y-4 pl-16 border-l-2 border-green-200">{individualGoals.map(renderGoalCard)}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
            <CiFlag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "No goals match your current search. Try adjusting your search criteria."
              : "Get started by creating your first goal to track performance objectives."}
          </p>
          <Button
            onClick={handleCreateGoal}
            className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <CiPlus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      )}

      {/* View Drawer */}
      {selectedGoalId && (
        <Drawer isOpen={selectedGoalId !== null} onClose={() => setSelectedGoalId(null)} title="Goal Details">
          {/* Goal details would be rendered here */}
        </Drawer>
      )}

      {/* Form Modal */}
      {showCreateModal && (
        <GoalFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={editingGoal ? "Edit Goal" : "Create Goal"}
          goal={editingGoal}
          onSubmit={() => {
            // Handle form submission
            setShowCreateModal(false)
            setEditingGoal(null)
          }}
        />
      )}
    </div>
  )
}
