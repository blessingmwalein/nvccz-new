# PROCUREMENT MODULE REFACTOR - IMPLEMENTATION GUIDE

## 📋 Overview

Complete refactor of the procurement module implementing the new API workflow with Redux state management, TypeScript types, and modern UI components.

## ✅ Completed Components

### 1. Type Definitions
**File**: `lib/api/types/procurement.types.ts`
- Complete TypeScript interfaces for all entities
- Enums for all status types
- Comprehensive type safety across the module

### 2. API Service Layer
**File**: `lib/api/procurement-v2-api.ts`
- Centralized API client for all procurement endpoints
- Organized by feature (dashboard, requisitions, RFQ, quotations, POs)
- Full CRUD operations with proper typing

### 3. Redux State Management
**File**: `lib/store/slices/procurementV2Slice.ts`
- Complete Redux slice with async thunks
- State management for all procurement entities
- Loading states, error handling, and success messages
- Filter management for each entity type

### 4. Reusable Components
**Files Created**:
- `components/procurement/user-avatar.tsx` - User avatar with detailed dropdown
- `components/procurement/copy-helper.tsx` - Copy to clipboard utilities

### 5. Dashboard Page
**File**: `app/procurement/page-v2.tsx`
- Stats overview cards
- Quick actions
- Pending approvals summary

## 🚀 Implementation Steps

### Step 1: Register Redux Slice

Add to `lib/store/store.ts`:

```typescript
import procurementV2Reducer from './slices/procurementV2Slice'

export const store = configureStore({
  reducer: {
    // ... existing reducers
    procurementV2: procurementV2Reducer,
  },
})
```

### Step 2: Create Purchase Requisitions Page

**File**: `app/procurement/requisitions/page.tsx`

Key Features:
- Server-side pagination (limit/offset)
- Status filter (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, CONVERTED_TO_PO)
- Priority filter (LOW, MEDIUM, HIGH, URGENT)
- Department filter
- Two tabs: "All Requisitions" and "Pending Approval"
- Create requisition modal/drawer
- View requisition details drawer with timeline
- Approve/Reject actions
- Copy requisition ID helper
- UserAvatar component for requestedBy and approvedBy

**Data Flow**:
```typescript
const dispatch = useAppDispatch()
const { requisitions, requisitionsLoading, requisitionsCount } = useAppSelector(state => state.procurementV2)

// Fetch with filters
dispatch(fetchRequisitions({ status, priority, limit: 50, offset: 0 }))

// Create
dispatch(createRequisition(payload))

// Submit for approval
dispatch(submitRequisition(id))

// Approve
dispatch(approveRequisition(id))

// Reject
dispatch(rejectRequisition({ id, reason }))
```

### Step 3: Create RFQ Management Page

**File**: `app/procurement/rfq/page.tsx`

Key Features:
- List all RFQs with filters
- Create RFQ from requisition (auto-populate items)
- Create RFQ manually
- Select multiple vendors
- View quotations received for each RFQ
- Copy RFQ number

**Create RFQ Flow**:
1. User can create from requisitions page (button with requisition ID)
2. Or create new RFQ from RFQ page
3. Form includes:
   - Title, description
   - Requisition selection (optional, auto-populates items)
   - Vendor multi-select
   - Priority
   - Expected delivery date
   - Delivery address
   - RFQ deadline
   - Special requirements
   - Items (editable if from requisition)

### Step 4: Create Vendor Portal (Public, No Login)

**Directory**: `app/vendor-portal/`

**Pages**:
- `app/vendor-portal/page.tsx` - Landing page
- `app/vendor-portal/submit-quotation/page.tsx` - Submit quotation form

**Key Features**:
- Accessed via link in RFQ email sent to vendors
- URL format: `/vendor-portal/submit-quotation?rfq=RFQ-XXX&token=YYY`
- No authentication required
- Form pre-filled with RFQ details
- Real-time calculation of totals
- Item pricing input
- Company information collection
- Success confirmation page

**Reference**: Check `app/application-portal/` for similar implementation pattern

### Step 5: Create Quotations Management Page

**File**: `app/procurement/quotations/page.tsx`

Key Features:
- List all quotations with filters (status, rfqNumber, vendorEmail)
- Status badges (SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED)
- View quotation details drawer
- Accept/Reject actions
- Comparison view for multiple quotations
- Side-by-side comparison table
- Accept creates PO automatically
- Delete quotation option

**Quotation Comparison Component**:
```typescript
// Show quotations for same RFQ in comparison table
// Highlight lowest prices
// Show payment terms, delivery time
// Quick accept/reject buttons
```

### Step 6: Create Purchase Orders Page

**File**: `app/procurement/purchase-orders/page.tsx`

Key Features:
- List all POs with filters (status, vendorId, priority)
- Status: DRAFT, SENT, ACKNOWLEDGED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED
- Create PO (from requisition or quotation)
- View PO details
- Send PO to vendor
- Track items received vs pending
- Convert to bill/invoice

### Step 7: Create Approval Configuration Page

**File**: `app/procurement/approval-configs/page.tsx`

Key Features:
- Display current approval configuration
- Only ONE configuration exists (enforced by API)
- Update configuration modal
- Stage types: PURCHASE_REQUISITION, INVOICE, PURCHASE_ORDER
- Step configuration for each stage
- Role code assignment
- Sequential vs Parallel approval order

**Configuration Structure**:
```typescript
{
  name: "Procurement Department Approval Workflow",
  department: "Procurement",
  stages: [
    {
      stageType: "PURCHASE_REQUISITION",
      steps: [
        { stepNumber: 1, stepName: "Manager Approval", roleCode: "PROC_MGR", ... }
      ]
    },
    {
      stageType: "INVOICE",
      steps: [
        { stepNumber: 1, stepName: "Buyer Review", roleCode: "BUYER", ... },
        { stepNumber: 2, stepName: "Coordinator Verification", roleCode: "PROC_COORD", ... }
      ]
    }
  ]
}
```

## 🎨 UI/UX Patterns

### Data Tables
- Use `components/ui/data-table` from shadcn
- Server-side pagination controls
- Filter dropdowns above table
- Action column with dropdown menu
- Status badges with color coding

### Drawers for Details
- Use `components/ui/sheet` for detail views
- Timeline component for approval history
- Item lists with totals
- Action buttons at bottom

### Forms
- Use `react-hook-form` with `zod` validation
- Multi-step forms for complex creates
- Auto-save to draft functionality
- Confirmation dialogs for destructive actions

### Status Badges
```typescript
const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}
```

## 📊 Component Patterns

### UserAvatar Usage
```typescript
import { UserAvatarWithName } from '@/components/procurement/user-avatar'

// In table
<UserAvatarWithName user={requisition.requestedBy} size="sm" />

// In drawer
<div className="flex items-center gap-4">
  <span className="text-sm text-muted-foreground">Requested By:</span>
  <UserAvatarWithName user={requisition.requestedBy} size="md" />
</div>
```

### Copy Helper Usage
```typescript
import { CopyBadge, CopyText } from '@/components/procurement/copy-helper'

// Badge format
<CopyBadge text={requisition.requisitionNumber} />

// Text format with label
<CopyText text={requisition.id} label="Requisition ID" />
```

### Timeline Component (Create New)
```typescript
// components/procurement/approval-timeline.tsx
// Show approval history
// Visual timeline with status, user, timestamp, comments
```

## 🔐 Role-Based Access Control

### Role Codes
- `PROC_MGR` - Procurement Manager (full access)
- `PROC_OFF` - Procurement Officer (most operations)
- `BUYER` - Buyer (create, view)
- `PROC_COORD` - Procurement Coordinator (review, coordinate)
- `PROC_MEM` - Procurement Member (basic access)

### Department Roles
- `HEAD` - Can approve requisitions
- `DEPUTY` - Can approve requisitions
- `MEMBER` - Cannot approve

### Permission Checks
```typescript
// In components, check user permissions
const canApprove = user.departmentRole === 'HEAD' || 
                   user.departmentRole === 'DEPUTY' ||
                   user.roleCode === 'PROC_MGR'

// Conditionally render actions
{canApprove && (
  <Button onClick={() => handleApprove(id)}>
    Approve
  </Button>
)}
```

## 📁 File Structure

```
app/
  procurement/
    page.tsx                          # Dashboard (use page-v2.tsx as reference)
    requisitions/
      page.tsx                        # List requisitions with tabs
      [id]/
        page.tsx                      # Detail view (optional, can use drawer)
    rfq/
      page.tsx                        # List RFQs
      create/
        page.tsx                      # Create RFQ form
    quotations/
      page.tsx                        # List & manage quotations
      compare/
        page.tsx                      # Side-by-side comparison
    purchase-orders/
      page.tsx                        # List POs
      [id]/
        page.tsx                      # PO details
    approval-configs/
      page.tsx                        # Manage approval workflow
  vendor-portal/
    page.tsx                          # Public landing page
    submit-quotation/
      page.tsx                        # Submit quotation form (no auth)

components/
  procurement/
    user-avatar.tsx                   # ✅ Created
    copy-helper.tsx                   # ✅ Created
    requisition-form.tsx              # Create/edit requisition
    requisition-drawer.tsx            # View requisition details
    rfq-form.tsx                      # Create RFQ
    quotation-form.tsx                # Submit quotation (vendor side)
    quotation-drawer.tsx              # View quotation details
    quotation-comparison.tsx          # Compare multiple quotations
    purchase-order-form.tsx           # Create PO
    purchase-order-drawer.tsx         # View PO details
    approval-timeline.tsx             # Visual approval history
    filters/
      requisition-filters.tsx         # Filter component
      rfq-filters.tsx
      quotation-filters.tsx
      purchase-order-filters.tsx

lib/
  api/
    types/
      procurement.types.ts            # ✅ Created
    procurement-v2-api.ts             # ✅ Created
  store/
    slices/
      procurementV2Slice.ts           # ✅ Created
```

## 🔄 Workflow Implementation

### Complete Procurement Flow

1. **Create Requisition** (Any user)
   - Fill form with items
   - Save as DRAFT or Submit for approval
   - If submitted, status → PENDING_APPROVAL

2. **Approve Requisition** (HEAD/DEPUTY/PROC_MGR)
   - View pending approvals tab
   - Review items and justification
   - Approve → status = APPROVED
   - Reject → status = REJECTED (with reason)

3. **Create RFQ** (PROC_MGR/PROC_OFF)
   - Can create from approved requisition
   - Select vendors (minimum 3 recommended)
   - Set deadline
   - System sends email to vendors with portal link

4. **Vendor Submits Quotation** (External, no login)
   - Vendor receives email with link
   - Opens public portal
   - Fills quotation form with prices
   - System calculates totals automatically
   - Receives confirmation

5. **Review Quotations** (PROC_MGR/PROC_OFF)
   - View all quotations for RFQ
   - Compare side-by-side
   - Accept best quotation (others auto-rejected)
   - System creates PO automatically if createPO=true

6. **Send Purchase Order** (PROC_MGR/PROC_OFF)
   - Review auto-created PO or create manually
   - Send to vendor
   - Status → SENT

7. **Receive Goods & Create Invoice**
   - Track items received
   - Convert PO to Bill/Invoice
   - Invoice goes through approval workflow

## 🎯 Next Steps (Priority Order)

1. ✅ Types, API service, Redux slice - DONE
2. ✅ UserAvatar and Copy components - DONE
3. ✅ Dashboard page - DONE
4. 🔄 Requisitions page (HIGH PRIORITY)
5. 🔄 RFQ management page
6. 🔄 Vendor portal (public)
7. 🔄 Quotations page
8. 🔄 Purchase Orders page
9. 🔄 Approval configs page
10. 🔄 Timeline component
11. 🔄 All drawer components
12. 🔄 All form components

## 📝 Notes

- All filters use server-side pagination (limit/offset)
- Use existing UI components from `components/ui/`
- Follow existing patterns from payroll module for consistency
- Keep existing styles and UI interactions
- Add new functionality as specified in workflow
- Test with actual API endpoints
- Handle loading states gracefully
- Show error messages clearly
- Use toast notifications for success/error feedback

## 🐛 Common Issues to Handle

1. **Currency ID missing**: Ensure currencyId is provided or handle null
2. **Vendor not found**: When accepting quotation, vendor email must exist in system
3. **Permission errors**: Check user roles before API calls
4. **Sequential step numbers**: Approval config steps must be 1, 2, 3... (no gaps)

## 📚 References

- Payroll module for Redux patterns: `lib/store/slices/payrollSlice.ts`
- Application portal for public access pattern: `app/application-portal/`
- Admin users for role management: `app/admin/users/`
- Existing procurement for UI reference: `components/procurement/`

---

**Ready to implement**: Start with requisitions page, it's the foundation of the workflow.
