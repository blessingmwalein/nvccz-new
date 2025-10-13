import { AccountingLayout } from "@/components/layout/accounting-layout"
import { ExpensesManagement } from "@/components/accounting/expenses-management"

export default function ExpensesPage() {
  return (
    <AccountingLayout>
      <div className="p-6">
        <ExpensesManagement />
      </div>
    </AccountingLayout>
  )
}