import { MainLayout } from "@/components/layout/main-layout"
import { PayrollDashboard } from "@/components/payroll/PayrollDashboard"
import { EmployeesTable } from "@/components/payroll/EmployeesTable"
import { PayRunsTable } from "@/components/payroll/PayRunsTable"
import { PayslipsTable } from "@/components/payroll/PayslipsTable"
import { PaymentsTable } from "@/components/payroll/PaymentsTable"

export default function PayrollPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <PayrollDashboard />
        <div className="mt-6 grid grid-cols-1 gap-6">
          <EmployeesTable />
          <PayRunsTable />
          <PayslipsTable />
          <PaymentsTable />
        </div>
      </div>
    </MainLayout>
  )
}


