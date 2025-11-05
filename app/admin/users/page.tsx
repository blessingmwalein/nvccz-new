"use client"

import { UsersTable } from "@/components/admin/users-table"
import { AdminLayout } from "@/components/layout/admin-layout"

export default function UsersPage() {
    return (
        <AdminLayout>
            <div className="mx-auto py-6 px-6">
                <UsersTable />
            </div>
        </AdminLayout>
    )
}
