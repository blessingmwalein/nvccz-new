"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { taskValidationSchema, TaskFormData } from "@/lib/validations/task-validation"
import { toast } from "sonner"

interface TaskFormModalProps {
  task?: any
  goals: any[]
  onSave: (data: any) => void
  onClose: () => void
}

export function TaskFormModal({ task, goals, onSave, onClose }: TaskFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(taskValidationSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      category: task?.category || "investment",
      priority: task?.priority || "medium",
      startDate: task?.startDate || "",
      endDate: task?.endDate || "",
      assignedToId: task?.assignedToId || "",
      team: task?.team || [],
      goalId: task?.goalId || "none",
      performanceCategory: task?.performanceCategory || "deal_sourcing",
      isPerformanceTask: task?.isPerformanceTask || true,
      monetaryValue: task?.monetaryValue || 0,
      percentValue: task?.percentValue || 0,
      kpi: task?.kpi || undefined,
      ruleset: task?.ruleset || ">=",
      status: task?.status || "not_started",
      progress: task?.progress || 0,
    },
    mode: "onChange"
  })

  const onSubmit = async (data: TaskFormData) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      const submitData = {
        ...data,
        goalId: data.goalId === "none" ? "" : data.goalId,
        team: data.assignedToId ? [data.assignedToId] : [],
        kpi: data.isPerformanceTask ? {
          type: "Metric",
          target: data.monetaryValue || 0,
          unit: "USD"
        } : undefined
      }
      await onSave(submitData)
      toast.success(task ? "Task updated successfully" : "Task created successfully")
      reset()
      onClose()
    } catch (error: any) {
      console.error('Failed to save task:', error)
      toast.error(error.message || "Failed to save task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <div className="space-y-6 p-1">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="Task Title"
                  className={errors.title ? "border-red-500" : ""}
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{String(errors.title?.message || '')}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{String(errors.category?.message || '')}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="description"
                placeholder="Task Description"
                className={errors.description ? "border-red-500" : ""}
              />
            )}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{String(errors.description?.message || '')}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-sm text-red-500">{String(errors.priority?.message || '')}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500">{String(errors.status?.message || '')}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="startDate"
                  type="date"
                  className={errors.startDate ? "border-red-500" : ""}
                />
              )}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{String(errors.startDate?.message || '')}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date *</Label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="endDate"
                  type="date"
                  className={errors.endDate ? "border-red-500" : ""}
                />
              )}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{String(errors.endDate?.message || '')}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="assignedToId">Assigned To ID</Label>
            <Controller
              name="assignedToId"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="assignedToId"
                  placeholder="User ID (optional)"
                  className={errors.assignedToId ? "border-red-500" : ""}
                />
              )}
            />
            {errors.assignedToId && (
              <p className="text-sm text-red-500">{String(errors.assignedToId?.message || '')}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goalId">Goal ID</Label>
            <Controller
              name="goalId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Goal</SelectItem>
                    {goals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.goalId && (
              <p className="text-sm text-red-500">{String(errors.goalId?.message || '')}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="monetaryValue">Monetary Value</Label>
            <Controller
              name="monetaryValue"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="monetaryValue"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  className={errors.monetaryValue ? "border-red-500" : ""}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )}
            />
            {errors.monetaryValue && (
              <p className="text-sm text-red-500">{String(errors.monetaryValue?.message || '')}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="percentValue">Percent Value</Label>
            <Controller
              name="percentValue"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="percentValue"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0"
                  className={errors.percentValue ? "border-red-500" : ""}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )}
            />
            {errors.percentValue && (
              <p className="text-sm text-red-500">{String(errors.percentValue?.message || '')}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="performanceCategory">Performance Category</Label>
            <Controller
              name="performanceCategory"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deal_sourcing">Deal Sourcing</SelectItem>
                    <SelectItem value="due_diligence">Due Diligence</SelectItem>
                    <SelectItem value="portfolio_management">Portfolio Management</SelectItem>
                    <SelectItem value="reporting">Reporting</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="progress">Progress (%) *</Label>
            <Controller
              name="progress"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  className={errors.progress ? "border-red-500" : ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
            {errors.progress && (
              <p className="text-sm text-red-500">{String(errors.progress?.message || '')}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ruleset">Ruleset</Label>
            <Controller
              name="ruleset"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ruleset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">=">Greater than or equal (&gt;=)</SelectItem>
                    <SelectItem value="<=">Less than or equal (&lt;=)</SelectItem>
                    <SelectItem value="=">Equal (=)</SelectItem>
                    <SelectItem value=">">Greater than (&gt;)</SelectItem>
                    <SelectItem value="<">Less than (&lt;)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <div className="flex items-center gap-2 pt-6">
            <Controller
              name="isPerformanceTask"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="isPerformanceTask"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="rounded"
                />
              )}
            />
            <Label htmlFor="isPerformanceTask">Performance Task</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="gradient-primary text-white"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (task ? "Updating..." : "Creating...") : (task ? "Update Task" : "Create Task")}
          </Button>
        </div>
      </form>
    </div>
  )
}
