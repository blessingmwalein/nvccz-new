"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { companyFormSchema, type CompanyFormData } from "@/lib/validations/forms"
import { useAppDispatch } from "@/lib/store"
import { addCompany } from "@/lib/store/slices/companiesSlice"
import { Building2, Save } from "lucide-react"

interface CompanyFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CompanyForm({ onSuccess, onCancel }: CompanyFormProps) {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CompanyFormData>({
    resolver: yupResolver(companyFormSchema),
  })

  const onSubmit = async (data: CompanyFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newCompany = {
        id: Date.now().toString(),
        ...data,
        status: "Active" as const,
        lastUpdate: new Date().toISOString().split("T")[0],
        performance: Math.random() * 30 + 5, // Random performance between 5-35%
      }

      dispatch(addCompany(newCompany))

      toast.success("Company added successfully", {
        description: `${data.name} has been added to your portfolio`,
      })

      reset()
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to add company", {
        description: "Please try again later",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Add New Company
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter company name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
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
                </SelectContent>
              </Select>
              {errors.sector && <p className="text-sm text-red-500">{errors.sector.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select onValueChange={(value) => setValue("stage", value)}>
                <SelectTrigger className={errors.stage ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Series A">Series A</SelectItem>
                  <SelectItem value="Series B">Series B</SelectItem>
                  <SelectItem value="Series C">Series C</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                </SelectContent>
              </Select>
              {errors.stage && <p className="text-sm text-red-500">{errors.stage.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment">Investment Amount ($)</Label>
              <Input
                id="investment"
                type="number"
                {...register("investment", { valueAsNumber: true })}
                placeholder="Enter investment amount"
                className={errors.investment ? "border-red-500" : ""}
              />
              {errors.investment && <p className="text-sm text-red-500">{errors.investment.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valuation">Valuation ($)</Label>
              <Input
                id="valuation"
                type="number"
                {...register("valuation", { valueAsNumber: true })}
                placeholder="Enter company valuation"
                className={errors.valuation ? "border-red-500" : ""}
              />
              {errors.valuation && <p className="text-sm text-red-500">{errors.valuation.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownership">Ownership (%)</Label>
              <Input
                id="ownership"
                type="number"
                step="0.1"
                {...register("ownership", { valueAsNumber: true })}
                placeholder="Enter ownership percentage"
                className={errors.ownership ? "border-red-500" : ""}
              />
              {errors.ownership && <p className="text-sm text-red-500">{errors.ownership.message}</p>}
            </div>
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
                "Adding..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Add Company
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
