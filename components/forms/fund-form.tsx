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
import { fundFormSchema, type FundFormData } from "@/lib/validations/forms"
import { useAppDispatch } from "@/lib/store"
import { addFund } from "@/lib/store/slices/fundsSlice"
import { Wallet, Plus } from "lucide-react"

interface FundFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function FundForm({ onSuccess, onCancel }: FundFormProps) {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FundFormData>({
    resolver: yupResolver(fundFormSchema),
  })

  const onSubmit = async (data: FundFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const newFund = {
        id: Date.now().toString(),
        name: data.name,
        type: data.type,
        vintage: data.vintage,
        size: data.size,
        committed: 0,
        deployed: 0,
        remaining: data.size,
        irr: 0,
        multiple: 1,
        status: "Active" as const,
        investors: 0,
        companies: 0,
      }

      dispatch(addFund(newFund))

      toast.success("Fund created successfully", {
        description: `${data.name} has been created and is ready for investments`,
      })

      reset()
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to create fund", {
        description: "Please check your information and try again",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Create New Fund
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Fund Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter fund name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Fund Type</Label>
              <Select onValueChange={(value) => setValue("type", value)}>
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select fund type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                  <SelectItem value="Growth Equity">Growth Equity</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Private Equity">Private Equity</SelectItem>
                  <SelectItem value="Debt Fund">Debt Fund</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Fund Size ($)</Label>
              <Input
                id="size"
                type="number"
                {...register("size", { valueAsNumber: true })}
                placeholder="Enter fund size"
                className={errors.size ? "border-red-500" : ""}
              />
              {errors.size && <p className="text-sm text-red-500">{errors.size.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vintage">Vintage Year</Label>
              <Select onValueChange={(value) => setValue("vintage", value)}>
                <SelectTrigger className={errors.vintage ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select vintage year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                </SelectContent>
              </Select>
              {errors.vintage && <p className="text-sm text-red-500">{errors.vintage.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy">Investment Strategy</Label>
            <Textarea
              id="strategy"
              {...register("strategy")}
              placeholder="Describe the fund's investment strategy, target sectors, and investment criteria..."
              rows={4}
              className={errors.strategy ? "border-red-500" : ""}
            />
            {errors.strategy && <p className="text-sm text-red-500">{errors.strategy.message}</p>}
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
                "Creating..."
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Fund
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
