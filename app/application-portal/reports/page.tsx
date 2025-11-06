"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchReports } from "@/lib/store/slices/applicationPortalSlice"
import { ApplicationPortalLayout } from "@/components/layout/application-portal-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CiText, CiFileOn, CiCalendar, CiDownload } from "react-icons/ci"
import { FileText, Download } from "lucide-react"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"

export default function ReportsPage() {
  const dispatch = useAppDispatch()
  const { reports, reportsLoading } = useAppSelector((state) => state.applicationPortal)

  useEffect(() => {
    dispatch(fetchReports())
  }, [dispatch])

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'quarterly':
        return 'bg-blue-100 text-blue-800'
      case 'annual':
        return 'bg-purple-100 text-purple-800'
      case 'monthly':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (reportsLoading) {
    return (
      <ApplicationPortalLayout>
        <DashboardSkeleton />
      </ApplicationPortalLayout>
    )
  }

  if (!reports) {
    return (
      <ApplicationPortalLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reports Available</h3>
              <p className="text-muted-foreground">Performance reports will appear here once generated.</p>
            </div>
          </div>
        </div>
      </ApplicationPortalLayout>
    )
  }

  return (
    <ApplicationPortalLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Performance Reports</h1>
            <p className="text-muted-foreground">Access your company performance reports and analytics</p>
          </div>
          <Badge variant="outline">
            {reports.reports.length} Total
          </Badge>
        </div>

        {/* Company Info */}
        {reports.portfolioCompany && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CiFileOn className="w-5 h-5" />
                {reports.portfolioCompany.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Industry: <span className="font-medium text-foreground">{reports.portfolioCompany.industry}</span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Reports List */}
        {reports.reports.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">📄</div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reports</h3>
                <p className="text-muted-foreground">
                  Reports will be generated and appear here periodically.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.reports.map((report) => (
              <Card key={report.id} className="card-shadow hover:card-shadow-hover transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <FileText size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {report.period}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getReportTypeColor(report.type)}>
                      {report.type}
                    </Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CiCalendar className="w-4 h-4" />
                      <span>Generated: {new Date(report.generatedAt).toLocaleDateString()}</span>
                    </div>

                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => window.open(report.downloadUrl, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ApplicationPortalLayout>
  )
}
