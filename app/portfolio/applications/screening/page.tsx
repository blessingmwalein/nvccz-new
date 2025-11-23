import { PortfolioLayout } from "@/components/layout/portfolio-layout"
import { InitialScreening } from "@/components/applications/initial-screening"
import { ModuleGuard } from "@/components/permissions/PermissionGuards"

export default function ScreeningPage() {
  return (
    <ModuleGuard moduleId="portfolio-management" subModuleId="applications-all">
      <PortfolioLayout>
        <InitialScreening />
      </PortfolioLayout>
    </ModuleGuard>
  )
}
