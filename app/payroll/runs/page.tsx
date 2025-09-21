import { PayrollRunsTable } from "@/components/payroll/payroll-runs-table"
import { PayrollLayout } from "@/components/layout/payroll-layout"

export default function PayrollRunsPage() {
  return (
    <PayrollLayout>
       <div className="container mx-auto py-6 px-6">
       <PayrollRunsTable />
      </div>
      
    </PayrollLayout>
  )
}