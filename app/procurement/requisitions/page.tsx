import { ProcurementLayout } from "@/components/layout/procurement-layout"
import { PurchaseRequisitions } from "@/components/procurement/purchase-requisitions"

export default function PurchaseRequisitionsPage() {
  return (
    <ProcurementLayout>
      <div className="p-6">
        <PurchaseRequisitions />
      </div>
    </ProcurementLayout>
  )
}
