"use client"

import { useState } from "react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Building, 
  CheckCircle, 
  Clock, 
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  Calendar,
  CreditCard,
  X,
  Receipt
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { TransactionsDataTable } from "./transactions-data-table"

interface Vendor {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  taxNumber: string | null
  contactPerson: string | null
  paymentTerms: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  transactions?: VendorTransaction[]
  summary?: {
    invoiceCount: number
    invoiceTotal: number
    purchaseOrderCount: number
    purchaseOrderTotal: number
    cashbookCount: number
    cashbookInTotal: number
    cashbookOutTotal: number
  }
}

interface VendorTransaction {
  id: string
  source: string
  type: string
  reference: string
  description: string
  date: string
  amount: number
  subtotal?: number
  taxAmount?: number
  status: string
  paymentStatus?: string
  dueDate?: string | null
  currency?: string | null
  direction?: string
  counterpartyType?: string
  bank?: {
    id: string
    name: string
    accountNumber: string
  }
  journalEntry?: {
    id: string
    referenceNumber: string
    status: string
  } | null
}

interface VendorViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  vendor?: Vendor | null
  onVendorUpdated?: () => void
}

const vendorTabs = [
  { id: "overview", label: "Vendor Info", icon: Building },
  { id: "transactions", label: "Transactions", icon: Receipt }
]


export function VendorViewDrawer({ isOpen, onClose, vendor, onVendorUpdated }: VendorViewDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!vendor) return null

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  // Transform vendor transactions to match TransactionsDataTable format
  const transformedTransactions = (vendor.transactions || []).map((txn: VendorTransaction) => {
    // Determine debit/credit amounts based on transaction type and source
    let debitAmount = 0
    let creditAmount = 0

    if (txn.source === 'CASHBOOK') {
      // Cashbook OUT transactions are credits (money going out)
      if (txn.direction === 'OUT') {
        creditAmount = Math.abs(txn.amount)
      } else {
        debitAmount = Math.abs(txn.amount)
      }
    } else if (txn.source === 'PROCUREMENT_INVOICE' || txn.type === 'INVOICE') {
      // Invoices increase vendor liability (credit)
      creditAmount = txn.amount
    } else if (txn.source === 'PURCHASE_ORDER' || txn.type === 'PURCHASE_ORDER') {
      // Purchase orders are pending, but shown as credits
      creditAmount = txn.amount
    } else {
      // Default: positive amounts are debits, negative are credits
      if (txn.amount >= 0) {
        debitAmount = txn.amount
      } else {
        creditAmount = Math.abs(txn.amount)
      }
    }

    return {
      id: txn.id,
      date: txn.date,
      reference: txn.reference,
      description: txn.description,
      debitAmount,
      creditAmount,
      source: txn.source,
      journalEntry: txn.journalEntry ? {
        id: txn.journalEntry.id,
        referenceNumber: txn.journalEntry.referenceNumber,
        description: txn.description,
        transactionDate: txn.date,
        status: txn.journalEntry.status,
        currencyId: txn.currency || 'USD'
      } : undefined,
      journalEntryId: txn.journalEntry?.id,
      journalEntryStatus: txn.journalEntry?.status || txn.status
    }
  })

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              {vendor.name}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Tab Navigation */}
        <div className="mt-6">
          <div className="flex space-x-1 border-b">
            {vendorTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm transition-all",
                    isActive
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-600 border-b-2 border-transparent hover:text-gray-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6 space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Vendor Information */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Vendor Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Email</h4>
                        <p className="text-sm">{vendor.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Phone</h4>
                        <p className="text-sm">{vendor.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Contact Person</h4>
                        <p className="text-sm">{vendor.contactPerson || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Address</h4>
                        <p className="text-sm">{vendor.address || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Tax Number</h4>
                        <p className="text-sm font-mono">{vendor.taxNumber || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Payment Terms</h4>
                        <p className="text-sm">{vendor.paymentTerms || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Status</h4>
                        <Badge className={getStatusColor(vendor.isActive)}>
                          {getStatusIcon(vendor.isActive)}
                          <span className="ml-1">{vendor.isActive ? 'Active' : 'Inactive'}</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Created</h4>
                        <p className="text-sm">{format(new Date(vendor.createdAt), "PPP")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Summary */}
              {vendor.summary && (
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Transaction Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-600 font-medium mb-1">Invoices</p>
                        <p className="text-2xl font-bold text-purple-900">{vendor.summary.invoiceCount}</p>
                        <p className="text-sm text-purple-700 mt-1">
                          ${vendor.summary.invoiceTotal.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-600 font-medium mb-1">Purchase Orders</p>
                        <p className="text-2xl font-bold text-blue-900">{vendor.summary.purchaseOrderCount}</p>
                        <p className="text-sm text-blue-700 mt-1">
                          ${vendor.summary.purchaseOrderTotal.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-600 font-medium mb-1">Cashbook In</p>
                        <p className="text-2xl font-bold text-green-900">{vendor.summary.cashbookCount}</p>
                        <p className="text-sm text-green-700 mt-1">
                          ${vendor.summary.cashbookInTotal.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xs text-red-600 font-medium mb-1">Cashbook Out</p>
                        <p className="text-2xl font-bold text-red-900">{vendor.summary.cashbookCount}</p>
                        <p className="text-sm text-red-700 mt-1">
                          ${vendor.summary.cashbookOutTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {activeTab === "transactions" && (
            <TransactionsDataTable
              transactions={transformedTransactions}
              loading={false}
              title="Vendor Transactions"
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Export as both names for backward compatibility
export const ViewVendorModal = VendorViewDrawer