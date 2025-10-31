"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import type { RootState, AppDispatch } from "@/lib/store/store"
import { fetchCashbookTransactions, matchOpenItems } from "@/lib/store/slices/accountingSlice"
import { Skeleton } from "@/components/ui/skeleton"

interface AllocatePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  openItems: any[]
  counterpartyType: 'CUSTOMER' | 'SUPPLIER'
  counterpartyId: string
  onSuccess?: () => void
}

export function AllocatePaymentModal({
  isOpen,
  onClose,
  openItems,
  counterpartyType,
  counterpartyId,
  onSuccess,
}: AllocatePaymentModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const cashbookTransactions = useSelector((state: RootState) => state.accounting.cashbookTransactions)
  const cashbookTransactionsLoading = useSelector((state: RootState) => state.accounting.cashbookTransactionsLoading)

  const [selectedPaymentId, setSelectedPaymentId] = useState("")
  const [allocations, setAllocations] = useState<Array<{
    openItemId: string
    allocatedAmount: number
    discountAmount: number
    description: string
    selected: boolean
  }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCashbookTransactions({ type: counterpartyType === 'CUSTOMER' ? 'RECEIPT' : 'PAYMENT', page: 1, limit: 50 }))
      // Initialize allocations from open items
      setAllocations(
        openItems.map((item) => ({
          openItemId: item.id,
          allocatedAmount: 0,
          discountAmount: 0,
          description: "",
          selected: false,
        }))
      )
    }
  }, [isOpen, dispatch, counterpartyType, openItems])

  const handleAllocationChange = (index: number, field: string, value: any) => {
    setAllocations((prev) =>
      prev.map((alloc, i) =>
        i === index ? { ...alloc, [field]: value } : alloc
      )
    )
  }

  const handleSubmit = async () => {
    if (!selectedPaymentId) {
      toast({
        title: "Error",
        description: "Please select a payment transaction",
        variant: "destructive",
      })
      return
    }

    const selectedAllocations = allocations
      .filter((a) => a.selected && a.allocatedAmount > 0)
      .map(({ selected, ...rest }) => rest)

    if (selectedAllocations.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item to allocate",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(matchOpenItems({ paymentId: selectedPaymentId, allocations: selectedAllocations })).unwrap()
      toast({
        title: "Success",
        description: "Payment allocated successfully",
      })
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to allocate payment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTransactions = cashbookTransactions.filter((t) => {
    if (counterpartyType === 'CUSTOMER') {
      return t.customerId === counterpartyId
    } else {
      return t.vendorId === counterpartyId
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Allocate Payment to Open Items</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Selection */}
          <div className="space-y-2">
            <Label>Select Payment Transaction</Label>
            {cashbookTransactionsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={selectedPaymentId} onValueChange={setSelectedPaymentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a transaction" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTransactions.map((transaction) => (
                    <SelectItem key={transaction.id} value={transaction.id}>
                      {transaction.reference} - {transaction.customer?.name || transaction.vendor?.name} - 
                      ${Number(transaction.amount).toLocaleString()} - 
                      {format(new Date(transaction.transactionDate), "yyyy-MM-dd")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Open Items Table */}
          <div className="space-y-2">
            <Label>Open Items</Label>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Select</th>
                    <th className="p-2 text-left">Reference</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Amount</th>
                    <th className="p-2 text-right">Allocated</th>
                    <th className="p-2 text-right">Discount</th>
                    <th className="p-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {openItems.map((item, index) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">
                        <Checkbox
                          checked={allocations[index]?.selected}
                          onCheckedChange={(checked) =>
                            handleAllocationChange(index, "selected", checked)
                          }
                        />
                      </td>
                      <td className="p-2">{item.reference}</td>
                      <td className="p-2">{item.description}</td>
                      <td className="p-2 text-right">${Number(item.amount).toLocaleString()}</td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={allocations[index]?.allocatedAmount || 0}
                          onChange={(e) =>
                            handleAllocationChange(index, "allocatedAmount", parseFloat(e.target.value) || 0)
                          }
                          disabled={!allocations[index]?.selected}
                          className="w-24 text-right"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={allocations[index]?.discountAmount || 0}
                          onChange={(e) =>
                            handleAllocationChange(index, "discountAmount", parseFloat(e.target.value) || 0)
                          }
                          disabled={!allocations[index]?.selected}
                          className="w-24 text-right"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={allocations[index]?.description || ""}
                          onChange={(e) =>
                            handleAllocationChange(index, "description", e.target.value)
                          }
                          disabled={!allocations[index]?.selected}
                          placeholder="Notes..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Allocating..." : "Allocate Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
