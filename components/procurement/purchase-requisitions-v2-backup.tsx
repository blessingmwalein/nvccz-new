"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  fetchRequisitions,
  fetchMyRequisitions,
  fetchPendingApprovalRequisitions,
  setRequisitionFilters
} from "@/lib/store/slices/procurementV2Slice"
import { PurchaseRequisition } from "@/lib/api/procurement-api-v2"
import { FileText, CheckCircle, Clock, XCircle, Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

export function PurchaseRequisitions() {
  const dispatch = useAppDispatch()
  const { 
    requisitions, 
    requisitionsCount,
    myRequisitions,
    myRequisitionsCount,
    pendingApprovalRequisitions,
    pendingApprovalCount,
    requisitionsLoading,
    filters
  } = useAppSelector(state => state.procurementV2)
  
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'pending'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 50

  useEffect(() => {
    loadRequisitions()
  }, [activeTab, statusFilter, priorityFilter, departmentFilter, currentPage])

  const loadRequisitions = async () => {
    const params = {
      status: statusFilter !== 'all' ? statusFilter : undefined,
      priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      department: departmentFilter !== 'all' ? departmentFilter : undefined,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }

    try {
      if (activeTab === 'my') {
        await dispatch(fetchMyRequisitions()).unwrap()
      } else if (activeTab === 'pending') {
        await dispatch(fetchPendingApprovalRequisitions()).unwrap()
      } else {
        await dispatch(fetchRequisitions(params)).unwrap()
      }
    } catch (error: any) {
      toast.error("Failed to load requisitions", { description: error.message })
    }
  }

  const handleResetFilters = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setDepartmentFilter('all')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any }> = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: FileText },
      PENDING_APPROVAL: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      RFQ_SENT: { color: 'bg-blue-100 text-blue-800', icon: FileText },
      CONVERTED_TO_PO: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle }
    }

    const { color, icon: Icon } = config[status] || { color: 'bg-gray-100 text-gray-800', icon: FileText }
    
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace(/_/g, ' ')}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800'
    }

    return (
      <Badge variant="outline" className={colors[priority] || 'bg-gray-100 text-gray-800'}>
        {priority}
      </Badge>
    )
  }

  const getCurrentData = () => {
    if (activeTab === 'my') return myRequisitions
    if (activeTab === 'pending') return pendingApprovalRequisitions
    return requisitions
  }

  const getCurrentCount = () => {
    if (activeTab === 'my') return myRequisitionsCount
    if (activeTab === 'pending') return pendingApprovalCount
    return requisitionsCount
  }

  const currentData = getCurrentData()
  const totalCount = getCurrentCount()
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Requisitions</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track purchase requisitions
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Requisition
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as 'all' | 'my' | 'pending')
        setCurrentPage(1)
      }}>
        <TabsList>
          <TabsTrigger value="all">
            All Requisitions ({requisitionsCount})
          </TabsTrigger>
          <TabsTrigger value="my">
            My Requisitions ({myRequisitionsCount})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval ({pendingApprovalCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requisitions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="RFQ_SENT">RFQ Sent</SelectItem>
                      <SelectItem value="CONVERTED_TO_PO">Converted to PO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {currentData.length} of {totalCount} requisitions
                </p>
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              {requisitionsLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : currentData.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No requisitions found</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === 'my' 
                      ? "You haven't created any requisitions yet."
                      : activeTab === 'pending'
                      ? "No requisitions pending your approval."
                      : "No requisitions match your filters."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requisition #</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((requisition) => (
                      <TableRow key={requisition.id}>
                        <TableCell className="font-medium">
                          {requisition.requisitionNumber}
                        </TableCell>
                        <TableCell>{requisition.title}</TableCell>
                        <TableCell>{requisition.department}</TableCell>
                        <TableCell>{getPriorityBadge(requisition.priority)}</TableCell>
                        <TableCell>{getStatusBadge(requisition.status)}</TableCell>
                        <TableCell>
                          {requisition.requestedBy.firstName} {requisition.requestedBy.lastName}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${parseFloat(requisition.totalAmount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(requisition.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
