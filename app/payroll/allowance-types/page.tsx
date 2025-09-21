import { PayrollLayout } from "@/components/layout/payroll-layout"
import { AllowanceTypesTable } from "@/components/payroll/allowance-types-table"

export default function AllowanceTypesPage() {
  return (
    <PayrollLayout>
      <div className="px-6 py-6">
        <AllowanceTypesTable />
      </div>
    </PayrollLayout>
  )
}