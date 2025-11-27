// ============================================================================
// RFQ LIST PAGE
// List all RFQs with filtering and pagination
// ============================================================================

'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { fetchRFQs, selectAllRFQs, selectRFQsState } from '@/lib/store/slices/procurementV2Slice'
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
import { Plus, Search, FileText, Calendar, Users } from 'lucide-react'
import { UserAvatarWithName } from '@/components/procurement/user-avatar'
import { CopyBadge } from '@/components/procurement/copy-helper'
import { format } from 'date-fns'
import Link from 'next/link'

export default function RFQPage() {
  const dispatch = useAppDispatch()
  const rfqs = useAppSelector(selectAllRFQs)
  const { loading } = useAppSelector(selectRFQsState)

  // Filters
  const [rfqNumber, setRfqNumber] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [limit] = useState(50)
  const [offset, setOffset] = useState(0)
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    const filters: any = { limit, offset }
    
    if (rfqNumber) filters.rfqNumber = rfqNumber
    if (status !== 'all') filters.status = status
    
    dispatch(fetchRFQs(filters))
  }, [dispatch, rfqNumber, status, limit, offset])

  const filteredRFQs = activeTab === 'all' 
    ? rfqs 
    : rfqs.filter(r => r.status === 'OPEN' || r.status === 'PENDING_APPROVAL')

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Request for Quotations</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track RFQs sent to vendors
          </p>
        </div>
        <Link href="/procurement/rfq/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create RFQ
          </Button>
        </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rfqNumber">RFQ Number</Label>
              <Input
                id="rfqNumber"
                placeholder="Search by RFQ number..."
                value={rfqNumber}
                onChange={(e) => {
                  setRfqNumber(e.target.value)
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
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setRfqNumber('')
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
            All RFQs
            <Badge variant="secondary" className="ml-2">{rfqs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2">
              {rfqs.filter(r => r.status === 'OPEN' || r.status === 'PENDING_APPROVAL').length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* RFQs Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading RFQs...</p>
              </div>
            </div>
          ) : filteredRFQs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No RFQs found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === 'active' 
                  ? 'There are no active RFQs at the moment'
                  : 'Get started by creating your first RFQ'}
              </p>
              <Link href="/procurement/rfq/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create RFQ
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFQ Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Requisition</TableHead>
                  <TableHead>Vendors</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRFQs.map((rfq) => (
                  <TableRow key={rfq.id}>
                    <TableCell>
                      <CopyBadge text={rfq.rfqNumber} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{rfq.title}</div>
                      {rfq.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {rfq.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <CopyBadge text={rfq.requisition.requisitionNumber} variant="outline" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{rfq.vendors.length} vendors</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(rfq.deadline), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <RFQStatusBadge status={rfq.status} />
                    </TableCell>
                    <TableCell>
                      <UserAvatarWithName user={rfq.createdBy} size="sm" />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(rfq.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/procurement/rfq/${rfq.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredRFQs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {offset + 1} to {Math.min(offset + limit, offset + filteredRFQs.length)} results
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
              disabled={filteredRFQs.length < limit}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function RFQStatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; label: string }> = {
    DRAFT: { className: 'bg-gray-100 text-gray-800', label: 'Draft' },
    OPEN: { className: 'bg-green-100 text-green-800', label: 'Open' },
    CLOSED: { className: 'bg-blue-100 text-blue-800', label: 'Closed' },
    CANCELLED: { className: 'bg-red-100 text-red-800', label: 'Cancelled' },
    PENDING_APPROVAL: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending Approval' },
    APPROVED: { className: 'bg-green-100 text-green-800', label: 'Approved' },
  }

  const { className, label } = config[status] || config.DRAFT

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
