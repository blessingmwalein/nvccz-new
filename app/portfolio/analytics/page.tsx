import { PortfolioLayout } from "@/components/layout/portfolio-layout"
import { PerformanceAnalytics } from "@/components/portfolio/performance-analytics"
import { ModuleGuard } from "@/components/permissions/PermissionGuards"

export default function PortfolioAnalyticsPage() {
  return (
    <ModuleGuard moduleId="portfolio-management" subModuleId="Dashboard">
      <PortfolioLayout>
        <PerformanceAnalytics />
      </PortfolioLayout>
    </ModuleGuard>
  )
}
