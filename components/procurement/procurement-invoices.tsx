"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { ProcurementDataTable, Column } from "./procurement-data-table"
import { ProcurementDrawer } from "./procurement-drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  setInvoices, 
  addInvoice, 
  updateInvoice, 
  removeInvoice,
  setInvoicesLoading,
  setInvoicesError,
  setSelectedInvoice
} from "@/lib/store/slices/procurementSlice"
import { procurementApi, ProcurementInvoice } from "@/lib/api/procurement-api"
import { CiWallet, CiCalendar, CiDollar, CiFileOn } from "react-icons/ci"
import { Building, CheckCircle, Clock, AlertCircle, FileText, Zap, Eye } from "lucide-react"
import { toast } from "sonner"
import { CreateInvoiceModal } from "./create-invoice-modal"
import { ApprovalDialog } from "./approval-dialog"

export function ProcurementInvoices() {
  const dispatch = useAppDispatch()
  const { invoices, invoicesLoading } = useAppSelector(state => state.procurement)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [viewingInvoice, setViewingInvoice] = useState<ProcurementInvoice | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [selectedInvoiceForApproval, setSelectedInvoiceForApproval] = useState<ProcurementInvoice | null>(null)

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      dispatch(setInvoicesLoading(true))
      const response = await procurementApi.getInvoices()
      if (response.success && response.data) {
        dispatch(setInvoices(response.data))
      } else {
        dispatch(setInvoicesError('Failed to load invoices'))
        toast.error("Failed to load invoices")
      }
    } catch (error: any) {
      dispatch(setInvoicesError(error.message))
      toast.error("Error loading invoices", { description: error.message })
    } finally {
      dispatch(setInvoicesLoading(false))
    }
  }

  const handleView = (invoice: ProcurementInvoice) => {
    setViewingInvoice(invoice)
    dispatch(setSelectedInvoice(invoice))
    setIsDrawerOpen(true)
  }

  const handleCreate = () => {
    setIsCreateModalOpen(true)
  }

  const handleEdit = (invoice: ProcurementInvoice) => {
    // TODO: Implement edit functionality
    toast.info("Edit functionality coming soon")
  }

  const handleDelete = async (invoice: ProcurementInvoice) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      return
    }

    try {
      // TODO: Implement delete API call
      dispatch(removeInvoice(invoice.id))
      toast.success("Invoice deleted successfully")
    } catch (error: any) {
      toast.error("Failed to delete invoice", { description: error.message })
    }
  }

  const handleProcessOCR = async (invoice: ProcurementInvoice) => {
    try {
      toast.info("Processing OCR data...")
      // TODO: Implement OCR processing
      toast.success("OCR processing completed")
    } catch (error: any) {
      toast.error("OCR processing failed", { description: error.message })
    }
  }

  const handleAIMatching = async (invoice: ProcurementInvoice) => {
    try {
      toast.info("Performing AI matching...")
      // TODO: Implement AI matching
      toast.success("AI matching completed")
    } catch (error: any) {
      toast.error("AI matching failed", { description: error.message })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RECEIVED': return <FileText className="w-4 h-4" />
      case 'PROCESSING': return <Clock className="w-4 h-4" />
      case 'MATCHED': return <CheckCircle className="w-4 h-4" />
      case 'DISCREPANCY': return <AlertCircle className="w-4 h-4" />
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />
      case 'PAID': return <CheckCircle className="w-4 h-4" />
      case 'REJECTED': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800'
      case 'MATCHED': return 'bg-green-100 text-green-800'
      case 'DISCREPANCY': return 'bg-orange-100 text-orange-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMatchingStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-800'
      case 'MATCHED': return 'bg-green-100 text-green-800'
      case 'DISCREPANCY': return 'bg-red-100 text-red-800'
      case 'MANUAL_REVIEW': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const columns: Column<ProcurementInvoice>[] = [
    {
      key: 'invoiceNumber',
      label: 'Invoice Number',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <CiWallet className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'vendor',
      label: 'Vendor',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-600" />
          <span>{value?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge className={getStatusColor(value)}>
          <div className="flex items-center gap-1">
            {getStatusIcon(value)}
            {value.replace('_', ' ')}
          </div>
        </Badge>
      )
    },
    {
      key: 'matchingStatus',
      label: 'Matching',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <Badge className={getMatchingStatusColor(value)}>
            {value.replace('_', ' ')}
          </Badge>
          {row.matchScore && (
            <div className="flex items-center gap-1">
              <Progress value={row.matchScore} className="h-1 w-12" />
              <span className="text-xs text-gray-500">{row.matchScore}%</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <CiDollar className="w-4 h-4 text-green-600" />
          <span className="font-medium">${parseFloat(value || '0').toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'invoiceDate',
      label: 'Invoice Date',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <CiCalendar className="w-4 h-4 text-purple-600" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (value) => {
        const isOverdue = new Date(value) < new Date()
        return (
          <div className="flex items-center gap-1">
            <CiCalendar className={`w-4 h-4 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`} />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {new Date(value).toLocaleDateString()}
            </span>
          </div>
        )
      }
    }
  ]

  const filterOptions = [
    { label: 'Received', value: 'RECEIVED' },
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Matched', value: 'MATCHED' },
    { label: 'Discrepancy', value: 'DISCREPANCY' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Rejected', value: 'REJECTED' }
  ]

  const bulkActions = [
    { label: 'Process OCR', value: 'ocr', icon: <Zap className="w-4 h-4 mr-1" /> },
    { label: 'AI Matching', value: 'matching', icon: <Eye className="w-4 h-4 mr-1" /> },
    { label: 'Approve', value: 'approve', icon: <CheckCircle className="w-4 h-4 mr-1" /> }
  ]

  const handleBulkAction = (selectedInvoices: ProcurementInvoice[], action: string) => {
    switch (action) {
      case 'ocr':
        toast.info(`Processing OCR for ${selectedInvoices.length} invoices`)
        break
      case 'matching':
        toast.info(`Running AI matching for ${selectedInvoices.length} invoices`)
        break
      case 'approve':
        toast.info(`Approving ${selectedInvoices.length} invoices`)
        break
      default:
        toast.info(`Bulk action: ${action}`)
    }
  }

  const handleExport = (data: ProcurementInvoice[]) => {
    // TODO: Implement export functionality
    toast.success(`Exporting ${data.length} invoices`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal">Procurement Invoices</h1>
          <p className="text-muted-foreground">Process and manage procurement invoices with OCR and AI matching</p>
        </div>
      </div>

      {/* Data Table */}
      <ProcurementDataTable
        data={invoices}
        columns={columns}
        title="Procurement Invoices"
        searchPlaceholder="Search invoices..."
        filterOptions={filterOptions}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onBulkAction={handleBulkAction}
        bulkActions={bulkActions}
        loading={invoicesLoading}
        onExport={handleExport}
        emptyMessage="No invoices found. Upload your first invoice to get started."
      />

      {/* View Drawer */}
      <ProcurementDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={`Invoice: ${viewingInvoice?.invoiceNumber || ''}`}
        description="View invoice details and manage processing status"
        size="xl"
      >
        {viewingInvoice && (
          <div className="space-y-6">
            {/* Invoice Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CiWallet className="w-5 h-5" />
                  Invoice Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Invoice Number</label>
                    <p className="text-lg font-semibold">{viewingInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(viewingInvoice.status)}>
                        {getStatusIcon(viewingInvoice.status)}
                        {viewingInvoice.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Vendor</label>
                    <p className="font-medium">{viewingInvoice.vendor?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Matching Status</label>
                    <div className="mt-1 space-y-2">
                      <Badge className={getMatchingStatusColor(viewingInvoice.matchingStatus)}>
                        {viewingInvoice.matchingStatus.replace('_', ' ')}
                      </Badge>
                      {viewingInvoice.matchScore && (
                        <div className="flex items-center gap-2">
                          <Progress value={viewingInvoice.matchScore} className="h-2 w-24" />
                          <span className="text-sm text-gray-600">{viewingInvoice.matchScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Amount</label>
                    <p className="text-lg font-semibold text-green-600">
                      ${parseFloat(viewingInvoice.totalAmount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Due Date</label>
                    <p className="font-medium">
                      {new Date(viewingInvoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Actions */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Processing Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleProcessOCR(viewingInvoice)}
                    className="flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Process OCR
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleAIMatching(viewingInvoice)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    AI Matching
                  </Button>
                  <Button 
                    className="gradient-primary text-white flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Invoice
                  </Button>
                </div>
              </CardContent>
            </Card> */}

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {viewingInvoice.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.itemName}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {item.quantity} {item.unit} × ${parseFloat(item.unitPrice.toString()).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: ${(parseFloat(item.quantity.toString()) * parseFloat(item.unitPrice.toString())).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No items found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Close
              </Button>
              <Button className="gradient-primary text-white">
                Edit Invoice
              </Button>
              {viewingInvoice?.status === 'RECEIVED' && (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setSelectedInvoiceForApproval(viewingInvoice)
                    setIsApprovalDialogOpen(true)
                  }}
                >
                  Send for Approval
                </Button>
              )}
            </div>
          </div>
        )}
      </ProcurementDrawer>

      {/* Create Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          loadInvoices()
        }}
      />

      {/* Approval Dialog */}
      <ApprovalDialog
        open={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
        title="Send Invoice for Approval"
        description={`Are you sure you want to send invoice ${selectedInvoiceForApproval?.invoiceNumber} for approval?`}
        loading={approvalLoading}
        onConfirm={async () => {
          if (!selectedInvoiceForApproval) return
          setApprovalLoading(true)
          try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Invoice sent for approval')
            setIsApprovalDialogOpen(false)
            loadInvoices()
          } catch (error) {
            toast.error('Failed to send invoice for approval')
          } finally {
            setApprovalLoading(false)
          }
        }}
      />
    </div>
  )
}
