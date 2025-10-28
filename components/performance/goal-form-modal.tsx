"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppSelector } from "@/lib/store"
import { toast } from "sonner"

const goalSchema = yup.object({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  type: yup.string().oneOf(["company", "department", "individual"]).required("Type is required"),
  category: yup.string().required("Category is required"),
  priority: yup.string().oneOf(["low", "medium", "high", "critical"]).required("Priority is required"),
  status: yup.string().required("Status is required"),
  targetValue: yup.string().required("Target value is required"),
  currentValue: yup.string().required("Current value is required"),
  owner: yup.string().required("Owner is required"),
  departmentId: yup.string().nullable(),
  parentGoalId: yup.string().nullable(),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
})

interface GoalFormModalProps {
  isOpen: boolean
  onClose: () => void
  goal?: any
  onSubmit: (data: any) => void
}

export function GoalFormModal({ isOpen, onClose, goal, onSubmit }: GoalFormModalProps) {
  const { departments, goals } = useAppSelector((state) => state.performance)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(goalSchema),
    defaultValues: goal || {
      title: "",
      description: "",
      type: "individual",
      category: "revenue",
      priority: "medium",
      status: "not_started",
      targetValue: "",
      currentValue: "0",
      owner: "",
      departmentId: null,
      parentGoalId: null,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  })

  const goalType = watch("type")

  // Filter parent goals based on type
  const availableParentGoals = goals.filter((g) => {
    if (goalType === "department") return g.type === "company"
    if (goalType === "individual") return g.type === "department"
    return false
  })

  const handleFormSubmit = (data: any) => {
    onSubmit(data)
    toast.success(goal ? "Goal updated successfully" : "Goal created successfully")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input id="title" {...register("title")} placeholder="Enter goal title" />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} placeholder="Describe the goal" rows={3} />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Type, Category, Priority */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue("category", value)} defaultValue={watch("category")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                  <SelectItem value="efficiency">Efficiency</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select onValueChange={(value) => setValue("priority", value)} defaultValue={watch("priority")}>
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
              {errors.priority && <p className="text-sm text-red-600">{errors.priority.message}</p>}
            </div>
          </div>

          {/* Status, Owner */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select onValueChange={(value) => setValue("status", value)} defaultValue={watch("status")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Owner *</Label>
              <Input id="owner" {...register("owner")} placeholder="Goal owner name" />
              {errors.owner && <p className="text-sm text-red-600">{errors.owner.message}</p>}
            </div>
          </div>

          {/* Department and Parent Goal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department</Label>
              <Select
                onValueChange={(value) => setValue("departmentId", value)}
                defaultValue={watch("departmentId") || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Company-wide)</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {availableParentGoals.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="parentGoalId">Parent Goal</Label>
                <Select
                  onValueChange={(value) => setValue("parentGoalId", value)}
                  defaultValue={watch("parentGoalId") || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availableParentGoals.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Target and Current Values */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value *</Label>
              <Input id="targetValue" {...register("targetValue")} placeholder="e.g., 1000000" />
              {errors.targetValue && <p className="text-sm text-red-600">{errors.targetValue.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value *</Label>
              <Input id="currentValue" {...register("currentValue")} placeholder="e.g., 500000" />
              {errors.currentValue && <p className="text-sm text-red-600">{errors.currentValue.message}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && <p className="text-sm text-red-600">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
              {errors.endDate && <p className="text-sm text-red-600">{errors.endDate.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {goal ? "Update Goal" : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
