import { PayrollLayout } from "@/components/layout/payroll-layout"
import { DeductionTypesTable } from "@/components/payroll/deduction-types-table"

export default function DeductionTypesPage() {
  return (
    <PayrollLayout>
      <div className="px-6 py-6">
        <DeductionTypesTable />
      </div>
    </PayrollLayout>
  )
}