"use client"

/**
 * Permission Guard Components
 * 
 * These components provide declarative permission checking in React components
 */

import { ReactNode } from 'react';
import { useRolePermissions, useHasPermission, useCanPerformAction } from '@/lib/hooks/useRolePermissions';

interface PermissionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ModuleGuardProps extends PermissionGuardProps {
  moduleId: string;
  subModuleId?: string;
}

interface ActionGuardProps extends PermissionGuardProps {
  moduleId: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

interface RoleGuardProps extends PermissionGuardProps {
  allowedRoles: string[];
}

interface DepartmentGuardProps extends PermissionGuardProps {
  allowedDepartments: string[];
}

interface LevelGuardProps extends PermissionGuardProps {
  minLevel: number;
}

/**
 * Guard component that renders children only if user has access to module
 * 
 * @example
 * <ModuleGuard moduleId="accounting">
 *   <AccountingDashboard />
 * </ModuleGuard>
 * 
 * @example
 * <ModuleGuard moduleId="accounting" subModuleId="invoices" fallback={<AccessDenied />}>
 *   <InvoicesList />
 * </ModuleGuard>
 */
export function ModuleGuard({ 
  moduleId, 
  subModuleId, 
  children, 
  fallback = null 
}: ModuleGuardProps) {
  const hasAccess = useHasPermission(moduleId, subModuleId);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Guard component that renders children only if user can perform specific action
 * 
 * @example
 * <ActionGuard moduleId="accounting" action="create">
 *   <CreateInvoiceButton />
 * </ActionGuard>
 */
export function ActionGuard({ 
  moduleId, 
  action, 
  children, 
  fallback = null 
}: ActionGuardProps) {
  const canPerform = useCanPerformAction(moduleId, action);

  if (!canPerform) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Guard component that renders children only if user has specific role
 * 
 * @example
 * <RoleGuard allowedRoles={['CFO', 'FIN_MGR']}>
 *   <FinancialSettings />
 * </RoleGuard>
 */
export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback = null 
}: RoleGuardProps) {
  const { roleCode } = useRolePermissions();

  if (!roleCode || !allowedRoles.includes(roleCode)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Guard component that renders children only if user is in specific department
 * 
 * @example
 * <DepartmentGuard allowedDepartments={['Finance', 'Accounting']}>
 *   <FinanceDashboard />
 * </DepartmentGuard>
 */
export function DepartmentGuard({ 
  allowedDepartments, 
  children, 
  fallback = null 
}: DepartmentGuardProps) {
  const { department } = useRolePermissions();

  if (!department || !allowedDepartments.includes(department)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Guard component that renders children only if user has minimum level
 * 
 * @example
 * <LevelGuard minLevel={4}>
 *   <ManagerDashboard />
 * </LevelGuard>
 */
export function LevelGuard({ 
  minLevel, 
  children, 
  fallback = null 
}: LevelGuardProps) {
  const { level } = useRolePermissions();

  if (level < minLevel) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Compound guard that combines multiple permission checks
 * All conditions must be met for children to render
 * 
 * @example
 * <PermissionGuard
 *   moduleId="accounting"
 *   allowedRoles={['CFO', 'FIN_MGR']}
 *   minLevel={4}
 * >
 *   <SensitiveContent />
 * </PermissionGuard>
 */
interface CompoundGuardProps extends PermissionGuardProps {
  moduleId?: string;
  subModuleId?: string;
  allowedRoles?: string[];
  allowedDepartments?: string[];
  minLevel?: number;
  requireAction?: 'create' | 'read' | 'update' | 'delete';
}

export function PermissionGuard({
  moduleId,
  subModuleId,
  allowedRoles,
  allowedDepartments,
  minLevel,
  requireAction,
  children,
  fallback = null,
}: CompoundGuardProps) {
  const { 
    roleCode, 
    department, 
    level, 
    hasModuleAccess: checkModuleAccess,
    hasSubModuleAccess: checkSubModuleAccess,
    canPerformAction: checkAction
  } = useRolePermissions();

  // Check module access
  if (moduleId) {
    const hasAccess = subModuleId 
      ? checkSubModuleAccess(moduleId, subModuleId)
      : checkModuleAccess(moduleId);
    
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  // Check role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!roleCode || !allowedRoles.includes(roleCode)) {
      return <>{fallback}</>;
    }
  }

  // Check department
  if (allowedDepartments && allowedDepartments.length > 0) {
    if (!department || !allowedDepartments.includes(department)) {
      return <>{fallback}</>;
    }
  }

  // Check level
  if (minLevel !== undefined && level < minLevel) {
    return <>{fallback}</>;
  }

  // Check action
  if (requireAction && moduleId) {
    if (!checkAction(moduleId, requireAction)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
