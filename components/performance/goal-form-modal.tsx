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
import { goalValidationSchema, GoalFormData } from "@/lib/validations/goal-validation"
import { toast } from "sonner"

interface GoalFormModalProps {
  goal?: any
  departments: any[]
  onSave: (data: any) => void
  onClose: () => void
}

export function GoalFormModal({ goal, departments, onSave, onClose }: GoalFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<GoalFormData>({
    resolver: yupResolver(goalValidationSchema),
    defaultValues: {
      title: goal?.title || "",
      description: goal?.description || "",
      type: goal?.type || "company",
      category: goal?.category || "financial",
      departmentId: goal?.departmentId || "",
      monetaryValue: goal?.monetaryValue || 0,
      percentValue: goal?.percentValue || 0,
      priority: goal?.priority || "medium",
      startDate: goal?.startDate || "",
      endDate: goal?.endDate || "",
      assignedToId: goal?.assignedToId || "",
      status: goal?.status || "not_started",
      progress: goal?.progress || 0,
    },
    mode: "onChange"
  })

  const onSubmit = async (data: GoalFormData) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onSave(data)
      toast.success(goal ? "Goal updated successfully" : "Goal created successfully")
      reset()
      onClose()
    } catch (error: any) {
      console.error('Failed to save goal:', error)
      toast.error(error.message || "Failed to save goal")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
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
                placeholder="Goal Title"
                className={errors.title ? "border-red-500" : ""}
              />
            )}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
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
              placeholder="Goal Description"
              className={errors.description ? "border-red-500" : ""}
            />
          )}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="departmentId">Department *</Label>
          <Controller
            name="departmentId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={errors.departmentId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.departmentId && (
            <p className="text-sm text-red-500">{errors.departmentId.message}</p>
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
            <p className="text-sm text-red-500">{errors.monetaryValue.message}</p>
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
            <p className="text-sm text-red-500">{errors.percentValue.message}</p>
          )}
        </div>
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
            <p className="text-sm text-red-500">{errors.priority.message}</p>
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
            <p className="text-sm text-red-500">{errors.status.message}</p>
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
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
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
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
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
            <p className="text-sm text-red-500">{errors.assignedToId.message}</p>
          )}
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
            <p className="text-sm text-red-500">{errors.progress.message}</p>
          )}
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
          {isSubmitting ? (goal ? "Updating..." : "Creating...") : (goal ? "Update Goal" : "Create Goal")}
        </Button>
      </div>
    </form>
  )
}
