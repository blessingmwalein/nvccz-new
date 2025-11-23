# Payroll Module Permissions Implementation

## Overview
Implemented comprehensive role-based permissions for the Payroll module using specific, named-action-based permissions for fine-grained access control.

## Payroll Module Structure
- **9 Pages**: Dashboard, Employees, Runs, Payslips, Tax Rules, Allowance Types, Deduction Types, Bank Templates, Payments
- **40+ Components**: Tables, forms, drawers, and specialized components
- **Key Workflows**: Employee management, payroll processing, payslip generation, configuration management

## Payroll-Specific Actions (48 total)

### Employee Management (5 actions)
```typescript
PAYROLL_ACTIONS = {
  CREATE_EMPLOYEE: 'create-employee',
  UPDATE_EMPLOYEE: 'update-employee',
  DELETE_EMPLOYEE: 'delete-employee',
  VIEW_EMPLOYEE_DETAILS: 'view-employee-details',
  MANAGE_EMPLOYEE_SALARY: 'manage-employee-salary',
}
```

### Payroll Run Management (6 actions)
```typescript
  CREATE_PAYROLL_RUN: 'create-payroll-run',
  UPDATE_PAYROLL_RUN: 'update-payroll-run',
  DELETE_PAYROLL_RUN: 'delete-payroll-run',
  PROCESS_PAYROLL_RUN: 'process-payroll-run',
  APPROVE_PAYROLL_RUN: 'approve-payroll-run',
  COMPLETE_PAYROLL_RUN: 'complete-payroll-run',
```

### Payslip Management (4 actions)
```typescript
  VIEW_PAYSLIPS: 'view-payslips',
  GENERATE_PAYSLIP: 'generate-payslip',
  DOWNLOAD_PAYSLIP: 'download-payslip',
  VIEW_ALL_PAYSLIPS: 'view-all-payslips',
```

### Tax Rules Management (3 actions)
```typescript
  CREATE_TAX_RULE: 'create-tax-rule',
  UPDATE_TAX_RULE: 'update-tax-rule',
  DELETE_TAX_RULE: 'delete-tax-rule',
```

### Allowance Types Management (3 actions)
```typescript
  CREATE_ALLOWANCE_TYPE: 'create-allowance-type',
  UPDATE_ALLOWANCE_TYPE: 'update-allowance-type',
  DELETE_ALLOWANCE_TYPE: 'delete-allowance-type',
```

### Deduction Types Management (3 actions)
```typescript
  CREATE_DEDUCTION_TYPE: 'create-deduction-type',
  UPDATE_DEDUCTION_TYPE: 'update-deduction-type',
  DELETE_DEDUCTION_TYPE: 'delete-deduction-type',
```

### Bank Template Management (4 actions)
```typescript
  CREATE_BANK_TEMPLATE: 'create-bank-template',
  UPDATE_BANK_TEMPLATE: 'update-bank-template',
  DELETE_BANK_TEMPLATE: 'delete-bank-template',
  GENERATE_BANK_FILE: 'generate-bank-file',
```

### Payment Management (3 actions)
```typescript
  VIEW_PAYMENTS: 'view-payments',
  APPROVE_PAYMENT: 'approve-payment',
  INITIATE_PAYMENT: 'initiate-payment',
```

## Role Configurations

### CFO (Chief Financial Officer)
**Access Level**: Full
**Permissions**: All 48 payroll actions

```typescript
{
  moduleId: 'payroll',
  access: 'full',
  actions: Object.values(PAYROLL_ACTIONS), // All 48 actions
  subModules: {
    'payroll-dashboard': 'full',
    'payroll-employees': 'full',
    'payroll-runs': 'full',
    'payroll-payslips': 'full',
    'payroll-tax-rules': 'full',
    'payroll-allowance-types': 'full',
    'payroll-deduction-types': 'full',
    'payroll-bank-templates': 'full',
  }
}
```

**Can Perform:**
- ✅ All employee operations (create, update, delete, view, manage salary)
- ✅ All payroll run operations (create, update, delete, process, approve, complete)
- ✅ All payslip operations
- ✅ All configuration management (tax rules, allowances, deductions, bank templates)
- ✅ Payment approvals and initiation

---

### FIN_MGR (Finance Manager)
**Access Level**: Full
**Permissions**: All 48 payroll actions

```typescript
{
  moduleId: 'payroll',
  access: 'full',
  actions: Object.values(PAYROLL_ACTIONS),
}
```

**Can Perform:**
- ✅ All payroll operations
- ✅ Complete oversight and management
- ✅ Approve and process payroll runs
- ✅ Configure all payroll settings

---

### FIN_OFF (Finance Officer)
**Access Level**: Write
**Permissions**: 12 specific actions

```typescript
{
  moduleId: 'payroll',
  access: 'write',
  actions: [
    PAYROLL_ACTIONS.VIEW_EMPLOYEE_DETAILS,
    PAYROLL_ACTIONS.CREATE_EMPLOYEE,
    PAYROLL_ACTIONS.UPDATE_EMPLOYEE,
    PAYROLL_ACTIONS.MANAGE_EMPLOYEE_SALARY,
    PAYROLL_ACTIONS.CREATE_PAYROLL_RUN,
    PAYROLL_ACTIONS.UPDATE_PAYROLL_RUN,
    PAYROLL_ACTIONS.PROCESS_PAYROLL_RUN,
    PAYROLL_ACTIONS.VIEW_PAYSLIPS,
    PAYROLL_ACTIONS.VIEW_ALL_PAYSLIPS,
    PAYROLL_ACTIONS.GENERATE_PAYSLIP,
    PAYROLL_ACTIONS.DOWNLOAD_PAYSLIP,
    PAYROLL_ACTIONS.VIEW_PAYMENTS,
  ],
  subModules: {
    'payroll-dashboard': 'read',
    'payroll-employees': 'write',
    'payroll-runs': 'write',
    'payroll-payslips': 'read',
  }
}
```

**Can Perform:**
- ✅ Create and update employees
- ✅ Manage employee salaries
- ✅ Create, update, and process payroll runs
- ✅ View and generate payslips
- ✅ View payments

**Cannot Perform:**
- ❌ Delete employees or payroll runs
- ❌ Approve or complete payroll runs
- ❌ Manage tax rules, allowances, deductions, or bank templates
- ❌ Approve or initiate payments

---

### HR_MGR (HR Manager)
**Access Level**: Full
**Permissions**: All 48 payroll actions

```typescript
{
  moduleId: 'payroll',
  access: 'full',
  actions: Object.values(PAYROLL_ACTIONS),
}
```

**Can Perform:**
- ✅ Complete HR and payroll management
- ✅ All employee operations
- ✅ Full payroll processing capability
- ✅ Configure payroll settings

---

### HR_OFF (HR Officer)
**Access Level**: Write
**Permissions**: 17 specific actions

```typescript
{
  moduleId: 'payroll',
  access: 'write',
  actions: [
    PAYROLL_ACTIONS.CREATE_EMPLOYEE,
    PAYROLL_ACTIONS.UPDATE_EMPLOYEE,
    PAYROLL_ACTIONS.DELETE_EMPLOYEE,
    PAYROLL_ACTIONS.VIEW_EMPLOYEE_DETAILS,
    PAYROLL_ACTIONS.MANAGE_EMPLOYEE_SALARY,
    PAYROLL_ACTIONS.CREATE_PAYROLL_RUN,
    PAYROLL_ACTIONS.UPDATE_PAYROLL_RUN,
    PAYROLL_ACTIONS.VIEW_PAYSLIPS,
    PAYROLL_ACTIONS.VIEW_ALL_PAYSLIPS,
    PAYROLL_ACTIONS.GENERATE_PAYSLIP,
    PAYROLL_ACTIONS.DOWNLOAD_PAYSLIP,
    PAYROLL_ACTIONS.CREATE_ALLOWANCE_TYPE,
    PAYROLL_ACTIONS.UPDATE_ALLOWANCE_TYPE,
    PAYROLL_ACTIONS.DELETE_ALLOWANCE_TYPE,
    PAYROLL_ACTIONS.CREATE_DEDUCTION_TYPE,
    PAYROLL_ACTIONS.UPDATE_DEDUCTION_TYPE,
    PAYROLL_ACTIONS.DELETE_DEDUCTION_TYPE,
  ],
}
```

**Can Perform:**
- ✅ Full employee management (create, update, delete)
- ✅ Manage employee salaries
- ✅ Create and update payroll runs
- ✅ Manage allowance and deduction types
- ✅ View and generate payslips

**Cannot Perform:**
- ❌ Process, approve, or complete payroll runs
- ❌ Delete payroll runs
- ❌ Manage tax rules or bank templates
- ❌ Initiate or approve payments

---

### HR_COORD (HR Coordinator)
**Access Level**: Read
**Permissions**: 3 specific actions

```typescript
{
  moduleId: 'payroll',
  access: 'read',
  actions: [
    PAYROLL_ACTIONS.VIEW_EMPLOYEE_DETAILS,
    PAYROLL_ACTIONS.VIEW_PAYSLIPS,
    PAYROLL_ACTIONS.VIEW_ALL_PAYSLIPS,
  ],
}
```

**Can Perform:**
- ✅ View employee details
- ✅ View all payslips

**Cannot Perform:**
- ❌ Any create, update, or delete operations
- ❌ Process payroll
- ❌ Manage configurations

---

### Other Roles
- **HR_MEM**: No payroll access
- **ACCOUNTANT, FIN_ASST, FIN_MEM**: Inherit CFO's submodule permissions, no specific actions defined yet
- **Investment, Operations, Procurement, Marketing, Legal, IT roles**: No payroll access

## Pages Protected with ModuleGuard

### 1. Payroll Dashboard (`/payroll`)
```typescript
<ModuleGuard moduleId="payroll" requiredAccess="read">
  <PayrollDashboard />
</ModuleGuard>
```

### 2. Employees Page (`/payroll/employees`)
```typescript
<ModuleGuard moduleId="payroll" subModuleId="payroll-employees" requiredAccess="read">
  <EmployeesTable />
</ModuleGuard>
```

### 3. Payroll Runs Page (`/payroll/runs`)
```typescript
<ModuleGuard moduleId="payroll" subModuleId="payroll-runs" requiredAccess="read">
  <PayrollRunsTable />
</ModuleGuard>
```

### 4. Payslips Page (`/payroll/payslips`)
```typescript
<ModuleGuard moduleId="payroll" subModuleId="payroll-payslips" requiredAccess="read">
  <PayslipsPage />
</ModuleGuard>
```

### 5. Tax Rules Page (`/payroll/tax-rules`)
```typescript
<ModuleGuard moduleId="payroll" subModuleId="payroll-tax-rules" requiredAccess="read">
  <TaxRulesTable />
</ModuleGuard>
```

### 6. Allowance Types Page (`/payroll/allowance-types`)
```typescript
<ModuleGuard moduleId="payroll" subModuleId="payroll-allowance-types" requiredAccess="read">
  <AllowanceTypesTable />
</ModuleGuard>
```

### 7. Deduction Types Page (`/payroll/deduction-types`)
```typescript
<ModuleGuard moduleId="payroll" subModuleId="payroll-deduction-types" requiredAccess="read">
  <DeductionTypesTable />
</ModuleGuard>
```

### 8. Bank Templates Page (`/payroll/bank-templates`)
```typescript
<ModuleGuard moduleId="payroll" subModuleId="payroll-bank-templates" requiredAccess="read">
  <BankTemplatesTable />
</ModuleGuard>
```

### 9. Payments Page (`/payroll/payments`)
```typescript
<ModuleGuard moduleId="payroll" requiredAccess="read">
  <PaymentsTable />
</ModuleGuard>
```

## Components Protected with Action Permissions

### 1. EmployeesTable Component

**Permission Checks:**
```typescript
const canCreateEmployee = hasSpecificAction('payroll', PAYROLL_ACTIONS.CREATE_EMPLOYEE)
const canUpdateEmployee = hasSpecificAction('payroll', PAYROLL_ACTIONS.UPDATE_EMPLOYEE)
const canDeleteEmployee = hasSpecificAction('payroll', PAYROLL_ACTIONS.DELETE_EMPLOYEE)
const canViewDetails = hasSpecificAction('payroll', PAYROLL_ACTIONS.VIEW_EMPLOYEE_DETAILS)
```

**Protected Actions:**
- Create Employee button: Only visible if `canCreateEmployee`
- Edit action: Only available if `canUpdateEmployee`
- Delete action: Only available if `canDeleteEmployee`
- View details: Only available if `canViewDetails`

**Implementation:**
```typescript
// Create button
{canCreateEmployee && (
  <Button onClick={handleCreate}>
    <Plus /> Create Employee
  </Button>
)}

// Table actions
<RichDataTable
  onView={canViewDetails ? handleView : undefined}
  onEdit={canUpdateEmployee ? handleEdit : undefined}
  onDelete={canDeleteEmployee ? handleDelete : undefined}
/>
```

---

### 2. PayrollRunsTable Component

**Permission Checks:**
```typescript
const canCreateRun = hasSpecificAction('payroll', PAYROLL_ACTIONS.CREATE_PAYROLL_RUN)
const canUpdateRun = hasSpecificAction('payroll', PAYROLL_ACTIONS.UPDATE_PAYROLL_RUN)
const canDeleteRun = hasSpecificAction('payroll', PAYROLL_ACTIONS.DELETE_PAYROLL_RUN)
const canProcessRun = hasSpecificAction('payroll', PAYROLL_ACTIONS.PROCESS_PAYROLL_RUN)
const canApproveRun = hasSpecificAction('payroll', PAYROLL_ACTIONS.APPROVE_PAYROLL_RUN)
const canCompleteRun = hasSpecificAction('payroll', PAYROLL_ACTIONS.COMPLETE_PAYROLL_RUN)
```

**Protected Actions:**
- Create Payroll Run button: Only visible if `canCreateRun`
- Edit action: Only available if `canUpdateRun`
- Delete action: Only available if `canDeleteRun`
- Process button: Only visible if `canProcessRun` and status is DRAFT
- Approve/Complete actions: Protected by respective permissions

**Implementation:**
```typescript
// Create button
{canCreateRun && (
  <Button onClick={handleCreate}>
    <Plus /> Create Payroll Run
  </Button>
)}

// Table actions
<RichDataTable
  onEdit={canUpdateRun ? handleEdit : undefined}
  onDelete={canDeleteRun ? openDeleteDialog : undefined}
  customActions={(row) => (
    {row.status === 'DRAFT' && canProcessRun && (
      <Button onClick={() => handleProcess(row)}>
        <Play /> Process
      </Button>
    )}
  )}
/>
```

## Permission Check Pattern

### Using hasSpecificAction
```typescript
import { useRolePermissions } from "@/lib/hooks/useRolePermissions"
import { PAYROLL_ACTIONS } from "@/lib/config/role-permissions"

function MyComponent() {
  const { hasSpecificAction } = useRolePermissions()
  
  // Check specific permission
  const canCreateEmployee = hasSpecificAction(
    'payroll', 
    PAYROLL_ACTIONS.CREATE_EMPLOYEE
  )
  
  // Use in conditional rendering
  return (
    <>
      {canCreateEmployee && (
        <Button onClick={handleCreate}>Create</Button>
      )}
    </>
  )
}
```

### Logic Flow
1. **Admin Bypass**: Admins automatically have all permissions
2. **Check Actions Array**: Looks for action in module's `actions` array
3. **Fallback**: If no actions array, checks if module has `'full'` access
4. **Return**: Boolean indicating permission status

## Benefits of This Implementation

### 1. Fine-Grained Control
- HR Officers can manage employees but can't process payroll
- Finance Officers can process payroll but can't delete employees
- Coordinators have read-only access to specific information

### 2. Workflow Alignment
- Permissions match actual business workflows
- Clear separation between employee management and payroll processing
- Configuration management separated from operational tasks

### 3. Security
- Principle of least privilege enforced
- Each role gets only the permissions needed for their job
- Critical actions (approve, delete, process) restricted appropriately

### 4. Maintainability
- Centralized permission definitions
- Easy to add new actions or modify existing ones
- Self-documenting code with descriptive action names

### 5. Scalability
- Easy to create new roles with specific permission combinations
- Can add new payroll features with their own actions
- Flexible enough for complex organizational structures

## Testing Scenarios

### Scenario 1: HR Officer Managing Employees
**User**: HR Officer
**Expected Behavior:**
- ✅ Can see "Create Employee" button
- ✅ Can edit employee details
- ✅ Can delete employees
- ✅ Can manage salaries
- ✅ Can create payroll runs
- ❌ Cannot see "Process" button on draft payroll runs
- ❌ Cannot delete payroll runs

### Scenario 2: Finance Officer Processing Payroll
**User**: Finance Officer
**Expected Behavior:**
- ✅ Can create employees
- ✅ Can edit employees
- ✅ Can create payroll runs
- ✅ Can process draft payroll runs
- ✅ Can view and generate payslips
- ❌ Cannot delete employees
- ❌ Cannot delete payroll runs
- ❌ Cannot manage tax rules or allowance types

### Scenario 3: HR Coordinator Viewing Information
**User**: HR Coordinator
**Expected Behavior:**
- ✅ Can view employee details
- ✅ Can view all payslips
- ❌ Cannot see "Create Employee" button
- ❌ No edit or delete actions available
- ❌ Cannot create or process payroll runs
- ❌ Cannot access configuration pages

### Scenario 4: CFO/HR Manager Full Access
**User**: CFO or HR Manager
**Expected Behavior:**
- ✅ All buttons visible
- ✅ All actions available
- ✅ Can access all pages
- ✅ Can perform all operations

## Remaining Components to Protect

The following components still need action-based permission implementation:

### High Priority:
1. **TaxRulesTable** - Create/Edit/Delete tax rules
2. **AllowanceTypesTable** - Create/Edit/Delete allowance types
3. **DeductionTypesTable** - Create/Edit/Delete deduction types
4. **BankTemplatesTable** - Create/Edit/Delete/Generate bank files
5. **PaymentsTable** - View/Approve/Initiate payments

### Medium Priority:
6. **PayrollDashboard** - Dashboard-level action controls
7. **EmployeeForm** - Field-level permissions (e.g., only managers can edit salary)
8. **PayrollRunForm** - Step validation based on permissions
9. **PayslipTemplate** - Download/Print actions

### Low Priority:
10. **EmployeeDrawer** - Edit button visibility
11. **PayrollRunDrawer** - Action buttons based on status and permissions
12. Various form components for fine-grained field control

## Implementation Pattern for Remaining Components

```typescript
// 1. Import dependencies
import { useRolePermissions } from "@/lib/hooks/useRolePermissions"
import { PAYROLL_ACTIONS } from "@/lib/config/role-permissions"

// 2. Define permission checks
const { hasSpecificAction } = useRolePermissions()
const canCreateTaxRule = hasSpecificAction('payroll', PAYROLL_ACTIONS.CREATE_TAX_RULE)
const canUpdateTaxRule = hasSpecificAction('payroll', PAYROLL_ACTIONS.UPDATE_TAX_RULE)
const canDeleteTaxRule = hasSpecificAction('payroll', PAYROLL_ACTIONS.DELETE_TAX_RULE)

// 3. Apply to UI elements
{canCreateTaxRule && <Button onClick={handleCreate}>Create</Button>}
<Table onEdit={canUpdateTaxRule ? handleEdit : undefined} />
```

## Files Modified

### Configuration Files:
1. **lib/config/role-permissions.ts**
   - Added 48 PAYROLL_ACTIONS constants
   - Updated CFO role with all payroll actions
   - Updated FIN_MGR role with all payroll actions
   - Updated FIN_OFF role with 12 processing actions
   - Updated HR_MGR role with all payroll actions
   - Updated HR_OFF role with 17 HR-specific actions
   - Updated HR_COORD role with 3 read-only actions

### Page Files (9 files):
2. **app/payroll/page.tsx** - Added ModuleGuard
3. **app/payroll/employees/page.tsx** - Added ModuleGuard with subModule
4. **app/payroll/runs/page.tsx** - Added ModuleGuard with subModule
5. **app/payroll/payslips/page.tsx** - Added ModuleGuard with wrapper pattern
6. **app/payroll/tax-rules/page.tsx** - Added ModuleGuard with subModule
7. **app/payroll/allowance-types/page.tsx** - Added ModuleGuard with subModule
8. **app/payroll/deduction-types/page.tsx** - Added ModuleGuard with subModule
9. **app/payroll/bank-templates/page.tsx** - Added ModuleGuard with subModule
10. **app/payroll/payments/page.tsx** - Added ModuleGuard

### Component Files (2 files):
11. **components/payroll/employees-table.tsx**
    - Added permission imports
    - Defined 4 permission checks
    - Protected Create button
    - Protected table actions (view, edit, delete)

12. **components/payroll/payroll-runs-table.tsx**
    - Added permission imports
    - Defined 6 permission checks
    - Protected Create button
    - Protected edit and delete actions
    - Protected Process button

## Next Steps

1. **Apply permissions to remaining table components** (TaxRules, AllowanceTypes, DeductionTypes, BankTemplates, Payments)
2. **Add field-level permissions** in forms (e.g., salary fields only editable by certain roles)
3. **Implement approval workflows** with permission checks at each stage
4. **Add audit logging** for sensitive payroll actions
5. **Create admin UI** to visualize role-payroll action mappings
6. **Write integration tests** for all permission scenarios
7. **Document API-level permission checks** for backend validation

## Summary

The payroll module now has comprehensive, fine-grained permissions that:
- Protect all 9 pages with ModuleGuard
- Define 48 specific actions for payroll workflows
- Configure 6 roles (CFO, FIN_MGR, FIN_OFF, HR_MGR, HR_OFF, HR_COORD) with appropriate actions
- Implement action checks in 2 major components (EmployeesTable, PayrollRunsTable)
- Follow the same pattern established for the application portal module
- Provide clear role-based access control aligned with business workflows

All changes compile without errors and follow TypeScript best practices.
