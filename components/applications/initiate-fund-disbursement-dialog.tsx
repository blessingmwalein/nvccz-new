"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { initiateInvestmentImplementation } from "@/lib/store/slices/applicationPortalSlice"
import { toast } from "sonner"

interface InitiateFundDisbursementDialogProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  applicationName: string
  portfolioCompanyId: string
  fundId: string | null
  onSuccess: () => void
  onRefresh?: () => void
}

export function InitiateFundDisbursementDialog({
  isOpen,
  onClose,
  applicationId,
  applicationName,
  portfolioCompanyId,
  fundId,
  onSuccess,
  onRefresh,
}: InitiateFundDisbursementDialogProps) {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.applicationPortal)
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

    try {
      await dispatch(initiateInvestmentImplementation({
        portfolioCompanyId,
        applicationId,
        fundId,
        implementationPlan: formData.implementationPlan,
        notes: formData.notes || undefined,
      })).unwrap()

      toast.success("Fund disbursement initiated successfully")
      
      // Trigger both callbacks
      onSuccess()
      if (onRefresh) {
        onRefresh()
      }
      
      // Reset form and close
      setFormData({ implementationPlan: "", notes: "" })
      onClose()
    } catch (error: any) {
      toast.error(error || "Failed to initiate fund disbursement")
    }
  }

  const handleClose = () => {
    if (!loading) {
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            >
              {loading ? "Initiating..." : "Initiate Disbursement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
