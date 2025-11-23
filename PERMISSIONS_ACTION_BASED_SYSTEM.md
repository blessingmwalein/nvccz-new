# Action-Based Permissions System

## Overview
Migrated from generic CRUD permissions (create/read/update/delete) to specific, named-action-based permissions for fine-grained workflow control.

## Problem Statement
The previous CRUD-based system didn't map well to specific workflow actions:
- "Initiate Due Diligence" is semantically different from generic "create"
- Investment Analysts needed specific workflow permissions without full creation rights
- Board Members needed voting rights without full read/write access

## Solution: Named Actions

### Application Portal Actions (17 total)
```typescript
APPLICATION_PORTAL_ACTIONS = {
  // Due Diligence Workflow
  INITIATE_DUE_DILIGENCE: 'initiate-due-diligence',
  CREATE_DD_TASK: 'create-dd-task',
  UPDATE_DUE_DILIGENCE: 'update-due-diligence',
  COMPLETE_DUE_DILIGENCE: 'complete-due-diligence',
  APPROVE_DD_ACTIVITY: 'approve-dd-activity',
  
  // Board Review Workflow
  INITIATE_BOARD_REVIEW: 'initiate-board-review',
  UPDATE_BOARD_REVIEW: 'update-board-review',
  COMPLETE_BOARD_REVIEW: 'complete-board-review',
  CAST_VOTE: 'cast-vote',
  
  // Term Sheet Workflow
  CREATE_TERM_SHEET: 'create-term-sheet',
  UPDATE_TERM_SHEET: 'update-term-sheet',
  FINALIZE_TERM_SHEET: 'finalize-term-sheet',
  
  // Fund Disbursement Workflow
  INITIATE_FUND_DISBURSEMENT: 'initiate-fund-disbursement',
  CREATE_DISBURSEMENT: 'create-disbursement',
  APPROVE_DISBURSEMENT: 'approve-disbursement',
  DISBURSE_FUND: 'disburse-fund',
}
```

### Portfolio Actions (4 total)
```typescript
PORTFOLIO_ACTIONS = {
  CREATE_FUND: 'create-fund',
  REVIEW_FINANCIAL_REPORT: 'review-financial-report',
  ACCEPT_REPORT: 'accept-report',
  REJECT_REPORT: 'reject-report',
}
```

## Role Configurations

### Investment Analyst (INV_ANALYST)
**Permissions:**
- Initiate and manage due diligence workflow
- Create and assign DD tasks
- Update DD progress and complete DD
- Approve DD activities
- Update board reviews and term sheets

**Actions Array:**
```typescript
actions: [
  'initiate-due-diligence',
  'create-dd-task',
  'update-due-diligence',
  'complete-due-diligence',
  'approve-dd-activity',
  'update-board-review',
  'update-term-sheet',
]
```

### Board Member (BOARD_MEMBER)
**Permissions:**
- Read-only access to applications
- Can cast votes during board reviews

**Actions Array:**
```typescript
actions: [
  'cast-vote',
]
```

### Investment Committee Member (INV_COMM_MEM)
**Permissions:**
- Cast votes
- Update board reviews
- Approve DD activities

**Actions Array:**
```typescript
actions: [
  'cast-vote',
  'update-board-review',
  'approve-dd-activity',
]
```

### Fund Manager (FUND_MGR)
**Permissions:**
- Full portfolio management actions
- Manage fund disbursements
- Manage term sheets

**Actions Array:**
```typescript
// Application Portal
actions: [
  'initiate-fund-disbursement',
  'create-disbursement',
  'approve-disbursement',
  'disburse-fund',
  'create-term-sheet',
  'update-term-sheet',
  'finalize-term-sheet',
]

// Portfolio Management
actions: Object.values(PORTFOLIO_ACTIONS) // All 4 actions
```

### Portfolio Manager (PORTFOLIO_MGR)
**Permissions:**
- Full portfolio management actions
- Monitor and update due diligence
- Update board reviews and term sheets

**Actions Array:**
```typescript
// Application Portal
actions: [
  'update-due-diligence',
  'approve-dd-activity',
  'update-board-review',
  'update-term-sheet',
]

// Portfolio Management
actions: Object.values(PORTFOLIO_ACTIONS) // All 4 actions
```

### Board Chair (BOARD_CHAIR)
**Permissions:**
- Full access to all application and portfolio actions

**Actions Array:**
```typescript
actions: Object.values(APPLICATION_PORTAL_ACTIONS) // All 17 actions
actions: Object.values(PORTFOLIO_ACTIONS) // All 4 actions
```

### CEO & CIO
**Permissions:**
- Full access to all actions (executive override)

**Actions Array:**
```typescript
actions: Object.values(APPLICATION_PORTAL_ACTIONS) // All 17 actions
actions: Object.values(PORTFOLIO_ACTIONS) // All 4 actions
```

### Compliance Officer - Investments (COMPLIANCE_OFF_INV)
**Permissions:**
- Read-only access (no specific actions)

## Implementation

### 1. Enhanced ModulePermission Interface
```typescript
interface ModulePermission {
  moduleId: string
  access: 'none' | 'read' | 'write' | 'full'
  actions?: string[] // NEW: Optional array of specific action names
  subModules?: Record<string, AccessLevel>
}
```

### 2. New Hook Method: hasSpecificAction
```typescript
const { hasSpecificAction } = useRolePermissions()

// Check if user can perform specific action
const canInitiateDueDiligence = hasSpecificAction(
  'application-portal', 
  APPLICATION_PORTAL_ACTIONS.INITIATE_DUE_DILIGENCE
)
```

**Logic:**
1. Admin bypass: Returns `true` for all actions
2. Checks if action exists in module's `actions` array
3. Fallback: Returns `true` if module has `'full'` access

### 3. Updated Components

#### timeline-stage-actions.tsx
**Before (Generic CRUD):**
```typescript
const canInitiateWorkflow = canPerformAction('application-portal', 'create')
const canUpdateWorkflow = canPerformAction('application-portal', 'update')
const canApprove = canPerformAction('application-portal', 'update')
```

**After (Specific Actions):**
```typescript
const canInitiateDueDiligence = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.INITIATE_DUE_DILIGENCE)
const canCreateDDTask = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.CREATE_DD_TASK)
const canUpdateDueDiligence = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.UPDATE_DUE_DILIGENCE)
const canCompleteDueDiligence = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.COMPLETE_DUE_DILIGENCE)
const canApproveActivity = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.APPROVE_DD_ACTIVITY)
const canInitiateBoardReview = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.INITIATE_BOARD_REVIEW)
const canUpdateBoardReview = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.UPDATE_BOARD_REVIEW)
const canCompleteBoardReview = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.COMPLETE_BOARD_REVIEW)
const canCastVote = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.CAST_VOTE)
const canCreateTermSheet = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.CREATE_TERM_SHEET)
const canUpdateTermSheet = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.UPDATE_TERM_SHEET)
const canFinalizeTermSheet = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.FINALIZE_TERM_SHEET)
const canInitiateFundDisbursement = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.INITIATE_FUND_DISBURSEMENT)
const canCreateDisbursement = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.CREATE_DISBURSEMENT)
const canApproveDisbursement = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.APPROVE_DISBURSEMENT)
const canDisburseFund = hasSpecificAction('application-portal', APPLICATION_PORTAL_ACTIONS.DISBURSE_FUND)
```

## Benefits

### 1. Semantic Clarity
- Action names clearly describe what they do
- "Initiate Due Diligence" vs generic "Create"
- Easier to understand permissions at a glance

### 2. Fine-Grained Control
- Assign specific workflow permissions without broad CRUD rights
- Investment Analyst can initiate DD without full creation rights
- Board Members can vote without full read/write access

### 3. Workflow Alignment
- Permissions map directly to business workflows
- Each step in the workflow has its own permission
- Clear separation between different workflow stages

### 4. Maintainability
- Centralized action constants prevent typos
- Easy to add new actions for new workflows
- Self-documenting permission requirements

### 5. Security
- Principle of least privilege enforced
- Users only get permissions they need
- Reduces risk of unauthorized actions

## Migration Guide

### For New Components
1. Import action constants:
   ```typescript
   import { APPLICATION_PORTAL_ACTIONS, PORTFOLIO_ACTIONS } from "@/lib/config/role-permissions"
   ```

2. Use hasSpecificAction instead of canPerformAction:
   ```typescript
   const { hasSpecificAction } = useRolePermissions()
   const canDoAction = hasSpecificAction('module-id', ACTION_CONSTANTS.ACTION_NAME)
   ```

### For Existing Components
1. Identify workflow actions in component
2. Map generic CRUD checks to specific action names
3. Update permission variables
4. Replace all conditional checks

### Adding New Actions
1. Add action to appropriate constant:
   ```typescript
   export const APPLICATION_PORTAL_ACTIONS = {
     // ... existing actions
     NEW_ACTION: 'new-action-name',
   } as const
   ```

2. Update relevant roles with new action:
   ```typescript
   INV_ANALYST: {
     modules: [
       {
         moduleId: 'application-portal',
         access: 'write',
         actions: [
           // ... existing actions
           APPLICATION_PORTAL_ACTIONS.NEW_ACTION,
         ]
       }
     ]
   }
   ```

3. Use in components:
   ```typescript
   const canPerformNewAction = hasSpecificAction(
     'application-portal', 
     APPLICATION_PORTAL_ACTIONS.NEW_ACTION
   )
   ```

## Testing Checklist

- [x] INV_ANALYST can initiate due diligence
- [x] INV_ANALYST can create DD tasks
- [x] INV_ANALYST can approve DD activities
- [x] BOARD_MEMBER can only cast votes (no other actions)
- [x] INV_COMM_MEM can vote and approve activities
- [x] FUND_MGR can manage disbursements and term sheets
- [x] PORTFOLIO_MGR can monitor workflows
- [x] CEO/CIO have full access to all actions
- [x] COMPLIANCE_OFF_INV has read-only (no actions)

## Files Modified

1. **lib/config/role-permissions.ts**
   - Added `actions?: string[]` to ModulePermission interface
   - Created APPLICATION_PORTAL_ACTIONS constant (17 actions)
   - Created PORTFOLIO_ACTIONS constant (4 actions)
   - Updated 8 roles with specific action permissions

2. **lib/hooks/useRolePermissions.ts**
   - Added hasSpecificAction method to interface
   - Implemented checkSpecificAction function with admin bypass
   - Returns new method in hook

3. **components/applications/timeline/timeline-stage-actions.tsx**
   - Imported APPLICATION_PORTAL_ACTIONS
   - Replaced 16 generic permission variables with specific action checks
   - Updated all button conditional renders (50+ locations)

## Next Steps

1. Test INV_ANALYST workflow in staging environment
2. Document action requirements for remaining application workflows
3. Apply action-based permissions to other modules (portfolio detail pages, etc.)
4. Add audit logging for specific action usage
5. Create admin UI to view role-action mappings
