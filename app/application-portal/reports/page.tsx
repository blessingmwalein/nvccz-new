"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchReports } from "@/lib/store/slices/applicationPortalSlice"
import { ApplicationPortalLayout } from "@/components/layout/application-portal-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { FinancialStatementsView } from "@/components/portfolio/financial-statements-view"

export default function ReportsPage() {
  const dispatch = useAppDispatch()
  const { reports, reportsLoading } = useAppSelector((state) => state.applicationPortal)

  useEffect(() => {
    dispatch(fetchReports())
  }, [dispatch])

  if (reportsLoading) {
    return (
      <ApplicationPortalLayout>
        <DashboardSkeleton />
      </ApplicationPortalLayout>
    )
  }

  return (
    <ApplicationPortalLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Reports
            </h1>
            <p className="text-muted-foreground">Manage and submit your financial statements and reports</p>
          </div>
        </div>

        {/* Financial Statements View */}
        <FinancialStatementsView />
      </div>
    </ApplicationPortalLayout>
  )
}
