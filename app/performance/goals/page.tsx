import { PerformanceLayout } from "@/components/layout/performance-layout"
import { GoalsManagement } from "@/components/performance/goals-management"

export default function GoalsPage() {
  return (
    <PerformanceLayout>
      <div className="p-6">
        <GoalsManagement />
      </div>
    </PerformanceLayout>
  )
}
