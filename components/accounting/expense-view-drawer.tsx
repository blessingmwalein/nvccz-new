"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Receipt,
  Building,
  Tag,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Hash,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { Expense } from "@/lib/api/accounting-api"

interface ExpenseViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  expense: Expense | null
}

export function ExpenseViewDrawer({ isOpen, onClose, expense }: ExpenseViewDrawerProps) {
  if (!expense) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'POSTED':
        return <CheckCircle className="w-4 h-4" />
      case 'DRAFT':
        return <Clock className="w-4 h-4" />
      case 'VOID':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'POSTED':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'VOID':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'bg-yellow-100 text-yellow-800'
      case 'BANK':
        return 'bg-blue-100 text-blue-800'
      case 'CARD':
        return 'bg-purple-100 text-purple-800'
      case 'CHEQUE':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="p-0 overflow-y-auto" 
        style={{ width: '50vw', maxWidth: '50vw' }}
      >
        <SheetHeader className="p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
          <SheetTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl">Expense Details</span>
              <p className="text-sm text-gray-600 font-normal">
                {expense.receiptNumber || `Expense #${expense.id.slice(-8)}`}
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</p>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Status</p>
                  <Badge className={getStatusColor(expense.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(expense.status)}
                      {expense.status}
                    </div>
                  </Badge>
                </div>
              </div>

              {expense.receiptNumber && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Receipt Number</p>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <p className="font-mono text-sm">{expense.receiptNumber}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Transaction Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{new Date(expense.transactionDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Details */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {expense.currency?.symbol}{expense.amount}
                  </p>
                </div>
                {expense.vatAmount && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">VAT Amount</p>
                    <p className="text-lg font-medium text-gray-700">
                      {expense.currency?.symbol}{expense.vatAmount}
                    </p>
                  </div>
                )}
              </div>

              {expense.totalAmount && (
                <div className="border-t pt-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    {expense.currency?.symbol}{expense.totalAmount}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Currency</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {expense.currency?.code}
                    </span>
                    <span className="text-sm text-gray-600">{expense.currency?.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Taxable</p>
                  <Badge variant={expense.isTaxable ? "default" : "secondary"}>
                    {expense.isTaxable ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Payment Method</p>
                <Badge variant="outline" className={getPaymentMethodColor(expense.paymentMethod)}>
                  <CreditCard className="w-3 h-3 mr-1" />
                  {expense.paymentMethod}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Information */}
          {expense.vendor && (
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-red-600" />
                  Vendor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-600 text-white">
                      {getInitials(expense.vendor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{expense.vendor.name}</p>
                    {expense.vendor.contactPerson && (
                      <p className="text-sm text-gray-600">{expense.vendor.contactPerson}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {expense.vendor.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{expense.vendor.email}</span>
                    </div>
                  )}
                  
                  {expense.vendor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{expense.vendor.phone}</span>
                    </div>
                  )}
                  
                  {expense.vendor.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm leading-relaxed">{expense.vendor.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category Information */}
          {expense.category && (
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-yellow-600" />
                  Category Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Category</p>
                    <p className="font-semibold text-lg">{expense.category.name}</p>
                  </div>
                  
                  {expense.category.description && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</p>
                      <p className="text-sm text-gray-700">{expense.category.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Journal Entry */}
          {expense.journalEntry && (
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Journal Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Reference Number</p>
                    <p className="font-mono text-sm">{expense.journalEntry.referenceNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Status</p>
                    <Badge variant="outline">
                      {expense.journalEntry.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</p>
                  <p>{new Date(expense.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Updated</p>
                  <p>{new Date(expense.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}