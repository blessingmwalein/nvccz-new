import { MainLayout } from "@/components/layout/main-layout"
import { SchedulesTable } from "@/components/payroll/SchedulesTable"

export default function PayrollSchedulesPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <SchedulesTable />
      </div>
    </MainLayout>
  )
}


