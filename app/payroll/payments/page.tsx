import { MainLayout } from "@/components/layout/main-layout"
import { PaymentsTable } from "@/components/payroll/PaymentsTable"

export default function PayrollPaymentsPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <PaymentsTable />
      </div>
    </MainLayout>
  )
}


