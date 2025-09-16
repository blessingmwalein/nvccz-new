import { MainLayout } from "@/components/layout/main-layout"
import { PayRunsTable } from "@/components/payroll/PayRunsTable"

export default function PayrollRunsPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <PayRunsTable />
      </div>
    </MainLayout>
  )
}


