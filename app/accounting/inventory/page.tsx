import { AccountingLayout } from "@/components/layout/accounting-layout"
import { InventoryManagement } from "@/components/accounting/inventory-management"

export default function InventoryPage() {
  return (
    <AccountingLayout>
      <div className="p-6">
        <InventoryManagement />
      </div>
    </AccountingLayout>
  )
}
