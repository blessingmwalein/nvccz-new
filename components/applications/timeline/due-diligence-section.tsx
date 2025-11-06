"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Calendar, User, DollarSign, FileText, CheckSquare, Eye, Clock } from "lucide-react"
import { format } from "date-fns"
import { DueDiligenceSkeleton } from "@/components/ui/skeleton-loader"
import type { DueDiligenceData } from "@/lib/api/due-diligence-api"

interface DueDiligenceSectionProps {
  data: DueDiligenceData | null
  loading: boolean
  error: string | null
  currentStage: string
  activityApprovalData?: any
  onRefresh: () => void
  onInitiate?: () => void
}

export function DueDiligenceSection({
  data,
  loading,
  error,
  currentStage,
  activityApprovalData,
  onRefresh,
  onInitiate
}: DueDiligenceSectionProps) {
  if (loading) {
    return <DueDiligenceSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 mb-2">Failed to load due diligence data</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <Button onClick={onRefresh} variant="outline" size="sm" className="rounded-full">
          <Clock className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">No due diligence data available</p>
        <p className="text-sm text-gray-400 mb-4">
          Due diligence has not been initiated for this application yet.
        </p>
        <div className="flex gap-2 justify-center">
          {currentStage === "SHORTLISTED" && onInitiate && (
            <Button
              onClick={onInitiate}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full"
            >
              <Play className="w-4 h-4 mr-2" />
              Initiate Due Diligence
            </Button>
          )}
          <Button onClick={onRefresh} variant="outline" size="sm" className="rounded-full">
            <Clock className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  const firstTask = data?.tasks?.[0]

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Due Diligence Overview */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-normal flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <Eye className="w-4 h-4 text-amber-500" />
            </div>
            Due Diligence Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <Badge className={`mt-1 ${
                data.status === 'COMPLETED' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {data.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm text-gray-500">Overall Score</label>
              <p className="text-sm font-medium">{data.overallScore || 'Not scored'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Recommendation</label>
              <Badge className={`mt-1 ${
                data.recommendation === 'APPROVE' 
                  ? 'bg-green-100 text-green-800'
                  : data.recommendation === 'REJECT'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {data.recommendation || 'Pending'}
              </Badge>
            </div>
            <div>
              <label className="text-sm text-gray-500">Reviewer</label>
              <p className="text-sm font-medium">
                {data.reviewer ? 
                  `${data.reviewer.firstName} ${data.reviewer.lastName}` : 
                  'Not assigned'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Details */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-normal flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            Assessment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Market Research */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Market Research</h4>
                <Badge className={data.marketResearchViable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {data.marketResearchViable ? 'Viable' : 'Not Viable'}
                </Badge>
              </div>
              {data.marketResearchComments && (
                <p className="text-sm text-gray-600">{data.marketResearchComments}</p>
              )}
            </div>

            {/* Financial Assessment */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Financial Assessment</h4>
                <Badge className={data.financialViable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {data.financialViable ? 'Viable' : 'Not Viable'}
                </Badge>
              </div>
              {data.financialComments && (
                <p className="text-sm text-gray-600">{data.financialComments}</p>
              )}
            </div>

            {/* ...existing assessment sections... */}
          </div>
        </CardContent>
      </Card>

      {/* Final Comments */}
      {data.finalComments && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-500" />
              </div>
              Final Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{data.finalComments}</p>
          </CardContent>
        </Card>
      )}

      {/* Tasks Section */}
      {data && data.tasks && data.tasks.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tasks">
            <AccordionTrigger className="text-left hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-blue-500" />
                </div>
                <span>Due Diligence Tasks ({data.tasks.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 mt-4">
                {firstTask && (
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-normal">{firstTask.title}</CardTitle>
                        <Badge variant={firstTask.stage === 'completed' ? 'default' : 'secondary'}>
                          {firstTask.stage}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{firstTask.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Due: {format(new Date(firstTask.date), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">
                            {firstTask.creator?.firstName} {firstTask.creator?.lastName}
                          </span>
                        </div>
                      </div>

                      {firstTask.monetaryValueAchieved && parseFloat(firstTask.monetaryValueAchieved) > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-xs text-gray-600">Task Value Achieved</p>
                            <p className="text-lg font-semibold text-green-600">
                              ${parseFloat(firstTask.monetaryValueAchieved).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Activity Log with Approval Data */}
                      {activityApprovalData && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Latest Activity
                          </h4>
                          <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="pt-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{activityApprovalData.title}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{activityApprovalData.activityType}</Badge>
                                  <Badge className={getApprovalStatusColor(activityApprovalData.approvalStatus)}>
                                    {activityApprovalData.approvalStatus}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <User className="w-3 h-3" />
                                <span>
                                  {activityApprovalData.user?.firstName} {activityApprovalData.user?.lastName}
                                </span>
                                <span>•</span>
                                <Calendar className="w-3 h-3" />
                                <span>{format(new Date(activityApprovalData.createdAt), "MMM dd, yyyy")}</span>
                              </div>

                              {activityApprovalData.monetaryValueAchieved && parseFloat(activityApprovalData.monetaryValueAchieved) > 0 && (
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                  <DollarSign className="w-5 h-5 text-green-600" />
                                  <div>
                                    <p className="text-xs text-gray-600">Activity Value Achieved</p>
                                    <p className="text-lg font-semibold text-green-600">
                                      ${parseFloat(activityApprovalData.monetaryValueAchieved).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Approval Status Details */}
                              <div className="pt-3 border-t">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">Approval Status</span>
                                  <Badge className={getApprovalStatusColor(activityApprovalData.approvalStatus)}>
                                    {activityApprovalData.approvalStatus === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                                    {activityApprovalData.approvalStatus === 'APPROVED' && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {activityApprovalData.approvalStatus === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
                                    {activityApprovalData.approvalStatus}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}
