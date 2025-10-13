"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Star,
  Calendar,
  Hash,
  Type,
  CircleDollarSign
} from "lucide-react"
import { AccountingCurrency } from "@/lib/api/accounting-api"

interface ViewCurrencyModalProps {
  isOpen: boolean
  onClose: () => void
  currency?: AccountingCurrency | null
}

export function ViewCurrencyModal({ isOpen, onClose, currency }: ViewCurrencyModalProps) {
  if (!currency) return null

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{currency.name}</span>
                {currency.isDefault && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
              <p className="text-sm text-gray-500 font-normal">Currency Details</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Row 1: Currency Code & Symbol */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Hash className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Currency Code</p>
                <p className="font-semibold text-gray-900 text-lg">{currency.code}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CircleDollarSign className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Symbol</p>
                <p className="font-semibold text-gray-900 text-2xl">{currency.symbol}</p>
              </div>
            </div>
          </div>

          {/* Row 2: Currency Name (Full Width) */}
          <div className="flex items-start gap-3">
            <Type className="w-4 h-4 text-gray-400 mt-1" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Currency Name</p>
              <p className="font-semibold text-gray-900 text-lg">{currency.name}</p>
            </div>
          </div>

          {/* Row 3: Status & Default */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              {getStatusIcon(currency.isActive)}
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</p>
                <Badge className={getStatusColor(currency.isActive)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(currency.isActive)}
                    {currency.isActive ? 'Active' : 'Inactive'}
                  </div>
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Star className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Default</p>
                {currency.isDefault ? (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                ) : (
                  <span className="text-gray-400 text-sm">Not Default</span>
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Created & Last Updated */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(currency.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(currency.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(currency.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(currency.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}