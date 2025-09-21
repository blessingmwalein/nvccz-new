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

const departmentValidationSchema = yup.object({
  name: yup
    .string()
    .required('Department name is required')
    .min(3, 'Department name must be at least 3 characters')
    .max(100, 'Department name must not exceed 100 characters'),
  
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  
  branch: yup
    .string()
    .required('Branch is required')
    .max(50, 'Branch must not exceed 50 characters'),
  
  isActive: yup
    .boolean()
    .required('Active status is required')
})

export type DepartmentFormData = yup.InferType<typeof departmentValidationSchema>

interface DepartmentFormProps {
  department?: any
  onSave: (data: DepartmentFormData) => void
  onClose: () => void
  isLoading?: boolean
}

export function DepartmentForm({ department, onSave, onClose, isLoading = false }: DepartmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<DepartmentFormData>({
    resolver: yupResolver(departmentValidationSchema),
    defaultValues: {
      name: department?.name || "",
      description: department?.description || "",
      branch: department?.branch || "main",
      isActive: department?.isActive ?? true,
    },
    mode: "onChange"
  })

  const onSubmit = async (data: DepartmentFormData) => {
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
      <div className="space-y-2">
        <Label htmlFor="name">Department Name *</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="name"
              placeholder="Department Name"
              className={errors.name ? "border-red-500" : ""}
            />
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
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
              placeholder="Department Description"
              className={errors.description ? "border-red-500" : ""}
            />
          )}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="branch">Branch *</Label>
        <Controller
          name="branch"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="branch"
              placeholder="Branch"
              className={errors.branch ? "border-red-500" : ""}
            />
          )}
        />
        {errors.branch && (
          <p className="text-sm text-red-500">{errors.branch.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
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
          {isSubmitting ? "Saving..." : department ? "Update Department" : "Create Department"}
        </Button>
      </div>
    </form>
  )
}
