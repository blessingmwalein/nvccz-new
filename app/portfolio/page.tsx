import { PortfolioLayout } from "@/components/layout/portfolio-layout"
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview"
import { ModuleGuard } from "@/components/permissions/PermissionGuards"

export default function PortfolioPage() {
  return (
    <ModuleGuard moduleId="portfolio-management" subModuleId="Dashboard">
      <PortfolioLayout>
        <PortfolioOverview />
      </PortfolioLayout>
    </ModuleGuard>
  )
}
