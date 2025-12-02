// ============================================================================
// QUOTATIONS LIST PAGE
// View and compare vendor quotations
// ============================================================================

'use client'

import React, { useEffect, useState } from 'react'
// import { useAppDispatch, useAppSelector } from '@/lib/store'
import {
  fetchQuotations,
  selectAllQuotations,
  selectQuotationsState,
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
import { Search, FileText, Users, DollarSign, GitCompare } from 'lucide-react'
import { CopyBadge } from '@/components/procurement/copy-helper'
import { format } from 'date-fns'
import { QuotationComparisonModal } from '@/components/procurement/quotation-comparison'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { ProcurementLayout } from '@/components/layout/procurement-layout'

export default function QuotationsPage() {
  const dispatch = useAppDispatch()
  const quotations = useAppSelector(selectAllQuotations)
  const { quotationsLoading: loading } = useAppSelector(selectQuotationsState)

  // Filters
  const [rfqNumber, setRfqNumber] = useState('')
  const [vendorEmail, setVendorEmail] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [limit] = useState(50)
  const [offset, setOffset] = useState(0)
  const [activeTab, setActiveTab] = useState<string>('all')

  // Comparison modal
  const [showComparison, setShowComparison] = useState(false)
  const [selectedRfqNumber, setSelectedRfqNumber] = useState<string>('')

  useEffect(() => {
    const filters: any = { limit, offset }

    if (rfqNumber) filters.rfqNumber = rfqNumber
    if (vendorEmail) filters.vendorEmail = vendorEmail
    if (status !== 'all') filters.status = status

    dispatch(fetchQuotations(filters))
  }, [dispatch, rfqNumber, vendorEmail, status, limit, offset])

  const filteredQuotations = activeTab === 'all'
    ? quotations
    : quotations.filter(q => q.status === 'SUBMITTED' || q.status === 'UNDER_REVIEW')

  // Group quotations by RFQ
  const groupedByRfq = quotations.reduce((acc, quotation) => {
    const rfqNum = quotation.rfqNumber
    if (!acc[rfqNum]) {
      acc[rfqNum] = {
        rfqNumber: quotation.rfqNumber,
        quotations: [],
      }
    }
    acc[rfqNum].quotations.push(quotation)
    return acc
  }, {} as Record<string, any>)

  const handleCompare = (rfqNumber: string) => {
    setSelectedRfqNumber(rfqNumber)
    setShowComparison(true)
  }

  return (
    <ProcurementLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendor Quotations</h1>
            <p className="text-muted-foreground mt-1">
              Review and compare quotations from vendors
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
                <Label htmlFor="rfqNumber">RFQ Number</Label>
                <Input
                  id="rfqNumber"
                  placeholder="Search by RFQ..."
                  value={rfqNumber}
                  onChange={(e) => {
                    setRfqNumber(e.target.value)
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
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => {
                    setRfqNumber('')
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
              All Quotations
              <Badge variant="secondary" className="ml-2">{quotations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Review
              <Badge variant="secondary" className="ml-2">
                {quotations.filter(q => q.status === 'SUBMITTED' || q.status === 'UNDER_REVIEW').length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* RFQ Groups with Compare */}
        {Object.keys(groupedByRfq).length > 0 && (
          <div className="space-y-4">
            {Object.entries(groupedByRfq).map(([rfqId, data]: [string, any]) => (
              <Card key={rfqId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{data.rfq.title}</CardTitle>
                      <CopyBadge text={data.rfq.rfqNumber} className="mt-2" />
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => handleCompare(rfqId)}
                      disabled={data.quotations.length < 2}
                    >
                      <GitCompare className="mr-2 h-4 w-4" />
                      Compare ({data.quotations.length})
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Quotations Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading quotations...</p>
                </div>
              </div>
            ) : filteredQuotations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-1">No quotations found</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'pending'
                    ? 'No quotations pending review at the moment'
                    : 'Quotations will appear here once vendors submit them'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RFQ</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Delivery Terms</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell>
                        <CopyBadge text={quotation.rfqNumber} />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{quotation.companyName}</p>
                          <p className="text-xs text-muted-foreground">{quotation.vendorEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">${Number(quotation.totalAmount).toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm line-clamp-2 max-w-[200px]">
                          {quotation.deliveryTerms || '-'}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {quotation.validUntil}
                      </TableCell>
                      <TableCell>
                        <QuotationStatusBadge status={quotation.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(quotation.submittedAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleCompare(quotation.rfqNumber)}
                        >
                          <GitCompare className="h-4 w-4 mr-1" />
                          Compare
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
        {filteredQuotations.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {offset + 1} to {Math.min(offset + limit, offset + filteredQuotations.length)} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setOffset(offset + limit)}
                disabled={filteredQuotations.length < limit}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Comparison Modal */}
        {selectedRfqNumber && (
          <QuotationComparisonModal
            rfqNumber={selectedRfqNumber}
            open={showComparison}
            onOpenChange={setShowComparison}
          />
        )}
      </div>
    </ProcurementLayout>
  )
}

function QuotationStatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; label: string }> = {
    SUBMITTED: { className: 'bg-blue-100 text-blue-800', label: 'Submitted' },
    UNDER_REVIEW: { className: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
    ACCEPTED: { className: 'bg-green-100 text-green-800', label: 'Accepted' },
    REJECTED: { className: 'bg-red-100 text-red-800', label: 'Rejected' },
  }

  const { className, label } = config[status] || config.SUBMITTED

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
