# Fund Disbursement Implementation Plan

## Overview
Comprehensive fund disbursement flow with support for ONE_TIME and MILESTONE_BASED modes.

## APIs Updated
✅ `investment-implementation-api.ts` - Added milestone, checklist, and disbursement summary APIs

## Flow Logic

### 1. Check Investment Implementation Status
```typescript
if (application.investmentImplementation?.id) {
  // Already initiated - fetch full details
  const implData = await investmentImplementationApi.getById(application.investmentImplementation.id)
} else {
  // Show "Initiate Fund Disbursement" button
}
```

### 2. Disbursement Modes

#### ONE_TIME Mode Flow:
1. **Initiate** → Show initiation details
2. **Create Disbursement** → Single disbursement creation
3. **Approve** → Approve the disbursement
4. **Disburse** → Mark as disbursed with transaction reference
5. **Summary** → Show completion status

#### MILESTONE_BASED Mode Flow:
1. **Initiate** → Show initiation details
2. **Create Milestones** → Allow adding multiple milestones
3. **Update Checklist** → Track completion items
4. **Create Disbursements** → Link to milestones
5. **Approve** → Per-disbursement approval
6. **Disburse** → Per-disbursement completion
7. **Summary** → Show progress across all milestones

## Components Needed

### 1. Fund Disbursement Details Section (Collapsible)
- Shows implementation plan, mode, total committed amount
- Displays fund information
- Shows checklist status (for milestone mode)

### 2. Milestone Management (for MILESTONE_BASED)
- List existing milestones
- Add new milestone modal
- Track milestone completion

### 3. Disbursement Summary
- Total committed vs disbursed
- Remaining amount
- List of all disbursements with status

## Key Changes to Existing Files

### timeline-stage-actions.tsx
- Check `application.investmentImplementation` existence
- Show "Initiate" if null
- Show mode-specific actions if exists

### fund-disbursement-section.tsx
- Add collapsible details section
- Add milestone creation UI
- Add checklist update UI
- Enhanced disbursement tracking

## Next Steps
1. Update fund-disbursement-section.tsx with collapsible details
2. Create milestone creation modal
3. Create checklist update component
4. Update timeline-stage-actions.tsx logic
5. Add disbursement summary display
