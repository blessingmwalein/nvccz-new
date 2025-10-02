"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  FileText, 
  Users, 
  DollarSign,
  ChevronRight,
  Eye,
  Edit,
  Play,
  Building2,
  Loader2
} from "lucide-react"
import { CiUser, CiDollar, CiFileOn, CiCalendar } from "react-icons/ci"
import { dueDiligenceApi, DueDiligenceData } from "@/lib/api/due-diligence-api"
import { boardReviewApi, BoardReviewData } from "@/lib/api/board-review-api"
import { termSheetApi, TermSheetData } from "@/lib/api/term-sheet-api"
import { DueDiligenceSkeleton, BoardReviewSkeleton, TermSheetSkeleton } from "@/components/ui/skeleton-loader"

interface Application {
  id: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  applicantAddress: string
  businessName: string
  businessDescription: string
  industry: string
  businessStage: string
  foundingDate: string
  requestedAmount: string
  currentStage: string
  submittedAt: string | null
  updatedAt: string
  createdAt: string
  documents: Array<{
    id: string
    documentType: string
    fileName: string
    isRequired: boolean
    isSubmitted: boolean
  }>
}

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
  refreshTrigger?: number // Add refresh trigger prop
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
  refreshTrigger
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
    
    setCurrentStageIndex(stageIndex >= 0 ? stageIndex : 0)
  }, [application.currentStage])

  // Fetch due diligence data for all applications when component mounts
  useEffect(() => {
    fetchDueDiligenceData()
  }, [application.id])

  // Fetch board review data for all applications when component mounts
  useEffect(() => {
    fetchBoardReviewData()
  }, [application.id])

  // Fetch term sheet data for all applications when component mounts
  useEffect(() => {
    fetchTermSheetData()
  }, [application.id])

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

  const getStageStatus = (stageIndex: number) => {
    // Special handling for BOARD_APPROVED stage
    if (application.currentStage === "BOARD_APPROVED") {
      if (stageIndex < 3) return "completed" // SHORTLISTED, UNDER_DUE_DILIGENCE, UNDER_BOARD_REVIEW
      if (stageIndex === 3) return "current" // TERM_SHEET (now at index 3)
      return "upcoming"
    }
    
    // Special handling for DUE_DILIGENCE_COMPLETED stage
    if (application.currentStage === "DUE_DILIGENCE_COMPLETED") {
      if (stageIndex < 2) return "completed" // SHORTLISTED, UNDER_DUE_DILIGENCE
      if (stageIndex === 2) return "current" // UNDER_BOARD_REVIEW (now at index 2)
      return "upcoming"
    }
    
    // Normal stage logic
    if (stageIndex < currentStageIndex) return "completed"
    if (stageIndex === currentStageIndex) return "current"
    return "upcoming"
  }

  const getStageActions = (stageId: string) => {
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
        return (
          <div className="flex gap-2">
            <Button
              onClick={onInitiateFundDisbursement}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Initiate Fund Disbursement
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const renderDueDiligenceData = () => {
    if (dueDiligenceLoading) {
      return <DueDiligenceSkeleton />
    }

    if (dueDiligenceError) {
      return (
        <div className="text-center py-8">
          <Clock className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-2">Failed to load due diligence data</p>
          <p className="text-sm text-gray-500 mb-4">{dueDiligenceError}</p>
          <Button 
            onClick={fetchDueDiligenceData}
            variant="outline" 
            size="sm" 
            className="rounded-full"
          >
            <Clock className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )
    }

    if (!dueDiligenceData) {
      return (
        <div className="text-center py-8">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No due diligence data available</p>
          <p className="text-sm text-gray-400 mb-4">
            Due diligence has not been initiated for this application yet.
          </p>
          <div className="flex gap-2 justify-center">
            {application.currentStage === "SHORTLISTED" && (
              <Button
                onClick={onInitiateDueDiligence}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Initiate Due Diligence
              </Button>
            )}
            <Button
              onClick={fetchDueDiligenceData}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <Clock className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
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
                  dueDiligenceData.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {dueDiligenceData.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-gray-500">Overall Score</label>
                <p className="text-sm font-medium">{dueDiligenceData.overallScore || 'Not scored'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Recommendation</label>
                <Badge className={`mt-1 ${
                  dueDiligenceData.recommendation === 'APPROVE' 
                    ? 'bg-green-100 text-green-800'
                    : dueDiligenceData.recommendation === 'REJECT'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {dueDiligenceData.recommendation || 'Pending'}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-gray-500">Reviewer</label>
                <p className="text-sm font-medium">
                  {dueDiligenceData.reviewer ? 
                    `${dueDiligenceData.reviewer.firstName} ${dueDiligenceData.reviewer.lastName}` : 
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
                  <Badge className={dueDiligenceData.marketResearchViable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {dueDiligenceData.marketResearchViable ? 'Viable' : 'Not Viable'}
                  </Badge>
                </div>
                {dueDiligenceData.marketResearchComments && (
                  <p className="text-sm text-gray-600">{dueDiligenceData.marketResearchComments}</p>
                )}
              </div>

              {/* Financial Assessment */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Financial Assessment</h4>
                  <Badge className={dueDiligenceData.financialViable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {dueDiligenceData.financialViable ? 'Viable' : 'Not Viable'}
                  </Badge>
                </div>
                {dueDiligenceData.financialComments && (
                  <p className="text-sm text-gray-600">{dueDiligenceData.financialComments}</p>
                )}
              </div>

              {/* Competitive Opportunities */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Competitive Opportunities</h4>
                  <Badge className={dueDiligenceData.competitiveOpportunities ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {dueDiligenceData.competitiveOpportunities ? 'Identified' : 'Not Identified'}
                  </Badge>
                </div>
                {dueDiligenceData.competitiveComments && (
                  <p className="text-sm text-gray-600">{dueDiligenceData.competitiveComments}</p>
                )}
              </div>

              {/* Management Team */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Management Team</h4>
                  <Badge className={dueDiligenceData.managementTeamQualified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {dueDiligenceData.managementTeamQualified ? 'Qualified' : 'Not Qualified'}
                  </Badge>
                </div>
                {dueDiligenceData.managementComments && (
                  <p className="text-sm text-gray-600">{dueDiligenceData.managementComments}</p>
                )}
              </div>

              {/* Legal Compliance */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Legal Compliance</h4>
                  <Badge className={dueDiligenceData.legalCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {dueDiligenceData.legalCompliant ? 'Compliant' : 'Not Compliant'}
                  </Badge>
                </div>
                {dueDiligenceData.legalComments && (
                  <p className="text-sm text-gray-600">{dueDiligenceData.legalComments}</p>
                )}
              </div>

              {/* Risk Assessment */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Risk Assessment</h4>
                  <Badge className={dueDiligenceData.riskTolerable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {dueDiligenceData.riskTolerable ? 'Tolerable' : 'Not Tolerable'}
                  </Badge>
                </div>
                {dueDiligenceData.riskComments && (
                  <p className="text-sm text-gray-600">{dueDiligenceData.riskComments}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Comments */}
        {dueDiligenceData.finalComments && (
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
              <p className="text-sm text-gray-700">{dueDiligenceData.finalComments}</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderBoardReviewData = () => {
    if (boardReviewLoading) {
      return <BoardReviewSkeleton />
    }

    if (boardReviewError) {
      return (
        <div className="text-center py-8">
          <Clock className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-2">Failed to load board review data</p>
          <p className="text-sm text-gray-500 mb-4">{boardReviewError}</p>
          <Button 
            onClick={fetchBoardReviewData}
            variant="outline" 
            size="sm" 
            className="rounded-full"
          >
            <Clock className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )
    }

    if (!boardReviewData) {
      return (
        <div className="text-center py-8">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No board review data available</p>
          <p className="text-sm text-gray-400 mb-4">
            Board review has not been initiated for this application yet.
          </p>
          <div className="flex gap-2 justify-center">
            {application.currentStage === "UNDER_DUE_DILIGENCE" && (
              <Button
                onClick={onInitiateBoardReview}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Initiate Board Review
              </Button>
            )}
            <Button
              onClick={fetchBoardReviewData}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <Clock className="w-4 h-4 mr-2" />
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
                  boardReviewData.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {boardReviewData.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-gray-500">Overall Score</label>
                <p className="text-sm font-medium">{boardReviewData.overallScore || 'Not scored'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Investment Decision</label>
                <Badge className={`mt-1 ${
                  boardReviewData.investmentApproved 
                    ? 'bg-green-100 text-green-800'
                    : boardReviewData.investmentRejected
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {boardReviewData.investmentApproved ? 'Approved' : 
                   boardReviewData.investmentRejected ? 'Rejected' : 
                   boardReviewData.conditionalApproval ? 'Conditional' : 'Pending'}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-gray-500">Reviewer</label>
                <p className="text-sm font-medium">
                  {boardReviewData.reviewer ? 
                    `${boardReviewData.reviewer.firstName} ${boardReviewData.reviewer.lastName}` : 
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
              {/* Recommendation Report */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Recommendation Report</h4>
                <p className="text-sm text-gray-600">{boardReviewData.recommendationReport}</p>
              </div>

              {/* Decision Reason */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Decision Reason</h4>
                <p className="text-sm text-gray-600">{boardReviewData.decisionReason}</p>
              </div>

              {/* Next Steps */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Next Steps</h4>
                <p className="text-sm text-gray-600">{boardReviewData.nextSteps}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Comments */}
        {boardReviewData.finalComments && (
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
              <p className="text-sm text-gray-700">{boardReviewData.finalComments}</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderTermSheetData = () => {
    if (termSheetLoading) {
      return <TermSheetSkeleton />
    }

    if (termSheetError) {
      return (
        <div className="text-center py-8">
          <Clock className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-2">Failed to load term sheet data</p>
          <p className="text-sm text-gray-500 mb-4">{termSheetError}</p>
          <Button 
            onClick={fetchTermSheetData}
            variant="outline" 
            size="sm" 
            className="rounded-full"
          >
            <Clock className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )
    }

    if (!termSheetData) {
      return (
        <div className="text-center py-8">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No term sheet data available</p>
          <p className="text-sm text-gray-400 mb-4">
            Term sheet has not been created for this application yet.
          </p>
          <div className="flex gap-2 justify-center">
            {application.currentStage === "UNDER_BOARD_REVIEW" && (
              <Button
                onClick={onCreateTermSheet}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Term Sheet
              </Button>
            )}
            <Button
              onClick={fetchTermSheetData}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <Clock className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Term Sheet Overview */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo-500" />
              </div>
              Term Sheet Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Title</label>
                <p className="text-sm font-medium">{termSheetData.title}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Version</label>
                <p className="text-sm font-medium">{termSheetData.version}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <Badge className={`mt-1 ${
                  termSheetData.status === 'SIGNED' 
                    ? 'bg-green-100 text-green-800' 
                    : termSheetData.status === 'FINAL'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {termSheetData.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-gray-500">Created By</label>
                <p className="text-sm font-medium">
                  {termSheetData.createdBy ? 
                    `${termSheetData.createdBy.firstName} ${termSheetData.createdBy.lastName}` : 
                    'Not assigned'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Terms */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-500" />
              </div>
              Investment Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Investment Amount</label>
                <p className="text-lg font-normal text-blue-600">${Number(termSheetData.investmentAmount).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Equity Percentage</label>
                <p className="text-lg font-normal text-green-600">{termSheetData.equityPercentage}%</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Valuation</label>
                <p className="text-lg font-normal text-purple-600">${Number(termSheetData.valuation).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Timeline</label>
                <p className="text-sm font-medium">{termSheetData.timeline}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Terms */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                <FileText className="w-4 h-4 text-amber-500" />
              </div>
              Key Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Key Terms</h4>
                <p className="text-sm text-gray-600">{termSheetData.keyTerms}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Conditions</h4>
                <p className="text-sm text-gray-600">{termSheetData.conditions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document */}
        {termSheetData.documentUrl && (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-normal flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-500" />
                </div>
                Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{termSheetData.documentFileName}</p>
                  <p className="text-sm text-gray-500">
                    {(termSheetData.documentSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  onClick={() => window.open(termSheetData.documentUrl, '_blank')}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderApplicationData = () => {
    return (
      <div className="space-y-6">
        {/* Applicant Information */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <CiUser className="w-5 h-5 text-blue-500" />
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="text-sm font-medium">{application.applicantName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-sm font-medium">{application.applicantEmail}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="text-sm font-medium">{application.applicantPhone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Address</label>
                <p className="text-sm font-medium">{application.applicantAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-500" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Business Name</label>
                <p className="text-sm font-medium">{application.businessName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Industry</label>
                <p className="text-sm font-medium">{application.industry}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Business Stage</label>
                <p className="text-sm font-medium">{application.businessStage}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Founding Date</label>
                <p className="text-sm font-medium">
                  {new Date(application.foundingDate).toLocaleDateString()}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-500">Business Description</label>
                <p className="text-sm font-medium">{application.businessDescription}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <CiDollar className="w-5 h-5 text-purple-500" />
              Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-gray-500">Requested Amount</label>
                <p className="text-xl font-normal text-purple-600">
                  ${Number(application.requestedAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <CiFileOn className="w-5 h-5 text-amber-500" />
              Submitted Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {application.documents?.map((doc) => (
                <div key={doc.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{doc.documentType.replaceAll('_', ' ')}</p>
                    <p className="text-xs text-gray-600">{doc.fileName}</p>
                  </div>
                  <Badge variant={doc.isRequired ? 'destructive' : 'secondary'} className="text-xs">
                    {doc.isRequired ? 'Required' : 'Optional'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-normal text-gray-900 mb-2">Application Timeline</h2>
        <p className="text-sm text-gray-600">Track the progress of this investment application</p>
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        {stages.map((stage, index) => {
          const status = getStageStatus(index)
          const isCompleted = status === "completed"
          const isCurrent = status === "current"
          const isUpcoming = status === "upcoming"
          const Icon = stage.icon

          return (
            <div key={stage.id} className="relative flex items-start">
              {/* Timeline Line */}
              {index < stages.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200" />
              )}

              {/* Timeline Icon */}
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

              {/* Stage Content */}
              <div className="ml-6 flex-1 pb-8">
                <Card className={`transition-all duration-300 ${
                  isCurrent 
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
                        <CardTitle className={`text-base font-normal ${
                          isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
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
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Application Data Accordion - Only for Application Review stage */}
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
                              {renderApplicationData()}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      {/* Stage-specific data accordions */}
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
                                {renderDueDiligenceData()}
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
                                {renderBoardReviewData()}
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
                                {renderTermSheetData()}
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
                                <div className="text-center py-8">
                                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-500">Fund disbursement data will be loaded from API</p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}
                        </Accordion>
                      )}

                      {/* Stage Actions */}
                      <div className="pt-4 border-t border-gray-200">
                        {!isUpcoming && getStageActions(stage.id)}
                        {isUpcoming && (
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
