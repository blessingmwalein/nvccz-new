"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CheckCircle,
  Circle,
  FileText,
  Users,
  DollarSign,
  Eye,
  Edit,
  Play,
  X,
  UserPlus
} from "lucide-react"
import { CiFileOn } from "react-icons/ci"
import { dueDiligenceApi, DueDiligenceData } from "@/lib/api/due-diligence-api"
import { boardReviewApi, BoardReviewData, VoteSummaryData } from "@/lib/api/board-review-api"
import { termSheetApi, TermSheetData } from "@/lib/api/term-sheet-api"
import { fundDisbursementApi, FundDisbursementData } from "@/lib/api/fund-disbursement-api"
import { applicationsApi } from "@/lib/api/applications-api"
import { FundDisbursementForm } from "./fund-disbursement-form"
import { FundDisbursementConfirmationDialog } from "./fund-disbursement-confirmation-dialog"
import { ApplicationDataSection } from "./timeline/application-data-section"
import { DueDiligenceSection } from "./timeline/due-diligence-section"
import { BoardReviewSection } from "./timeline/board-review-section"
import { TermSheetSection } from "./timeline/term-sheet-section"
import { FundDisbursementSection } from "./timeline/fund-disbursement-section"
import { TimelineStageActions } from "./timeline/timeline-stage-actions"
import type { Application } from './applications-dashboard'
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DueDiligenceTaskModal } from "./due-diligence-task-modal"
import { ActivityApprovalModal } from "./activity-approval-modal"
import { BoardVoteModal } from "./board-voting-modal"
// import { BoardVoteModal } from "./board-vote-modal"

interface ApplicationTimelineProps {
  application: Application
  onInitiateDueDiligence?: () => void
  onUpdateDueDiligence?: () => void
  onCompleteDueDiligence?: () => void
  onInitiateBoardReview?: () => void
  onUpdateBoardReview?: () => void
  onCompleteBoardReview?: () => void
  onCreateTermSheet?: () => void
  onUpdateTermSheet?: () => void
  onFinalizeTermSheet?: () => void
  onInitiateFundDisbursement?: () => void
  onCreateFundDisbursement?: () => void
  refreshTrigger?: number
  onRefresh?: () => void
  onClose?: () => void
}

const stages = [
  {
    id: "SHORTLISTED",
    title: "Application Review",
    description: "Review application details and documents",
    icon: FileText,
    color: "bg-blue-500",
    completedColor: "bg-green-500"
  },
  {
    id: "UNDER_DUE_DILIGENCE",
    title: "Due Diligence",
    description: "Comprehensive business and financial analysis",
    icon: Eye,
    color: "bg-amber-500",
    completedColor: "bg-green-500"
  },
  {
    id: "UNDER_BOARD_REVIEW",
    title: "Board Review",
    description: "Board evaluation and decision making",
    icon: Users,
    color: "bg-purple-500",
    completedColor: "bg-green-500"
  },
  {
    id: "TERM_SHEET",
    title: "Term Sheet",
    description: "Investment terms negotiation and finalization",
    icon: FileText,
    color: "bg-indigo-500",
    completedColor: "bg-green-500"
  },
  {
    id: "INVESTMENT_IMPLEMENTATION",
    title: "Fund Disbursement",
    description: "Investment implementation and fund release",
    icon: DollarSign,
    color: "bg-emerald-500",
    completedColor: "bg-green-500"
  },
  {
    id: "DISBURSED",
    title: "Completed",
    description: "Funds successfully disbursed",
    icon: CheckCircle,
    color: "bg-green-500",
    completedColor: "bg-green-500"
  }
]

export function ApplicationTimeline({
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
  refreshTrigger,
  onRefresh,
  onClose
}: ApplicationTimelineProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [dueDiligenceData, setDueDiligenceData] = useState<DueDiligenceData | null>(null)
  const [dueDiligenceLoading, setDueDiligenceLoading] = useState(false)
  const [dueDiligenceError, setDueDiligenceError] = useState<string | null>(null)
  const [boardReviewData, setBoardReviewData] = useState<BoardReviewData | null>(null)
  const [boardReviewLoading, setBoardReviewLoading] = useState(false)
  const [boardReviewError, setBoardReviewError] = useState<string | null>(null)
  const [termSheetData, setTermSheetData] = useState<TermSheetData | null>(null)
  const [termSheetLoading, setTermSheetLoading] = useState(false)
  const [termSheetError, setTermSheetError] = useState<string | null>(null)
  const [fundDisbursementData, setFundDisbursementData] = useState<FundDisbursementData | null>(null)
  const [fundDisbursementLoading, setFundDisbursementLoading] = useState(false)
  const [fundDisbursementError, setFundDisbursementError] = useState<string | null>(null)
  const [showFundDisbursementForm, setShowFundDisbursementForm] = useState(false)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [pendingDisbursement, setPendingDisbursement] = useState<{
    amount: number
    disbursementDate: Date
    paymentMethod: string
    referenceNumber: string
    notes: string
  } | null>(null)
  const [approvingDisbursementId, setApprovingDisbursementId] = useState<string | null>(null)
  const [disbursingFundId, setDisbursingFundId] = useState<string | null>(null)
  const [transactionReference, setTransactionReference] = useState('')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showActivityApprovalModal, setShowActivityApprovalModal] = useState(false)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [activityApprovalData, setActivityApprovalData] = useState<any>(null)
  const [activityApprovalLoading, setActivityApprovalLoading] = useState(false)
  const [voteSummary, setVoteSummary] = useState<VoteSummaryData | null>(null)
  const [voteSummaryLoading, setVoteSummaryLoading] = useState(false)
  const [showVoteModal, setShowVoteModal] = useState(false)

  useEffect(() => {
    let stageIndex = stages.findIndex(stage => stage.id === application.currentStage)

    // Special handling for BOARD_APPROVED - it should show TERM_SHEET as current
    if (application.currentStage === "BOARD_APPROVED") {
      stageIndex = stages.findIndex(stage => stage.id === "TERM_SHEET")
    }

    // Special handling for DUE_DILIGENCE_COMPLETED - it should show UNDER_BOARD_REVIEW as current
    if (application.currentStage === "DUE_DILIGENCE_COMPLETED") {
      stageIndex = stages.findIndex(stage => stage.id === "UNDER_BOARD_REVIEW")
    }

    // Special handling for DISBURSED - all stages should be completed
    if (application.currentStage === "DISBURSED") {
      stageIndex = stages.findIndex(stage => stage.id === "DISBURSED")
    }

    setCurrentStageIndex(stageIndex >= 0 ? stageIndex : 0)
  }, [application.currentStage])

  // Fetch due diligence data for all applications when component mounts
  useEffect(() => {
    fetchDueDiligenceData()
  }, [application.id])

  // Fetch board review data for all applications when component mounts
  useEffect(() => {
    fetchBoardReviewData()
    if (application.currentStage === 'UNDER_BOARD_REVIEW' || application.currentStage === 'BOARD_APPROVED') {
      fetchVoteSummary()
    }
  }, [application.id, application.currentStage])

  // Fetch term sheet data for all applications when component mounts
  useEffect(() => {
    fetchTermSheetData()
  }, [application.id])

  // Fetch fund disbursement data when component mounts or application changes
  useEffect(() => {
    if (application.currentStage === 'INVESTMENT_IMPLEMENTATION' ||
      application.currentStage === 'FUND_DISBURSED' ||
      application.currentStage === 'DISBURSED') {
      fetchFundDisbursementData()
    }
  }, [application.id, application.currentStage])

  // Refresh due diligence data when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchDueDiligenceData()
    }
  }, [refreshTrigger])

  const fetchDueDiligenceData = async () => {
    setDueDiligenceLoading(true)
    setDueDiligenceError(null)
    try {
      const response = await dueDiligenceApi.getByApplicationId(application.id)
      setDueDiligenceData(response.data)
      
      // After successfully fetching due diligence, fetch activity approval data if available
      if (response.data?.tasks?.length > 0 && response.data.tasks[0]?.activityLogs?.length > 0) {
        const firstActivityLogId = response.data.tasks[0].activityLogs[0].id
        await fetchActivityApprovalData(firstActivityLogId)
      } else {
        setActivityApprovalData(null)
      }
    } catch (error: any) {
      // If it's a 404 or similar "not found" error, don't treat it as an error
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('No due diligence data')) {
        setDueDiligenceData(null)
        setDueDiligenceError(null)
      } else {
        setDueDiligenceError(error.message || 'Failed to load due diligence data')
      }
    } finally {
      setDueDiligenceLoading(false)
    }
  }

  const fetchActivityApprovalData = async (activityId: string) => {
    try {
      setActivityApprovalLoading(true)
      const response = await applicationsApi.getActivityForApproval(activityId)
      setActivityApprovalData(response.data)
      setSelectedActivityId(activityId)
    } catch (error: any) {
      console.error('Error fetching activity approval data:', error)
      setActivityApprovalData(null)
    } finally {
      setActivityApprovalLoading(false)
    }
  }

  const fetchVoteSummary = async () => {
    setVoteSummaryLoading(true);
    try {
      const response = await boardReviewApi.getVoteSummary(application.id)
      setVoteSummary(response.data)
    } catch (error) {
      console.error('Error fetching vote summary:', error)
      setVoteSummary(null)
    } finally {
      setVoteSummaryLoading(false)
    }
  }

  const fetchBoardReviewData = async () => {
    setBoardReviewLoading(true)
    setBoardReviewError(null)
    try {
      const response = await boardReviewApi.getByApplicationId(application.id)
      setBoardReviewData(response.data)
    } catch (error: any) {
      // If it's a 404 or similar "not found" error, don't treat it as an error
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('No board review data')) {
        setBoardReviewData(null)
        setBoardReviewError(null)
      } else {
        setBoardReviewError(error.message || 'Failed to load board review data')
      }
    } finally {
      setBoardReviewLoading(false)
    }
  }

  const fetchTermSheetData = async () => {
    setTermSheetLoading(true)
    setTermSheetError(null)
    try {
      const response = await termSheetApi.getByApplicationId(application.id)
      setTermSheetData(response.data)
    } catch (error: any) {
      // If it's a 404 or similar "not found" error, don't treat it as an error
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('No term sheet data')) {
        setTermSheetData(null)
        setTermSheetError(null)
      } else {
        setTermSheetError(error.message || 'Failed to load term sheet data')
      }
    } finally {
      setTermSheetLoading(false)
    }
  }

  const fetchFundDisbursementData = async () => {
    setFundDisbursementLoading(true)
    setFundDisbursementError(null)
    try {
      const response = await fundDisbursementApi.getByApplicationId(application.id)
      setFundDisbursementData(response.data)
    } catch (error: any) {
      // If it's a 404 or similar "not found" error, don't treat it as an error
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('No fund disbursement data')) {
        setFundDisbursementData(null)
        setFundDisbursementError(null)
      } else {
        setFundDisbursementError(error.message || 'Failed to load fund disbursement data')
      }
    } finally {
      setFundDisbursementLoading(false)
    }
  }

  const handleInitiateFundDisbursement = () => {
    setShowFundDisbursementForm(true)
  }

  const handleSubmitFundDisbursement = async (data: {
    amount: number
    disbursementDate: Date
    paymentMethod: string
    referenceNumber: string
    notes: string
  }) => {
    setPendingDisbursement(data)
    setShowConfirmationDialog(true)
  }

  const handleConfirmFundDisbursement = async () => {
    if (!pendingDisbursement) return

    try {
      await fundDisbursementApi.create(application.id, {
        amount: pendingDisbursement.amount,
        disbursementDate: pendingDisbursement.disbursementDate.toISOString(),
        bankDetails: {
          accountName: application.applicantName,
          accountNumber: 'N/A',
          bankName: 'N/A',
          branchCode: 'N/A'
        },
        notes: pendingDisbursement.notes || undefined
      })

      // Close the dialogs and reset state
      setShowConfirmationDialog(false)
      setShowFundDisbursementForm(false)
      setPendingDisbursement(null)

      // Refresh and close drawer
      await handleActionWithRefresh()

    } catch (error) {
      console.error('Error creating fund disbursement:', error)
    }
  }

  const handleApproveDisbursement = async (disbursementId: string) => {
    try {
      await fundDisbursementApi.approveDisbursement(disbursementId)
      toast.success('Disbursement approved successfully', {
        description: 'The disbursement has been approved and is ready for processing.'
      })
      setApprovingDisbursementId(null)
      await handleActionWithRefresh()
    } catch (error: any) {
      toast.error('Failed to approve disbursement', {
        description: error.message || 'Please try again.'
      })
    }
  }

  const handleDisburseFund = async () => {
    if (!disbursingFundId || !transactionReference.trim()) {
      toast.error('Transaction reference is required')
      return
    }

    try {
      await fundDisbursementApi.disburseFund(disbursingFundId, transactionReference)
      toast.success('Disbursement completed successfully', {
        description: 'The funds have been marked as disbursed.'
      })
      setDisbursingFundId(null)
      setTransactionReference('')
      await handleActionWithRefresh()
    } catch (error: any) {
      toast.error('Failed to disburse funds', {
        description: error.message || 'Please try again.'
      })
    }
  }

  const handleActionWithRefresh = async (action?: () => void | Promise<void>) => {
    if (action) {
      await action()
    }
    if (onRefresh) {
      onRefresh()
    }
    fetchDueDiligenceData()
    fetchBoardReviewData()
    fetchTermSheetData()
    fetchFundDisbursementData()

    // if (onClose) {
    //   onClose()
    // }
  }

  const getStageStatus = (stageIndex: number) => {
    // Special handling for DISBURSED stage - mark all as completed
    if (application.currentStage === "DISBURSED") {
      return "completed"
    }

    if (application.currentStage === "BOARD_APPROVED") {
      if (stageIndex < 3) return "completed"
      if (stageIndex === 3) return "current"
      return "upcoming"
    }

    if (application.currentStage === "DUE_DILIGENCE_COMPLETED") {
      if (stageIndex < 2) return "completed"
      if (stageIndex === 2) return "current"
      return "upcoming"
    }

    if (stageIndex < currentStageIndex) return "completed"
    if (stageIndex === currentStageIndex) return "current"
    return "upcoming"
  }

  // Add missing handler functions
  const handleInitiateDueDiligence = async () => {
    if (onInitiateDueDiligence) {
      await onInitiateDueDiligence()
      await handleActionWithRefresh()
    }
  }

  const handleUpdateDueDiligence = async () => {
    if (onUpdateDueDiligence) {
      await onUpdateDueDiligence()
      await handleActionWithRefresh()
    }
  }

  const handleCompleteDueDiligence = async () => {
    if (onCompleteDueDiligence) {
      await onCompleteDueDiligence()
      await handleActionWithRefresh()
    }
  }

  const handleInitiateBoardReview = async () => {
    if (onInitiateBoardReview) {
      await onInitiateBoardReview()
      await handleActionWithRefresh()
    }
  }

  const handleUpdateBoardReview = async () => {
    if (onUpdateBoardReview) {
      await onUpdateBoardReview()
      await handleActionWithRefresh()
    }
  }

  const handleCompleteBoardReview = async () => {
    if (onCompleteBoardReview) {
      await onCompleteBoardReview()
      await handleActionWithRefresh()
    }
  }

  const handleCreateTermSheet = async () => {
    if (onCreateTermSheet) {
      await onCreateTermSheet()
      await handleActionWithRefresh()
    }
  }

  const handleUpdateTermSheet = async () => {
    if (onUpdateTermSheet) {
      await onUpdateTermSheet()
      await handleActionWithRefresh()
    }
  }

  const handleFinalizeTermSheet = async () => {
    if (onFinalizeTermSheet) {
      await onFinalizeTermSheet()
      await handleActionWithRefresh()
    }
  }

  const handleInitiateFundDisbursementAction = async () => {
    if (onInitiateFundDisbursement) {
      await onInitiateFundDisbursement()
      await handleActionWithRefresh()
    }
  }

  const handleCreateTask = () => {
    setShowTaskModal(true)
  }

  const handleTaskSuccess = async () => {
    setShowTaskModal(false)
    await handleActionWithRefresh()
  }

  const handleApproveActivity = () => {
    if (selectedActivityId) {
      setShowActivityApprovalModal(true)
    }
  }

  const handleActivityApprovalSuccess = async () => {
    setShowActivityApprovalModal(false)
    await handleActionWithRefresh()
  }

  const handleVoteSuccess = async () => {
    setShowVoteModal(false)
    await handleActionWithRefresh()
    fetchVoteSummary()
  }

  return (
    <div className="space-y-6" key={application.id}>
      {/* Timeline Header with Close Button */}
      <div className="relative text-center mb-8">
        <h2 className="text-xl font-normal text-gray-900 mb-2">Application Timeline</h2>
        <p className="text-sm text-gray-600">Track the progress of this investment application</p>

        {/* Close Button */}
        
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="absolute -top-2 right-0 rounded-full h-10 w-10 bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700 shadow-md hover:shadow-lg transition-all"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </Button>
      
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        {/* Modals and Dialogs */}
        {showFundDisbursementForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Initiate Fund Disbursement</h3>
                  <button
                    onClick={() => setShowFundDisbursementForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <FundDisbursementForm
                  applicationId={application.id}
                  portfolioCompanyId={application.portfolioCompanyId || ''}
                  fundId={application.fundId || ''}
                  onCancel={() => setShowFundDisbursementForm(false)}
                  onSubmit={handleSubmitFundDisbursement}
                />
              </div>
            </div>
          </div>
        )}

        <FundDisbursementConfirmationDialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
          onConfirm={handleConfirmFundDisbursement}
          disbursementData={{
            amount: pendingDisbursement?.amount || 0,
            disbursementDate: pendingDisbursement?.disbursementDate || new Date(),
            paymentMethod: pendingDisbursement?.paymentMethod || '',
            referenceNumber: pendingDisbursement?.referenceNumber || ''
          }}
          loading={false}
        />

        <DueDiligenceTaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          applicationId={application.id}
          onSuccess={handleTaskSuccess}
        />

        <ActivityApprovalModal
          isOpen={showActivityApprovalModal}
          onClose={() => setShowActivityApprovalModal(false)}
          activityId={selectedActivityId || ''}
          onSuccess={handleActivityApprovalSuccess}
        />

        <BoardVoteModal
          isOpen={showVoteModal}
          onClose={() => setShowVoteModal(false)}
          applicationId={application.id}
          onSuccess={handleVoteSuccess}
        />

        {stages.map((stage, index) => {
          const status = getStageStatus(index)
          const isCompleted = status === "completed"
          const isCurrent = status === "current"
          const isUpcoming = status === "upcoming"

          return (
            <div key={`${stage.id}-${application.id}`} className="relative flex items-start">
              {index < stages.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200" />
              )}

              <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-white shadow-lg">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : isCurrent ? (
                  <div className={`w-6 h-6 rounded-full ${stage.color} flex items-center justify-center`}>
                    <stage.icon className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <div className="ml-6 flex-1 pb-8">
                <Card className={`transition-all duration-300 ${isCurrent
                    ? 'border-2 border-blue-500 shadow-lg bg-white'
                    : isCompleted
                      ? 'border-green-200 bg-white'
                      : isUpcoming
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : 'border-gray-200 bg-white'
                  }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className={`text-base font-normal ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
                          }`}>
                          {stage.title}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{stage.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Current
                          </Badge>
                        )}
                        {isUpcoming && (
                          <Badge variant="secondary">
                            Upcoming
                          </Badge>
                        )}
                        {stage.id === 'UNDER_BOARD_REVIEW' && voteSummary?.boardStatus === 'IN_PROGRESS' && !voteSummary.isVotingComplete && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Voting in Progress
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {stage.id === "SHORTLISTED" && !isUpcoming && (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="application-data">
                            <AccordionTrigger className="text-left hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                                  <CiFileOn className="w-4 h-4 text-blue-500" />
                                </div>
                                <span>Application Data</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ApplicationDataSection application={application} />
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      {(stage.id === "UNDER_DUE_DILIGENCE" || stage.id === "UNDER_BOARD_REVIEW" || stage.id === "TERM_SHEET" || stage.id === "INVESTMENT_IMPLEMENTATION") && !isUpcoming && (
                        <Accordion type="single" collapsible className="w-full">
                          {stage.id === "UNDER_DUE_DILIGENCE" && (
                            <AccordionItem value="due-diligence-data">
                              <AccordionTrigger className="text-left hover:bg-amber-50 transition-colors duration-200 cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-amber-500" />
                                  </div>
                                  <span>Due Diligence Report</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <DueDiligenceSection
                                  data={dueDiligenceData}
                                  loading={dueDiligenceLoading}
                                  error={dueDiligenceError}
                                  currentStage={application.currentStage}
                                  activityApprovalData={activityApprovalData}
                                  onRefresh={fetchDueDiligenceData}
                                  onInitiate={onInitiateDueDiligence}
                                />
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {stage.id === "UNDER_BOARD_REVIEW" && (
                            <AccordionItem value="board-review-data">
                              <AccordionTrigger className="text-left hover:bg-purple-50 transition-colors duration-200 cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-purple-500" />
                                  </div>
                                  <span>Board Review Report</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <BoardReviewSection
                                  data={boardReviewData}
                                  loading={boardReviewLoading}
                                  error={boardReviewError}
                                  currentStage={application.currentStage}
                                  voteSummary={voteSummary}
                                  voteSummaryLoading={voteSummaryLoading}
                                  onRefresh={fetchBoardReviewData}
                                  onInitiate={onInitiateBoardReview}
                                />
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {stage.id === "TERM_SHEET" && (
                            <AccordionItem value="term-sheet-data">
                              <AccordionTrigger className="text-left hover:bg-indigo-50 transition-colors duration-200 cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-indigo-500" />
                                  </div>
                                  <span>Term Sheet Details</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <TermSheetSection
                                  data={termSheetData}
                                  loading={termSheetLoading}
                                  error={termSheetError}
                                  currentStage={application.currentStage}
                                  onRefresh={fetchTermSheetData}
                                  onCreate={onCreateTermSheet}
                                />
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {stage.id === "INVESTMENT_IMPLEMENTATION" && (
                            <AccordionItem value="fund-disbursement-data">
                              <AccordionTrigger className="text-left hover:bg-emerald-50 transition-colors duration-200 cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center">
                                    <DollarSign className="w-4 h-4 text-emerald-500" />
                                  </div>
                                  <span>Fund Disbursement Details</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <FundDisbursementSection
                                  application={application}
                                  data={fundDisbursementData}
                                  loading={fundDisbursementLoading}
                                  error={fundDisbursementError}
                                  approvingDisbursementId={approvingDisbursementId}
                                  disbursingFundId={disbursingFundId}
                                  transactionReference={transactionReference}
                                  onSetApprovingId={setApprovingDisbursementId}
                                  onSetDisbursingId={setDisbursingFundId}
                                  onSetTransactionReference={setTransactionReference}
                                  onApproveDisbursement={handleApproveDisbursement}
                                  onDisburseFund={handleDisburseFund}
                                  onRefresh={handleActionWithRefresh}
                                />
                              </AccordionContent>
                            </AccordionItem>
                          )}
                        </Accordion>
                      )}

                      <div className="pt-4 border-t border-gray-200">
                        {!isUpcoming ? (
                          <TimelineStageActions
                            stageId={stage.id}
                            application={application}
                            dueDiligenceData={dueDiligenceData}
                            dueDiligenceLoading={dueDiligenceLoading || boardReviewLoading}
                            activityApprovalData={activityApprovalData}
                            activityApprovalLoading={activityApprovalLoading}
                            boardReviewData={boardReviewData}
                            voteSummary={voteSummary}
                            onInitiateDueDiligence={handleInitiateDueDiligence}
                            onUpdateDueDiligence={handleUpdateDueDiligence}
                            onCompleteDueDiligence={handleCompleteDueDiligence}
                            onCreateDueDiligenceTask={handleCreateTask}
                            onApproveActivity={handleApproveActivity}
                            onInitiateBoardReview={handleInitiateBoardReview}
                            onUpdateBoardReview={handleUpdateBoardReview}
                            onCompleteBoardReview={handleCompleteBoardReview}
                            onVote={() => setShowVoteModal(true)}
                            onCreateTermSheet={handleCreateTermSheet}
                            onUpdateTermSheet={handleUpdateTermSheet}
                            onFinalizeTermSheet={handleFinalizeTermSheet}
                            onInitiateFundDisbursement={handleInitiateFundDisbursementAction}
                            onCreateFundDisbursement={onCreateFundDisbursement}
                            onRefresh={handleActionWithRefresh}
                          />
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500 italic">This stage is not yet available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
