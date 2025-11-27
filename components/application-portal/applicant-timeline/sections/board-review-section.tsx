"use client"

import { Badge } from "@/components/ui/badge"
import type { ApplicationData } from "../timeline-types"

interface BoardReviewSectionProps {
  application: ApplicationData
}

export function BoardReviewSection({ application }: BoardReviewSectionProps) {
  const review = application?.boardReview

  if (!review) {
    return <div className="text-center py-4 text-sm text-gray-500">Board review not yet started</div>
  }

  const getDecisionBadge = () => {
    if (review.investmentApproved) return { className: "bg-green-100 text-green-800", label: "Approved" }
    if (review.investmentRejected) return { className: "bg-red-100 text-red-800", label: "Rejected" }
    if (review.conditionalApproval) return { className: "bg-yellow-100 text-yellow-800", label: "Conditional" }
    return { className: "bg-gray-100 text-gray-800", label: "Pending" }
  }

  const decision = getDecisionBadge()

  return (
    <div className="space-y-4 pt-2">
      {/* Status Overview */}
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-gray-500">Status</label>
            <Badge
              className={`mt-1 ${review.status === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}`}
            >
              {review.status}
            </Badge>
          </div>
          <div>
            <label className="text-gray-500">Overall Score</label>
            <p className="text-lg font-bold text-purple-600">{review.overallScore}%</p>
          </div>
          <div>
            <label className="text-gray-500">Decision</label>
            <Badge className={`mt-1 ${decision.className}`}>{decision.label}</Badge>
          </div>
          <div>
            <label className="text-gray-500">Reviewer</label>
            <p className="font-medium">
              {review.reviewer.firstName} {review.reviewer.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* Review Details */}
      <div className="space-y-3">
        <div className="bg-white border rounded-lg p-3">
          <label className="text-sm font-medium text-gray-700">Recommendation Report</label>
          <p className="text-sm mt-1">{review.recommendationReport}</p>
        </div>
        <div className="bg-white border rounded-lg p-3">
          <label className="text-sm font-medium text-gray-700">Decision Reason</label>
          <p className="text-sm mt-1">{review.decisionReason}</p>
        </div>
        <div className="bg-white border rounded-lg p-3">
          <label className="text-sm font-medium text-gray-700">Next Steps</label>
          <p className="text-sm mt-1">{review.nextSteps}</p>
        </div>
        {review.finalComments && (
          <div className="bg-blue-50 rounded-lg p-3">
            <label className="text-sm font-medium text-gray-700">Final Comments</label>
            <p className="text-sm mt-1">{review.finalComments}</p>
          </div>
        )}
      </div>
    </div>
  )
}
