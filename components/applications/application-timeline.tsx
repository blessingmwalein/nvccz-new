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
import { useAppDispatch, useAppSelector } from '@/lib/store'
import {
  fetchDueDiligenceByApplication,
  fetchBoardReviewByApplication,
  fetchTermSheetByApplication,
  fetchFundDisbursementByApplication,
  fetchVoteSummaryByApplication,
  getActivityForApproval,
  fetchLatestApplicationById
} from '@/lib/store/slices/applicationSlice'
import { FundDisbursementForm } from "./fund-disbursement-form"
import { FundDisbursementConfirmationDialog } from "./fund-disbursement-confirmation-dialog"
import { ApplicationDataSection } from "./timeline/application-data-section"
import { DueDiligenceSection } from "./timeline/due-diligence-section"
import { BoardReviewSection } from "./timeline/board-review-section"
import { TermSheetSection } from "./timeline/term-sheet-section"
import { FundDisbursementSection } from "./timeline/fund-disbursement-section"
import { TimelineStageActions } from "./timeline/timeline-stage-actions"
import type { ExtendedApplication } from '@/lib/api/applications-api'
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
import { TimelineSkeleton } from "@/components/ui/skeleton-loader"
// import { BoardVoteModal } from "./board-vote-modal"

interface ApplicationTimelineProps {
  application: ExtendedApplication
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
    id: "APPLICATION_SUBMISSION",
    statusCodes: ["SHORTLISTED"],
    title: "Application Submission",
    description: "Applicant submits form; documents linked; status visible to applicant.",
    icon: FileText,
    color: "bg-blue-500",
    completedColor: "bg-green-500"
  },
  {
    id: "DUE_DILIGENCE_GROUP",
    statusCodes: ["UNDER_DUE_DILIGENCE", "DUE_DILIGENCE_COMPLETED"],
    title: "Due Diligence",
    description: "Due diligence review in progress by Investments team; completed when finished.",
    icon: Eye,
    color: "bg-amber-500",
    completedColor: "bg-green-500"
  },
  {
    id: "TERM_SHEET_GROUP",
    statusCodes: ["TERM_SHEET_NEGOTIATION", "TERM_SHEET", "TERM_SHEET_SIGNED"],
    title: "Term Sheet",
    description: "Negotiating the term sheet before finalizing the deal; term sheet generated, finalized, and signed by applicant.",
    icon: FileText,
    color: "bg-indigo-500",
    completedColor: "bg-green-500"
  },
  {
    id: "BOARD_GROUP",
    statusCodes: ["UNDER_BOARD_REVIEW", "BOARD_APPROVED", "BOARD_CONDITIONAL", "BOARD_REJECTED"],
    title: "Board Review & Decision",
    description: "Application queued for board review; board outcomes determine next steps.",
    icon: Users,
    color: "bg-purple-500",
    completedColor: "bg-green-500"
  },
  {
    id: "INVESTMENT_GROUP",
    statusCodes: ["INVESTMENT_IMPLEMENTATION", "DISBURSED", "FUNDED"],
    title: "Investment Implementation & Disbursement",
    description: "Implementation plan started; all disbursements approved/disbursed and investment marked as funded.",
    icon: DollarSign,
    color: "bg-emerald-500",
    completedColor: "bg-green-500"
  },
  {
    id: "REJECTION_PATH",
    statusCodes: ["REJECTED", "BELOW_THRESHOLD"],
    title: "Rejection Path",
    description: "Application may move here from any stage if criteria are not met.",
    icon: X,
    color: "bg-red-500",
    completedColor: "bg-red-500"
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
  // Fund disbursement state
  const [approvingDisbursementId, setApprovingDisbursementId] = useState<string | null>(null);
  const [disbursingFundId, setDisbursingFundId] = useState<string | null>(null);
  const [transactionReference, setTransactionReference] = useState<string>('');

  const { latestApplication, latestApplicationLoading, } = useAppSelector((s) => s.application)

  // Data selectors for board review, term sheet, due diligence, fund disbursement
  const boardReviewData = (latestApplication as any)?.boardReview || null;
  const boardReviewLoading = useAppSelector((s) => s.application.boardReviewLoadingByApp?.[application.id] || false);
  const termSheetData = (latestApplication as any)?.termSheet || null;
  const termSheetLoading = useAppSelector((s) => s.application.termSheetLoadingByApp?.[application.id] || false);
  const dueDiligenceLoading = useAppSelector((s) => s.application.dueDiligenceLoadingByApp?.[application.id] || false);
  const fundDisbursementData = useAppSelector((s) => s.application.fundDisbursementByApp[application.id] || null);
  const fundDisbursementLoading = useAppSelector((s) => s.application.fundDisbursementLoadingByApp?.[application.id] || false);
  const voteSummaryLoading = useAppSelector((s) => s.application.voteSummaryLoadingByApp?.[application.id] || false);

  // const { dueDiligenceByApp}
  //get dueDiligenceByApp from state  
  const dueDiligenceByApp = useAppSelector((s) => s.application.dueDiligenceByApp || {});

  // Activity approval data
  const [activityApprovalData, setActivityApprovalData] = useState<any>(null);
  const [activityApprovalLoading, setActivityApprovalLoading] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const dispatch = useAppDispatch()

  // Use latestApplication for all subcomponent payloads
  const dueDiligenceData = dueDiligenceByApp[application.id] || (latestApplication as any)?.dueDiligenceReview || null;
  const voteSummary = useAppSelector((s) => s.application.voteSummaryByApp[application.id] || null);

  // UI state hooks
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showActivityApprovalModal, setShowActivityApprovalModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [showFundDisbursementForm, setShowFundDisbursementForm] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pendingDisbursement, setPendingDisbursement] = useState<any>(null);

  useEffect(() => {
    let stageIndex = stages.findIndex(stage => stage.statusCodes.includes(latestApplication?.currentStage || application.currentStage))

    setCurrentStageIndex(stageIndex >= 0 ? stageIndex : 0)
  }, [latestApplication?.currentStage, application.currentStage])

  // Fetch due diligence data for all applications when component mounts
  useEffect(() => {
    dispatch(fetchLatestApplicationById(application.id))
    dispatch(fetchDueDiligenceByApplication(application.id))
    dispatch(fetchBoardReviewByApplication(application.id))
    dispatch(fetchTermSheetByApplication(application.id))
    dispatch(fetchFundDisbursementByApplication(application.id))
    dispatch(fetchVoteSummaryByApplication(application.id))
  }, [dispatch, application.id, application.currentStage])

  // Refresh due diligence data when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      dispatch(fetchDueDiligenceByApplication(application.id))
    }
  }, [refreshTrigger])


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
      // TODO: Implement createFundDisbursement thunk dispatch when available
      // await dispatch(createFundDisbursement({ ... }))

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
      // TODO: Implement approveFundDisbursement thunk dispatch when available
      // await dispatch(approveFundDisbursement({ disbursementId }))
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
      // TODO: Implement disburseFund thunk dispatch when available
      // await dispatch(disburseFund({ disbursingFundId, transactionReference }))
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
    dispatch(fetchDueDiligenceByApplication(application.id))
    dispatch(fetchBoardReviewByApplication(application.id))
    dispatch(fetchTermSheetByApplication(application.id))
    dispatch(fetchFundDisbursementByApplication(application.id))
  }

  const isStageCompleted = (stageId: string) => {
    switch (stageId) {
      case "APPLICATION_SUBMISSION":
        return latestApplication?.currentStage !== 'SHORTLISTED'
      case "DUE_DILIGENCE_GROUP":
        return (latestApplication as any)?.dueDiligenceReview?.status === 'COMPLETED'
      case "TERM_SHEET_GROUP":
        return (latestApplication as any)?.termSheet?.status === 'SIGNED'
      case "BOARD_GROUP":
        return (latestApplication as any)?.boardReview?.status === 'COMPLETED' || latestApplication?.currentStage && ['BOARD_APPROVED', 'BOARD_CONDITIONAL', 'BOARD_REJECTED'].includes(latestApplication.currentStage)
      case "INVESTMENT_GROUP":
        return latestApplication?.currentStage !== 'INVESTMENT_IMPLEMENTATION' && (!!(latestApplication as any)?.investmentImplementation || latestApplication?.currentStage && ['DISBURSED', 'FUNDED'].includes(latestApplication.currentStage))
      case "REJECTION_PATH":
        return latestApplication?.currentStage && ['REJECTED', 'BELOW_THRESHOLD'].includes(latestApplication.currentStage)
      default:
        return false
    }
  }

  const getStageStatus = (stageIndex: number) => {
    const stage = stages[stageIndex]
    if (isStageCompleted(stage.id)) {
      return "completed"
    }
    if (latestApplication?.currentStage && stage.statusCodes.includes(latestApplication.currentStage)) {
      return "current"
    }
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
    dispatch(fetchVoteSummaryByApplication(application.id))
  }

  if (latestApplicationLoading) {
    return (<TimelineSkeleton />)
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

          //get actula application stage 
          const actualStage = application.currentStage


          // Show accordion for current or completed stage, or if data exists
          let showAccordion = false;
          if (stage.id === "APPLICATION_SUBMISSION") {
            showAccordion = true;
          } else if (isCurrent || isCompleted) {
            showAccordion = true;
          } else if (stage.id === "DUE_DILIGENCE_GROUP" && dueDiligenceData) {
            showAccordion = true;
          } else if (stage.id === "BOARD_GROUP" && boardReviewData) {
            showAccordion = true;
          } else if (stage.id === "TERM_SHEET_GROUP" && termSheetData) {
            showAccordion = true;
          } else if (stage.id === "INVESTMENT_GROUP" && (fundDisbursementData || (latestApplication as any)?.investmentImplementation)) {
            showAccordion = true;
          }

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
                        {stage.id === 'BOARD_GROUP' && voteSummary?.boardStatus === 'IN_PROGRESS' && !voteSummary.isVotingComplete && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Voting in Progress
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {stage.id === "APPLICATION_SUBMISSION" && showAccordion && (
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

                      {stage.id === "DUE_DILIGENCE_GROUP" && showAccordion && (
                        <Accordion type="single" collapsible className="w-full">
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
                                error={dueDiligenceData?.error}
                                currentStage={latestApplication?.currentStage || application.currentStage}
                                activityApprovalData={activityApprovalData}
                                onRefresh={() => dispatch(fetchDueDiligenceByApplication(application.id))}
                                onInitiate={onInitiateDueDiligence}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      {stage.id === "BOARD_GROUP" && showAccordion && (
                        <Accordion type="single" collapsible className="w-full">
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
                                error={boardReviewData?.error}
                                currentStage={latestApplication?.currentStage || application.currentStage}
                                voteSummary={voteSummary}
                                voteSummaryLoading={voteSummaryLoading}
                                onRefresh={() => dispatch(fetchBoardReviewByApplication(application.id))}
                                onInitiate={onInitiateBoardReview}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      {stage.id === "TERM_SHEET_GROUP" && showAccordion && (
                        <Accordion type="single" collapsible className="w-full">
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
                                error={termSheetData?.error}
                                currentStage={latestApplication?.currentStage || application.currentStage}
                                onRefresh={() => dispatch(fetchTermSheetByApplication(application.id))}
                                onCreate={onCreateTermSheet}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      {stage.id === "INVESTMENT_GROUP" && showAccordion && (
                        <Accordion type="single" collapsible className="w-full">
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
                                error={fundDisbursementData?.error}
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
                        </Accordion>
                      )}

                      <div className="pt-4 border-t border-gray-200">
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
