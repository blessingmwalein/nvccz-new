import { MainLayout } from "@/components/layout/main-layout"
import { GoalsManagement } from "@/components/performance/goals-management"

export default function GoalsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <GoalsManagement />
      </div>
    </MainLayout>
  )
}
