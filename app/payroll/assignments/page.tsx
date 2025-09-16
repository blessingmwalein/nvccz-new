import { MainLayout } from "@/components/layout/main-layout"
import { AssignmentsTable } from "@/components/payroll/AssignmentsTable"

export default function PayrollAssignmentsPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <AssignmentsTable />
      </div>
    </MainLayout>
  )
}


