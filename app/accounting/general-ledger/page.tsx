import { AccountingLayout } from "@/components/layout/accounting-layout"
import { GeneralLedger } from "@/components/accounting/general-ledger"

export default function GeneralLedgerPage() {
  return (
    <AccountingLayout>
      <div className="p-6">
        <GeneralLedger />
      </div>
    </AccountingLayout>
  )
}