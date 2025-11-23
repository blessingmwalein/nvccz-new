import { PortfolioLayout } from "@/components/layout/portfolio-layout"
import { RiskAssessment } from "@/components/portfolio/risk-assessment"
import { ModuleGuard } from "@/components/permissions/PermissionGuards"

export default function RiskAssessmentPage() {
  return (
    <ModuleGuard moduleId="portfolio-management" subModuleId="Dashboard">
      <PortfolioLayout>
        <RiskAssessment />
      </PortfolioLayout>
    </ModuleGuard>
  )
}
