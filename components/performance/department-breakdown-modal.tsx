"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppSelector } from "@/lib/store"
import { MultiSelect } from "@/components/ui/multi-select"

interface DepartmentBreakdownModalProps {
  isOpen: boolean
  onClose: () => void
  parentGoal: any
  onSubmit: (data: any) => void
}

export function DepartmentBreakdownModal({ isOpen, onClose, parentGoal, onSubmit }: DepartmentBreakdownModalProps) {
  const { availableDepartments } = useAppSelector((state) => state.performance)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parentGoalId: parentGoal.id,
      selectedDepartments: [],
      breakdownData: [],
    },
  })

  const { fields, replace } = useFieldArray({
    control,
    name: "breakdownData",
  })

  const selectedDepartments = useWatch({
    control,
    name: "selectedDepartments",
    defaultValue: [],
  })

  useEffect(() => {
    const newFields = selectedDepartments.map((deptName: string) => ({
      title: `${deptName}: Contribution to ${parentGoal.title}`,
      targetValue: 0,
      targetUnit: parentGoal.targetUnit || "USD",
      description: `Breakdown goal for ${deptName} department.`,
      departmentName: deptName,
    }))
    replace(newFields)
  }, [selectedDepartments, parentGoal.title, parentGoal.targetUnit, replace])

  const departmentOptions = availableDepartments.map((dept: any) => ({
    value: dept.name,
    label: dept.name,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Breakdown Goal: {parentGoal.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Select Departments *</Label>
            <MultiSelect
              options={departmentOptions}
              onValueChange={(value) => setValue("selectedDepartments", value)}
              placeholder="Select departments to assign goals..."
            />
          </div>

          <div className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-4 relative">
                <h4 className="font-medium text-lg">Goal for: {selectedDepartments[index]}</h4>
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
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={selectedDepartments.length === 0}>Create Breakdown Goals</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
