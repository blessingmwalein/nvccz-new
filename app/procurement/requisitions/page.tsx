import { ProcurementLayout } from "@/components/layout/procurement-layout"
import { PurchaseRequisitions } from "@/components/procurement/purchase-requisitions"

export default function PurchaseRequisitionsPage() {
  return (
    <ProcurementLayout>
      <div className="">
        <PurchaseRequisitions />
      </div>
    </ProcurementLayout>
  )
}
