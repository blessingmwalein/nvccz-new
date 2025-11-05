"use client"

import { useEffect, useMemo } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { MultiSelect } from "@/components/ui/multi-select"
import { toast } from "sonner"
import { fetchUsersForBreakdown } from "@/lib/store/slices/performanceSlice"
import { Skeleton } from "@/components/ui/skeleton"

interface IndividualBreakdownModalProps {
  isOpen: boolean
  onClose: () => void
  parentGoal: any
  onSubmit: (data: any) => void
}

// Yup validation schema
const individualBreakdownSchema = yup.object({
  parentGoalId: yup.string().required("Parent goal ID is required"),
  selectedUsers: yup
    .array()
    .of(yup.string())
    .min(1, "At least one user must be selected")
    .required("Please select at least one user"),
  breakdownData: yup.array().of(
    yup.object({
      title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
      targetValue: yup
        .number()
        .typeError("Target value must be a number")
        .required("Target value is required")
        .min(0.01, "Target value must be greater than 0"),
      targetUnit: yup.string().required("Target unit is required"),
      description: yup.string(),
      userId: yup.string().required(),
    })
  ),
})

export function IndividualBreakdownModal({ isOpen, onClose, parentGoal, onSubmit }: IndividualBreakdownModalProps) {
  const dispatch = useAppDispatch()
  const { breakdownUsers, breakdownUsersLoading } = useAppSelector((state) => state.performance)
  
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(individualBreakdownSchema),
    defaultValues: {
      parentGoalId: parentGoal?.id || "",
      departmentName: parentGoal?.department?.name || "",
      selectedUsers: [],
      breakdownData: [],
    },
  })

  const { fields, replace } = useFieldArray({
    control,
    name: "breakdownData",
  })

  const selectedUsers = watch("selectedUsers", [])

  // Fetch users when modal opens - using department name from parentGoal
  useEffect(() => {
    if (isOpen && parentGoal) {
      // Try to get department name from various possible locations
      const departmentName = parentGoal.department?.name || parentGoal.departmentName
      
      console.log('Parent Goal:', parentGoal)
      console.log('Department Name:', departmentName)
      console.log('Department ID:', parentGoal.departmentId)
      
      if (departmentName) {
        console.log('Fetching users for department:', departmentName)
        dispatch(fetchUsersForBreakdown(departmentName))
          .unwrap()
          .then((users) => {
            console.log('Fetched users:', users)
            if (!users || users.length === 0) {
              toast.info('No users found in this department', {
                description: 'Please assign users to this department first.'
              })
            }
          })
          .catch((error) => {
            console.error('Failed to fetch users:', error)
            toast.error('Failed to load users', {
              description: error.message || 'Please try again'
            })
          })
      } else {
        console.error('No department name available')
        toast.error('Department information missing', {
          description: 'Cannot load users without department information'
        })
      }
    }
  }, [isOpen, parentGoal, dispatch])

  // Update parent goal ID when it changes
  useEffect(() => {
    if (parentGoal?.id) {
      setValue("parentGoalId", parentGoal.id)
      const departmentName = parentGoal.department?.name || parentGoal.departmentName || ""
      setValue("departmentName", departmentName)
    }
  }, [parentGoal, setValue])

  // Generate breakdown data when users are selected
  useEffect(() => {
    if (!parentGoal) return
    
    const newFields = selectedUsers.map((userId: string) => {
      const user = breakdownUsers.find((u: any) => u.id === userId)
      const userName = user ? `${user.firstName} ${user.lastName}` : 'User'
      
      return {
        title: `${userName}: Contribution to ${parentGoal.title}`,
        targetValue: 0,
        targetUnit: parentGoal.targetUnit || "USD",
        description: `Individual goal for ${userName}.`,
        userId: userId,
      }
    })
    replace(newFields)
  }, [selectedUsers, parentGoal, breakdownUsers, replace])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const userOptions = useMemo(() => {
    console.log('Breakdown users:', breakdownUsers)
    if (!Array.isArray(breakdownUsers) || breakdownUsers.length === 0) {
      return []
    }
    return breakdownUsers.map((user: any) => ({
      value: user.id,
      label: `${user.firstName || 'Unknown'} ${user.lastName || 'User'} (${user.email || 'No email'})`,
    }))
  }, [breakdownUsers])

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data)
      toast.success("Individual breakdown goals created successfully", {
        description: "Goals have been assigned to selected users."
      })
      reset()
      onClose()
    } catch (error: any) {
      console.error("Error submitting form:", error)
      toast.error("Failed to create breakdown goals", {
        description: error.message || "An error occurred"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Breakdown Department Goal: {parentGoal?.title || 'Goal'}</DialogTitle>
          {parentGoal && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Department: {parentGoal.department?.name || parentGoal.departmentName || 'Unknown'}</p>
              <p className="text-xs">Department ID: {parentGoal.departmentId || 'Not set'}</p>
              {parentGoal.type && <p className="text-xs">Goal Type: {parentGoal.type}</p>}
            </div>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* User Selection */}
          <Controller
            name="selectedUsers"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Select Users *</Label>
                {breakdownUsersLoading ? (
                  <div className="space-y-2 mt-2">
                    <Skeleton className="h-10 w-full" />
                    <p className="text-xs text-muted-foreground">Loading users from department...</p>
                  </div>
                ) : (
                  <>
                    <MultiSelect
                      options={userOptions}
                      onValueChange={field.onChange}
                      value={field.value}
                      placeholder="Select users to assign individual goals..."
                      disabled={userOptions.length === 0}
                      className="mt-2"
                    />
                    {errors.selectedUsers && (
                      <p className="text-xs text-red-500 mt-1">{errors.selectedUsers.message}</p>
                    )}
                    {userOptions.length === 0 && !breakdownUsersLoading && (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <p className="text-xs text-amber-700 font-medium mb-2">
                          No users available in this department. Please ensure users are assigned to the department.
                        </p>
                        <div className="text-xs text-amber-600 space-y-1">
                          <p>Department: {parentGoal?.department?.name || parentGoal?.departmentName || 'Unknown'}</p>
                          <p>Department ID: {parentGoal?.departmentId || 'Not set'}</p>
                          <p>Goal Type: {parentGoal?.type || 'Not set'}</p>
                        </div>
                        {(parentGoal?.department?.name || parentGoal?.departmentName) && (
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={() => {
                              const deptName = parentGoal.department?.name || parentGoal.departmentName
                              console.log('Retrying fetch for department:', deptName)
                              dispatch(fetchUsersForBreakdown(deptName))
                            }}
                            className="h-auto p-0 text-amber-700 underline mt-2"
                          >
                            Retry loading users
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          />

          {/* Breakdown Data Fields */}
          <div className="space-y-4">
            {fields.map((item, index) => {
              const user = breakdownUsers.find((u: any) => u.id === selectedUsers[index])
              const userName = user ? `${user.firstName} ${user.lastName}` : 'User'
              
              return (
                <div key={item.id} className="p-4 border rounded-lg space-y-4 relative bg-muted/30">
                  <h4 className="font-medium text-lg">Goal for: {userName}</h4>
                  
                  {/* Title */}
                  <Controller
                    name={`breakdownData.${index}.title`}
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input 
                          {...field}
                          placeholder="Enter goal title"
                          className={errors.breakdownData?.[index]?.title ? "border-red-500" : ""}
                        />
                        {errors.breakdownData?.[index]?.title && (
                          <p className="text-xs text-red-500">{errors.breakdownData[index].title?.message}</p>
                        )}
                      </div>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    {/* Target Value */}
                    <Controller
                      name={`breakdownData.${index}.targetValue`}
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label>Target Value *</Label>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            placeholder="Enter target value"
                            className={errors.breakdownData?.[index]?.targetValue ? "border-red-500" : ""}
                          />
                          {errors.breakdownData?.[index]?.targetValue && (
                            <p className="text-xs text-red-500">{errors.breakdownData[index].targetValue?.message}</p>
                          )}
                        </div>
                      )}
                    />

                    {/* Target Unit */}
                    <Controller
                      name={`breakdownData.${index}.targetUnit`}
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label>Target Unit *</Label>
                          <Input 
                            {...field}
                            placeholder="e.g., USD, %"
                            className={errors.breakdownData?.[index]?.targetUnit ? "border-red-500" : ""}
                          />
                          {errors.breakdownData?.[index]?.targetUnit && (
                            <p className="text-xs text-red-500">{errors.breakdownData[index].targetUnit?.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <Controller
                    name={`breakdownData.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          {...field}
                          placeholder="Enter goal description (optional)"
                          rows={3}
                        />
                      </div>
                    )}
                  />
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {selectedUsers.length === 0 && !breakdownUsersLoading && (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/30">
              <p>Please select users to create individual breakdown goals</p>
            </div>
          )}

          {/* Footer Buttons */}
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={selectedUsers.length === 0 || isSubmitting || breakdownUsersLoading}
              className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Individual Goals"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
