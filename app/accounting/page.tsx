"use client"

import { AccountingLayout } from "@/components/layout/accounting-layout"
import { AccountingDashboard } from "@/components/accounting/accounting-dashboard"
import { ModuleGuard } from "@/components/permissions/PermissionGuards"

export default function AccountingPage() {
  return (
    <ModuleGuard moduleId="accounting" subModuleId="accounting-dashboard">
      <AccountingLayout>
        <div className="p-6">
          <AccountingDashboard />
        </div>
      </AccountingLayout>
    </ModuleGuard>
  )
}