# Role-Based Permissions Management System

This document describes the comprehensive role-based permissions system implemented for module and sub-module access control.

## Overview

The permissions system uses a centralized role-to-module mapping that determines which users can access which modules and features based on their assigned role code from the backend.

## Architecture

### 1. Role Permissions Configuration (`lib/config/role-permissions.ts`)

This is the **central source of truth** for all permissions. It contains:

- **52 role definitions** across 8 departments (Finance, Sales, Operations, Procurement, HR, Marketing, Legal, IT, Investments)
- **Module access mappings** for each role
- **Sub-module granular permissions** for specific features
- **Access levels**: `full`, `read`, `write`, `none`

#### Key Features:
- Hierarchical role structure (Levels 1-5)
- Department-based segregation
- Granular sub-module permissions
- Easy to maintain and extend

### 2. Permission Hooks (`lib/hooks/useRolePermissions.ts`)

Custom React hooks that provide permission checking functionality:

#### Main Hook: `useRolePermissions()`

Returns comprehensive permission utilities:

```typescript
const {
  // User Info
  roleCode,        // Current user's role code (e.g., 'CFO', 'ACCOUNTANT')
  level,           // Role level (1-5)
  department,      // Department name
  isAuthenticated, // Auth status
  
  // Permission Checkers
  hasModuleAccess,      // (moduleId) => boolean
  hasSubModuleAccess,   // (moduleId, subModuleId) => boolean
  getModuleAccessLevel, // (moduleId) => 'full'|'read'|'write'|'none'
  canPerformAction,     // (moduleId, action) => boolean
  
  // Accessible Modules
  accessibleModules,    // string[] of accessible module IDs
  
  // Full Permissions
  permissions,          // Complete RolePermissions object
  
  // Loading
  isLoading,           // boolean
} = useRolePermissions();
```

#### Helper Hooks:

```typescript
// Check single permission
const hasAccess = useHasPermission('accounting', 'invoices');

// Check specific action
const canCreate = useCanPerformAction('accounting', 'create');
```

### 3. Permission Guard Components (`components/permissions/PermissionGuards.tsx`)

Declarative components for conditional rendering based on permissions:

#### ModuleGuard
```tsx
<ModuleGuard moduleId="accounting" subModuleId="invoices" fallback={<AccessDenied />}>
  <InvoicesList />
</ModuleGuard>
```

#### ActionGuard
```tsx
<ActionGuard moduleId="accounting" action="create">
  <CreateInvoiceButton />
</ActionGuard>
```

#### RoleGuard
```tsx
<RoleGuard allowedRoles={['CFO', 'FIN_MGR']}>
  <FinancialSettings />
</RoleGuard>
```

#### DepartmentGuard
```tsx
<DepartmentGuard allowedDepartments={['Finance', 'Accounting']}>
  <FinanceDashboard />
</DepartmentGuard>
```

#### LevelGuard
```tsx
<LevelGuard minLevel={4}>
  <ManagerApprovalSection />
</LevelGuard>
```

#### Compound PermissionGuard
```tsx
<PermissionGuard
  moduleId="accounting"
  allowedRoles={['CFO', 'FIN_MGR']}
  minLevel={4}
  requireAction="delete"
  fallback={<AccessDenied />}
>
  <DeleteButton />
</PermissionGuard>
```

## Role Definitions

### Finance Department

| Role Code | Level | Description | Key Permissions |
|-----------|-------|-------------|-----------------|
| CFO | 5 | Chief Financial Officer | Full access to Accounting, Payroll, read access to others |
| FIN_MGR | 5 | Finance Manager | Full Accounting & Payroll access |
| FIN_OFF | 4 | Finance Officer | Write access to most Accounting features |
| ACCOUNTANT | 3 | Accountant | Write access to GL, invoices, expenses |
| FIN_ASST | 2 | Finance Assistant | Basic write access to GL, cash book |
| FIN_MEM | 1 | Finance Member | Read-only access |

### Investment Department

| Role Code | Level | Description | Key Permissions |
|-----------|-------|-------------|-----------------|
| CEO | 5 | Chief Executive Officer | Full access to all modules |
| CIO | 5 | Chief Investment Officer | Full Portfolio & Application Portal access |
| BOARD_CHAIR | 5 | Board Chairman | Full Portfolio & Application Portal access |
| FUND_MGR | 5 | Fund Manager | Full Portfolio Management |
| PORTFOLIO_MGR | 5 | Portfolio Manager | Full Portfolio Management |
| BOARD_MEMBER | 4 | Board Member | Read access to Portfolio & Applications |
| INV_COMM_MEM | 4 | Investment Committee Member | Write access to Portfolio |
| INV_ANALYST | 3 | Investment Analyst | Write access to Portfolio |
| COMPLIANCE_OFF_INV | 4 | Compliance Officer | Read access with audit rights |
| LIMITED_PARTNER | 2 | Limited Partner | Restricted Portfolio view |
| EXT_AUDITOR | 3 | External Auditor | Read-only audit access |

### Operations Department

| Role Code | Level | Description | Key Permissions |
|-----------|-------|-------------|-----------------|
| OPS_MGR | 5 | Operations Manager | Full Procurement, Performance, Events |
| OPS_OFF | 4 | Operations Officer | Write access to operational modules |
| OPS_COORD | 3 | Operations Coordinator | Write Procurement & Events |
| OPS_ANALYST | 2 | Operations Analyst | Read Performance data |
| OPS_MEM | 1 | Operations Member | Basic access |

### Procurement Department

| Role Code | Level | Description | Key Permissions |
|-----------|-------|-------------|-----------------|
| PROC_MGR | 5 | Procurement Manager | Full Procurement module access |
| PROC_OFF | 4 | Procurement Officer | Write PRs, POs, Invoices, GRNs |
| BUYER | 3 | Buyer | Create requisitions, manage vendors |
| PROC_COORD | 2 | Procurement Coordinator | Write PRs and GRNs |
| PROC_MEM | 1 | Procurement Member | Read-only |

### HR Department

| Role Code | Level | Description | Key Permissions |
|-----------|-------|-------------|-----------------|
| HR_MGR | 5 | HR Manager | Full Payroll, Performance, User Management |
| HR_OFF | 4 | HR Officer | Write Payroll & Performance |
| RECRUITER | 3 | Recruiter | User Management write access |
| HR_COORD | 2 | HR Coordinator | Read Payroll |
| HR_MEM | 1 | HR Member | Basic access |

### Sales, Marketing, Legal, IT Departments

Similar hierarchical structures with department-specific permissions.

## Access Levels

### `full`
- Complete CRUD operations
- Can view, create, edit, delete
- Can approve and manage settings

### `write`
- Can create, read, and update
- Cannot delete without additional checks
- Cannot manage critical settings

### `read`
- View-only access
- Can generate reports
- Cannot modify data

### `none`
- No access to module
- Module hidden from UI

## Implementation Guide

### Adding Permissions to a Component

#### Method 1: Using Hooks
```tsx
import { useRolePermissions } from '@/lib/hooks/useRolePermissions';

function InvoiceComponent() {
  const { hasSubModuleAccess, canPerformAction } = useRolePermissions();
  
  const canViewInvoices = hasSubModuleAccess('accounting', 'invoices');
  const canCreateInvoice = canPerformAction('accounting', 'create');
  
  if (!canViewInvoices) {
    return <AccessDenied />;
  }
  
  return (
    <div>
      <InvoiceList />
      {canCreateInvoice && <CreateInvoiceButton />}
    </div>
  );
}
```

#### Method 2: Using Guard Components
```tsx
import { ModuleGuard, ActionGuard } from '@/components/permissions/PermissionGuards';

function InvoiceComponent() {
  return (
    <ModuleGuard moduleId="accounting" subModuleId="invoices">
      <div>
        <InvoiceList />
        <ActionGuard moduleId="accounting" action="create">
          <CreateInvoiceButton />
        </ActionGuard>
      </div>
    </ModuleGuard>
  );
}
```

### Adding a New Role

1. Add role definition to `ROLE_PERMISSIONS_MAP` in `lib/config/role-permissions.ts`:

```typescript
NEW_ROLE: {
  roleCode: 'NEW_ROLE',
  level: 3,
  department: 'Department Name',
  modules: [
    { moduleId: 'homepage', access: 'full' },
    { 
      moduleId: 'accounting', 
      access: 'read',
      subModules: {
        'invoices': 'write',
        'expenses': 'read',
      }
    },
  ]
}
```

2. Update the `RoleCode` type at the top of the file.

3. No code changes needed elsewhere - the system automatically picks up the new role!

### Adding a New Module

1. Add module to `MODULE_CONFIG` in `lib/config/modules.ts`
2. Add module permissions to relevant roles in `ROLE_PERMISSIONS_MAP`
3. Module will automatically appear for users with appropriate permissions

### Checking Permissions in API Routes

```typescript
import { getRolePermissions, hasModuleAccess } from '@/lib/config/role-permissions';

export async function GET(request: Request) {
  const userRoleCode = getUserRoleFromSession(); // Your auth logic
  
  if (!hasModuleAccess(userRoleCode, 'accounting')) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Proceed with request
}
```

## Integration with Auth System

The permissions system integrates with the Redux auth store:

1. User logs in → `loginUser` thunk
2. User details fetched → `fetchUserDetails` thunk
3. `roleCode` stored in `userDetails.roleCode`
4. Permissions hook reads `roleCode` from Redux state
5. Permissions evaluated against `ROLE_PERMISSIONS_MAP`

### Auth Flow

```
Login → API Response → Redux Store → useRolePermissions → Permission Guards
                           ↓
                      userDetails
                           ↓
                       roleCode
                           ↓
                   ROLE_PERMISSIONS_MAP
                           ↓
                   Module Access Decision
```

## Security Considerations

1. **Frontend permissions are for UX only** - Always validate on the backend
2. **Role codes from backend are trusted** - Ensure your API validates JWT tokens
3. **Permission checks are cached** - Uses `useMemo` for performance
4. **Loading states handled** - Shows content appropriately while checking permissions

## Testing Permissions

```typescript
import { hasModuleAccess, getModuleAccessLevel } from '@/lib/config/role-permissions';

describe('Permissions', () => {
  it('CFO should have full accounting access', () => {
    expect(hasModuleAccess('CFO', 'accounting')).toBe(true);
    expect(getModuleAccessLevel('CFO', 'accounting')).toBe('full');
  });
  
  it('Accountant should have write access to invoices', () => {
    expect(hasSubModuleAccess('ACCOUNTANT', 'accounting', 'invoices')).toBe(true);
  });
  
  it('Sales Rep should not access accounting', () => {
    expect(hasModuleAccess('SALES_REP', 'accounting')).toBe(false);
  });
});
```

## Troubleshooting

### Module not showing in app switcher
- Check if role has module in `ROLE_PERMISSIONS_MAP`
- Verify `moduleId` matches exactly
- Check if `accessibleModules` includes the module

### User sees module but gets access denied
- Check sub-module permissions
- Verify action-level permissions
- Ensure `userDetails.roleCode` is correctly set

### Permissions not updating after role change
- Dispatch `refreshUserDetails` thunk
- Clear browser cookies and re-login
- Check Redux DevTools for state

## API Endpoints

The system expects these backend structures:

### Get User Details
```json
GET /api/users/:id
{
  "data": {
    "roleCode": "ACCOUNTANT",
    "role": {
      "name": "Accountant",
      "permissions": [...] // Optional, not used by new system
    }
  }
}
```

### Get Roles
```json
GET /api/roles
{
  "data": [
    {
      "code": "CFO",
      "name": "Chief Financial Officer",
      "level": 5,
      "department": "Finance"
    }
  ]
}
```

## Migration Guide

If you have existing permission checks, migrate them:

### Old Pattern
```tsx
// ❌ Old way
const { user } = useSelector(state => state.auth);
if (user?.role?.permissions?.includes('view_accounting')) {
  // ...
}
```

### New Pattern
```tsx
// ✅ New way
const { hasModuleAccess } = useRolePermissions();
if (hasModuleAccess('accounting')) {
  // ...
}
```

## Future Enhancements

- [ ] Dynamic permission loading from backend
- [ ] Permission inheritance (role hierarchies)
- [ ] Time-based permissions (temporary access)
- [ ] Feature flags integration
- [ ] Audit logging for permission checks
- [ ] Permission delegation
- [ ] Custom permission rules engine

## Support

For questions or issues with the permissions system:
1. Check this documentation
2. Review role definitions in `role-permissions.ts`
3. Check Redux state in DevTools
4. Verify backend response structure
