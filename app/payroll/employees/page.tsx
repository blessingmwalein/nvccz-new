import { MainLayout } from "@/components/layout/main-layout"
import { EmployeesTable } from "@/components/payroll/EmployeesTable"

export default function PayrollEmployeesPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <EmployeesTable />
      </div>
    </MainLayout>
  )
}


