"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppSelector } from "@/lib/store"
import { toast } from "sonner"

interface InitiateFundDisbursementDialogProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  applicationName: string
  onSuccess: () => void
}

export function InitiateFundDisbursementDialog({
  isOpen,
  onClose,
  applicationId,
  applicationName,
  onSuccess,
}: InitiateFundDisbursementDialogProps) {
  const token = useAppSelector((state) => state.auth.token)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    implementationPlan: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.implementationPlan.trim()) {
      toast.error("Implementation plan is required")
      return
    }

    setIsLoading(true)

    try {
      // Get application data to get portfolioCompanyId
      const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!applicationsResponse.ok) {
        throw new Error("Failed to fetch application details")
      }

      const applicationData = await applicationsResponse.json()

      const payload = {
        portfolioCompanyId: applicationData.data.portfolioCompanyId,
        applicationId,
        fundId: applicationData.data.fundId || null, // Use null if no fundId
        implementationPlan: formData.implementationPlan,
        notes: formData.notes,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/investment-implementations/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to initiate fund disbursement")
      }

      toast.success("Fund disbursement initiated successfully")
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error initiating fund disbursement:", error)
      toast.error(error.message || "Failed to initiate fund disbursement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ implementationPlan: "", notes: "" })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Initiate Fund Disbursement</DialogTitle>
          <DialogDescription>
            Initialize the investment implementation process for {applicationName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="implementationPlan">Implementation Plan *</Label>
            <Textarea
              id="implementationPlan"
              value={formData.implementationPlan}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  implementationPlan: e.target.value,
                }))
              }
              placeholder="Describe the implementation plan (e.g., Phase 1: Final due diligence and contract signing, Phase 2: Initial fund disbursement, Phase 3: Milestone-based disbursements)"
              rows={4}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Any additional notes about the investment implementation"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Initiating..." : "Initiate Disbursement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
