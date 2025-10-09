import { ProcurementLayout } from "@/components/layout/procurement-layout"
import { PurchaseOrders } from "@/components/procurement/purchase-orders"

export default function PurchaseOrdersPage() {
  return (
    <ProcurementLayout>
      <div className="p-6">
        <PurchaseOrders />
      </div>
    </ProcurementLayout>
  )
}
