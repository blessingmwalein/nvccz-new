import { MainLayout } from "@/components/layout/main-layout"
import { TimeTable } from "@/components/payroll/TimeTable"

export default function PayrollTimePage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <TimeTable />
      </div>
    </MainLayout>
  )
}


