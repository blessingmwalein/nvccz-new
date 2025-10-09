import { ProcurementLayout } from "@/components/layout/procurement-layout"
import { ProcurementDashboard } from "@/components/procurement/procurement-dashboard"

export default function ProcurementPage() {
  return (
    <ProcurementLayout>
      <div className="p-6">
        <ProcurementDashboard />
      </div>
    </ProcurementLayout>
  )
}
