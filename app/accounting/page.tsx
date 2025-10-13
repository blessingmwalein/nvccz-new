import { AccountingLayout } from "@/components/layout/accounting-layout"
import { AccountingDashboard } from "@/components/accounting/accounting-dashboard"

export default function AccountingPage() {
  return (
    <AccountingLayout>
      <div className="p-6">
        <AccountingDashboard />
      </div>
    </AccountingLayout>
  )
}