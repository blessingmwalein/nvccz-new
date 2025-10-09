import { ProcurementLayout } from "@/components/layout/procurement-layout"
import { GoodsReceivedNotes } from "@/components/procurement/goods-received-notes"

export default function GoodsReceivedPage() {
  return (
    <ProcurementLayout>
      <div className="p-6">
        <GoodsReceivedNotes />
      </div>
    </ProcurementLayout>
  )
}
