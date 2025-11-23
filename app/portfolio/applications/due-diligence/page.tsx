import { PortfolioLayout } from "@/components/layout/portfolio-layout"
import { DueDiligence } from "@/components/applications/due-diligence"
import { ModuleGuard } from "@/components/permissions/PermissionGuards"

export default function DueDiligencePage() {
  return (
    <ModuleGuard moduleId="portfolio-management" subModuleId="applications-all">
      <PortfolioLayout>
        <DueDiligence />
      </PortfolioLayout>
    </ModuleGuard>
  )
}
