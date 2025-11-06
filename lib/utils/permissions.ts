import { MODULE_CONFIG, ModuleConfig } from '@/lib/config/modules'

// Department to module access mapping
const DEPARTMENT_MODULE_ACCESS: Record<string, string[]> = {
  'Finance': ['accounting', 'payroll', 'procurement', 'performance-management'],
  'Sales': ['portfolio-management', 'application-portal', 'performance-management'],
  'Operations': ['procurement', 'performance-management', 'events-management'],
  'Procurement': ['procurement', 'performance-management'],
  'Human Resources': ['payroll', 'performance-management', 'admin-management'],
  'Marketing': ['events-management', 'performance-management'],
  'Legal': ['portfolio-management', 'procurement'],
  'IT': ['admin-management', 'performance-management'],
  'Investments': ['portfolio-management', 'application-portal', 'accounting', 'events-management', 'performance-management', 'admin-management'],
}

// Role level based access (higher level = more access)
const ROLE_LEVEL_ACCESS: Record<number, string[]> = {
  5: ['all'], // Level 5 (Managers, CEO, CIO, etc.) - Full access to their department modules
  4: ['all'], // Level 4 (Officers, Committee Members) - Full access to their department modules
  3: ['view', 'create', 'edit'], // Level 3 (Analysts, Specialists) - Can view, create, edit
  2: ['view', 'create'], // Level 2 (Coordinators, Assistants) - Can view and create
  1: ['view'], // Level 1 (Members) - View only
}

// Special roles with universal access
const UNIVERSAL_ACCESS_ROLES = ['CEO', 'CIO', 'IT_MGR', 'SYSADMIN']

// Admin module specific access
const ADMIN_MODULE_ROLES = ['CEO', 'HR_MGR', 'IT_MGR', 'SYSADMIN']

// Applicant role - only view access to application portal
const APPLICANT_ROLE = 'APPLICANT'
const APPLICANT_ACCESSIBLE_MODULES = ['homepage', 'application-portal']

export interface PermissionCheck {
  canAccess: boolean
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canApprove: boolean
}

/**
 * Check if a user has access to a specific module
 */
export function canAccessModule(
  moduleId: string,
  userRole: string,
  userDepartment: string,
  roleLevel: number
): boolean {
  // Universal access roles
  if (UNIVERSAL_ACCESS_ROLES.includes(userRole)) {
    return true
  }

  // Applicant role - special case with limited access
  if (userRole === APPLICANT_ROLE || userRole.toLowerCase() === 'applicant') {
    return APPLICANT_ACCESSIBLE_MODULES.includes(moduleId)
  }

  // Admin module requires specific roles
  if (moduleId === 'admin-management') {
    return ADMIN_MODULE_ROLES.includes(userRole)
  }

  // Homepage is accessible to all
  if (moduleId === 'homepage') {
    return true
  }

  // Check department access
  const departmentModules = DEPARTMENT_MODULE_ACCESS[userDepartment] || []
  return departmentModules.includes(moduleId)
}

/**
 * Get detailed permissions for a module
 */
export function getModulePermissions(
  moduleId: string,
  userRole: string,
  userDepartment: string,
  roleLevel: number
): PermissionCheck {
  const canAccess = canAccessModule(moduleId, userRole, userDepartment, roleLevel)
  
  if (!canAccess) {
    return {
      canAccess: false,
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
    }
  }

  // Applicant role - view only access
  if (userRole === APPLICANT_ROLE || userRole.toLowerCase() === 'applicant') {
    return {
      canAccess: true,
      canView: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
    }
  }

  // Universal access roles have all permissions
  if (UNIVERSAL_ACCESS_ROLES.includes(userRole)) {
    return {
      canAccess: true,
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: true,
    }
  }

  // Get permissions based on role level
  const levelPermissions = ROLE_LEVEL_ACCESS[roleLevel] || ['view']
  const hasAllAccess = levelPermissions.includes('all')

  return {
    canAccess: true,
    canView: true,
    canCreate: hasAllAccess || levelPermissions.includes('create'),
    canEdit: hasAllAccess || levelPermissions.includes('edit'),
    canDelete: roleLevel >= 4, // Only level 4 and above can delete
    canApprove: roleLevel >= 4, // Only level 4 and above can approve
  }
}

/**
 * Filter modules based on user permissions
 */
export function getAccessibleModules(
  userRole: string,
  userDepartment: string,
  roleLevel: number
): ModuleConfig[] {
  return MODULE_CONFIG.filter(module => 
    canAccessModule(module.id, userRole, userDepartment, roleLevel)
  )
}

/**
 * Check if user can perform a specific action
 */
export function canPerformAction(
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve',
  moduleId: string,
  userRole: string,
  userDepartment: string,
  roleLevel: number
): boolean {
  const permissions = getModulePermissions(moduleId, userRole, userDepartment, roleLevel)
  
  switch (action) {
    case 'view':
      return permissions.canView
    case 'create':
      return permissions.canCreate
    case 'edit':
      return permissions.canEdit
    case 'delete':
      return permissions.canDelete
    case 'approve':
      return permissions.canApprove
    default:
      return false
  }
}

/**
 * Get user permission context from role details
 */
export function getUserPermissionContext(userDetails: any) {
  if (!userDetails || !userDetails.role) {
    return {
      role: '',
      department: '',
      level: 1,
    }
  }

  return {
    role: userDetails.role.code || '',
    department: userDetails.role.department || '',
    level: userDetails.role.level || 1,
  }
}

/**
 * Export constants for external use
 */
export const PERMISSION_CONSTANTS = {
  DEPARTMENT_MODULE_ACCESS,
  ROLE_LEVEL_ACCESS,
  UNIVERSAL_ACCESS_ROLES,
  ADMIN_MODULE_ROLES,
  APPLICANT_ROLE,
  APPLICANT_ACCESSIBLE_MODULES,
}
