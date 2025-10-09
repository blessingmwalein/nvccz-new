"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Calendar, FileText, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { fundDisbursementApi, DisbursementCreateRequest } from "@/lib/api/fund-disbursement-api"

interface CreateFundDisbursementModalProps {
  isOpen: boolean
  onClose: () => void
  investmentImplementationId: string
  companyName: string
  onSuccess?: () => void
}

export function CreateFundDisbursementModal({ 
  isOpen, 
  onClose, 
  investmentImplementationId,
  companyName,
  onSuccess 
}: CreateFundDisbursementModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<DisbursementCreateRequest>({
    investmentImplementationId: investmentImplementationId,
    amount: 0,
    disbursementDate: new Date().toISOString().split('T')[0],
    disbursementType: 'INITIAL',
    notes: `Initial disbursement for ${companyName}`
  })

  const handleSubmit = async () => {
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid disbursement amount')
      return
    }

    if (!formData.disbursementDate) {
      toast.error('Please select a disbursement date')
      return
    }

    try {
      setLoading(true)
      
      // Convert date to ISO string format
      const disbursementData = {
        ...formData,
        disbursementDate: new Date(formData.disbursementDate).toISOString(),
        investmentImplementationId: investmentImplementationId
      }

      await fundDisbursementApi.createDisbursement(disbursementData)
      toast.success('Fund disbursement created successfully')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error('Failed to create fund disbursement', { 
        description: error.message 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-normal">
            <DollarSign className="w-5 h-5" />
            Create Fund Disbursement
          </DialogTitle>
          <p className="text-gray-600">
            Create a new fund disbursement for {companyName}
          </p>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {/* Disbursement Details */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Disbursement Details</h3>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Amount & Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Disbursement Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="Enter amount..."
                      className="rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disbursementType">Disbursement Type</Label>
                    <Select 
                      value={formData.disbursementType} 
                      onValueChange={(value: 'INITIAL' | 'MILESTONE' | 'FINAL') => 
                        setFormData(prev => ({ ...prev, disbursementType: value }))
                      }
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INITIAL">Initial Disbursement</SelectItem>
                        <SelectItem value="MILESTONE">Milestone Disbursement</SelectItem>
                        <SelectItem value="FINAL">Final Disbursement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Disbursement Date */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Schedule</h3>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Disbursement Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="disbursementDate">Date</Label>
                  <Input
                    id="disbursementDate"
                    type="date"
                    value={formData.disbursementDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, disbursementDate: e.target.value }))}
                    className="rounded-lg"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-gray-900">Additional Information</h3>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-normal flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Disbursement Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter disbursement notes..."
                    rows={4}
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </form>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-full">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full"
          >
            {loading ? 'Creating...' : 'Create Disbursement'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
