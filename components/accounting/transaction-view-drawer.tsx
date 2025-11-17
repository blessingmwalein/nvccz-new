"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { 
  FileText, 
  Download, 
  Calendar, 
  Hash, 
  DollarSign, 
  Building2, 
  User, 
  Mail,
  CreditCard,
  Eye
} from "lucide-react"
import { toast } from "sonner"

interface Transaction {
  id: string
  date: string
  reference: string
  description: string
  debitAmount: number
  creditAmount: number
  source: string
  journalEntry?: {
    id: string
    referenceNumber: string
    description: string
    transactionDate: string
    status: string
    currencyId: string
  }
  sourceTransaction?: {
    id: string
    type?: string
    amount?: number
    description?: string
    reference?: string
    transactionDate?: string
    status?: string
    referenceNumber?: string
    bank?: {
      id: string
      name: string
      accountNumber: string
    }
    customer?: {
      id: string
      name: string
      email: string
    } | null
    vendor?: {
      id: string
      name: string
      email: string
    } | null
  }
  journalEntryId?: string
  journalEntryStatus?: string
}

interface TransactionViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

export function TransactionViewDrawer({ isOpen, onClose, transaction }: TransactionViewDrawerProps) {
  if (!transaction) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const handleExportTransaction = () => {
    try {
      const data = {
        Transaction: {
          ID: transaction.id,
          Date: format(new Date(transaction.date), 'PP'),
          Reference: transaction.reference,
          Description: transaction.description,
          'Debit Amount': formatCurrency(transaction.debitAmount),
          'Credit Amount': formatCurrency(transaction.creditAmount),
          Source: transaction.source,
          Status: transaction.journalEntryStatus || 'N/A'
        },
        'Journal Entry': transaction.journalEntry ? {
          ID: transaction.journalEntry.id,
          Reference: transaction.journalEntry.referenceNumber,
          Description: transaction.journalEntry.description,
          Date: format(new Date(transaction.journalEntry.transactionDate), 'PP'),
          Status: transaction.journalEntry.status
        } : null,
        'Source Transaction': transaction.sourceTransaction ? {
          ID: transaction.sourceTransaction.id,
          Type: transaction.sourceTransaction.type || 'N/A',
          Amount: transaction.sourceTransaction.amount ? formatCurrency(transaction.sourceTransaction.amount) : 'N/A',
          Reference: transaction.sourceTransaction.reference || transaction.sourceTransaction.referenceNumber || 'N/A',
          Bank: transaction.sourceTransaction.bank?.name || 'N/A',
          Customer: transaction.sourceTransaction.customer?.name || 'N/A',
          Vendor: transaction.sourceTransaction.vendor?.name || 'N/A'
        } : null
      }

      const jsonStr = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transaction_${transaction.reference}_${format(new Date(), 'yyyyMMdd')}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Transaction exported successfully')
    } catch (error) {
      toast.error('Failed to export transaction')
    }
  }

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'CASHBOOK':
        return 'bg-blue-100 text-blue-800'
      case 'MANUAL_ENTRY':
        return 'bg-purple-100 text-purple-800'
      case 'INVOICE':
        return 'bg-green-100 text-green-800'
      case 'PAYMENT':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'POSTED':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'VOIDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Transaction Details
            </SheetTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportTransaction}
              className="rounded-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Transaction Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Transaction Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                  <p className="text-sm font-mono text-gray-900 break-all">{transaction.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Reference</p>
                  <p className="text-sm font-semibold text-blue-600">{transaction.reference}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-sm text-gray-900">{transaction.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date
                  </p>
                  <p className="text-sm text-gray-900">{format(new Date(transaction.date), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Source</p>
                  <Badge className={getSourceBadgeColor(transaction.source)}>{transaction.source}</Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Debit Amount
                  </p>
                  <p className="text-xl font-bold text-green-900">{formatCurrency(transaction.debitAmount)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Credit Amount
                  </p>
                  <p className="text-xl font-bold text-red-900">{formatCurrency(transaction.creditAmount)}</p>
                </div>
              </div>

              {transaction.journalEntryStatus && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                  <Badge className={getStatusBadgeColor(transaction.journalEntryStatus)}>
                    {transaction.journalEntryStatus}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Journal Entry Card */}
          {transaction.journalEntry && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Journal Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Entry ID</p>
                    <p className="text-xs font-mono text-gray-900 break-all">{transaction.journalEntry.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reference Number</p>
                    <p className="text-sm font-semibold text-blue-600">{transaction.journalEntry.referenceNumber}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-sm text-gray-900">{transaction.journalEntry.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction Date</p>
                    <p className="text-sm text-gray-900">{format(new Date(transaction.journalEntry.transactionDate), 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge className={getStatusBadgeColor(transaction.journalEntry.status)}>
                      {transaction.journalEntry.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Source Transaction Card */}
          {transaction.sourceTransaction && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Source Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Source ID</p>
                    <p className="text-xs font-mono text-gray-900 break-all">{transaction.sourceTransaction.id}</p>
                  </div>
                  {transaction.sourceTransaction.type && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <Badge variant="outline">{transaction.sourceTransaction.type}</Badge>
                    </div>
                  )}
                </div>

                {transaction.sourceTransaction.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-sm text-gray-900">{transaction.sourceTransaction.description}</p>
                  </div>
                )}

                {transaction.sourceTransaction.amount && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(transaction.sourceTransaction.amount)}</p>
                  </div>
                )}

                {(transaction.sourceTransaction.reference || transaction.sourceTransaction.referenceNumber) && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reference</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {transaction.sourceTransaction.reference || transaction.sourceTransaction.referenceNumber}
                    </p>
                  </div>
                )}

                {transaction.sourceTransaction.status && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge className={getStatusBadgeColor(transaction.sourceTransaction.status)}>
                      {transaction.sourceTransaction.status}
                    </Badge>
                  </div>
                )}

                {/* Bank Info */}
                {transaction.sourceTransaction.bank && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        Bank Account
                      </p>
                      <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Bank Name</p>
                          <p className="text-sm font-semibold text-gray-900">{transaction.sourceTransaction.bank.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Account Number</p>
                          <p className="text-sm font-mono text-gray-900">{transaction.sourceTransaction.bank.accountNumber}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Customer Info */}
                {transaction.sourceTransaction.customer && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Customer
                      </p>
                      <div className="bg-green-50 p-3 rounded-lg space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Name</p>
                          <p className="text-sm font-semibold text-gray-900">{transaction.sourceTransaction.customer.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-600" />
                          <p className="text-sm text-gray-900">{transaction.sourceTransaction.customer.email}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Vendor Info */}
                {transaction.sourceTransaction.vendor && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        Vendor
                      </p>
                      <div className="bg-amber-50 p-3 rounded-lg space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Name</p>
                          <p className="text-sm font-semibold text-gray-900">{transaction.sourceTransaction.vendor.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-600" />
                          <p className="text-sm text-gray-900">{transaction.sourceTransaction.vendor.email}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
