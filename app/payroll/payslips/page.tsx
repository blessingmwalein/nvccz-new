import { MainLayout } from "@/components/layout/main-layout"
import { PayslipsTable } from "@/components/payroll/PayslipsTable"

export default function PayrollPayslipsPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <PayslipsTable />
      </div>
    </MainLayout>
  )
}


