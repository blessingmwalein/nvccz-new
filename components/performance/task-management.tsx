"use client"

import { useState } from "react"
import { useAppSelector } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
// import { Modal } from "@/components/ui/modal"
// import { TaskForm } from "@/components/forms/task-form"
import {
  CiCirclePlus as Plus,
  CiViewList as List,
  CiViewBoard as Kanban,
  CiCircleCheck as Activity,
  CiFlag1 as CiFlag,
  CiSearch,
  CiEdit,
  CiTrash,
} from "react-icons/ci"
import { toast } from "sonner"

export function TaskManagement() {
  const { tasks, goals } = useAppSelector((state) => state.testPerfomance)

  const [activeTab, setActiveTab] = useState("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)

  const getGoalHierarchy = (taskGoalId: string) => {
    const individualGoal = goals.find((g) => g.id === taskGoalId)
    if (!individualGoal) return null

    const departmentGoal = individualGoal.parentGoalId ? goals.find((g) => g.id === individualGoal.parentGoalId) : null

    const companyGoal = departmentGoal?.parentGoalId ? goals.find((g) => g.id === departmentGoal.parentGoalId) : null

    return {
      company: companyGoal,
      department: departmentGoal,
      individual: individualGoal,
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateTask = () => {
    setShowCreateModal(true)
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setShowCreateModal(true)
  }

  const handleDeleteTask = (task: any) => {
    toast.info(`Delete task: ${task.title} - using dummy data`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const renderTaskCard = (task: any) => {
    const hierarchy = getGoalHierarchy(task.goalId)
    const progress = Number.parseFloat(task.progress || "0")

    return (
      <Card
        key={task.id}
        className="bg-white border border-gray-200 rounded-2xl shadow-none hover:shadow-lg transition-shadow duration-200"
        onClick={() => setSelectedTaskId(task.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-normal">{task.title}</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleEditTask(task)}
                title="Edit Task"
              >
                <CiEdit className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleDeleteTask(task)}
                title="Delete Task"
              >
                <CiTrash className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>

          {/* Goal Hierarchy */}
          {hierarchy && (
            <div className="mb-4 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="text-xs font-medium text-gray-700 mb-2">Linked Goal Hierarchy</div>
              <div className="space-y-1">
                {hierarchy.company && (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium">{hierarchy.company.title}</span>
                  </div>
                )}
                {hierarchy.department && (
                  <div className="flex items-center gap-2 text-xs pl-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{hierarchy.department.title}</span>
                  </div>
                )}
                {hierarchy.individual && (
                  <div className="flex items-center gap-2 text-xs pl-8">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Individual:</span>
                    <span className="font-medium">{hierarchy.individual.title}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-gray-900">{progress}%</span>
            </div>
            <div className="relative">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    progress >= 80
                      ? "bg-green-500"
                      : progress >= 60
                        ? "bg-blue-500"
                        : progress >= 40
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Assignee and Due Date */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Assigned to:</span>
              <p className="font-medium">{task.assignedTo || "Unassigned"}</p>
            </div>
            <div>
              <span className="text-gray-500">Due Date:</span>
              <p className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Task Management</h1>
          <p className="text-gray-600 font-normal">
            Create, track, and manage performance tasks linked to individual goals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreateTask}
            className="flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Goal Hierarchy Info Card */}
      {tasks.some((t) => t.goalId) && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CiFlag className="w-5 h-5 text-blue-600" />
              Goal Hierarchy Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="font-medium">Company Goal</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium">Department Goal</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium">Individual Goal</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="font-medium">Tasks</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Tasks are linked to individual goals, which roll up to department goals, and ultimately to company goals.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("list")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
              activeTab === "list" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List className="w-4 h-4" />
            List View
          </button>
          <button
            onClick={() => setActiveTab("board")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
              activeTab === "board" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Kanban className="w-4 h-4" />
            Board View
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
              activeTab === "activity"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Activity className="w-4 h-4" />
            Activity Logs
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tasks Display */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(renderTaskCard)
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                <List className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? "No tasks match your current search." : "Get started by creating your first task."}
              </p>
              <Button
                onClick={handleCreateTask}
                className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Task
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === "board" && (
        <div className="text-center py-12">
          <p className="text-gray-600">Board view coming soon...</p>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="text-center py-12">
          <p className="text-gray-600">Activity logs coming soon...</p>
        </div>
      )}

    

      {/* View Drawer */}
      {selectedTaskId && (
        <Drawer open={!!selectedTaskId} onOpenChange={setSelectedTaskId}>
          <DrawerContent>
            <div className="p-4">
              {tasks.find((task) => task.id === selectedTaskId) &&
                renderTaskCard(tasks.find((task) => task.id === selectedTaskId))}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}
