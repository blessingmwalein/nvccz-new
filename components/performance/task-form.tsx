"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { departmentApiService } from "@/lib/api/department-api"
import { toast } from "sonner"

const taskValidationSchema = yup.object({
  title: yup.string().required('Task title is required'),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  priority: yup.string().required('Priority is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
})

export type TaskFormData = yup.InferType<typeof taskValidationSchema>

interface TaskFormProps {
  departmentId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function TaskForm({ departmentId, isOpen, onClose, onSuccess }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskValidationSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "investment",
      priority: "medium",
      startDate: "",
      endDate: "",
    },
    mode: "onChange"
  })

  const onSubmit = async (data: TaskFormData) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await departmentApiService.createTask({
        ...data,
        team: [],
        kpi: undefined
      })
      toast.success("Task created successfully")
      reset()
      onSuccess()
    } catch (error: any) {
      console.error('Failed to create task:', error)
      toast.error(error.message || "Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
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
                <p className="text-sm text-red-500">{errors.title.message}</p>
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
                <p className="text-sm text-red-500">{errors.category.message}</p>
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
              <p className="text-sm text-red-500">{errors.description.message}</p>
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
                <p className="text-sm text-red-500">{errors.priority.message}</p>
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
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
