"use client"

import { PortfolioLayout } from "@/components/layout/portfolio-layout"
import { FundsList } from "@/components/portfolio/funds/funds-list"
import { ModuleGuard } from "@/components/permissions/PermissionGuards"

export default function FundsPage() {
  return (
    <ModuleGuard moduleId="portfolio-management" subModuleId="funds">
      <PortfolioLayout>
        <div className="container mx-auto py-6 px-6">
          <FundsList />
        </div>
      </PortfolioLayout>
    </ModuleGuard>
  )
}
