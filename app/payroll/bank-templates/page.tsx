import { PayrollLayout } from "@/components/layout/payroll-layout"
import { BankTemplatesTable } from "@/components/payroll/bank-templates-table"

export default function BankTemplatesPage() {
  return (
    <PayrollLayout>
      <div className="px-6 py-6">
        <BankTemplatesTable />
      </div>
    </PayrollLayout>
  )
}