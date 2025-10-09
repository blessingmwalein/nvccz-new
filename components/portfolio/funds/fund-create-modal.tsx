"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus } from "lucide-react"
import { fundCreateFormSchema, type FundCreateFormData } from "@/lib/validations/forms"
import { fundsApi } from "@/lib/api/funds-api"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/date-picker"

interface FundCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

const INDUSTRY_OPTIONS = [
  "Technology",
  "Fintech",
  "E-commerce",
  "Manufactoring",
  "Healthcare",
  "Agriculture",
  "Energy"
]

export function FundCreateModal({ isOpen, onClose, onCreated }: FundCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FundCreateFormData>({
    resolver: yupResolver(fundCreateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      totalAmount: undefined as unknown as number,
      minInvestment: undefined as unknown as number,
      maxInvestment: undefined as unknown as number,
      focusIndustries: [],
      applicationStart: "",
      applicationEnd: "",
      status: 'OPEN'
    }
  })

  const selectedIndustries = watch('focusIndustries') || []

  const onSubmit = async (data: FundCreateFormData) => {
    setIsSubmitting(true)
    try {
      await fundsApi.create({
        name: data.name,
        description: data.description,
        totalAmount: data.totalAmount,
        minInvestment: data.minInvestment,
        maxInvestment: data.maxInvestment,
        focusIndustries: data.focusIndustries,
        applicationStart: data.applicationStart,
        applicationEnd: data.applicationEnd,
        status: data.status
      })
      toast.success("Fund created successfully")
      reset()
      onCreated?.()
      onClose()
    } catch (e: any) {
      toast.error("Failed to create fund", { description: e?.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-normal">
            <Plus className="w-5 h-5" />
            Create Fund
          </DialogTitle>
          <DialogDescription>
            Add a new investment fund
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Controller name="name" control={control} render={({ field }) => (
                <Input {...field} placeholder="e.g., Tech Innovation Fund 2025" className="rounded-full" />
              )} />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Controller name="status" control={control} render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">OPEN</SelectItem>
                    <SelectItem value="CLOSED">CLOSED</SelectItem>
                    <SelectItem value="PAUSED">PAUSED</SelectItem>
                  </SelectContent>
                </Select>
              )} />
              {errors.status && <p className="text-sm text-red-600">{String(errors.status.message)}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Controller name="description" control={control} render={({ field }) => (
              <Textarea {...field} placeholder="Describe the fund focus and strategy" className="min-h-[100px]" />
            )} />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Total Amount *</Label>
              <Controller name="totalAmount" control={control} render={({ field }) => (
                <Input type="number" step="0.01" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="rounded-full" />
              )} />
              {errors.totalAmount && <p className="text-sm text-red-600">{errors.totalAmount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Min Investment *</Label>
              <Controller name="minInvestment" control={control} render={({ field }) => (
                <Input type="number" step="0.01" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="rounded-full" />
              )} />
              {errors.minInvestment && <p className="text-sm text-red-600">{errors.minInvestment.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Max Investment *</Label>
              <Controller name="maxInvestment" control={control} render={({ field }) => (
                <Input type="number" step="0.01" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="rounded-full" />
              )} />
              {errors.maxInvestment && <p className="text-sm text-red-600">{errors.maxInvestment.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Focus Industries *</Label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_OPTIONS.map(ind => {
                const checked = selectedIndustries.includes(ind)
                return (
                  <Badge
                    key={ind}
                    variant={checked ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => {
                      const next = checked 
                        ? selectedIndustries.filter(i => i !== ind)
                        : [...selectedIndustries, ind]
                      setValue('focusIndustries', next)
                    }}
                  >
                    {ind}
                  </Badge>
                )
              })}
            </div>
            {errors.focusIndustries && <p className="text-sm text-red-600">{String(errors.focusIndustries.message)}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Application Start *</Label>
              <Controller name="applicationStart" control={control} render={({ field }) => (
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(d) => field.onChange(d ? d.toISOString() : '')}
                  placeholder="mm/dd/yyyy"
                />
              )} />
              {errors.applicationStart && <p className="text-sm text-red-600">{errors.applicationStart.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Application End *</Label>
              <Controller name="applicationEnd" control={control} render={({ field }) => (
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(d) => field.onChange(d ? d.toISOString() : '')}
                  placeholder="mm/dd/yyyy"
                  allowFutureDates
                />
              )} />
              {errors.applicationEnd && <p className="text-sm text-red-600">{errors.applicationEnd.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>) : 'Create Fund'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
