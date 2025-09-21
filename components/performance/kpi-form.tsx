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
import { kpiValidationSchema, KPIFormData } from "@/lib/validations/kpi-validation"

interface KPIFormProps {
  kpi?: any
  onSave: (data: KPIFormData) => void
  onClose: () => void
  isLoading?: boolean
}

export function KPIForm({ kpi, onSave, onClose, isLoading = false }: KPIFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<KPIFormData>({
    resolver: yupResolver(kpiValidationSchema),
    defaultValues: {
      name: kpi?.name || "",
      description: kpi?.description || "",
      type: kpi?.type || "Metric",
      unit: kpi?.unit || "",
      targetValue: kpi?.targetValue || 0,
      currentValue: kpi?.currentValue || 0,
      category: kpi?.category || "sales",
      frequency: kpi?.frequency || "monthly",
      departmentId: kpi?.departmentId || "",
      weightValue: kpi?.weightValue ? parseFloat(kpi.weightValue) : 0.1,
      isActive: kpi?.isActive ?? true,
    },
    mode: "onChange"
  })

  const onSubmit = async (data: KPIFormData) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onSave(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                placeholder="KPI Name"
                className={errors.name ? "border-red-500" : ""}
              />
            )}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
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
                  <SelectItem value="Metric">Metric</SelectItem>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                  <SelectItem value="Number">Number</SelectItem>
                  <SelectItem value="Currency">Currency</SelectItem>
                  <SelectItem value="Ratio">Ratio</SelectItem>
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
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="description"
              placeholder="KPI Description"
              className={errors.description ? "border-red-500" : ""}
            />
          )}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="unit">Unit *</Label>
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="unit"
                placeholder="Unit"
                className={errors.unit ? "border-red-500" : ""}
              />
            )}
          />
          {errors.unit && (
            <p className="text-sm text-red-500">{errors.unit.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="targetValue">Target Value *</Label>
          <Controller
            name="targetValue"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="targetValue"
                type="number"
                step="0.01"
                placeholder="Target"
                className={errors.targetValue ? "border-red-500" : ""}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
          {errors.targetValue && (
            <p className="text-sm text-red-500">{errors.targetValue.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentValue">Current Value *</Label>
          <Controller
            name="currentValue"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="currentValue"
                type="number"
                step="0.01"
                placeholder="Current"
                className={errors.currentValue ? "border-red-500" : ""}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
          {errors.currentValue && (
            <p className="text-sm text-red-500">{errors.currentValue.message}</p>
          )}
        </div>
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
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>
        
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="departmentId">Department ID</Label>
        <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="departmentId"
              placeholder="Department ID (optional)"
              className={errors.departmentId ? "border-red-500" : ""}
            />
          )}
        />
        {errors.departmentId && (
          <p className="text-sm text-red-500">{errors.departmentId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="weightValue">Weight Value *</Label>
          <Controller
            name="weightValue"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="weightValue"
                type="number"
                step="0.1"
                min="0"
                max="1"
                placeholder="0.1"
                className={errors.weightValue ? "border-red-500" : ""}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
          {errors.weightValue && (
            <p className="text-sm text-red-500">{errors.weightValue.message}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2 pt-6">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                id="isActive"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="rounded"
              />
            )}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="gradient-primary text-white"
          disabled={!isValid || isSubmitting || isLoading}
        >
          {isSubmitting ? "Saving..." : kpi ? "Update KPI" : "Create KPI"}
        </Button>
      </div>
    </form>
  )
}
