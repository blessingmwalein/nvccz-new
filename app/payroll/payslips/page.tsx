import { PayrollLayout } from "@/components/layout/payroll-layout"
import { PayslipsTable } from "@/components/payroll/PayslipsTable"

export default function PayslipsPage() {
  return (
    <PayrollLayout>
      <div className="px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-normal">Payslips</h1>
          <p className="text-gray-500 text-sm">View and manage employee payslips</p>
        </div>
        <PayslipsTable />
      </div>
    </PayrollLayout>
  )
}