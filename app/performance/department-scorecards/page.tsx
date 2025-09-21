import { PerformanceLayout } from "@/components/layout/performance-layout"
import { DepartmentScorecards } from "@/components/performance/department-scorecards"

export default function DepartmentScorecardsPage() {
  return (
    <PerformanceLayout>
      <div className="p-6">
        <DepartmentScorecards />
      </div>
    </PerformanceLayout>
  )
}