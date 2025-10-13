import { AccountingLayout } from "@/components/layout/accounting-layout"
import { AccountingSettings } from "@/components/accounting/accounting-settings"

export default function AccountingSettingsPage() {
  return (
    <AccountingLayout>
      <div className="p-6">
        <AccountingSettings />
      </div>
    </AccountingLayout>
  )
}