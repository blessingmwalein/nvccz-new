import { MainLayout } from "@/components/layout/main-layout"
import { KPIManagement } from "@/components/performance/kpi-management"

export default function KPIsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <KPIManagement />
      </div>
    </MainLayout>
  )
}
