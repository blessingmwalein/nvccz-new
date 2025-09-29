"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Filter, 
  Search, 
  List, 
  Kanban,
  Calendar,
  Users,
  Target,
  AlertCircle,
  Activity
} from "lucide-react"
import { TaskListView } from "./task-list-view"
import { TaskBoardView } from "./task-board-view"
import { TaskForm } from "./task-form"
import { ActivityLogs } from "./activity-logs"
import { TaskManagementSkeleton } from "@/components/ui/skeleton-loaders"
import { useTaskStore } from "@/lib/store/slices/useTaskStore"

export function TaskManagement() {
  const [activeTab, setActiveTab] = useState("list")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks, 
    createTask, 
    updateTask, 
    deleteTask,
    filters,
    setFilters
  } = useTaskStore()

  useEffect(() => {
    // Fetch tasks when filters change. Avoid including fetchTasks in deps to prevent ref changes causing loops.
    fetchTasks(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData)
      setShowTaskForm(false)
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  const handleUpdateTask = async (taskId: string, taskData: any) => {
    try {
      await updateTask(taskId, taskData)
      setSelectedTask(null)
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const handleStageUpdate = async (taskId: string, newStage: string, notes?: string) => {
    try {
      await updateTask(taskId, { stage: newStage, notes })
    } catch (error) {
      console.error("Failed to update task stage:", error)
    }
  }

  // Show skeleton loader when loading and no tasks
  if (loading && tasks.length === 0) {
    return <TaskManagementSkeleton />
  }

  // Show skeleton loader when there's an error and no tasks
  if (error && tasks.length === 0) {
    return <TaskManagementSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">
            Create, track, and manage performance tasks and activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Removed stats summary cards per new design */}

      {/* Custom Tab Navigation - matching goal view drawer design */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("list")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
              activeTab === "list"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List className="w-4 h-4" />
            List View
          </button>
          <button
            onClick={() => setActiveTab("board")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
              activeTab === "board"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Kanban className="w-4 h-4" />
            Board View
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${
              activeTab === "activity"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Activity className="w-4 h-4" />
            Activity Logs
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {activeTab === "list" && (
          <TaskListView
            tasks={tasks}
            loading={loading}
            onEditTask={setSelectedTask}
            onDeleteTask={handleDeleteTask}
            onUpdateStage={handleStageUpdate}
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}

        {activeTab === "board" && (
          <TaskBoardView
            tasks={tasks}
            loading={loading}
            onUpdateStage={handleStageUpdate}
            onEditTask={setSelectedTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === "activity" && (
          <ActivityLogs
            isOpen={true}
            onClose={() => {}} // No close function needed since it's a tab
          />
        )}
      </div>

      {/* Task Form Dialog */}
      {showTaskForm && (
        <TaskForm
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onSubmit={handleCreateTask}
          task={null}
        />
      )}

      {/* Edit Task Dialog */}
      {selectedTask && (
        <TaskForm
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSubmit={(data) => handleUpdateTask(selectedTask.id, data)}
          task={selectedTask}
        />
      )}

    </div>
  )
}
