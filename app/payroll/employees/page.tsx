import { PayrollLayout } from "@/components/layout/payroll-layout"
import { EmployeesTable } from "@/components/payroll/employees-table"

export default function EmployeesPage() {
  return (
    <PayrollLayout>
      <div className="container mx-auto py-6 px-6">
        <EmployeesTable />
      </div>
    </PayrollLayout>
  )
}