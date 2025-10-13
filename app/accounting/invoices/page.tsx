import { AccountingLayout } from "@/components/layout/accounting-layout"
import { InvoicesManagement } from "@/components/accounting/invoices-management"

export default function InvoicesPage() {
  return (
    <AccountingLayout>
      <div className="p-6">
        <InvoicesManagement />
      </div>
    </AccountingLayout>
  )
}