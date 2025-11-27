"use client"

import { Badge } from "@/components/ui/badge"
import type { ApplicationData } from "../timeline-types"

interface DueDiligenceSectionProps {
  application: ApplicationData
}

export function DueDiligenceSection({ application }: DueDiligenceSectionProps) {
  const review = application?.dueDiligenceReview

  if (!review) {
    return <div className="text-center py-4 text-sm text-gray-500">Due diligence review not yet started</div>
  }

  const assessmentAreas = [
    { label: "Market Research", viable: review.marketResearchViable, comments: review.marketResearchComments },
    { label: "Financial Viability", viable: review.financialViable, comments: review.financialComments },
    {
      label: "Competitive Opportunities",
      viable: review.competitiveOpportunities,
      comments: review.competitiveComments,
    },
    { label: "Management Team", viable: review.managementTeamQualified, comments: review.managementComments },
    { label: "Legal Compliance", viable: review.legalCompliant, comments: review.legalComments },
    { label: "Risk Assessment", viable: review.riskTolerable, comments: review.riskComments },
  ]

  return (
    <div className="space-y-4 pt-2">
      {/* Status Overview */}
      <div className="bg-amber-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-gray-500">Status</label>
            <Badge
              className={`mt-1 ${review.status === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
            >
              {review.status}
            </Badge>
          </div>
          <div>
            <label className="text-gray-500">Overall Score</label>
            <p className="text-lg font-bold text-amber-600">{review.overallScore}%</p>
          </div>
          <div>
            <label className="text-gray-500">Recommendation</label>
            <Badge
              className={`mt-1 ${review.recommendation === "APPROVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {review.recommendation}
            </Badge>
          </div>
          <div>
            <label className="text-gray-500">Reviewer</label>
            <p className="font-medium">
              {review.reviewer.firstName} {review.reviewer.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* Assessment Areas */}
      <div className="space-y-2">
        {assessmentAreas.map((item, idx) => (
          <div key={idx} className="bg-white border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{item.label}</span>
              <Badge className={item.viable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {item.viable ? "Pass" : "Fail"}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">{item.comments}</p>
          </div>
        ))}
      </div>

      {/* Final Comments */}
      {review.finalComments && (
        <div className="bg-blue-50 rounded-lg p-4">
          <label className="text-sm font-medium text-gray-700">Final Comments</label>
          <p className="text-sm mt-1">{review.finalComments}</p>
        </div>
      )}
    </div>
  )
}
