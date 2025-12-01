"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { investmentImplementationApi, type ChecklistUpdateRequest, type ChecklistData } from "@/lib/api/investment-implementation-api"

interface ChecklistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  implementationId: string
  currentChecklist?: ChecklistData | null
  onSuccess: () => Promise<void>
}

export function ChecklistModal({ open, onOpenChange, implementationId, currentChecklist, onSuccess }: ChecklistModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ChecklistUpdateRequest>({
    finalDueDiligence: false,
    contractsSigned: false,
    fundsDisbursed: false,
    notes: ''
  })

  // Initialize form with current checklist data when modal opens
  useEffect(() => {
    if (open && currentChecklist) {
      setFormData({
        finalDueDiligence: currentChecklist.finalDueDiligence || false,
        contractsSigned: currentChecklist.contractsSigned || false,
        fundsDisbursed: currentChecklist.fundsDisbursed || false,
        notes: currentChecklist.notes || ''
      })
    }
  }, [open, currentChecklist])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      await investmentImplementationApi.updateChecklist(implementationId, formData)
      toast.success('Checklist updated successfully')
      
      onOpenChange(false)
      await onSuccess()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update checklist'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Implementation Checklist</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Checkbox
                id="finalDueDiligence"
                checked={formData.finalDueDiligence}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, finalDueDiligence: checked as boolean })
                }
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="finalDueDiligence" 
                className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Final Due Diligence Completed
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Checkbox
                id="contractsSigned"
                checked={formData.contractsSigned}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, contractsSigned: checked as boolean })
                }
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="contractsSigned" 
                className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                All Contracts Signed
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Checkbox
                id="fundsDisbursed"
                checked={formData.fundsDisbursed}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, fundsDisbursed: checked as boolean })
                }
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="fundsDisbursed" 
                className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Funds Successfully Disbursed
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any relevant notes or comments about the implementation progress..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Checklist
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
