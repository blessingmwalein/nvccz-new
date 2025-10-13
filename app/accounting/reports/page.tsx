import { AccountingLayout } from "@/components/layout/accounting-layout"
import { FinancialReports } from "@/components/accounting/financial-reports"

export default function ReportsPage() {
    return (
        <AccountingLayout>
            <div className="p-6">
                <FinancialReports />

            </div>
        </AccountingLayout>
    )
}
