"use client"

import { useState, useEffect } from "react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  CreditCard,
  Calendar,
  DollarSign,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"
import type { Customer, CreditNote } from "@/lib/api/accounting-api"
import { accountingApi } from "@/lib/api/accounting-api"
import { ProcurementDataTable, Column } from "../procurement/procurement-data-table"
import { Button } from "@/components/ui/button"

interface CustomerViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
  onCustomerUpdated: () => void
}

const customerTabs = [
  { id: "overview", label: "Customer Info", icon: User },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "credit-notes", label: "Credit Notes", icon: CreditCard }
]

export function CustomerViewDrawer({ isOpen, onClose, customer, onCustomerUpdated }: CustomerViewDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([])
  const [creditNotesLoading, setCreditNotesLoading] = useState(false)

  useEffect(() => {
    if (customer && activeTab === "credit-notes") {
      loadCustomerCreditNotes()
    }
  }, [customer, activeTab])

  const loadCustomerCreditNotes = async () => {
    if (!customer) return
    
    try {
      setCreditNotesLoading(true)
      const response = await accountingApi.getCustomerCreditNotes(customer.id)
      if (response.success) {
        setCreditNotes(response.data.creditNotes)
      } else {
        toast.error('Failed to load credit notes')
      }
    } catch (error) {
      toast.error('Failed to load credit notes')
    } finally {
      setCreditNotesLoading(false)
    }
  }

  if (!customer) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'POSTED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPLIED':
        return 'bg-green-100 text-green-800'
      case 'SENT':
        return 'bg-purple-100 text-purple-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'VOID':
        return 'bg-red-100 text-red-800'
      case 'PAID':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'CASHBOOK':
        return 'bg-blue-100 text-blue-800'
      case 'INVOICE':
        return 'bg-purple-100 text-purple-800'
      case 'CREDIT_NOTE':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const transactionColumns: Column<any>[] = [
    {
      key: 'reference',
      label: 'Reference',
      sortable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <div className="font-medium text-blue-600">{value}</div>
          <div className="text-xs text-gray-500">
            {row.type === 'INVOICE' ? 'Invoice' : row.type}
          </div>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true,
      render: (value) => (
        <Badge className={getSourceColor(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value, row) => (
        <div className="text-right space-y-1">
          <div className={cn(
            "font-bold flex items-center justify-end gap-1",
            row.direction === 'IN' ? 'text-green-600' : 'text-red-600'
          )}>
            {row.direction === 'IN' ? (
              <ArrowDownLeft className="w-3 h-3" />
            ) : (
              <ArrowUpRight className="w-3 h-3" />
            )}
            ${Math.abs(value).toLocaleString()}
          </div>
          {row.balance !== undefined && (
            <div className="text-xs text-gray-500">
              Balance: ${row.balance.toLocaleString()}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'bank',
      label: 'Bank Account',
      sortable: false,
      render: (value) => (
        value ? (
          <div className="space-y-0.5">
            <div className="text-sm font-medium">{value.name}</div>
            <div className="text-xs text-gray-500">{value.accountNumber}</div>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {format(new Date(value), "PPP")}
        </span>
      )
    },
    {
      key: 'journalEntry',
      label: 'Journal',
      sortable: false,
      render: (value) => (
        value ? (
          <div className="space-y-0.5">
            <div className="text-xs font-medium text-blue-600">
              {value.referenceNumber}
            </div>
            <Badge variant="outline" className="text-xs">
              {value.status}
            </Badge>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">No Journal</span>
        )
      )
    }
  ]

  const creditNoteColumns: Column<CreditNote>[] = [
    {
      key: 'creditNoteNumber',
      label: 'Credit Note',
      sortable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <div className="font-medium text-red-600">{value}</div>
          <div className="text-xs text-gray-500">{row.reason}</div>
        </div>
      )
    },
    {
      key: 'originalInvoice',
      label: 'Original Invoice',
      sortable: true,
      render: (value) => (
        <div className="font-medium text-blue-600">{value?.invoiceNumber}</div>
      )
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      sortable: true,
      render: (value, row) => (
        <div className="text-right">
          <div className="font-bold text-red-600">
            -{row.currency?.symbol}{value}
          </div>
          <div className="text-xs text-gray-500">
            Remaining: {row.currency?.symbol}{row.remainingAmount}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    }
  ]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              {customer.name}
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
            {customerTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm transition-all",
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600"
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
              {/* Customer Information */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Email</h4>
                        <p className="text-sm">{customer.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Phone</h4>
                        <p className="text-sm">{customer.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Address</h4>
                        <p className="text-sm">{customer.address || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Type</h4>
                        <Badge>{customer.type}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Balance</h4>
                        <p className="text-sm font-bold">${customer.balance?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <h4 className="text-gray-900 font-medium text-sm">Created</h4>
                        <p className="text-sm">{format(new Date(customer.createdAt), "PPP")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "transactions" && (
            <ProcurementDataTable
              data={customer.transactions || []}
              columns={transactionColumns}
              title=""
              searchPlaceholder="Search transactions..."
              loading={false}
              emptyMessage="No transactions found."
            />
          )}

          {activeTab === "credit-notes" && (
            <ProcurementDataTable
              data={creditNotes}
              columns={creditNoteColumns}
              title=""
              searchPlaceholder="Search credit notes..."
              loading={creditNotesLoading}
              emptyMessage="No credit notes found."
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}