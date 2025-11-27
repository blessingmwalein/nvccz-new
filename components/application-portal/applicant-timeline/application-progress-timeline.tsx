"use client"

import { useMemo } from "react"
import { TimelineStageCard } from "./timeline-stage-card"
import { stages } from "./stage-config"
import type { ApplicationData } from "./timeline-types"
import { TermSheet } from "@/lib/api/application-portal-api"

interface ApplicationProgressTimelineProps {
  application: ApplicationData
  onPreviewDocument: (index: number) => void
  onSignTermsheet: (termSheet: TermSheet) => void

}

export function ApplicationProgressTimeline({ application, onPreviewDocument, onSignTermsheet }: ApplicationProgressTimelineProps) {
  const stageStatuses = useMemo(() => {
    const currentStage = application?.currentStage



    return stages.map((stage) => {
      // Check if stage is completed
      const isCompleted = (() => {
        switch (stage.id) {
          case "APPLICATION_SUBMISSION":
            // Completed if we're past the initial stages
            return !["SUBMITTED", "INITIAL_SCREENING", "SHORTLISTED"].includes(currentStage)
          case "DUE_DILIGENCE_GROUP":
            return application?.dueDiligenceReview?.status === "COMPLETED"
          case "TERM_SHEET_GROUP":
            return application?.termSheet?.status === "SIGNED"
          case "BOARD_GROUP":
            return (
              application?.boardReview?.status === "COMPLETED" ||
              ["BOARD_APPROVED", "BOARD_CONDITIONAL", "BOARD_REJECTED"].includes(currentStage)
            )
          case "INVESTMENT_GROUP":
            return ["DISBURSED", "FUND_DISBURSED", "FUNDED"].includes(currentStage)
          case "REJECTION_PATH":
            return ["REJECTED", "BELOW_THRESHOLD"].includes(currentStage)
          default:
            return false
        }
      })()

      // Check if this is the current stage group
      const isCurrent = stage.statusCodes.includes(currentStage) && !isCompleted

      return { isCompleted, isCurrent, isUpcoming: !isCompleted && !isCurrent }
    })
  }, [application])

  // Filter out rejection path if not in rejection state
  const visibleStages = useMemo(() => {
    const currentStage = application?.currentStage
    if (["REJECTED", "BELOW_THRESHOLD"].includes(currentStage)) {
      return stages
    }
    return stages.filter((s) => s.id !== "REJECTION_PATH")
  }, [application])

  return (
    <div className="space-y-4">
      {visibleStages.map((stage, index) => {
        const stageIndex = stages.findIndex((s) => s.id === stage.id)
        const status = stageStatuses[stageIndex]

        return (
          <TimelineStageCard
            key={stage.id}
            stage={stage}
            index={index}
            totalStages={visibleStages.length}
            application={application}
            isCompleted={status.isCompleted}
            isCurrent={status.isCurrent}
            isUpcoming={status.isUpcoming}
            onPreviewDocument={onPreviewDocument}
            onSignTermsheet={onSignTermsheet}
          />
        )
      })}
    </div>
  )
}
