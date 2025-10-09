"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"

interface FundDisbursementConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  disbursementData: {
    amount: number
    disbursementDate: Date
    paymentMethod: string
    referenceNumber: string
  }
  loading?: boolean
}

export function FundDisbursementConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  disbursementData,
  loading = false,
}: FundDisbursementConfirmationDialogProps) {
  const paymentMethodLabels: Record<string, string> = {
    BANK_TRANSFER: "Bank Transfer",
    CHECK: "Check",
    WIRE_TRANSFER: "Wire Transfer",
    OTHER: "Other",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Fund Disbursement</DialogTitle>
          <DialogDescription>
            Please review the disbursement details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium text-gray-500 col-span-1">Amount</p>
            <p className="text-sm text-gray-900 col-span-3">${disbursementData.amount.toLocaleString()}</p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium text-gray-500 col-span-1">Date</p>
            <p className="text-sm text-gray-900 col-span-3">
              {format(new Date(disbursementData.disbursementDate), "PPP")}
            </p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium text-gray-500 col-span-1">Method</p>
            <p className="text-sm text-gray-900 col-span-3">
              {paymentMethodLabels[disbursementData.paymentMethod] || disbursementData.paymentMethod}
            </p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium text-gray-500 col-span-1">Reference</p>
            <p className="text-sm text-gray-900 col-span-3 font-mono">
              {disbursementData.referenceNumber}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Processing..." : "Confirm Disbursement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
