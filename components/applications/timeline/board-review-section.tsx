"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Play } from "lucide-react"
import type { BoardReviewData } from "@/lib/api/board-review-api"

interface BoardReviewSectionProps {
  data: BoardReviewData | null
  loading: boolean
  error: string | null
  currentStage: string
  onRefresh: () => void
  onInitiate?: () => void
}

export function BoardReviewSection({
  data,
  loading,
  error,
  currentStage,
  onRefresh,
  onInitiate
}: BoardReviewSectionProps) {
  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Failed to load board review data</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <Button onClick={onRefresh} variant="outline" size="sm" className="rounded-full">
          Retry
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">No board review data available</p>
        <p className="text-sm text-gray-400 mb-4">
          Board review has not been initiated for this application yet.
        </p>
        <div className="flex gap-2 justify-center">
          {currentStage === "UNDER_DUE_DILIGENCE" && onInitiate && (
            <Button
              onClick={onInitiate}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full"
            >
              <Users className="w-4 h-4 mr-2" />
              Initiate Board Review
            </Button>
          )}
          <Button onClick={onRefresh} variant="outline" size="sm" className="rounded-full">
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Board Review Overview */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-normal flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            Board Review Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <Badge className={`mt-1 ${
                data.status === 'COMPLETED' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {data.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm text-gray-500">Overall Score</label>
              <p className="text-sm font-medium">{data.overallScore || 'Not scored'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Investment Decision</label>
              <Badge className={`mt-1 ${
                data.investmentApproved 
                  ? 'bg-green-100 text-green-800'
                  : data.investmentRejected
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {data.investmentApproved ? 'Approved' : 
                 data.investmentRejected ? 'Rejected' : 
                 data.conditionalApproval ? 'Conditional' : 'Pending'}
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

      {/* Review Details */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-normal flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            Review Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Recommendation Report</h4>
              <p className="text-sm text-gray-600">{data.recommendationReport}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Decision Reason</h4>
              <p className="text-sm text-gray-600">{data.decisionReason}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Next Steps</h4>
              <p className="text-sm text-gray-600">{data.nextSteps}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Comments */}
      {data.finalComments && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-500" />
              </div>
              Final Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{data.finalComments}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
