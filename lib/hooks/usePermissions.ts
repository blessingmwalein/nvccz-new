import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import { 
  canAccessModule, 
  getModulePermissions, 
  getAccessibleModules,
  canPerformAction,
  getUserPermissionContext,
  PermissionCheck 
} from '@/lib/utils/permissions'
import { useMemo } from 'react'

/**
 * Main permissions hook - provides comprehensive permission checking
 */
export function usePermissions() {
  const { userDetails, isAuthenticated, isFetchingDetails } = useSelector((state: RootState) => state.auth)

  // Get permission context
  const permissionContext = useMemo(() => {
    return getUserPermissionContext(userDetails)
  }, [userDetails])

  const { role: userRole, department: userDepartment, level: roleLevel } = permissionContext

  // Get accessible modules
  const accessibleModules = useMemo(() => {
    if (!userRole) return []
    return getAccessibleModules(userRole, userDepartment, roleLevel)
  }, [userRole, userDepartment, roleLevel])

  /**
   * Check if user can access a module
   */
  const checkModuleAccess = (moduleId: string): boolean => {
    if (!userRole || !isAuthenticated) return false
    return canAccessModule(moduleId, userRole, userDepartment, roleLevel)
  }

  /**
   * Get detailed permissions for a module
   */
  const getPermissions = (moduleId: string): PermissionCheck => {
    if (!userRole || !isAuthenticated) {
      return {
        canAccess: false,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canApprove: false,
      }
    }
    return getModulePermissions(moduleId, userRole, userDepartment, roleLevel)
  }

  /**
   * Check if user can perform specific action
   */
  const checkAction = (
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve',
    moduleId: string
  ): boolean => {
    if (!userRole || !isAuthenticated) return false
    return canPerformAction(action, moduleId, userRole, userDepartment, roleLevel)
  }

  /**
   * Check if user has universal access
   */
  const hasUniversalAccess = useMemo(() => {
    const universalRoles = ['CEO', 'CIO', 'IT_MGR', 'SYSADMIN']
    return universalRoles.includes(userRole)
  }, [userRole])

  /**
   * Check if user is admin
   */
  const isAdmin = useMemo(() => {
    const adminRoles = ['CEO', 'HR_MGR', 'IT_MGR', 'SYSADMIN']
    return adminRoles.includes(userRole)
  }, [userRole])

  /**
   * Check if user is manager level (level 4+)
   */
  const isManager = useMemo(() => {
    return roleLevel >= 4
  }, [roleLevel])

  /**
   * Check if user can approve (level 4+)
   */
  const canApprove = useMemo(() => {
    return roleLevel >= 4
  }, [roleLevel])

  /**
   * Check if user is applicant (view-only access to application portal)
   */
  const isApplicant = useMemo(() => {
    return userRole === 'APPLICANT' || userRole.toLowerCase() === 'applicant'
  }, [userRole])

  return {
    // User context
    userRole,
    userDepartment,
    roleLevel,
    userDetails,
    isAuthenticated,
    
    // Permission checks
    accessibleModules,
    checkModuleAccess,
    getPermissions,
    checkAction,
    
    // Role checks
    hasUniversalAccess,
    isAdmin,
    isManager,
    canApprove,
    isApplicant,
    
    // Loading state
    isLoading: isFetchingDetails || !isAuthenticated,
  }
}

/**
 * Hook to check permissions for a specific module
 * @param moduleId - The module ID to check permissions for
 */
export function useModulePermissions(moduleId: string) {
  const { getPermissions, checkModuleAccess, isLoading, isAuthenticated } = usePermissions()

  const permissions = useMemo(() => {
    if (!isAuthenticated) {
      return {
        canAccess: false,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canApprove: false,
      }
    }
    return getPermissions(moduleId)
  }, [moduleId, getPermissions, isAuthenticated])

  const hasAccess = useMemo(() => {
    return checkModuleAccess(moduleId)
  }, [moduleId, checkModuleAccess])

  return {
    ...permissions,
    hasAccess,
    isLoading,
  }
}

/**
 * Hook to check if user can perform a specific action
 * @param action - The action to check (view, create, edit, delete, approve)
 * @param moduleId - The module ID to check the action for
 */
export function useCanPerformAction(
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve',
  moduleId: string
) {
  const { checkAction, isLoading } = usePermissions()

  const canPerform = useMemo(() => {
    return checkAction(action, moduleId)
  }, [action, moduleId, checkAction])

  return {
    canPerform,
    isLoading,
  }
}

/**
 * Hook to get only accessible modules
 */
export function useAccessibleModules() {
  const { accessibleModules, isLoading } = usePermissions()

  return {
    modules: accessibleModules,
    isLoading,
    hasModules: accessibleModules.length > 0,
  }
}

/**
 * Hook to check multiple permissions at once
 * @param checks - Array of permission checks to perform
 */
export function useBulkPermissions(
  checks: Array<{ moduleId: string; action?: 'view' | 'create' | 'edit' | 'delete' | 'approve' }>
) {
  const { checkModuleAccess, checkAction, isLoading } = usePermissions()

  const results = useMemo(() => {
    return checks.map(check => ({
      moduleId: check.moduleId,
      hasAccess: checkModuleAccess(check.moduleId),
      canPerformAction: check.action ? checkAction(check.action, check.moduleId) : undefined,
    }))
  }, [checks, checkModuleAccess, checkAction])

  return {
    results,
    isLoading,
  }
}
