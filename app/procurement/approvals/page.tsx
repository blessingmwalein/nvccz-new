import { ProcurementLayout } from "@/components/layout/procurement-layout"
import { MyApprovals } from "@/components/procurement/my-approvals"

export default function ApprovalsPage() {
  return (
    <ProcurementLayout>
      <div className="p-6">
        <MyApprovals />
      </div>
    </ProcurementLayout>
  )
}
