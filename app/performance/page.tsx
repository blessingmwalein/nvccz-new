import { MainLayout } from "@/components/layout/main-layout"
import { PerformanceDashboard } from "@/components/performance/performance-dashboard"

export default function PerformancePage() {
  return (
    <MainLayout>
      <div className="p-6">
        <PerformanceDashboard />
      </div>
    </MainLayout>
  )
}
