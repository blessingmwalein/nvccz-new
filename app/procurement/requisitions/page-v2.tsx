// ============================================================================
// PURCHASE REQUISITIONS PAGE
// Complete implementation with filters, pagination, tabs, and actions
// ============================================================================

'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import {
  fetchRequisitions,
  fetchPendingApprovalRequisitions,
  setRequisitionFilters,
  clearError,
  clearSuccessMessage,
} from '@/lib/store/slices/procurementV2Slice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { Plus, Filter, RefreshCw, FileText } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { UserAvatarWithName } from '@/components/procurement/user-avatar'
import { CopyBadge } from '@/components/procurement/copy-helper'
import type { PurchaseRequisition, RequisitionStatus, Priority } from '@/lib/api/types/procurement.types'
import { format } from 'date-fns'
import { RequisitionDrawer } from '@/components/procurement/requisition-drawer'
import { CreateRequisitionModal } from '@/components/procurement/create-requisition-modal'

export default function RequisitionsPage() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  
  const {
    requisitions,
    requisitionsCount,
    pendingApprovalRequisitions,
    pendingApprovalCount,
    requisitionsLoading,
    filters,
    error,
    successMessage,
  } = useAppSelector((state) => state.procurementV2)

  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all')
  const [selectedRequisition, setSelectedRequisition] = useState<PurchaseRequisition | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Filters state
  const [statusFilter, setStatusFilter] = useState<RequisitionStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('')
  const [departmentFilter, setDepartmentFilter] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  useEffect(() => {
    loadRequisitions()
    dispatch(fetchPendingApprovalRequisitions())
  }, [])

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      })
      dispatch(clearError())
    }
  }, [error])

  useEffect(() => {
    if (successMessage) {
      toast({
        title: 'Success',
        description: successMessage,
      })
      dispatch(clearSuccessMessage())
      loadRequisitions()
      dispatch(fetchPendingApprovalRequisitions())
    }
  }, [successMessage])

  const loadRequisitions = () => {
    const filterParams = {
      ...filters.requisitions,
      ...(statusFilter && { status: statusFilter }),
      ...(priorityFilter && { priority: priorityFilter }),
      ...(departmentFilter && { department: departmentFilter }),
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    }
    dispatch(fetchRequisitions(filterParams))
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
    loadRequisitions()
  }

  const handleClearFilters = () => {
    setStatusFilter('')
    setPriorityFilter('')
    setDepartmentFilter('')
    setCurrentPage(1)
    dispatch(fetchRequisitions({ limit: itemsPerPage, offset: 0 }))
  }

  const handleViewRequisition = (requisition: PurchaseRequisition) => {
    setSelectedRequisition(requisition)
    setDrawerOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const filterParams = {
      ...filters.requisitions,
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
    }
    dispatch(fetchRequisitions(filterParams))
  }

  const displayRequisitions = activeTab === 'all' ? requisitions : pendingApprovalRequisitions
  const totalCount = activeTab === 'all' ? requisitionsCount : pendingApprovalCount

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase Requisitions</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage purchase requisitions for approval
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} size="default">
          <Plus className="mr-2 h-4 w-4" />
          Create Requisition
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RequisitionStatus | '')}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All statuses</SelectItem>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="PENDING_APPROVAL">PENDING_APPROVAL</SelectItem>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                  <SelectItem value="CONVERTED_TO_PO">CONVERTED_TO_PO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | '')}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All priorities</SelectItem>
                  <SelectItem value="LOW">LOW</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                  <SelectItem value="URGENT">URGENT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                placeholder="Filter by department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2 flex items-end gap-2">
              <Button onClick={handleFilterChange} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for All vs Pending Approval */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'pending')}>
        <TabsList>
          <TabsTrigger value="all">
            All Requisitions
            <Badge variant="secondary" className="ml-2">
              {requisitionsCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval
            {pendingApprovalCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingApprovalCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {activeTab === 'all' ? 'All Requisitions' : 'Requisitions Pending Your Approval'}
                </CardTitle>
                <CardDescription>
                  {totalCount} requisition{totalCount !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={loadRequisitions}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {requisitionsLoading ? (
                <TableSkeleton />
              ) : displayRequisitions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No requisitions found</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {activeTab === 'all'
                      ? 'Create your first requisition to get started.'
                      : 'No requisitions pending your approval.'}
                  </p>
                </div>
              ) : (
                <>
                  <RequisitionsTable
                    requisitions={displayRequisitions}
                    onView={handleViewRequisition}
                  />
                  
                  {/* Pagination */}
                  {totalCount > itemsPerPage && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage * itemsPerPage >= totalCount}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Requisition Drawer */}
      {selectedRequisition && (
        <RequisitionDrawer
          requisition={selectedRequisition}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      )}

      {/* Create Modal */}
      <CreateRequisitionModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  )
}

// ============================================================================
// REQUISITIONS TABLE
// ============================================================================

interface RequisitionsTableProps {
  requisitions: PurchaseRequisition[]
  onView: (requisition: PurchaseRequisition) => void
}

function RequisitionsTable({ requisitions, onView }: RequisitionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requisition #</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Requested By</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requisitions.map((requisition) => (
          <TableRow key={requisition.id}>
            <TableCell>
              <CopyBadge text={requisition.requisitionNumber} />
            </TableCell>
            <TableCell className="font-medium max-w-xs truncate">
              {requisition.title}
            </TableCell>
            <TableCell>
              <UserAvatarWithName user={requisition.requestedBy} size="sm" />
            </TableCell>
            <TableCell>{requisition.department}</TableCell>
            <TableCell>
              <StatusBadge status={requisition.status} />
            </TableCell>
            <TableCell>
              <PriorityBadge priority={requisition.priority} />
            </TableCell>
            <TableCell>{requisition.items.length}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {format(new Date(requisition.createdAt), 'MMM dd, yyyy')}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onView(requisition)}>
                    View Details
                  </DropdownMenuItem>
                  {requisition.status === 'APPROVED' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Create RFQ</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ============================================================================
// STATUS BADGE
// ============================================================================

function StatusBadge({ status }: { status: RequisitionStatus }) {
  const variants: Record<RequisitionStatus, { variant: any; label: string }> = {
    DRAFT: { variant: 'secondary', label: 'Draft' },
    PENDING_APPROVAL: { variant: 'default', label: 'Pending Approval' },
    APPROVED: { variant: 'default', label: 'Approved' },
    REJECTED: { variant: 'destructive', label: 'Rejected' },
    CONVERTED_TO_PO: { variant: 'outline', label: 'Converted to PO' },
  }

  const config = variants[status]
  
  return (
    <Badge variant={config.variant} className={
      status === 'APPROVED' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
      status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
      ''
    }>
      {config.label}
    </Badge>
  )
}

// ============================================================================
// PRIORITY BADGE
// ============================================================================

function PriorityBadge({ priority }: { priority: Priority }) {
  const variants: Record<Priority, { className: string; label: string }> = {
    LOW: { className: 'bg-blue-100 text-blue-800', label: 'Low' },
    MEDIUM: { className: 'bg-gray-100 text-gray-800', label: 'Medium' },
    HIGH: { className: 'bg-orange-100 text-orange-800', label: 'High' },
    URGENT: { className: 'bg-red-100 text-red-800', label: 'Urgent' },
  }

  const config = variants[priority]
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

// ============================================================================
// TABLE SKELETON
// ============================================================================

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}
