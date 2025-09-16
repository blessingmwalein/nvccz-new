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
            <GoalModal 
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
function GoalModal({ goal, departments, onSave, onClose }: { 
  goal?: any, 
  departments: any[],
  onSave: (data: any) => void, 
  onClose: () => void 
}) {
  const [formData, setFormData] = useState({
    title: goal?.title || "",
    description: goal?.description || "",
    type: goal?.type || "company",
    category: goal?.category || "financial",
    departmentId: goal?.departmentId || "",
    monetaryValue: goal?.monetaryValue || "",
    percentValue: goal?.percentValue || "",
    priority: goal?.priority || "medium",
    startDate: goal?.startDate || "",
    endDate: goal?.endDate || "",
    assignedToId: goal?.assignedToId || "",
    status: goal?.status || "not_started",
    progress: goal?.progress || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      monetaryValue: formData.monetaryValue ? parseFloat(formData.monetaryValue) : undefined,
      percentValue: formData.percentValue ? parseFloat(formData.percentValue) : undefined,
      progress: parseInt(formData.progress),
    }
    onSave(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Goal Title"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Goal Description"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="strategic">Strategic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Department</label>
          <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Monetary Value (Optional)</label>
          <Input
            type="number"
            value={formData.monetaryValue}
            onChange={(e) => setFormData({ ...formData, monetaryValue: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Percent Value (Optional)</label>
          <Input
            type="number"
            value={formData.percentValue}
            onChange={(e) => setFormData({ ...formData, percentValue: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Assigned To ID</label>
          <Input
            value={formData.assignedToId}
            onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
            placeholder="User ID"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Progress (%)</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="gradient-primary text-white">
          {goal ? "Update Goal" : "Create Goal"}
        </Button>
      </div>
    </form>
  )
}
