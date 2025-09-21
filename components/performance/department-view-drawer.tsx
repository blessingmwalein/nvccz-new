"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { 
  Building,
  Users,
  Target,
  Calendar,
  Plus,
  Eye
} from "lucide-react"
import { GoalForm } from "./goal-form"
import { TaskForm } from "./task-form"

interface DepartmentViewDrawerProps {
  department: any
  isOpen: boolean
  onClose: () => void
}

export function DepartmentViewDrawer({ department, isOpen, onClose }: DepartmentViewDrawerProps) {
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  if (!department) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[25vw] min-w-[600px] max-w-[800px] overflow-y-auto p-5">
          <SheetHeader>
            <SheetTitle className="text-2xl font-normal flex items-center gap-2">
              <Building className="w-6 h-6" />
              {department.name}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Basic Information */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-normal">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {department.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Branch</label>
                    <p className="text-sm text-gray-900 mt-1">{department.branch}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <Badge className={department.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {department.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-normal flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-semibold text-blue-600">{department._count?.users || 0}</div>
                    <div className="text-sm text-gray-600">Users</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-semibold text-green-600">{department._count?.goals || 0}</div>
                    <div className="text-sm text-gray-600">Goals</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-normal">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setIsGoalFormOpen(true)}
                    className="flex-1 gradient-primary text-white"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Create Goal
                  </Button>
                  <Button 
                    onClick={() => setIsTaskFormOpen(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Goals */}
            {department.goals && department.goals.length > 0 && (
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-normal flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Performance Goals ({department.goals.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {department.goals.map((goal: any, index: number) => (
                      <div key={goal.id || index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{goal.title}</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">{goal.stage}</Badge>
                            <Badge className={
                              goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                              goal.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {goal.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-normal flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created At</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(department.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(department.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      {/* Goal Form Modal */}
      <GoalForm
        departmentId={department.id}
        isOpen={isGoalFormOpen}
        onClose={() => setIsGoalFormOpen(false)}
        onSuccess={() => {
          setIsGoalFormOpen(false)
          // Refresh department data
        }}
      />

      {/* Task Form Modal */}
      <TaskForm
        departmentId={department.id}
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSuccess={() => {
          setIsTaskFormOpen(false)
          // Refresh department data
        }}
      />
    </>
  )
}
