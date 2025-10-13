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
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"
import type { Customer, CreditNote } from "@/lib/api/accounting-api"
import { accountingApi } from "@/lib/api/accounting-api"
import { ProcurementDataTable, Column } from "../procurement/procurement-data-table"

interface CustomerViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
  onCustomerUpdated: () => void
}

const customerTabs = [
  { id: "overview", label: "Customer Info", icon: User },
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
      case 'APPLIED':
        return 'bg-green-100 text-green-800'
      case 'SENT':
        return 'bg-purple-100 text-purple-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'VOID':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            {customer.name}
          </SheetTitle>
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
              {/* Basic Information */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {customer.contactPerson && (
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Contact Person</p>
                          <p className="font-medium">{customer.contactPerson}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                    </div>

                    {customer.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="font-medium">{customer.phone}</p>
                        </div>
                      </div>
                    )}

                    {customer.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="font-medium leading-relaxed">{customer.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {customer.taxNumber && (
                      <div>
                        <p className="text-xs text-gray-500">Tax Number</p>
                        <p className="font-medium">{customer.taxNumber}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-gray-500">Payment Terms</p>
                      <Badge variant="outline">{customer.paymentTerms}</Badge>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <Badge className={customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Created Date</p>
                      <p className="font-medium">{format(new Date(customer.createdAt), 'PPP')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "credit-notes" && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Customer Credit Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ProcurementDataTable
                  data={creditNotes}
                  columns={creditNoteColumns}
                  title=""
                  loading={creditNotesLoading}
                  showSearch={false}
                  showFilters={false}
                  showActions={false}
                  emptyMessage="No credit notes found for this customer."
                />
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
