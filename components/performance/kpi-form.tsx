"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  CiFloppyDisk, 
  CiSquareRemove
} from "react-icons/ci"
import { KPI } from "@/lib/store/slices/performanceSlice"
import { useAppSelector } from "@/lib/store"

const schema = yup.object({
  name: yup.string().required("KPI name is required"),
  description: yup.string(),
  type: yup.string().oneOf(["Percentage", "Metric", "Count"]).required("Type is required"),
  unit: yup.string(),
  targetValue: yup.number().positive("Target value must be positive"),
  currentValue: yup.number().min(0, "Current value cannot be negative"),
  category: yup.string().oneOf(["sales", "marketing", "operations", "finance", "hr"]).required("Category is required"),
  frequency: yup.string().oneOf(["daily", "weekly", "monthly", "quarterly", "yearly"]).required("Frequency is required"),
  departmentId: yup.string(),
  weightValue: yup.number().min(0, "Weight value cannot be negative").max(1, "Weight value cannot exceed 1").required("Weight value is required"),
  isActive: yup.boolean().required("Status is required")
})

interface KPIFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  kpi?: KPI | null
  isLoading?: boolean
}

export function KPIForm({ isOpen, onClose, onSubmit, kpi, isLoading = false }: KPIFormProps) {
  const { departments } = useAppSelector((state) => state.performance)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      type: "Metric",
      unit: "",
      targetValue: 0,
      currentValue: 0,
      category: "sales",
      frequency: "monthly",
      departmentId: "",
      weightValue: 0.1,
      isActive: true
    }
  })

  const watchedType = watch("type")

  useEffect(() => {
    if (kpi) {
      reset({
        name: kpi.name,
        description: kpi.description || "",
        type: kpi.type,
        unit: kpi.unit || "",
        targetValue: kpi.targetValue || 0,
        currentValue: kpi.currentValue || 0,
        category: kpi.category,
        frequency: kpi.frequency,
        departmentId: kpi.departmentId || "none",
        weightValue: kpi.weightValue,
        isActive: kpi.isActive
      })
      setSelectedDepartment(kpi.departmentId || "none")
    } else {
      reset({
        name: "",
        description: "",
        type: "Metric",
        unit: "",
        targetValue: 0,
        currentValue: 0,
        category: "sales",
        frequency: "monthly",
        departmentId: "none",
        weightValue: 0.1,
        isActive: true
      })
      setSelectedDepartment("none")
    }
  }, [kpi, reset])

  const handleFormSubmit = (data: any) => {
    // Convert "none" to null for departmentId
    const formData = {
      ...data,
      departmentId: data.departmentId === "none" ? null : data.departmentId
    }
    onSubmit(formData)
  }

  const getUnitOptions = (type: string) => {
    switch (type) {
      case "Percentage":
        return ["%", "ratio", "rate"]
      case "Metric":
        return ["USD", "EUR", "GBP", "ZAR", "count", "units", "items"]
      case "Count":
        return ["count", "units", "items", "people", "deals"]
      default:
        return ["USD", "count", "units", "%"]
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <CiFloppyDisk className="w-6 h-6 text-white" />
            </div>
            {kpi ? "Edit KPI" : "Create New KPI"}
          </DialogTitle>
          <DialogDescription>
            {kpi ? "Update the KPI information below." : "Fill in the details to create a new KPI."}
          </DialogDescription>
        </DialogHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">KPI Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter KPI name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Type */}
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
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Metric">Metric</SelectItem>
                      <SelectItem value="Count">Count</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Category */}
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
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={errors.frequency ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.frequency && (
                <p className="text-sm text-red-500">{errors.frequency.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department</Label>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <Select 
                    value={field.value} 
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedDepartment(value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Department</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnitOptions(watchedType).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Target Value */}
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value</Label>
              <Controller
                name="targetValue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="Enter target value"
                    className={errors.targetValue ? "border-red-500" : ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
              {errors.targetValue && (
                <p className="text-sm text-red-500">{errors.targetValue.message}</p>
              )}
            </div>

            {/* Current Value */}
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value</Label>
              <Controller
                name="currentValue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="Enter current value"
                    className={errors.currentValue ? "border-red-500" : ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
              {errors.currentValue && (
                <p className="text-sm text-red-500">{errors.currentValue.message}</p>
              )}
            </div>

            {/* Weight Value */}
            <div className="space-y-2">
              <Label htmlFor="weightValue">Weight Value * (0.0 - 1.0)</Label>
              <Controller
                name="weightValue"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="Enter weight value"
                    className={errors.weightValue ? "border-red-500" : ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
              {errors.weightValue && (
                <p className="text-sm text-red-500">{errors.weightValue.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="isActive">Status *</Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Select 
                    value={field.value ? "active" : "inactive"} 
                    onValueChange={(value) => field.onChange(value === "active")}
                  >
                    <SelectTrigger className={errors.isActive ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.isActive && (
                <p className="text-sm text-red-500">{errors.isActive.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Enter KPI description"
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-300"
            >
              <CiSquareRemove className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {kpi ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CiFloppyDisk className="w-4 h-4" />
                  {kpi ? "Update KPI" : "Create KPI"}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}