import { PerformanceLayout } from "@/components/layout/performance-layout"
import { UserScorecards } from "@/components/performance/user-scorecards"

export default function UserScorecardsPage() {
  return (
    <PerformanceLayout>
      <div className="p-6">
        <UserScorecards />
      </div>
    </PerformanceLayout>
  )
}