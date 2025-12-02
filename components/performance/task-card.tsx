"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CiUser } from "react-icons/ci"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: any
  isDrawerVersion?: boolean
  onClick?: (id: string) => void
}

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

export function TaskCard({ task, isDrawerVersion = false, onClick }: TaskCardProps) {
  const hierarchy = getGoalHierarchy(task)
  const progress = Number.parseFloat(task.taskPercentage || "0")

  return (
    <Card
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
                className={`h-full rounded-full transition-all duration-300 ${progress >= 80
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
            <span className="text-gray-500">Creator:</span>
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
