import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminLayout } from "@/components/layout/admin-layout"

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <AdminDashboard  />
      </div>
    </AdminLayout>
  )
}
