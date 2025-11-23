/**
 * Permissions System - Index
 * 
 * Centralized exports for the permissions system
 */

// Configuration
export {
  type RoleCode,
  type ModulePermission,
  type RolePermissions,
  ROLE_PERMISSIONS_MAP,
  getRolePermissions,
  hasModuleAccess,
  getModuleAccessLevel,
  hasSubModuleAccess,
  getAccessibleModules,
  canPerformAction,
} from './config/role-permissions';

// Hooks
export {
  useRolePermissions,
  useHasPermission,
  useCanPerformAction,
  type UseRolePermissionsReturn,
} from './hooks/useRolePermissions';

// Components
export {
  ModuleGuard,
  ActionGuard,
  RoleGuard,
  DepartmentGuard,
  LevelGuard,
  PermissionGuard,
} from '../components/permissions/PermissionGuards';
