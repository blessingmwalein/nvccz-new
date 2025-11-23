/**
 * Example component demonstrating the permissions system
 * 
 * This shows various ways to use role-based permissions
 */

'use client';

import { useRolePermissions } from '@/lib/hooks/useRolePermissions';
import { 
  ModuleGuard, 
  ActionGuard, 
  RoleGuard, 
  LevelGuard,
  PermissionGuard 
} from '@/components/permissions/PermissionGuards';

export function PermissionsExample() {
  const {
    roleCode,
    level,
    department,
    hasModuleAccess,
    hasSubModuleAccess,
    canPerformAction,
    accessibleModules,
    isLoading,
  } = useRolePermissions();

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Permissions</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-2">
          <p><strong>Role:</strong> {roleCode}</p>
          <p><strong>Level:</strong> {level}</p>
          <p><strong>Department:</strong> {department}</p>
          <p><strong>Accessible Modules:</strong> {accessibleModules.length}</p>
        </div>
      </section>

      {/* Example 1: Using hooks for conditional logic */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Example 1: Hook-Based Checks</h3>
        <div className="space-y-2">
          {hasModuleAccess('accounting') && (
            <div className="bg-green-100 p-3 rounded">
              ✅ You have access to Accounting module
            </div>
          )}
          
          {hasSubModuleAccess('accounting', 'invoices') && (
            <div className="bg-green-100 p-3 rounded">
              ✅ You can access Invoices
            </div>
          )}
          
          {canPerformAction('accounting', 'create') ? (
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Create New Invoice
            </button>
          ) : (
            <button className="bg-gray-300 px-4 py-2 rounded cursor-not-allowed" disabled>
              Create New Invoice (No Permission)
            </button>
          )}
        </div>
      </section>

      {/* Example 2: Using ModuleGuard */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Example 2: Module Guard</h3>
        <ModuleGuard 
          moduleId="accounting" 
          fallback={<div className="text-red-500">❌ No access to accounting</div>}
        >
          <div className="bg-green-100 p-3 rounded">
            ✅ Accounting content visible because you have access
          </div>
        </ModuleGuard>
      </section>

      {/* Example 3: Using ActionGuard */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Example 3: Action Guard</h3>
        <div className="space-x-2">
          <ActionGuard moduleId="accounting" action="read">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              View Reports
            </button>
          </ActionGuard>
          
          <ActionGuard 
            moduleId="accounting" 
            action="create"
            fallback={
              <button className="bg-gray-300 px-4 py-2 rounded cursor-not-allowed" disabled>
                Create (No Permission)
              </button>
            }
          >
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Create New
            </button>
          </ActionGuard>
          
          <ActionGuard 
            moduleId="accounting" 
            action="delete"
            fallback={
              <button className="bg-gray-300 px-4 py-2 rounded cursor-not-allowed" disabled>
                Delete (No Permission)
              </button>
            }
          >
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
          </ActionGuard>
        </div>
      </section>

      {/* Example 4: Using RoleGuard */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Example 4: Role Guard</h3>
        <RoleGuard 
          allowedRoles={['CFO', 'FIN_MGR', 'CEO']}
          fallback={<div className="text-gray-500">Manager-only content hidden</div>}
        >
          <div className="bg-purple-100 p-3 rounded">
            🔒 This content is only visible to CFO, Finance Manager, or CEO
          </div>
        </RoleGuard>
      </section>

      {/* Example 5: Using LevelGuard */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Example 5: Level Guard</h3>
        <LevelGuard 
          minLevel={4}
          fallback={<div className="text-gray-500">Senior management content hidden</div>}
        >
          <div className="bg-orange-100 p-3 rounded">
            👔 This is visible to Level 4+ (Senior Management)
          </div>
        </LevelGuard>
      </section>

      {/* Example 6: Compound PermissionGuard */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Example 6: Compound Permission Guard</h3>
        <PermissionGuard
          moduleId="accounting"
          minLevel={4}
          requireAction="delete"
          fallback={
            <div className="bg-red-100 p-3 rounded">
              ❌ You need Level 4+ and delete permission in Accounting
            </div>
          }
        >
          <div className="bg-green-100 p-3 rounded">
            ✅ You have senior accounting access with delete permission
            <button className="ml-4 bg-red-500 text-white px-4 py-2 rounded">
              Delete Financial Records
            </button>
          </div>
        </PermissionGuard>
      </section>

      {/* Example 7: Nested Guards */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Example 7: Nested Guards</h3>
        <ModuleGuard moduleId="accounting">
          <div className="border-2 border-blue-500 p-4 rounded">
            <h4 className="font-semibold mb-2">Accounting Module</h4>
            
            <ModuleGuard 
              moduleId="accounting" 
              subModuleId="invoices"
            >
              <div className="border-2 border-green-500 p-3 rounded mb-2">
                <h5 className="font-semibold">Invoices Section</h5>
                
                <ActionGuard moduleId="accounting" action="create">
                  <button className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm">
                    + Create Invoice
                  </button>
                </ActionGuard>
              </div>
            </ModuleGuard>
            
            <ModuleGuard 
              moduleId="accounting" 
              subModuleId="financial-reports"
            >
              <div className="border-2 border-yellow-500 p-3 rounded">
                <h5 className="font-semibold">Financial Reports</h5>
                <button className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                  View Reports
                </button>
              </div>
            </ModuleGuard>
          </div>
        </ModuleGuard>
      </section>

      {/* Example 8: Dynamic content based on access level */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Example 8: Dynamic Content</h3>
        <div className="space-y-2">
          {canPerformAction('accounting', 'read') && (
            <div className="flex items-center gap-2 bg-blue-100 p-2 rounded">
              <span>📖</span>
              <span>You can view accounting data</span>
            </div>
          )}
          
          {canPerformAction('accounting', 'create') && (
            <div className="flex items-center gap-2 bg-green-100 p-2 rounded">
              <span>✏️</span>
              <span>You can create accounting entries</span>
            </div>
          )}
          
          {canPerformAction('accounting', 'update') && (
            <div className="flex items-center gap-2 bg-yellow-100 p-2 rounded">
              <span>🔄</span>
              <span>You can update accounting records</span>
            </div>
          )}
          
          {canPerformAction('accounting', 'delete') && (
            <div className="flex items-center gap-2 bg-red-100 p-2 rounded">
              <span>🗑️</span>
              <span>You can delete accounting entries</span>
            </div>
          )}
        </div>
      </section>

      {/* Module Access Matrix */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Your Module Access Matrix</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['accounting', 'payroll', 'procurement', 'portfolio-management', 
            'performance-management', 'events-management', 'admin-management'].map((moduleId) => (
            <div 
              key={moduleId}
              className={`p-3 rounded ${
                hasModuleAccess(moduleId) 
                  ? 'bg-green-100 border-green-500' 
                  : 'bg-gray-100 border-gray-300'
              } border-2`}
            >
              <div className="font-semibold text-sm">
                {moduleId.replace(/-/g, ' ').toUpperCase()}
              </div>
              <div className="text-xs mt-1">
                {hasModuleAccess(moduleId) ? '✅ Accessible' : '❌ No Access'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
