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
  setRequisitions, 
  addRequisition, 
  updateRequisition, 
  removeRequisition,
  setRequisitionsLoading,
  setRequisitionsError,
  setSelectedRequisition
} from "@/lib/store/slices/procurementSlice"
import { procurementApi, PurchaseRequisition } from "@/lib/api/procurement-api"
import { CiFileOn, CiUser, CiDollar, CiCalendar } from "react-icons/ci"
import { FileText, CheckCircle, Clock, AlertCircle, Send, XCircle, Eye, Edit, X, ShoppingCart } from "lucide-react"
import { CreateRequisitionModal } from "./create-requisition-modal"
import { CreatePurchaseOrderModal } from "./create-purchase-order-modal"
import { RequisitionTimeline } from "./requisition-timeline"
import { toast } from "sonner"

export function PurchaseRequisitions() {
  const dispatch = useAppDispatch()
  const { requisitions, requisitionsLoading } = useAppSelector(state => state.procurement)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [viewingRequisition, setViewingRequisition] = useState<PurchaseRequisition | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false)
  const [selectedRequisitionForPO, setSelectedRequisitionForPO] = useState<string | null>(null)

  useEffect(() => {
    loadRequisitions()
  }, [])

  const loadRequisitions = async () => {
    try {
      dispatch(setRequisitionsLoading(true))
      const response = await procurementApi.getRequisitions()
      if (response.success && response.data) {
        dispatch(setRequisitions(response.data))
      } else {
        dispatch(setRequisitionsError('Failed to load requisitions'))
        toast.error("Failed to load requisitions")
      }
    } catch (error: any) {
      dispatch(setRequisitionsError(error.message))
      toast.error("Error loading requisitions", { description: error.message })
    } finally {
      dispatch(setRequisitionsLoading(false))
    }
  }

  const handleView = (requisition: PurchaseRequisition) => {
    setViewingRequisition(requisition)
    dispatch(setSelectedRequisition(requisition))
    setIsDrawerOpen(true)
  }

  const handleCreate = () => {
    setIsCreateModalOpen(true)
  }

  const handleEdit = (requisition: PurchaseRequisition) => {
    // TODO: Implement edit functionality
    toast.info("Edit functionality coming soon")
  }

  const handleDelete = async (requisition: PurchaseRequisition) => {
    if (!confirm(`Are you sure you want to delete requisition ${requisition.requisitionNumber}?`)) {
      return
    }

    try {
      // TODO: Implement delete API call
      dispatch(removeRequisition(requisition.id))
      toast.success("Requisition deleted successfully")
    } catch (error: any) {
      toast.error("Failed to delete requisition", { description: error.message })
    }
  }

  const handleSubmitForApproval = async (requisition: PurchaseRequisition) => {
    try {
      await procurementApi.submitRequisition(requisition.id)
      toast.success('Requisition submitted for approval')
      await loadRequisitions()
    } catch (error: any) {
      toast.error('Failed to submit requisition', { description: error.message })
    }
  }

  const handleApprove = async (requisition: PurchaseRequisition) => {
    try {
      await procurementApi.approveRequisition(requisition.id)
      toast.success('Requisition approved successfully')
      await loadRequisitions()
    } catch (error: any) {
      toast.error('Failed to approve requisition', { description: error.message })
    }
  }

  const handleReject = async (requisition: PurchaseRequisition, reason?: string) => {
    const rejectionReason = reason || prompt("Please provide a reason for rejection:")
    if (!rejectionReason) return

    try {
      await procurementApi.rejectRequisition(requisition.id, rejectionReason)
      toast.success('Requisition rejected')
      await loadRequisitions()
    } catch (error: any) {
      toast.error('Failed to reject requisition', { description: error.message })
    }
  }
  
  const handleCreatePurchaseOrder = async (requisitionId: string) => {
    setSelectedRequisitionForPO(requisitionId)
    setIsCreatePOModalOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText className="w-4 h-4" />
      case 'PENDING_APPROVAL': return <Clock className="w-4 h-4" />
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />
      case 'CONVERTED_TO_PO': return <ShoppingCart className="w-4 h-4" />
      case 'REJECTED': return <XCircle className="w-4 h-4" />
      case 'CANCELLED': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'CONVERTED_TO_PO': return 'bg-blue-100 text-blue-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusProgress = (status: string) => {
    const statusOrder = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'CONVERTED_TO_PO', 'DELIVERED']
    const currentIndex = statusOrder.indexOf(status)
    if (currentIndex === -1) return 0
    return Math.round((currentIndex / (statusOrder.length - 1)) * 100)
  }

  const columns: Column<PurchaseRequisition>[] = [
    {
      key: 'requisitionNumber',
      label: 'Requisition #',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <CiFileOn className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'requestedBy',
      label: 'Requested By',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <CiUser className="w-4 h-4 text-gray-600" />
          <span>{value.firstName} {value.lastName}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status & Progress',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="space-y-2">
          <Badge className={getStatusColor(value)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(value)}
              {value.replace('_', ' ')}
            </div>
          </Badge>
          <div className="w-full">
            <Progress value={getStatusProgress(value)} className="h-1" />
            <span className="text-xs text-gray-500">{getStatusProgress(value)}%</span>
          </div>
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
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <CiCalendar className="w-4 h-4 text-purple-600" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    }
  ]

  const filterOptions = [
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Pending Approval', value: 'PENDING_APPROVAL' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ]

  const bulkActions = [
    { 
      label: 'Submit for Approval', 
      value: 'submit', 
      icon: <Send className="w-4 h-4 mr-1" /> 
    },
    { 
      label: 'Approve', 
      value: 'approve', 
      icon: <CheckCircle className="w-4 h-4 mr-1" /> 
    }
  ]

  const handleBulkAction = (selectedRequisitions: PurchaseRequisition[], action: string) => {
    switch (action) {
      case 'submit':
        selectedRequisitions.forEach(req => handleSubmitForApproval(req))
        break
      case 'approve':
        selectedRequisitions.forEach(req => handleApprove(req))
        break
      default:
        toast.info(`Bulk action: ${action}`)
    }
  }

  const handleExport = (data: PurchaseRequisition[]) => {
    // TODO: Implement export functionality
    toast.success(`Exporting ${data.length} requisitions`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal">Purchase Requisitions</h1>
          <p className="text-muted-foreground">Create and manage purchase requisitions with approval workflow</p>
        </div>
      </div>

      {/* Data Table */}
      <ProcurementDataTable
        data={requisitions}
        columns={columns}
        title="Purchase Requisitions"
        searchPlaceholder="Search requisitions..."
        filterOptions={filterOptions}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onBulkAction={handleBulkAction}
        bulkActions={bulkActions}
        loading={requisitionsLoading}
        onExport={handleExport}
        emptyMessage="No requisitions found. Create your first purchase requisition to get started."
        extraControls={
          <Button 
            variant="outline" 
            onClick={() => toast.info("Bulk import functionality coming soon")}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0"
          >
            <FileText className="w-4 h-4 mr-2" />
            Import
          </Button>
        }
      />

      {/* View Drawer */}
      <ProcurementDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={`Requisition: ${viewingRequisition?.requisitionNumber || ''}`}
        description="View requisition details and manage approval workflow"
        size="xl"
        headerActions={
          <>
            {viewingRequisition?.status === 'DRAFT' && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 px-3 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-0"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDrawerOpen(false)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </>
        }
      >
        {viewingRequisition && (
          <RequisitionTimeline 
            requisitionId={viewingRequisition.id}
            onCreatePurchaseOrder={handleCreatePurchaseOrder}
          />
        )}
      </ProcurementDrawer>

      {/* Create Modal */}
      <CreateRequisitionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          loadRequisitions()
        }}
      />

      {/* Edit Modal */}
      {viewingRequisition && (
        <CreateRequisitionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false)
            loadRequisitions()
          }}
          editMode={true}
          requisitionId={viewingRequisition.id}
        />
      )}

      {/* Create Purchase Order Modal */}
      <CreatePurchaseOrderModal
        isOpen={isCreatePOModalOpen}
        onClose={() => {
          setIsCreatePOModalOpen(false)
          setSelectedRequisitionForPO(null)
        }}
        onSuccess={() => {
          setIsCreatePOModalOpen(false)
          setSelectedRequisitionForPO(null)
          setIsDrawerOpen(false)
          toast.success('Purchase order created successfully')
          loadRequisitions()
        }}
        preSelectedRequisitionId={selectedRequisitionForPO || undefined}
      />
    </div>
  )
}
