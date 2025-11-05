import { RolesView } from "@/components/admin/roles-view"
import { AdminLayout } from "@/components/layout/admin-layout"

export default function RolesPage() {
    return (
        <AdminLayout>

            <div className=" mx-auto py-6 px-6">
                <RolesView />
            </div>
        </AdminLayout>
    )
}
