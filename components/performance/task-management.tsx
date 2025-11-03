"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import {
  fetchMyTasks,
  fetchDepartmentTasks,
  fetchTaskActivities,
  createTaskActivity,
} from "@/lib/store/slices/taskSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CiViewList as List,
  CiViewBoard as Kanban,
  CiCircleCheck as Activity,
  CiFlag1 as CiFlag,
  CiSearch,
  CiEdit,
  CiTrash,
  CiUser,
} from "react-icons/ci"
import { toast } from "sonner"
import { fetchAvailableDepartments } from "@/lib/store/slices/performanceSlice"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type TaskView = "my-tasks" | "department-tasks" | "activity"
type DrawerTab = "details" | "activity"

const UserAvatar = ({ user }: { user: { firstName?: string; lastName?: string } | null }) => {
  if (!user || !user.firstName) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <CiUser className="w-5 h-5 text-gray-500" />
        </div>
        <span className="font-medium text-gray-700">Unassigned</span>
      </div>
    )
  }

  const initials = `${user.firstName[0] || ""}`.toUpperCase()
  const fullName = `${user.firstName}`

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
        {initials}
      </div>
      <span className="font-medium text-gray-800">{fullName}</span>
    </div>
  )
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in_progress":
      return "bg-blue-100 text-blue-800"
    case "todo":
      return "bg-yellow-100 text-yellow-800"
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

const getGoalHierarchy = (task: any) => {
  if (!task.goal) return null

  const individualGoal = task.goal
  const departmentGoal = individualGoal.parentGoal
  const companyGoal = departmentGoal?.parentGoal

  return {
    company: companyGoal,
    department: departmentGoal,
    individual: individualGoal,
  }
}

const TaskCard = ({
  task,
  isDrawerVersion = false,
  onClick,
}: {
  task: any
  isDrawerVersion?: boolean
  onClick?: (id: string) => void
}) => {
  const hierarchy = getGoalHierarchy(task)
  const progress = Number.parseFloat(task.goal?.progressPercentage || "0")

  return (
    <Card
      key={task.id}
      className={cn(
        "bg-white border border-gray-200 rounded-2xl shadow-none",
        !isDrawerVersion && "hover:shadow-lg transition-shadow duration-200 cursor-pointer",
      )}
      onClick={() => onClick?.(task.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-normal">{task.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getStatusColor(task.stage)}>{task.stage?.replace("_", " ")}</Badge>
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
            <UserAvatar user={task.creator} />
          </div>
          <div>
            <span className="text-gray-500">Due Date:</span>
            <p className="font-medium">{new Date(task.date).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const TaskDrawerView = ({ task }: { task: any }) => {
  const dispatch = useAppDispatch()
  const {
    activities,
    activitiesLoading,
    activitiesError,
  } = useAppSelector((state) => state.tasks)
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTab>("details")
  const [isCreateActivityModalOpen, setCreateActivityModalOpen] = useState(false)

  useEffect(() => {
    if (activeDrawerTab === "activity" && task?.id) {
      dispatch(fetchTaskActivities(task.id))
    }
  }, [activeDrawerTab, task?.id, dispatch])

  useEffect(() => {
    if (activitiesError) {
      toast.error("Failed to load task activities.", {
        description: activitiesError,
      })
    }
  }, [activitiesError])

  if (!task) return null

  const drawerTabs = [
    { id: "details", label: "Task Details", icon: List },
    { id: "activity", label: "Activity Log", icon: Activity },
  ]

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <span className="truncate">{task.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(task.stage)}>{task.stage?.replace("_", " ")}</Badge>
            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
          </div>
        </SheetTitle>
        {task.goal?.title && (
          <p className="text-sm text-gray-500 pt-1">
            Individual Goal: <span className="font-medium text-gray-700">{task.goal.title}</span>
          </p>
        )}
      </SheetHeader>

      {/* Action Buttons - Top Right */}
      <div className="mt-4 flex justify-end gap-3">
        <Button onClick={() => setCreateActivityModalOpen(true)}>
          <Activity className="mr-2 h-4 w-4" /> Log Activity
        </Button>
      </div>

      <div className="mt-4 border-b">
        <nav className="flex -mb-px space-x-6">
          {drawerTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDrawerTab(tab.id as DrawerTab)}
              className={cn(
                "flex items-center gap-2 py-3 px-1 text-sm font-medium transition-colors",
                activeDrawerTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "border-b-2 border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 space-y-6">
        {activeDrawerTab === "details" && <TaskCard task={task} isDrawerVersion />}
        {activeDrawerTab === "activity" && (
          <div>
            {activitiesLoading ? (
              <ActivityListSkeleton />
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Activity Found</h3>
                <p className="text-gray-600">There are no activity logs for this task yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <CreateActivityModal
        isOpen={isCreateActivityModalOpen}
        onClose={() => setCreateActivityModalOpen(false)}
        task={task}
        onSuccess={() => {
          setCreateActivityModalOpen(false)
          if (task?.id) {
            dispatch(fetchTaskActivities(task.id))
          }
        }}
      />
    </>
  )
}

export function TaskManagement() {
  const dispatch = useAppDispatch()
  const { tasks, loading: isLoading, error } = useAppSelector((state) => state.tasks)
  const { availableDepartments } = useAppSelector((state) => state.performance)

  const [activeTab, setActiveTab] = useState<TaskView>("my-tasks")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchAvailableDepartments())
  }, [dispatch])

  useEffect(() => {
    if (activeTab === "my-tasks") {
      dispatch(fetchMyTasks())
    } else if (activeTab === "department-tasks" && selectedDepartment) {
      dispatch(fetchDepartmentTasks(selectedDepartment))
    } else if (activeTab === "department-tasks" && !selectedDepartment) {
      // Clear tasks if no department is selected
      // You might want to dispatch an action to clear tasks in your slice
    }
  }, [activeTab, selectedDepartment, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const filteredTasks = (tasks || []).filter(
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

  const renderTaskCard = (task: any) => {
    return <TaskCard task={task} onClick={setSelectedTaskId} />
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
        <div className="flex items-center gap-2">{/* Create Task button removed */}</div>
      </div>

      {/* Goal Hierarchy Info Card */}
      {(tasks || []).some((t) => t.goalId) && (
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
            onClick={() => setActiveTab("my-tasks")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${activeTab === "my-tasks" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <List className="w-4 h-4" />
            Your Tasks
          </button>
          <button
            onClick={() => setActiveTab("department-tasks")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${activeTab === "department-tasks"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Kanban className="w-4 h-4" />
            Department Tasks
          </button>
          {/* <button
            onClick={() => setActiveTab("activity")}
            className={`relative flex items-center gap-2 py-3 px-1 text-sm font-normal transition-colors cursor-pointer ${activeTab === "activity"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Activity className="w-4 h-4" />
            Activity Logs
          </button> */}
        </nav>
      </div>

      {/* Search & Filters */}
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
        {activeTab === "department-tasks" && (
          <Select
            onValueChange={(value) => {
              setSelectedDepartment(value)
              if (value) {
                dispatch(fetchDepartmentTasks(value))
              }
            }}
            value={selectedDepartment || ""}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {availableDepartments.map((dept:any) => (
                <SelectItem key={dept} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Tasks Display */}
      {isLoading ? (
        <TaskPageSkeleton />
      ) : activeTab === "my-tasks" || (activeTab === "department-tasks" && selectedDepartment) ? (
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
                {searchTerm
                  ? "No tasks match your current search."
                  : activeTab === "department-tasks"
                    ? "No tasks found for the selected department."
                    : "You have no tasks assigned to you."}
              </p>
            </div>
          )}
        </div>
      ) : activeTab === "department-tasks" && !selectedDepartment ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Please select a department to view tasks.</p>
        </div>
      ) : null}

      {activeTab === "activity" && (
        <div className="text-center py-12">
          <p className="text-gray-600">Activity logs coming soon...</p>
        </div>
      )}

      {/* View Drawer */}
      {selectedTaskId && (
        <Sheet open={!!selectedTaskId} onOpenChange={(open) => !open && setSelectedTaskId(null)}>
          <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
            <TaskDrawerView task={(tasks || []).find((task) => task.id === selectedTaskId)} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

function TaskPageSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-white border border-gray-200 rounded-2xl shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="h-6 w-3/5 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="mt-4 h-24 bg-gray-100 rounded-lg animate-pulse" />
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-3 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="h-4 w-20 mb-1 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-16 mb-1 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const ActivityCard = ({ activity }: { activity: any }) => {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <UserAvatar user={activity.user} />
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-semibold text-gray-800">{activity.user.firstName}</span>
              <span className="text-gray-600"> {activity.title.toLowerCase()}</span>
            </p>
            {activity.description && <p className="text-sm text-gray-500 mt-1">{activity.description}</p>}
            <p className="text-xs text-gray-400 mt-2">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CreateActivityModal = ({
  isOpen,
  onClose,
  task,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  task: any
  onSuccess: () => void
}) => {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [valueCollected, setValueCollected] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task || !title) {
      toast.error("Title is required.")
      return
    }

    if (!task.goalId) {
      toast.error("This task is not linked to a goal. Cannot log activity.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        title,
        description,
        activityType: "task" as const,
        taskId: task.id,
        goalId: task.goalId,
        ...(valueCollected && { valueCollected: parseFloat(valueCollected) }),
      }

      await dispatch(createTaskActivity(payload)).unwrap()

      toast.success("Activity logged successfully.")
      onSuccess()
      setTitle("")
      setDescription("")
      setValueCollected("")
    } catch (error: any) {
      toast.error("Failed to log activity.", {
        description: error.message || "An unexpected error occurred.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log New Activity for: {task?.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="activity-title">Activity Title</Label>
            <Input
              id="activity-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Completed client meeting"
              required
            />
          </div>
          <div>
            <Label htmlFor="activity-description">Description (Optional)</Label>
            <Textarea
              id="activity-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about the activity..."
            />
          </div>
          <div>
            <Label htmlFor="activity-value">Value Collected (Optional)</Label>
            <Input
              id="activity-value"
              type="number"
              value={valueCollected}
              onChange={(e) => setValueCollected(e.target.value)}
              placeholder="e.g., 50000"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging..." : "Log Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ActivityListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="shadow-sm border-gray-200 animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
