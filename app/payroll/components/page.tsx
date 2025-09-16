import { MainLayout } from "@/components/layout/main-layout"
import { ComponentsTable } from "@/components/payroll/ComponentsTable"

export default function PayrollComponentsPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <ComponentsTable />
      </div>
    </MainLayout>
  )
}


