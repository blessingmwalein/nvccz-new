import { PayrollLayout } from "@/components/layout/payroll-layout"
import { PayrollDashboard } from "@/components/payroll/PayrollDashboard"

export default function PayrollPage() {
  return (
    <PayrollLayout>
      <div className="px-6 py-6">
        <PayrollDashboard />
      </div>
    </PayrollLayout>
  )
}


