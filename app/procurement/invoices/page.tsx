import { ProcurementLayout } from "@/components/layout/procurement-layout"
import { ProcurementInvoices } from "@/components/procurement/procurement-invoices"

export default function InvoicesPage() {
  return (
    <ProcurementLayout>
      <div className="p-6">
        <ProcurementInvoices />
      </div>
    </ProcurementLayout>
  )
}
