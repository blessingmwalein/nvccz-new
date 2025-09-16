import { MainLayout } from "@/components/layout/main-layout"
import { GroupsTable } from "@/components/payroll/GroupsTable"

export default function PayrollGroupsPage() {
  return (
    <MainLayout>
      <div className="px-6 py-6">
        <GroupsTable />
      </div>
    </MainLayout>
  )
}


