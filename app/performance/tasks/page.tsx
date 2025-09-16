import { MainLayout } from "@/components/layout/main-layout"
import { TasksManagement } from "@/components/performance/tasks-management"

export default function TasksPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <TasksManagement />
      </div>
    </MainLayout>
  )
}
