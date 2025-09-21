import { PerformanceLayout } from "@/components/layout/performance-layout"
import { TasksManagement } from "@/components/performance/tasks-management"

export default function TasksPage() {
  return (
    <PerformanceLayout>
      <div className="p-6">
        <TasksManagement />
      </div>
    </PerformanceLayout>
  )
}
