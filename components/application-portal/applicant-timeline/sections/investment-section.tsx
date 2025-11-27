"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp } from "lucide-react"
import type { ApplicationData } from "../timeline-types"

interface InvestmentSectionProps {
  application: ApplicationData
  isDisbursed: boolean
}

export function InvestmentSection({ application, isDisbursed }: InvestmentSectionProps) {
  if (isDisbursed) {
    return (
      <div className="space-y-4 pt-2">
        {/* Completion Message */}
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">Investment Successfully Completed</h3>
          <p className="text-sm text-green-700 mb-4">All funds have been disbursed to your portfolio company.</p>
          <Badge className="bg-green-600 text-white">
            Disbursed on {application?.updatedAt && new Date(application.updatedAt).toLocaleDateString()}
          </Badge>
        </div>

        {/* Investment Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-3 text-blue-900">Investment Summary</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-blue-700">Approved Amount</label>
              <p className="text-xl font-bold text-blue-900">
                $
                {Number(application?.termSheet?.investmentAmount || application?.requestedAmount || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-blue-700">Equity Stake</label>
              <p className="text-xl font-bold text-blue-900">{application?.termSheet?.equityPercentage || 0}%</p>
            </div>
            <div>
              <label className="text-blue-700">Valuation</label>
              <p className="font-medium text-blue-900">
                ${Number(application?.termSheet?.valuation || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-blue-700">Business Name</label>
              <p className="font-medium text-blue-900">{application?.businessName}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2 text-purple-900">What's Next?</h4>
          <ul className="space-y-2 text-sm text-purple-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>You will receive regular portfolio updates and reports</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Your company information is now in our portfolio management system</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Our team will contact you for onboarding and support</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Access to mentorship and networking opportunities</span>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-amber-50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2 text-amber-900">Need Help?</h4>
          <p className="text-sm text-amber-800">
            If you have any questions about your investment or disbursement, please contact our portfolio management
            team.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-8">
      <TrendingUp className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
      <h4 className="font-medium text-emerald-900 mb-2">Investment in Progress</h4>
      <p className="text-sm text-emerald-700">
        Your investment is currently being processed. You'll be notified once funds are disbursed.
      </p>
    </div>
  )
}
