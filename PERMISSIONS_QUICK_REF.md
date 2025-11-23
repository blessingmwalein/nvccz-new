# Permissions System - Quick Reference

## 🚀 Quick Start

### 1. Check if user can access a module

```tsx
import { useRolePermissions } from '@/lib/hooks/useRolePermissions';

function MyComponent() {
  const { hasModuleAccess } = useRolePermissions();
  
  if (!hasModuleAccess('accounting')) {
    return <AccessDenied />;
  }
  
  return <AccountingDashboard />;
}
```

### 2. Hide/show features based on permissions

```tsx
import { ModuleGuard } from '@/components/permissions/PermissionGuards';

function MyComponent() {
  return (
    <ModuleGuard moduleId="accounting" subModuleId="invoices">
      <InvoicesList />
    </ModuleGuard>
  );
}
```

### 3. Check if user can perform an action

```tsx
import { useRolePermissions } from '@/lib/hooks/useRolePermissions';

function InvoicesList() {
  const { canPerformAction } = useRolePermissions();
  const canCreate = canPerformAction('accounting', 'create');
  
  return (
    <div>
      <h1>Invoices</h1>
      {canCreate && <CreateInvoiceButton />}
    </div>
  );
}
```

## 📋 Common Patterns

### Pattern 1: Button with permission check

```tsx
import { ActionGuard } from '@/components/permissions/PermissionGuards';

<ActionGuard moduleId="accounting" action="delete">
  <button onClick={handleDelete}>Delete</button>
</ActionGuard>
```

### Pattern 2: Role-specific content

```tsx
import { RoleGuard } from '@/components/permissions/PermissionGuards';

<RoleGuard allowedRoles={['CFO', 'FIN_MGR']}>
  <FinancialSettings />
</RoleGuard>
```

### Pattern 3: Manager-only features

```tsx
import { LevelGuard } from '@/components/permissions/PermissionGuards';

<LevelGuard minLevel={4}>
  <ApprovalSection />
</LevelGuard>
```

### Pattern 4: Complex permission requirements

```tsx
import { PermissionGuard } from '@/components/permissions/PermissionGuards';

<PermissionGuard
  moduleId="accounting"
  allowedRoles={['CFO', 'FIN_MGR']}
  minLevel={4}
  requireAction="delete"
>
  <DeleteFinancialRecords />
</PermissionGuard>
```

## 🎯 Access Levels

| Level | Permissions | Use Case |
|-------|-------------|----------|
| `full` | Create, Read, Update, Delete, Approve | Module owner, Manager |
| `write` | Create, Read, Update | Regular user with edit rights |
| `read` | Read only | Viewer, Auditor |
| `none` | No access | Not authorized |

## 👥 Role Hierarchy

### Level 5 - Executive/Manager
- CFO, CEO, CIO, BOARD_CHAIR
- Full department access
- Cross-department read access

### Level 4 - Senior Officer
- FIN_OFF, HR_OFF, BOARD_MEMBER
- Most write permissions
- Approval authority

### Level 3 - Specialist
- ACCOUNTANT, BUYER, INV_ANALYST
- Feature-specific write access
- No approval rights

### Level 2 - Assistant/Coordinator
- FIN_ASST, PROC_COORD
- Limited write access
- Supportive role

### Level 1 - Member
- FIN_MEM, OPS_MEM
- Read-only access
- Basic tasks only

## 🔍 Module IDs Reference

| Module ID | Description |
|-----------|-------------|
| `homepage` | Dashboard/Home |
| `accounting` | Accounting & Finance |
| `payroll` | Payroll Management |
| `procurement` | Procurement & Purchasing |
| `portfolio-management` | Investment Portfolio |
| `application-portal` | Application Management |
| `performance-management` | Performance Tracking |
| `events-management` | Events & IR |
| `admin-management` | User & Role Admin |

## 🎨 Sub-Module IDs

### Accounting
- `accounting-dashboard`
- `general-ledger`
- `cash-book`
- `invoices`
- `bank-reconciliation`
- `expenses`
- `inventory-accounting`
- `asset-management`
- `financial-reports`
- `accounting-settings`

### Procurement
- `procurement-dashboard`
- `purchase-requisitions`
- `purchase-orders`
- `procurement-invoices`
- `goods-received-notes`
- `approval-configurations`
- `approval-requests`

### Payroll
- `payroll-dashboard`
- `payroll-employees`
- `payroll-runs`
- `payroll-payslips`
- `payroll-tax-rules`
- `payroll-allowance-types`
- `payroll-deduction-types`
- `payroll-bank-templates`

## 🛠️ Hook API

```tsx
const {
  // User Info
  roleCode,           // 'CFO' | 'ACCOUNTANT' | etc.
  level,              // 1-5
  department,         // 'Finance' | 'IT' | etc.
  isAuthenticated,    // boolean
  
  // Functions
  hasModuleAccess,           // (moduleId: string) => boolean
  hasSubModuleAccess,        // (moduleId: string, subModuleId: string) => boolean
  getModuleAccessLevel,      // (moduleId: string) => 'full' | 'read' | 'write' | 'none'
  canPerformAction,          // (moduleId: string, action: 'create' | 'read' | 'update' | 'delete') => boolean
  
  // Data
  accessibleModules,  // string[]
  permissions,        // RolePermissions | null
  
  // State
  isLoading,          // boolean
} = useRolePermissions();
```

## ⚡ Performance Tips

1. **Use Guards for static checks** - Better performance than hooks
2. **Memoize permission checks** - Hooks already do this
3. **Check module before sub-module** - Fail fast
4. **Use accessibleModules array** - Pre-computed list

## 🐛 Troubleshooting

### Module not showing?
1. Check roleCode is set in Redux: `userDetails.roleCode`
2. Verify role exists in `ROLE_PERMISSIONS_MAP`
3. Check moduleId spelling matches exactly

### Permission denied but should work?
1. Check sub-module permissions (module access ≠ sub-module access)
2. Verify action level (read ≠ write ≠ full)
3. Check if multiple conditions are required

### Not updating after role change?
```tsx
import { useDispatch } from 'react-redux';
import { refreshUserDetails } from '@/lib/store/slices/authSlice';

const dispatch = useDispatch();
dispatch(refreshUserDetails(userId));
```

## 📦 Import Paths

```tsx
// Hooks
import { useRolePermissions } from '@/lib/hooks/useRolePermissions';

// Guards
import { ModuleGuard, ActionGuard } from '@/components/permissions/PermissionGuards';

// Utils (for server-side)
import { hasModuleAccess, getRolePermissions } from '@/lib/config/role-permissions';

// Everything (convenience)
import { 
  useRolePermissions, 
  ModuleGuard, 
  hasModuleAccess 
} from '@/lib/permissions';
```

## 🧪 Testing

```tsx
import { hasModuleAccess } from '@/lib/config/role-permissions';

test('CFO has accounting access', () => {
  expect(hasModuleAccess('CFO', 'accounting')).toBe(true);
});
```

## 💡 Pro Tips

1. **Always have a fallback** - Show user-friendly message for denied access
2. **Don't rely on frontend only** - Always validate on backend too
3. **Use TypeScript** - Get autocomplete for role codes and module IDs
4. **Check early** - Validate permissions before expensive operations
5. **Log permission checks** - Helps debug access issues

## 🔗 See Also

- Full Documentation: `PERMISSIONS_SYSTEM.md`
- Example Component: `components/permissions/PermissionsExample.tsx`
- Role Definitions: `lib/config/role-permissions.ts`
