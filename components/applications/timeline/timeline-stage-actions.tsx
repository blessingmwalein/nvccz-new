"use client"

import { Button } from "@/components/ui/button"
import { FileText, Users, Edit, Play, CheckCircle, DollarSign } from "lucide-react"
import type { Application } from "../applications-dashboard"

interface TimelineStageActionsProps {
  stageId: string
  application: Application
  onInitiateDueDiligence?: () => Promise<void>
  onUpdateDueDiligence?: () => Promise<void>
  onCompleteDueDiligence?: () => Promise<void>
  onInitiateBoardReview?: () => Promise<void>
  onUpdateBoardReview?: () => Promise<void>
  onCompleteBoardReview?: () => Promise<void>
  onCreateTermSheet?: () => Promise<void>
  onUpdateTermSheet?: () => Promise<void>
  onFinalizeTermSheet?: () => Promise<void>
  onInitiateFundDisbursement?: () => Promise<void>
  onCreateFundDisbursement?: () => void
  onRefresh: () => Promise<void>
}

export function TimelineStageActions({
  stageId,
  application,
  onInitiateDueDiligence,
  onUpdateDueDiligence,
  onCompleteDueDiligence,
  onInitiateBoardReview,
  onUpdateBoardReview,
  onCompleteBoardReview,
  onCreateTermSheet,
  onUpdateTermSheet,
  onFinalizeTermSheet,
  onInitiateFundDisbursement,
  onCreateFundDisbursement,
  onRefresh
}: TimelineStageActionsProps) {
  // Special handling for BOARD_APPROVED - show TERM_SHEET actions
  if (application.currentStage === "BOARD_APPROVED" && stageId === "TERM_SHEET") {
    return (
      <div className="flex gap-2">
        <Button
          onClick={onCreateTermSheet}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-full"
        >
          <FileText className="w-4 h-4 mr-2" />
          Create Term Sheet
        </Button>
      </div>
    )
  }
  
  // Special handling for DUE_DILIGENCE_COMPLETED - show UNDER_BOARD_REVIEW actions
  if (application.currentStage === "DUE_DILIGENCE_COMPLETED" && stageId === "UNDER_BOARD_REVIEW") {
    return (
      <div className="flex gap-2">
        <Button
          onClick={onInitiateBoardReview}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full"
        >
          <Users className="w-4 h-4 mr-2" />
          Initiate Board Review
        </Button>
      </div>
    )
  }
  
  // Only show actions for the current stage
  if (application.currentStage !== stageId) {
    return null
  }

  switch (stageId) {
    case "SHORTLISTED":
      return (
        <div className="flex gap-2">
          <Button
            onClick={onInitiateDueDiligence}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full"
          >
            <Play className="w-4 h-4 mr-2" />
            Initiate Due Diligence
          </Button>
        </div>
      )
      
    case "UNDER_DUE_DILIGENCE":
      return (
        <div className="flex gap-2">
          <Button
            onClick={onUpdateDueDiligence}
            variant="outline"
            className="border-amber-500 text-amber-600 hover:bg-amber-50 rounded-full"
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Due Diligence
          </Button>
          <Button
            onClick={onCompleteDueDiligence}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Due Diligence
          </Button>
        </div>
      )
      
    case "UNDER_BOARD_REVIEW":
      return (
        <div className="flex gap-2">
          <Button
            onClick={onUpdateBoardReview}
            variant="outline"
            className="border-purple-500 text-purple-600 hover:bg-purple-50 rounded-full"
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Board Review
          </Button>
          <Button
            onClick={onCompleteBoardReview}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Board Review
          </Button>
        </div>
      )
      
    case "TERM_SHEET":
      return (
        <div className="flex gap-2">
          <Button
            onClick={onCreateTermSheet}
            variant="outline"
            className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Create Term Sheet
          </Button>
          <Button
            onClick={onUpdateTermSheet}
            variant="outline"
            className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded-full"
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Term Sheet
          </Button>
          <Button
            onClick={onFinalizeTermSheet}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Finalize Term Sheet
          </Button>
        </div>
      )
      
    case "INVESTMENT_IMPLEMENTATION":
      const hasDisbursements = application.disbursements && application.disbursements.length > 0
      
      return (
        <div className="space-y-4">
          {!application.investmentImplementation ? (
            <div className="flex gap-2">
              <Button
                onClick={onInitiateFundDisbursement}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Initiate Fund Disbursement
              </Button>
            </div>
          ) : !hasDisbursements ? (
            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  if (onCreateFundDisbursement) {
                    await onCreateFundDisbursement()
                    await onRefresh()
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Fund Disbursement
              </Button>
            </div>
          ) : null}
        </div>
      )
      
    default:
      return null
  }
}
