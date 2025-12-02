# Procurement Module Refactor - Complete Implementation Plan

## Overview
This document outlines the complete refactoring plan for the Procurement module to align with the new backend API structure, including approval flows, department-based configurations, and role-based permissions.

## Completed Tasks ✓

### 1. API Layer - Created `procurement-api-v2.ts`
- ✅ Complete type definitions matching new API structure
- ✅ Dashboard API endpoint
- ✅ Approval Configurations endpoints (GET, CREATE, UPDATE)
- ✅ Requisitions endpoints (GET, CREATE, SUBMIT, APPROVE, REJECT)
- ✅ RFQ endpoints (GET, CREATE)
- ✅ Quotations endpoints (GET, SUBMIT, ACCEPT, REJECT, DELETE)
- ✅ Proper query parameter handling for all filters

## Pending Tasks

### 2. Redux Store Updates

#### Update `procurementV2Slice.ts`:
```typescript
// Add new state properties:
interface ProcurementV2State {
  dashboard: DashboardData | null
  dashboardLoading: boolean
  dashboardError: string | null
  
  approvalConfigs: ApprovalConfiguration[]
  approvalConfigsLoading: boolean
  
  requisitions: PurchaseRequisition[]
  requisitionsLoading: boolean
  requisitionsPagination: { count: number, limit: number, offset: number }
  
  rfqs: RFQ[]
  rfqsLoading: boolean
  rfqsPagination: { count: number, limit: number, offset: number }
  
  quotations: Quotation[]
  quotationsLoading: boolean
  quotationsPagination: { count: number, limit: number, offset: number }
}

// Update async thunks to use new API:
import { procurementApiV2 } from '@/lib/api/procurement-api-v2'
```

### 3. Dashboard Component (`procurement-dashboard.tsx`)

Update to use new dashboard structure:
```typescript
const stats = [
  {
    title: 'Purchase Requisitions',
    icon: FileText,
    total: dashboard.requisitions.summary.total,
    pending: dashboard.requisitions.summary.pending,
    approved: dashboard.requisitions.summary.approved,
    draft: dashboard.requisitions.summary.draft,
    rejected: dashboard.requisitions.summary.rejected,
    href: '/procurement/requisitions',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'RFQs',
    icon: ClipboardList,
    total: dashboard.rfqs.summary.total,
    active: dashboard.rfqs.summary.active,
    href: '/procurement/rfq',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    title: 'Quotations',
    icon: FileCheck,
    total: dashboard.quotations.summary.total,
    pending: dashboard.quotations.summary.pending,
    accepted: dashboard.quotations.summary.accepted,
    rejected: dashboard.quotations.summary.rejected,
    href: '/procurement/quotations',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Invoices',
    icon: FileText,
    total: dashboard.invoices.summary.total,
    pending: dashboard.invoices.summary.pending,
    approved: dashboard.invoices.summary.approved,
    paid: dashboard.invoices.summary.paid,
    href: '/procurement/invoices',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
]
```

### 4. Approval Configurations (`approval-configurations.tsx`)

#### Department-Based System:
```typescript
// Fetch departments from API
const departments = await apiClient.get('/departments')

// Display department cards:
// 1. Show configured departments with "Update" button
// 2. Show unconfigured departments with "Configure" button
// 3. Each card shows department name and current approval flow if configured

// For configured departments:
<Card>
  <CardHeader>
    <CardTitle>{dept.name}</CardTitle>
    <Badge variant="success">Configured</Badge>
  </CardHeader>
  <CardContent>
    <p>Stages: {config.stages.length}</p>
    <Button onClick={() => handleEdit(config)}>Update Configuration</Button>
  </CardContent>
</Card>

// For unconfigured departments:
<Card>
  <CardHeader>
    <CardTitle>{dept.name}</CardTitle>
    <Badge variant="secondary">Not Configured</Badge>
  </CardHeader>
  <CardContent>
    <Button onClick={() => handleConfigure(dept)}>Configure Approval Flow</Button>
  </CardContent>
</Card>
```

#### Configuration Modal:
```typescript
interface ApprovalConfigFormData {
  name: string
  description: string
  department: string
  stages: Array<{
    stageType: 'PURCHASE_REQUISITION' | 'INVOICE' | 'PURCHASE_ORDER' | 'GRN'
    steps: Array<{
      stepNumber: number
      stepName: string
      stepType: 'ROLE'
      roleCode: string // E.g., PROC_MGR, PROC_COORD, FIN_MGR
      isRequired: boolean
      approvalOrder: 'SEQUENTIAL' | 'PARALLEL'
    }>
  }>
}
```

### 5. Purchase Requisitions (`purchase-requisitions.tsx`)

#### Add Advanced Filters:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Filters</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-4 gap-4">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
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

      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="URGENT">Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map(dept => (
            <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleResetFilters}>
        Clear Filters
      </Button>
    </div>
  </CardContent>
</Card>
```

#### Backend Pagination:
```typescript
const [pagination, setPagination] = useState({
  limit: 50,
  offset: 0,
  total: 0
})

const loadRequisitions = async () => {
  const response = await procurementApiV2.getRequisitions({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    department: departmentFilter !== 'all' ? departmentFilter : undefined,
    limit: pagination.limit,
    offset: pagination.offset
  })
  
  setPagination(prev => ({
    ...prev,
    total: response.count || 0
  }))
}

// Pagination controls:
<div className="flex items-center justify-between mt-4">
  <p className="text-sm text-muted-foreground">
    Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} results
  </p>
  <div className="flex gap-2">
    <Button 
      variant="outline" 
      disabled={pagination.offset === 0}
      onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
    >
      Previous
    </Button>
    <Button 
      variant="outline"
      disabled={pagination.offset + pagination.limit >= pagination.total}
      onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
    >
      Next
    </Button>
  </div>
</div>
```

#### Add "My Requisitions" Tab:
```typescript
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="all">All Requisitions</TabsTrigger>
    <TabsTrigger value="my">My Requisitions</TabsTrigger>
    <TabsTrigger value="pending">Pending Approval</TabsTrigger>
  </TabsList>
</Tabs>

// Load different data based on tab:
useEffect(() => {
  if (activeTab === 'my') {
    dispatch(fetchMyRequisitions())
  } else if (activeTab === 'pending') {
    dispatch(fetchPendingApprovalRequisitions())
  } else {
    dispatch(fetchRequisitions(filters))
  }
}, [activeTab, filters])
```

### 6. RFQ Management (`rfq/page.tsx` and `rfq/create/page.tsx`)

#### Update RFQ List:
```typescript
// Add filters for rfqNumber and requisitionId
const loadRFQs = async () => {
  const response = await procurementApiV2.getRFQs({
    rfqNumber: rfqNumberFilter || undefined,
    requisitionId: requisitionIdFilter || undefined,
    limit: 50,
    offset: pagination.offset
  })
}
```

#### Create RFQ Improvements:
```typescript
// Can create from:
// 1. Requisitions page (timeline drawer)
// 2. Dedicated RFQ create page

// Support multiple vendors selection:
<div className="space-y-2">
  <Label>Select Vendors (minimum 3)</Label>
  {vendors.map(vendor => (
    <div key={vendor.id} className="flex items-center space-x-2">
      <Checkbox 
        checked={selectedVendorIds.includes(vendor.id)}
        onCheckedChange={() => toggleVendor(vendor.id)}
      />
      <label>{vendor.name} - {vendor.email}</label>
    </div>
  ))}
  {selectedVendorIds.length < 3 && (
    <p className="text-sm text-red-500">Please select at least 3 vendors</p>
  )}
</div>
```

### 7. Vendor Quotation Submission Page

#### Create New Page: `app/procurement/vendor-quotation/[rfqNumber]/[requisitionId]/page.tsx`

This is the public page vendors use to submit quotes:

```typescript
'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { procurementApiV2 } from '@/lib/api/procurement-api-v2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function VendorQuotationSubmissionPage() {
  const params = useParams()
  const rfqNumber = params.rfqNumber as string
  const requisitionId = params.requisitionId as string
  
  const [rfqData, setRfqData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorEmail: '',
    companyName: '',
    taxEIN: '',
    contactPerson: '',
    phoneNumber: '',
    address: '',
    validUntil: '',
    currencyCode: 'USD',
    paymentTerms: '',
    deliveryTerms: '',
    deliveryTime: '',
    notes: '',
    items: []
  })

  useEffect(() => {
    loadRFQData()
  }, [rfqNumber])

  const loadRFQData = async () => {
    try {
      // Fetch RFQ details to show what items need quotes
      const response = await procurementApiV2.getRFQByNumber(rfqNumber)
      setRfqData(response.data)
      
      // Initialize items with RFQ items
      setFormData(prev => ({
        ...prev,
        items: response.data.items.map(item => ({
          itemName: item.itemName,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: 0,
          specifications: item.specifications,
          brand: '',
          model: '',
          warranty: ''
        }))
      }))
    } catch (error) {
      console.error('Failed to load RFQ:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await procurementApiV2.submitQuotation({
        rfqNumber,
        requisitionId,
        ...formData
      })
      // Show success message and redirect
      alert('Quotation submitted successfully!')
    } catch (error) {
      console.error('Failed to submit quotation:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit Quotation for RFQ: {rfqNumber}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vendor Information Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vendor Name *</Label>
                <Input 
                  required
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input 
                  type="email"
                  required
                  value={formData.vendorEmail}
                  onChange={(e) => setFormData({ ...formData, vendorEmail: e.target.value })}
                />
              </div>
              {/* Add all other vendor fields */}
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quote Items</h3>
              {formData.items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Item: {item.itemName}</Label>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-sm">Qty: {item.quantity} {item.unit}</p>
                      </div>
                      <div>
                        <Label>Unit Price *</Label>
                        <Input 
                          type="number"
                          step="0.01"
                          required
                          value={item.unitPrice}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index].unitPrice = parseFloat(e.target.value)
                            setFormData({ ...formData, items: newItems })
                          }}
                        />
                      </div>
                      <div>
                        <Label>Total</Label>
                        <Input 
                          value={(item.quantity * item.unitPrice).toFixed(2)}
                          disabled
                        />
                      </div>
                      {/* Add brand, model, warranty fields */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Submit Quotation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 8. Quotations Management (`quotations/page.tsx`)

#### Update with new filters and comparison:
```typescript
// Add filters
const [filters, setFilters] = useState({
  status: 'all',
  rfqNumber: '',
  vendorEmail: '',
  limit: 50,
  offset: 0
})

// Add comparison modal
const [showComparison, setShowComparison] = useState(false)
const [selectedRfqForComparison, setSelectedRfqForComparison] = useState<string>('')

// Group quotations by RFQ for comparison
const groupedByRfq = quotations.reduce((acc, quotation) => {
  const rfqNumber = quotation.rfqNumber
  if (!acc[rfqNumber]) {
    acc[rfqNumber] = {
      rfqNumber,
      quotations: []
    }
  }
  acc[rfqNumber].quotations.push(quotation)
  return acc
}, {} as Record<string, { rfqNumber: string, quotations: Quotation[] }>)

// Comparison Modal Component
<Dialog open={showComparison} onOpenChange={setShowComparison}>
  <DialogContent className="max-w-6xl">
    <DialogHeader>
      <DialogTitle>Compare Quotations for RFQ: {selectedRfqForComparison}</DialogTitle>
    </DialogHeader>
    <QuotationComparisonTable 
      quotations={groupedByRfq[selectedRfqForComparison]?.quotations || []}
      onAccept={(quotation) => handleAcceptQuotation(quotation.id)}
      onReject={(quotation) => handleRejectQuotation(quotation.id)}
    />
  </DialogContent>
</Dialog>
```

### 9. Role-Based Permissions Integration

For each action, add permission checks:

```typescript
import { useRolePermissions, useCanPerformAction } from '@/lib/permissions'

// In components:
const { roleCode, hasModuleAccess, canPerformAction } = useRolePermissions()

// Check permissions before showing actions:
{canPerformAction('procurement', 'create') && (
  <Button onClick={handleCreate}>Create Requisition</Button>
)}

{(roleCode === 'PROC_MGR' || roleCode === 'PROC_OFF') && (
  <Button onClick={handleApprove}>Approve</Button>
)}

{(['PROC_MGR', 'PROC_OFF', 'BUYER'].includes(roleCode)) && (
  <Button onClick={handleCreateRFQ}>Create RFQ</Button>
)}
```

### Permission Matrix:

| Action | Required Roles |
|--------|---------------|
| View Dashboard | Any authenticated user |
| View Approval Configs | PROC_MGR, PROC_OFF, ADMIN |
| Create Approval Config | ADMIN |
| Update Approval Config | ADMIN, PROC_MGR |
| Create Requisition | Any user |
| Submit Requisition | Requisition creator |
| Approve Requisition | Department HEAD, DEPUTY, PROC_MGR |
| Create RFQ | PROC_MGR, PROC_OFF, BUYER |
| Accept Quotation | PROC_MGR, PROC_OFF |
| Reject Quotation | PROC_MGR, PROC_OFF |

## Implementation Order

1. ✅ **API Layer** - Complete
2. **Redux Store** - Update slices to use new API
3. **Dashboard** - Update with new data structure
4. **Approval Configurations** - Department-based system
5. **Requisitions** - Add filters, pagination, tabs
6. **RFQ Management** - Update list and create pages
7. **Vendor Quotation Page** - Create public submission page
8. **Quotations** - Add comparison and management features
9. **Permissions** - Integrate role-based checks throughout

## Testing Checklist

- [ ] Dashboard displays correct counters
- [ ] Approval configs can be created per department
- [ ] Requisitions can be filtered and paginated
- [ ] RFQs can be created with multiple vendors
- [ ] Vendors can submit quotations via public link
- [ ] Quotations can be compared and accepted/rejected
- [ ] All actions respect role-based permissions
- [ ] Navigation between modules works correctly

## Next Steps

1. Update Redux slices with new async thunks
2. Refactor dashboard component
3. Update approval configurations component
4. Update requisitions with filters and pagination
5. Create vendor quotation submission page
6. Update quotations management
7. Integrate permissions throughout
8. Add Purchase Orders and Invoices (next phase)
9. Add GRNs management (next phase)

## Notes

- All API endpoints are now using the new structure from `procurement-api-v2.ts`
- Approval configs are department-based, one config per department
- Backend handles all pagination, frontend just passes limit/offset
- Vendor quotation page uses route params: `/vendor-quotation/[rfqNumber]/[requisitionId]`
- All components should use `useRolePermissions` hook for permission checks
