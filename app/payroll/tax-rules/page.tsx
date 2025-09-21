import { PayrollLayout } from "@/components/layout/payroll-layout"
import { TaxRulesTable } from "@/components/payroll/tax-rules-table"

export default function TaxRulesPage() {
  return (
    <PayrollLayout>
      <div className="px-6 py-6">
        {/* <div className="mb-6">
          <h1 className="text-2xl font-normal">Tax Rules</h1>
          <p className="text-gray-500 text-sm">Manage PAYE, NSSA, and AIDS Levy tax rules</p>
        </div> */}
        <TaxRulesTable />
      </div>
    </PayrollLayout>
  )
}
