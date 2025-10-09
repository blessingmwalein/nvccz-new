import { ProcurementLayout } from "@/components/layout/procurement-layout"
import { ApprovalConfigurations } from "@/components/procurement/approval-configurations"

export default function ApprovalConfigsPage() {
  return (
    <ProcurementLayout>
      <div className="p-6">
        <ApprovalConfigurations />
      </div>
    </ProcurementLayout>
  )
}
