"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { applicationFormSchema, type ApplicationFormData } from "@/lib/validations/forms"
import { useAppDispatch } from "@/lib/store"
import { addApplication } from "@/lib/store/slices/applicationsSlice"
import { FileText, Send } from "lucide-react"

interface ApplicationFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ApplicationForm({ onSuccess, onCancel }: ApplicationFormProps) {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: yupResolver(applicationFormSchema),
  })

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newApplication = {
        id: Date.now().toString(),
        companyName: data.companyName,
        sector: data.sector,
        requestedAmount: data.requestedAmount,
        stage: "Initial Screening" as const,
        status: "Pending" as const,
        submittedDate: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
      }

      dispatch(addApplication(newApplication))

      toast.success("Application submitted successfully", {
        description: `Application for ${data.companyName} has been submitted for review`,
      })

      reset()
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to submit application", {
        description: "Please check your information and try again",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Investment Application
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                {...register("companyName")}
                placeholder="Enter company name"
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Select onValueChange={(value) => setValue("sector", value)}>
                <SelectTrigger className={errors.sector ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Clean Energy">Clean Energy</SelectItem>
                  <SelectItem value="Fintech">Fintech</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
              {errors.sector && <p className="text-sm text-red-500">{errors.sector.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestedAmount">Requested Amount ($)</Label>
              <Input
                id="requestedAmount"
                type="number"
                {...register("requestedAmount", { valueAsNumber: true })}
                placeholder="Enter requested amount"
                className={errors.requestedAmount ? "border-red-500" : ""}
              />
              {errors.requestedAmount && <p className="text-sm text-red-500">{errors.requestedAmount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                {...register("contactEmail")}
                placeholder="Enter contact email"
                className={errors.contactEmail ? "border-red-500" : ""}
              />
              {errors.contactEmail && <p className="text-sm text-red-500">{errors.contactEmail.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                {...register("contactPhone")}
                placeholder="Enter contact phone number"
                className={errors.contactPhone ? "border-red-500" : ""}
              />
              {errors.contactPhone && <p className="text-sm text-red-500">{errors.contactPhone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessPlan">Business Plan Summary</Label>
            <Textarea
              id="businessPlan"
              {...register("businessPlan")}
              placeholder="Provide a detailed summary of your business plan, market opportunity, and growth strategy..."
              rows={6}
              className={errors.businessPlan ? "border-red-500" : ""}
            />
            {errors.businessPlan && <p className="text-sm text-red-500">{errors.businessPlan.message}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
