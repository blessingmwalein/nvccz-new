"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"
import type { Asset } from "@/lib/api/accounting-api"
import { accountingApi } from "@/lib/api/accounting-api"

interface CalculateDepreciationModalProps {
  isOpen: boolean
  onClose: () => void
  asset: Asset
  onSuccess: () => void
}

export function CalculateDepreciationModal({ isOpen, onClose, asset, onSuccess }: CalculateDepreciationModalProps) {
  const [loading, setLoading] = useState(false)
  const [depreciationDate, setDepreciationDate] = useState<Date>(new Date())
  const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const data = {
        depreciationDate: format(depreciationDate, 'yyyy-MM-dd'),
        period
      }

      const response = await accountingApi.calculateDepreciation(asset.id, data)
      
      if (response.success) {
        toast.success('Depreciation calculated successfully')
        onSuccess()
      } else {
        toast.error(response.error || 'Failed to calculate depreciation')
      }
    } catch (error: any) {
      if (error.message.includes('already calculated')) {
        toast.error('Depreciation already calculated for this period')
      } else {
        toast.error('Failed to calculate depreciation')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculate Depreciation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Asset: {asset.assetName}</h3>
            <p className="text-sm text-gray-600">Code: {asset.assetCode}</p>
            <p className="text-sm text-gray-600">
              Current Book Value: ${parseFloat(asset.currentBookValue).toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Depreciation Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-full",
                      !depreciationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {depreciationDate ? format(depreciationDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={depreciationDate}
                    onSelect={(date) => date && setDepreciationDate(date)}
                    initialFocus
                    className="rounded-xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="period">Period (YYYY-MM)</Label>
              <Input
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g., 2025-01"
                pattern="^\d{4}-\d{2}$"
                required
                className="rounded-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: YYYY-MM (e.g., 2025-01 for January 2025)
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-sm"
            >
              {loading ? 'Calculating...' : 'Calculate Depreciation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
