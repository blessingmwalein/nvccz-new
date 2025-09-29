"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command"
import { goalValidationSchema, GoalFormData } from "@/lib/validations/goal-validation"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { usersApi } from "@/lib/api/users-api"
import { setUsers, setUsersError, setUsersLoading } from "@/lib/store/slices/usersSlice"
import { User, AlertCircle } from "lucide-react"

interface GoalFormModalProps {
  goal?: any
  departments: any[]
  onSave: (data: any) => void
  onClose: () => void
}

export function GoalFormModal({ goal, departments, onSave, onClose }: GoalFormModalProps) {
  const dispatch = useAppDispatch()
  const { items: users, loading: usersLoading } = useAppSelector(state => state.users)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false)
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch
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
      assignedToId: goal?.assignedToId || "none",
      status: goal?.status || "not_started",
      progress: goal?.progress || 0,
    },
    mode: "onChange"
  })

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        dispatch(setUsersLoading(true))
        dispatch(setUsersError(null))
        const res = await usersApi.getAll()
        dispatch(setUsers(res.data || []))
      } catch (e: any) {
        dispatch(setUsersError(e?.message || 'Failed to load users'))
      } finally {
        dispatch(setUsersLoading(false))
      }
    }
    loadUsers()
  }, [dispatch])

  const onSubmit = async (data: GoalFormData) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      // Convert "none" to empty string for API
      const submitData = {
        ...data,
        assignedToId: data.assignedToId === "none" ? "" : data.assignedToId
      }
      await onSave(submitData)
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

  const selectedUserId = watch('assignedToId')
  const selectedUser = users.find(user => user.id === selectedUserId)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Row 1: Title, Type, Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Goal Title *</Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="title"
                placeholder="Enter goal title"
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
      </div>

      {/* Description - Full width textarea */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="description"
              placeholder="Enter goal description"
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
          )}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Row 2: Department, Assigned To, Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departmentId">Department *</Label>
          <Controller
            name="departmentId"
            control={control}
            render={({ field }) => (
              <Popover open={isDepartmentOpen} onOpenChange={setIsDepartmentOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-between rounded-full">
                    {field.value ? (
                      <span className="truncate text-left">
                        {departments.find(d => d.id === field.value)?.name}
                      </span>
                    ) : (
                      <span className="text-gray-500">Choose a department...</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[420px]" align="start">
                  <Command>
                    <CommandInput placeholder="Search departments by name..." />
                    <CommandEmpty>No departments found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {departments.map(dept => (
                        <CommandItem
                          key={dept.id}
                          value={dept.name}
                          onSelect={() => {
                            field.onChange(dept.id)
                            setIsDepartmentOpen(false)
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{dept.name}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.departmentId && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.departmentId.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assignedToId">Assigned To</Label>
          <Controller
            name="assignedToId"
            control={control}
            render={({ field }) => (
              <Popover open={isUserOpen} onOpenChange={setIsUserOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-between rounded-full">
                    {field.value && field.value !== "none" ? (
                      <span className="truncate text-left">
                        {users.find(u => u.id === field.value)?.firstName} {users.find(u => u.id === field.value)?.lastName}
                        <span className="text-gray-500 text-xs ml-2">{users.find(u => u.id === field.value)?.email}</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">Choose a user...</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[420px]" align="start">
                  <Command>
                    <CommandInput placeholder="Search users by name or email..." />
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      <CommandItem
                        value="none"
                        onSelect={() => {
                          field.onChange("none")
                          setIsUserOpen(false)
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">No assignment</span>
                          <span className="text-sm text-gray-500">Leave unassigned</span>
                        </div>
                      </CommandItem>
                      {users.map(user => (
                        <CommandItem
                          key={user.id}
                          value={`${user.firstName} ${user.lastName} ${user.email}`}
                          onSelect={() => {
                            field.onChange(user.id)
                            setIsUserOpen(false)
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{user.firstName} {user.lastName}</span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.assignedToId && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.assignedToId.message}
            </p>
          )}
        </div>

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
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.priority && (
            <p className="text-sm text-red-500">{errors.priority.message}</p>
          )}
        </div>
      </div>

      {/* Row 3: Status, Start Date, End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <SelectItem value="active">Active</SelectItem>
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
        
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal rounded-full ${errors.startDate ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ? date.toISOString().split('T')[0] : '')
                      setIsStartDateOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.startDate.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal rounded-full ${errors.endDate ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ? date.toISOString().split('T')[0] : '')
                      setIsEndDateOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 4: Monetary Value, Percent Value, Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                placeholder="0.00"
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
                placeholder="0.0"
                className={errors.percentValue ? "border-red-500" : ""}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
          {errors.percentValue && (
            <p className="text-sm text-red-500">{errors.percentValue.message}</p>
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

      <div className="flex justify-end gap-2 pt-4 border-t">
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
          className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (goal ? "Updating..." : "Creating...") : (goal ? "Update Goal" : "Create Goal")}
        </Button>
      </div>
    </form>
  )
}
