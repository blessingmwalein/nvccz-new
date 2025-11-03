"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchUsersForBreakdown } from "@/lib/store/slices/performanceSlice"
import { MultiSelect } from "@/components/ui/multi-select"

interface IndividualBreakdownModalProps {
  isOpen: boolean
  onClose: () => void
  departmentGoal: any
  onSubmit: (data: any) => void
}

export function IndividualBreakdownModal({ isOpen, onClose, departmentGoal, onSubmit }: IndividualBreakdownModalProps) {
  const dispatch = useAppDispatch()
  const { breakdownUsers, breakdownUsersLoading } = useAppSelector((state) => state.performance)

  useEffect(() => {
    if (isOpen && departmentGoal.departmentName) {
      dispatch(fetchUsersForBreakdown(departmentGoal.departmentName))
    }
  }, [isOpen, departmentGoal.departmentName, dispatch])

  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      departmentGoalId: departmentGoal.id,
      selectedUsers: [],
      breakdownData: [],
    },
  })

  const { fields, replace } = useFieldArray({
    control,
    name: "breakdownData",
  })

  const selectedUsers = useWatch({
    control,
    name: "selectedUsers",
    defaultValue: [],
  })

  useEffect(() => {
    const newFields = selectedUsers.map((userId: string) => {
      const user = breakdownUsers.find(u => u.id === userId)
      const userName = user ? `${user.firstName} ${user.lastName}` : 'User'
      return {
        title: `${userName}: Contribution to ${departmentGoal.title}`,
        targetValue: 0,
        targetUnit: departmentGoal.targetUnit || "USD",
        description: `Individual goal for ${userName}.`,
        assignedToId: userId,
      }
    })
    replace(newFields)
  }, [selectedUsers, breakdownUsers, departmentGoal.title, departmentGoal.targetUnit, replace])

  const userOptions = breakdownUsers.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName} (${user.email})`,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Breakdown Department Goal: {departmentGoal.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Select Users *</Label>
            <MultiSelect
              options={userOptions}
              onValueChange={(value) => setValue("selectedUsers", value)}
              placeholder="Select users to assign goals..."
              loading={breakdownUsersLoading}
            />
          </div>

          <div className="space-y-4">
            {fields.map((item, index) => {
              const user = breakdownUsers.find(u => u.id === selectedUsers[index])
              return (
                <div key={item.id} className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-medium text-lg">Goal for: {user ? `${user.firstName} ${user.lastName}` : '...'}</h4>
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input {...register(`breakdownData.${index}.title`)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target Value *</Label>
                      <Input type="number" {...register(`breakdownData.${index}.targetValue`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Unit *</Label>
                      <Input {...register(`breakdownData.${index}.targetUnit`)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea {...register(`breakdownData.${index}.description`)} />
                  </div>
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={selectedUsers.length === 0}>Create Individual Goals</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
