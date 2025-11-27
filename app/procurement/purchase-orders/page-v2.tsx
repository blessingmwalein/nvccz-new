// ============================================================================
// PURCHASE ORDERS LIST PAGE V2
// Manage purchase orders - follows new Redux architecture
// ============================================================================

'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import {
  fetchPurchaseOrders,
  selectAllPurchaseOrders,
  selectPurchaseOrdersState,
} from '@/lib/store/slices/procurementV2Slice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, FileText, DollarSign, Calendar, Printer } from 'lucide-react'
import { UserAvatarWithName } from '@/components/procurement/user-avatar'
import { CopyBadge } from '@/components/procurement/copy-helper'
import { format } from 'date-fns'

export default function PurchaseOrdersPageV2() {
  const dispatch = useAppDispatch()
  const purchaseOrders = useAppSelector(selectAllPurchaseOrders)
  const { loading } = useAppSelector(selectPurchaseOrdersState)

  // Filters
  const [poNumber, setPoNumber] = useState('')
  const [vendorEmail, setVendorEmail] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [limit] = useState(50)
  const [offset, setOffset] = useState(0)
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    const filters: any = { limit, offset }
    
    if (poNumber) filters.poNumber = poNumber
    if (vendorEmail) filters.vendorEmail = vendorEmail
    if (status !== 'all') filters.status = status
    
    dispatch(fetchPurchaseOrders(filters))
  }, [dispatch, poNumber, vendorEmail, status, limit, offset])

  const filteredPOs = activeTab === 'all' 
    ? purchaseOrders 
    : purchaseOrders.filter(po => po.status === 'PENDING' || po.status === 'APPROVED')

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage purchase orders and track deliveries
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="poNumber">PO Number</Label>
              <Input
                id="poNumber"
                placeholder="Search by PO number..."
                value={poNumber}
                onChange={(e) => {
                  setPoNumber(e.target.value)
                  setOffset(0)
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendorEmail">Vendor Email</Label>
              <Input
                id="vendorEmail"
                placeholder="Search by vendor..."
                value={vendorEmail}
                onChange={(e) => {
                  setVendorEmail(e.target.value)
                  setOffset(0)
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => { setStatus(v); setOffset(0) }}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setPoNumber('')
                  setVendorEmail('')
                  setStatus('all')
                  setOffset(0)
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All Purchase Orders
            <Badge variant="secondary" className="ml-2">{purchaseOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2">
              {purchaseOrders.filter(po => po.status === 'PENDING' || po.status === 'APPROVED').length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Purchase Orders Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading purchase orders...</p>
              </div>
            </div>
          ) : filteredPOs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No purchase orders found</h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'active' 
                  ? 'No active purchase orders at the moment'
                  : 'Purchase orders will appear here once created from accepted quotations'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>RFQ</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell>
                      <CopyBadge text={po.poNumber} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{po.vendor.companyName}</p>
                        <p className="text-xs text-muted-foreground">{po.vendor.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {po.quotation && (
                        <CopyBadge text={po.quotation.rfq.rfqNumber} variant="outline" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">${Number(po.totalAmount).toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {po.expectedDeliveryDate ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(po.expectedDeliveryDate), 'MMM dd, yyyy')}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <POStatusBadge status={po.status} />
                    </TableCell>
                    <TableCell>
                      <UserAvatarWithName user={po.createdBy} size="sm" />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(po.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredPOs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {offset + 1} to {Math.min(offset + limit, offset + filteredPOs.length)} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOffset(offset + limit)}
              disabled={filteredPOs.length < limit}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function POStatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; label: string }> = {
    PENDING: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    APPROVED: { className: 'bg-green-100 text-green-800', label: 'Approved' },
    REJECTED: { className: 'bg-red-100 text-red-800', label: 'Rejected' },
    IN_PROGRESS: { className: 'bg-blue-100 text-blue-800', label: 'In Progress' },
    DELIVERED: { className: 'bg-purple-100 text-purple-800', label: 'Delivered' },
    COMPLETED: { className: 'bg-green-100 text-green-800', label: 'Completed' },
    CANCELLED: { className: 'bg-gray-100 text-gray-800', label: 'Cancelled' },
  }

  const { className, label } = config[status] || config.PENDING

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
