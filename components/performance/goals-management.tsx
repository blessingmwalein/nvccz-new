"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { 
  addGoal, 
  updateGoal, 
  removeGoal,
  setSelectedPriority,
  setSelectedStatus,
  setSearchTerm 
} from "@/lib/store/slices/performanceSlice"
import { performanceAPI } from "@/lib/api/performance-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  CiEdit, 
  CiTrash, 
  CiSearch,
  CiCalendar,
  CiDollar,
  CiFlag1 as CiFlag,
  CiCirclePlus as CiPlus,
  CiCircleCheck as CiTarget
} from "react-icons/ci"
import { toast } from "sonner"
import { GoalFormModal } from "./goal-form-modal"

export function GoalsManagement() {
  const dispatch = useAppDispatch()
  const { goals, departments, selectedPriority, selectedStatus, searchTerm } = useAppSelector((state) => state.performance)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)

  const filteredGoals = goals.filter(goal => {
    const matchesPriority = selectedPriority === "all" || goal.priority === selectedPriority
    const matchesStatus = selectedStatus === "all" || goal.status === selectedStatus
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesPriority && matchesStatus && matchesSearch
  })

  const handleCreateGoal = async (goalData: any) => {
    try {
      const newGoal = await performanceAPI.createGoal(goalData)
      dispatch(addGoal(newGoal))
      toast.success("Goal created successfully")
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Failed to create goal")
    }
  }

  const handleUpdateGoal = async (id: string, updates: any) => {
    try {
      const updatedGoal = await performanceAPI.updateKPI(id, updates)
      dispatch(updateGoal({ id, updates: updatedGoal }))
      toast.success("Goal updated successfully")
      setIsDialogOpen(false)
      setEditingGoal(null)
    } catch (error) {
      toast.error("Failed to update goal")
    }
  }

  const handleDeleteGoal = async (id: string) => {
    try {
      await performanceAPI.deleteKPI(id)
      dispatch(removeGoal(id))
      toast.success("Goal deleted successfully")
    } catch (error) {
      toast.error("Failed to delete goal")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'not_started': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Goals Management</h1>
          <p className="text-gray-600 font-normal">Create and track performance goals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gradient-primary text-white">
              <CiPlus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl md:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? "Edit Goal" : "Create New Goal"}
              </DialogTitle>
            </DialogHeader>
            <GoalFormModal 
              goal={editingGoal}
              departments={departments}
              onSave={editingGoal ? 
                (updates) => handleUpdateGoal(editingGoal.id, updates) : 
                handleCreateGoal
              }
              onClose={() => {
                setIsDialogOpen(false)
                setEditingGoal(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedPriority} onValueChange={(value) => dispatch(setSelectedPriority(value))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={(value) => dispatch(setSelectedStatus(value))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Goals Grid */}
      <div className="space-y-4">
        {filteredGoals.map((goal) => (
          <Card key={goal.id} className="bg-white border border-gray-200 rounded-2xl shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{goal.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0 gradient-primary text-white" onClick={() => setEditingGoal(goal)}>
                    <CiEdit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0 gradient-primary text-white" onClick={() => handleDeleteGoal(goal.id)}>
                    <CiTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(goal.priority)}>
                  {goal.priority}
                </Badge>
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  {goal.type}
                </Badge>
                <Badge variant="outline">
                  {goal.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
              
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress: {goal.progress}%</span>
                    <span className="text-gray-500">
                      {goal.startDate} - {goal.endDate}
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Value Information */}
                <div className="grid grid-cols-2 gap-4">
                  {goal.monetaryValue && (
                    <div className="flex items-center gap-2 text-sm">
                      <CiDollar className="w-4 h-4 text-green-600" />
                      <span>Target: ${goal.monetaryValue.toLocaleString()}</span>
                    </div>
                  )}
                  {goal.percentValue && (
                    <div className="flex items-center gap-2 text-sm">
                      <CiTarget className="w-4 h-4 text-blue-600" />
                      <span>Target: {goal.percentValue}%</span>
                    </div>
                  )}
                </div>

                {/* Department */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CiCalendar className="w-4 h-4" />
                  <span>
                    Department: {departments.find(d => d.id === goal.departmentId)?.name || 'Unknown'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <CiFlag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedPriority !== "all" || selectedStatus !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first goal"
            }
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="rounded-full gradient-primary text-white">
            <CiPlus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>
      )}
    </div>
  )
}

// Goal Modal Component
