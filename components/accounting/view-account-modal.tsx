"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator, 
  CheckCircle, 
  Clock, 
  Hash,
  Type,
  FileText,
  Calendar,
  StickyNote
} from "lucide-react"
import { ChartOfAccount } from "@/lib/api/accounting-api"

interface ViewAccountModalProps {
  isOpen: boolean
  onClose: () => void
  account?: ChartOfAccount | null
}

export function ViewAccountModal({ isOpen, onClose, account }: ViewAccountModalProps) {
  if (!account) return null

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getAccountTypeColor = (accountType: string) => {
    const colorMap: Record<string, string> = {
      'Current Asset': 'bg-blue-100 text-blue-800',
      'Fixed Asset': 'bg-indigo-100 text-indigo-800',
      'Long-Term Asset': 'bg-purple-100 text-purple-800',
      'Current Liability': 'bg-red-100 text-red-800',
      'Long-Term Liability': 'bg-pink-100 text-pink-800',
      'Equity': 'bg-green-100 text-green-800',
      'Revenue': 'bg-emerald-100 text-emerald-800',
      'Expense': 'bg-yellow-100 text-yellow-800',
      'Income': 'bg-teal-100 text-teal-800',
      'Contra-Asset': 'bg-gray-100 text-gray-800'
    }
    return colorMap[accountType] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{account.accountName}</span>
              </div>
              <p className="text-sm text-gray-500 font-normal">Account Details</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Row 1: Account Number & Account Type */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Hash className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Account Number</p>
                <p className="font-semibold text-gray-900 text-lg">{account.accountNo}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Type className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Account Type</p>
                <Badge className={getAccountTypeColor(account.accountType)}>
                  {account.accountType}
                </Badge>
              </div>
            </div>
          </div>

          {/* Row 2: Account Name (Full Width) */}
          <div className="flex items-start gap-3">
            <Type className="w-4 h-4 text-gray-400 mt-1" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Account Name</p>
              <p className="font-semibold text-gray-900 text-lg">{account.accountName}</p>
            </div>
          </div>

          {/* Row 3: Financial Statement & Status */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Financial Statement</p>
                <p className="font-medium text-gray-900">{account.financialStatement}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {getStatusIcon(account.isActive)}
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</p>
                <Badge className={getStatusColor(account.isActive)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(account.isActive)}
                    {account.isActive ? 'Active' : 'Inactive'}
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          {/* Row 4: Notes (if available) */}
          {account.notes && (
            <div className="flex items-start gap-3">
              <StickyNote className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-gray-900 leading-relaxed">{account.notes}</p>
              </div>
            </div>
          )}

          {/* Row 5: Created & Last Updated */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(account.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(account.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(account.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(account.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}