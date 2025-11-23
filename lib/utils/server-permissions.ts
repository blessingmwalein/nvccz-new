/**
 * Server-Side Permission Utilities
 * 
 * These utilities are for checking permissions in API routes, server components,
 * and server actions. They don't rely on React hooks or client-side state.
 */

import { 
  RoleCode, 
  getRolePermissions, 
  hasModuleAccess, 
  hasSubModuleAccess,
  getModuleAccessLevel,
  canPerformAction as checkActionPermission
} from '@/lib/config/role-permissions';

/**
 * Server-side permission checker
 * Use this in API routes and server components
 */
export class PermissionChecker {
  private roleCode: RoleCode | null;

  constructor(roleCode: RoleCode | null) {
    this.roleCode = roleCode;
  }

  /**
   * Check if user has access to a module
   */
  canAccessModule(moduleId: string): boolean {
    if (!this.roleCode) return false;
    return hasModuleAccess(this.roleCode, moduleId);
  }

  /**
   * Check if user has access to a sub-module
   */
  canAccessSubModule(moduleId: string, subModuleId: string): boolean {
    if (!this.roleCode) return false;
    return hasSubModuleAccess(this.roleCode, moduleId, subModuleId);
  }

  /**
   * Get access level for a module
   */
  getAccessLevel(moduleId: string): 'full' | 'read' | 'write' | 'none' {
    if (!this.roleCode) return 'none';
    return getModuleAccessLevel(this.roleCode, moduleId);
  }

  /**
   * Check if user can perform specific action
   */
  canPerformAction(
    moduleId: string, 
    action: 'create' | 'read' | 'update' | 'delete'
  ): boolean {
    if (!this.roleCode) return false;
    const accessLevel = this.getAccessLevel(moduleId);
    return checkActionPermission(accessLevel, action);
  }

  /**
   * Get full role permissions
   */
  getPermissions() {
    if (!this.roleCode) return null;
    return getRolePermissions(this.roleCode);
  }

  /**
   * Check if user has minimum level
   */
  hasMinimumLevel(minLevel: number): boolean {
    const permissions = this.getPermissions();
    if (!permissions) return false;
    return permissions.level >= minLevel;
  }

  /**
   * Check if user is in specific department
   */
  isInDepartment(department: string): boolean {
    const permissions = this.getPermissions();
    if (!permissions) return false;
    return permissions.department === department;
  }

  /**
   * Check if user has specific role
   */
  hasRole(roles: RoleCode[]): boolean {
    if (!this.roleCode) return false;
    return roles.includes(this.roleCode);
  }

  /**
   * Throw error if user doesn't have permission
   * Useful for API routes
   */
  requireModuleAccess(moduleId: string, message?: string): void {
    if (!this.canAccessModule(moduleId)) {
      throw new PermissionError(
        message || `Access denied to module: ${moduleId}`
      );
    }
  }

  /**
   * Throw error if user can't perform action
   */
  requireAction(
    moduleId: string, 
    action: 'create' | 'read' | 'update' | 'delete',
    message?: string
  ): void {
    if (!this.canPerformAction(moduleId, action)) {
      throw new PermissionError(
        message || `Cannot perform ${action} on module: ${moduleId}`
      );
    }
  }

  /**
   * Throw error if user doesn't have minimum level
   */
  requireLevel(minLevel: number, message?: string): void {
    if (!this.hasMinimumLevel(minLevel)) {
      throw new PermissionError(
        message || `Requires minimum level: ${minLevel}`
      );
    }
  }
}

/**
 * Custom error class for permission errors
 */
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

/**
 * Factory function to create permission checker from user data
 */
export function createPermissionChecker(userDetails: {
  roleCode?: string;
} | null): PermissionChecker {
  const roleCode = userDetails?.roleCode as RoleCode || null;
  return new PermissionChecker(roleCode);
}

/**
 * Middleware-style permission check for API routes
 * 
 * @example
 * export async function GET(request: Request) {
 *   const userDetails = await getUserFromSession();
 *   const permitted = await checkPermission(userDetails, {
 *     moduleId: 'accounting',
 *     action: 'read'
 *   });
 *   
 *   if (!permitted.allowed) {
 *     return new Response(permitted.error, { status: 403 });
 *   }
 *   
 *   // Proceed with request
 * }
 */
export async function checkPermission(
  userDetails: { roleCode?: string } | null,
  options: {
    moduleId?: string;
    subModuleId?: string;
    action?: 'create' | 'read' | 'update' | 'delete';
    requiredRoles?: RoleCode[];
    minLevel?: number;
    requiredDepartment?: string;
  }
): Promise<{
  allowed: boolean;
  error?: string;
  checker: PermissionChecker;
}> {
  const checker = createPermissionChecker(userDetails);

  // Check module access
  if (options.moduleId) {
    if (options.subModuleId) {
      if (!checker.canAccessSubModule(options.moduleId, options.subModuleId)) {
        return {
          allowed: false,
          error: `Access denied to ${options.moduleId}/${options.subModuleId}`,
          checker,
        };
      }
    } else if (!checker.canAccessModule(options.moduleId)) {
      return {
        allowed: false,
        error: `Access denied to module: ${options.moduleId}`,
        checker,
      };
    }
  }

  // Check action
  if (options.action && options.moduleId) {
    if (!checker.canPerformAction(options.moduleId, options.action)) {
      return {
        allowed: false,
        error: `Cannot perform ${options.action} on ${options.moduleId}`,
        checker,
      };
    }
  }

  // Check role
  if (options.requiredRoles && options.requiredRoles.length > 0) {
    if (!checker.hasRole(options.requiredRoles)) {
      return {
        allowed: false,
        error: `Requires one of roles: ${options.requiredRoles.join(', ')}`,
        checker,
      };
    }
  }

  // Check level
  if (options.minLevel !== undefined) {
    if (!checker.hasMinimumLevel(options.minLevel)) {
      return {
        allowed: false,
        error: `Requires minimum level: ${options.minLevel}`,
        checker,
      };
    }
  }

  // Check department
  if (options.requiredDepartment) {
    if (!checker.isInDepartment(options.requiredDepartment)) {
      return {
        allowed: false,
        error: `Requires department: ${options.requiredDepartment}`,
        checker,
      };
    }
  }

  return { allowed: true, checker };
}

/**
 * HOC for API routes that require permissions
 * 
 * @example
 * export const GET = withPermission(
 *   async (request, context) => {
 *     // Your handler code
 *     return Response.json({ data: 'protected data' });
 *   },
 *   {
 *     moduleId: 'accounting',
 *     action: 'read'
 *   }
 * );
 */
export function withPermission<T extends any[], R>(
  handler: (...args: T) => Promise<Response> | Response,
  permissionOptions: {
    moduleId?: string;
    subModuleId?: string;
    action?: 'create' | 'read' | 'update' | 'delete';
    requiredRoles?: RoleCode[];
    minLevel?: number;
    getUserDetails: (...args: T) => Promise<{ roleCode?: string } | null> | { roleCode?: string } | null;
  }
) {
  return async (...args: T): Promise<Response> => {
    try {
      // Get user details from request
      const userDetails = await permissionOptions.getUserDetails(...args);

      // Check permissions
      const permission = await checkPermission(userDetails, permissionOptions);

      if (!permission.allowed) {
        return new Response(
          JSON.stringify({
            error: permission.error || 'Access denied',
            code: 'PERMISSION_DENIED',
          }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Call the actual handler
      return await handler(...args);
    } catch (error) {
      if (error instanceof PermissionError) {
        return new Response(
          JSON.stringify({
            error: error.message,
            code: 'PERMISSION_ERROR',
          }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      throw error;
    }
  };
}

/**
 * Helper to extract role code from various user objects
 */
export function extractRoleCode(user: any): RoleCode | null {
  if (!user) return null;
  
  // Try different possible properties
  if (user.roleCode) return user.roleCode as RoleCode;
  if (user.role?.code) return user.role.code as RoleCode;
  if (user.role_code) return user.role_code as RoleCode;
  
  return null;
}

/**
 * Batch permission check for multiple modules
 * Useful for dashboard data fetching
 */
export function checkMultiplePermissions(
  userDetails: { roleCode?: string } | null,
  checks: Array<{
    id: string;
    moduleId: string;
    subModuleId?: string;
    action?: 'create' | 'read' | 'update' | 'delete';
  }>
): Record<string, boolean> {
  const checker = createPermissionChecker(userDetails);
  const results: Record<string, boolean> = {};

  for (const check of checks) {
    let allowed = false;

    if (check.subModuleId) {
      allowed = checker.canAccessSubModule(check.moduleId, check.subModuleId);
    } else {
      allowed = checker.canAccessModule(check.moduleId);
    }

    if (allowed && check.action) {
      allowed = checker.canPerformAction(check.moduleId, check.action);
    }

    results[check.id] = allowed;
  }

  return results;
}
