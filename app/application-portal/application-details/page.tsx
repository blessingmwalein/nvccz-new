"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchApplication, fetchTimeline } from "@/lib/store/slices/applicationPortalSlice"
import { ApplicationPortalLayout } from "@/components/layout/application-portal-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    Clock,
    CheckCircle,
    History,
    GitBranch,
    FileText,
    User,
    Building2,
    DollarSign,
    Eye,
    Users,
    TrendingUp
} from "lucide-react"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"

// Custom Skeleton Loader Component
const ApplicationDetailsSkeleton = () => {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-gray-200 rounded"></div>
                    <div className="h-4 w-96 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
            </div>

            {/* Tabs Skeleton */}
            <div className="space-y-4">
                <div className="flex gap-2 max-w-md">
                    <div className="h-10 flex-1 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 flex-1 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Content Card */}
                <div className="border rounded-lg">
                    {/* Card Header */}
                    <div className="p-6 border-b">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-gray-200 rounded"></div>
                            <div className="h-6 w-48 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* Card Content - Timeline Items */}
                    <div className="p-6 space-y-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex items-start gap-4">
                                {/* Timeline Icon */}
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>

                                {/* Timeline Content */}
                                <div className="flex-1 space-y-3">
                                    <div className="border rounded-lg p-6 space-y-4">
                                        {/* Title and Badge */}
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <div className="h-5 w-48 bg-gray-200 rounded"></div>
                                                <div className="h-4 w-64 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                                        </div>

                                        {/* Accordion Trigger */}
                                        <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ApplicationDetailsPage() {
    const dispatch = useAppDispatch()
    const { application, applicationLoading, timeline, timelineLoading } = useAppSelector(
        (state) => state.applicationPortal
    )
    const [activeTab, setActiveTab] = useState("progress")

    useEffect(() => {
        dispatch(fetchApplication())
        dispatch(fetchTimeline())
    }, [dispatch])

    const getStageProgress = (stage: string) => {
        const stageOrder = [
            'SUBMITTED', 'INITIAL_SCREENING', 'SHORTLISTED',
            'UNDER_DUE_DILIGENCE', 'DUE_DILIGENCE_COMPLETED',
            'UNDER_BOARD_REVIEW', 'BOARD_APPROVED',
            'TERM_SHEET', 'TERM_SHEET_SIGNED',
            'INVESTMENT_IMPLEMENTATION', 'FUND_DISBURSED'
        ]
        const currentIndex = stageOrder.indexOf(stage)
        if (currentIndex === -1) return 0
        return Math.round((currentIndex / (stageOrder.length - 1)) * 100)
    }

    const getStageColor = (stage: string) => {
        if (stage.includes('FUND_DISBURSED')) return 'bg-green-100 text-green-800'
        if (stage.includes('BOARD')) return 'bg-purple-100 text-purple-800'
        if (stage.includes('DILIGENCE')) return 'bg-blue-100 text-blue-800'
        if (stage.includes('SCREEN')) return 'bg-amber-100 text-amber-800'
        if (stage.includes('SHORTLIST')) return 'bg-cyan-100 text-cyan-800'
        if (stage.includes('TERM_SHEET')) return 'bg-indigo-100 text-indigo-800'
        return 'bg-gray-100 text-gray-800'
    }

    const getStageIcon = (stage: string) => {
        const stages = [
            'SUBMITTED', 'INITIAL_SCREENING', 'SHORTLISTED',
            'UNDER_DUE_DILIGENCE', 'DUE_DILIGENCE_COMPLETED',
            'UNDER_BOARD_REVIEW', 'BOARD_APPROVED',
            'TERM_SHEET', 'TERM_SHEET_SIGNED',
            'INVESTMENT_IMPLEMENTATION', 'FUND_DISBURSED'
        ]
        const currentIndex = stages.indexOf(stage)
        return currentIndex
    }

    const renderStageDetails = (stageId: string, index: number, currentStageIndex: number) => {
        const isCompleted = index < currentStageIndex
        const isCurrent = index === currentStageIndex

        // Only show details for completed or current stages
        if (index > currentStageIndex) return null

        switch (stageId) {
            case 'SUBMITTED':
                return (
                    <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="submitted-details" className="border-none">
                            <AccordionTrigger className="hover:no-underline py-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="w-4 h-4" />
                                    View Application Details
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4 pt-2">
                                    {/* Applicant Information */}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <User className="w-4 h-4 text-blue-600" />
                                            <h4 className="font-medium text-sm">Applicant Information</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <label className="text-gray-500">Name</label>
                                                <p className="font-medium">{application?.applicantName}</p>
                                            </div>
                                            <div>
                                                <label className="text-gray-500">Email</label>
                                                <p className="font-medium">{application?.applicantEmail}</p>
                                            </div>
                                            <div>
                                                <label className="text-gray-500">Phone</label>
                                                <p className="font-medium">{application?.applicantPhone}</p>
                                            </div>
                                            <div>
                                                <label className="text-gray-500">Address</label>
                                                <p className="font-medium">{application?.applicantAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Business Information */}
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Building2 className="w-4 h-4 text-green-600" />
                                            <h4 className="font-medium text-sm">Business Information</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <label className="text-gray-500">Business Name</label>
                                                <p className="font-medium">{application?.businessName}</p>
                                            </div>
                                            <div>
                                                <label className="text-gray-500">Industry</label>
                                                <p className="font-medium">{application?.industry}</p>
                                            </div>
                                            <div>
                                                <label className="text-gray-500">Stage</label>
                                                <p className="font-medium">{application?.businessStage}</p>
                                            </div>
                                            <div>
                                                <label className="text-gray-500">Founded</label>
                                                <p className="font-medium">
                                                    {application?.foundingDate && new Date(application.foundingDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-gray-500">Description</label>
                                                <p className="font-medium">{application?.businessDescription}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Information */}
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <DollarSign className="w-4 h-4 text-purple-600" />
                                            <h4 className="font-medium text-sm">Requested Amount</h4>
                                        </div>
                                        <p className="text-2xl font-bold text-purple-600">
                                            ${Number(application?.requestedAmount || 0).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Documents */}
                                    <div className="bg-amber-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <FileText className="w-4 h-4 text-amber-600" />
                                            <h4 className="font-medium text-sm">Submitted Documents</h4>
                                        </div>
                                        <div className="space-y-2">
                                            {application?.documents?.map((doc) => (
                                                <div key={doc.id} className="flex items-center justify-between bg-white p-2 rounded">
                                                    <div>
                                                        <p className="text-sm font-medium">{doc.documentType.replaceAll('_', ' ')}</p>
                                                        <p className="text-xs text-gray-500">{doc.fileName}</p>
                                                    </div>
                                                    <Badge variant={doc.isRequired ? 'default' : 'secondary'} className="text-xs">
                                                        {doc.isRequired ? 'Required' : 'Optional'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )

            case 'UNDER_DUE_DILIGENCE':
            case 'DUE_DILIGENCE_COMPLETED':
                return (
                    <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="due-diligence-details" className="border-none">
                            <AccordionTrigger className="hover:no-underline py-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Eye className="w-4 h-4" />
                                    View Due Diligence Review
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {application?.dueDiligenceReview ? (
                                    <div className="space-y-4 pt-2">
                                        {/* Status Overview */}
                                        <div className="bg-amber-50 rounded-lg p-4">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <label className="text-gray-500">Status</label>
                                                    <Badge className={`mt-1 ${application.dueDiligenceReview.status === 'COMPLETED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-amber-100 text-amber-800'
                                                        }`}>
                                                        {application.dueDiligenceReview.status}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <label className="text-gray-500">Overall Score</label>
                                                    <p className="text-lg font-bold text-amber-600">
                                                        {application.dueDiligenceReview.overallScore}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-gray-500">Recommendation</label>
                                                    <Badge className={`mt-1 ${application.dueDiligenceReview.recommendation === 'APPROVE'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {application.dueDiligenceReview.recommendation}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <label className="text-gray-500">Reviewer</label>
                                                    <p className="font-medium">
                                                        {application.dueDiligenceReview.reviewer.firstName} {application.dueDiligenceReview.reviewer.lastName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assessment Areas */}
                                        <div className="space-y-2">
                                            {[
                                                { label: 'Market Research', viable: application.dueDiligenceReview.marketResearchViable, comments: application.dueDiligenceReview.marketResearchComments },
                                                { label: 'Financial Viability', viable: application.dueDiligenceReview.financialViable, comments: application.dueDiligenceReview.financialComments },
                                                { label: 'Competitive Opportunities', viable: application.dueDiligenceReview.competitiveOpportunities, comments: application.dueDiligenceReview.competitiveComments },
                                                { label: 'Management Team', viable: application.dueDiligenceReview.managementTeamQualified, comments: application.dueDiligenceReview.managementComments },
                                                { label: 'Legal Compliance', viable: application.dueDiligenceReview.legalCompliant, comments: application.dueDiligenceReview.legalComments },
                                                { label: 'Risk Assessment', viable: application.dueDiligenceReview.riskTolerable, comments: application.dueDiligenceReview.riskComments }
                                            ].map((item, idx) => (
                                                <div key={idx} className="bg-white border rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium">{item.label}</span>
                                                        <Badge className={item.viable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                            {item.viable ? 'Pass' : 'Fail'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-600">{item.comments}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Final Comments */}
                                        {application.dueDiligenceReview.finalComments && (
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <label className="text-sm font-medium text-gray-700">Final Comments</label>
                                                <p className="text-sm mt-1">{application.dueDiligenceReview.finalComments}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-sm text-gray-500">
                                        Due diligence review not yet started
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )

            case 'UNDER_BOARD_REVIEW':
            case 'BOARD_APPROVED':
                return (
                    <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="board-review-details" className="border-none">
                            <AccordionTrigger className="hover:no-underline py-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Users className="w-4 h-4" />
                                    View Board Review
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {application?.boardReview ? (
                                    <div className="space-y-4 pt-2">
                                        {/* Status Overview */}
                                        <div className="bg-purple-50 rounded-lg p-4">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <label className="text-gray-500">Status</label>
                                                    <Badge className={`mt-1 ${application.boardReview.status === 'COMPLETED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {application.boardReview.status}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <label className="text-gray-500">Overall Score</label>
                                                    <p className="text-lg font-bold text-purple-600">
                                                        {application.boardReview.overallScore}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-gray-500">Decision</label>
                                                    <Badge className={`mt-1 ${application.boardReview.investmentApproved
                                                            ? 'bg-green-100 text-green-800'
                                                            : application.boardReview.investmentRejected
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {application.boardReview.investmentApproved ? 'Approved' :
                                                            application.boardReview.investmentRejected ? 'Rejected' :
                                                                application.boardReview.conditionalApproval ? 'Conditional' : 'Pending'}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <label className="text-gray-500">Reviewer</label>
                                                    <p className="font-medium">
                                                        {application.boardReview.reviewer.firstName} {application.boardReview.reviewer.lastName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review Details */}
                                        <div className="space-y-3">
                                            <div className="bg-white border rounded-lg p-3">
                                                <label className="text-sm font-medium text-gray-700">Recommendation Report</label>
                                                <p className="text-sm mt-1">{application.boardReview.recommendationReport}</p>
                                            </div>

                                            <div className="bg-white border rounded-lg p-3">
                                                <label className="text-sm font-medium text-gray-700">Decision Reason</label>
                                                <p className="text-sm mt-1">{application.boardReview.decisionReason}</p>
                                            </div>

                                            <div className="bg-white border rounded-lg p-3">
                                                <label className="text-sm font-medium text-gray-700">Next Steps</label>
                                                <p className="text-sm mt-1">{application.boardReview.nextSteps}</p>
                                            </div>

                                            {application.boardReview.finalComments && (
                                                <div className="bg-blue-50 rounded-lg p-3">
                                                    <label className="text-sm font-medium text-gray-700">Final Comments</label>
                                                    <p className="text-sm mt-1">{application.boardReview.finalComments}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-sm text-gray-500">
                                        Board review not yet started
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )

            case 'TERM_SHEET':
            case 'TERM_SHEET_SIGNED':
                return (
                    <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="term-sheet-details" className="border-none">
                            <AccordionTrigger className="hover:no-underline py-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="w-4 h-4" />
                                    View Term Sheet
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {application?.termSheet ? (
                                    <div className="space-y-4 pt-2">
                                        {/* Term Sheet Overview */}
                                        <div className="bg-indigo-50 rounded-lg p-4">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <label className="text-gray-500">Status</label>
                                                    <Badge className={`mt-1 ${application.termSheet.status === 'SIGNED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-indigo-100 text-indigo-800'
                                                        }`}>
                                                        {application.termSheet.status}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <label className="text-gray-500">Version</label>
                                                    <p className="font-medium">{application.termSheet.version}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Investment Terms */}
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <h4 className="font-medium text-sm mb-3">Investment Terms</h4>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <label className="text-gray-500">Investment Amount</label>
                                                    <p className="text-lg font-bold text-green-600">
                                                        ${Number(application.termSheet.investmentAmount).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-gray-500">Equity</label>
                                                    <p className="text-lg font-bold text-blue-600">
                                                        {application.termSheet.equityPercentage}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-sm text-gray-500">
                                        Term sheet not yet created
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )

            default:
                return null
        }
    }

    const renderProgressTimeline = () => {
        const stages = [
            { id: 'SUBMITTED', title: 'Submitted', description: 'Application received' },
            { id: 'INITIAL_SCREENING', title: 'Initial Screening', description: 'Application under review' },
            { id: 'SHORTLISTED', title: 'Shortlisted', description: 'Selected for due diligence' },
            { id: 'UNDER_DUE_DILIGENCE', title: 'Due Diligence', description: 'Comprehensive analysis in progress' },
            { id: 'DUE_DILIGENCE_COMPLETED', title: 'Due Diligence Complete', description: 'Analysis completed' },
            { id: 'UNDER_BOARD_REVIEW', title: 'Board Review', description: 'Under board evaluation' },
            { id: 'BOARD_APPROVED', title: 'Board Approved', description: 'Investment approved by board' },
            { id: 'TERM_SHEET', title: 'Term Sheet', description: 'Investment terms being finalized' },
            { id: 'TERM_SHEET_SIGNED', title: 'Term Sheet Signed', description: 'Terms agreed and signed' },
            { id: 'INVESTMENT_IMPLEMENTATION', title: 'Implementation', description: 'Investment being processed' },
            { id: 'FUND_DISBURSED', title: 'Funded', description: 'Funds disbursed successfully' }
        ]

        const currentStageIndex = stages.findIndex(s => s.id === application?.currentStage)

        return (
            <div className="space-y-4">
                {stages.map((stage, index) => {
                    const isCompleted = index < currentStageIndex
                    const isCurrent = index === currentStageIndex
                    const isUpcoming = index > currentStageIndex

                    return (
                        <div key={stage.id} className="relative flex items-start">
                            {/* Timeline Line */}
                            {index < stages.length - 1 && (
                                <div
                                    className={`absolute left-6 top-12 w-0.5 h-full ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                        }`}
                                />
                            )}

                            {/* Timeline Icon */}
                            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-white shadow-lg">
                                {isCompleted ? (
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                ) : isCurrent ? (
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-white" />
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                                )}
                            </div>

                            {/* Stage Content */}
                            <div className="ml-6 flex-1 pb-8">
                                <Card className={`transition-all duration-300 ${isCurrent
                                        ? 'border-2 border-blue-500 shadow-lg'
                                        : isCompleted
                                            ? 'border-green-200'
                                            : 'border-gray-200 opacity-60'
                                    }`}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
                                                    }`}>
                                                    {stage.title}
                                                </h4>
                                                <p className="text-sm text-gray-500">{stage.description}</p>
                                            </div>
                                            <div>
                                                {isCompleted && (
                                                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                                                )}
                                                {isCurrent && (
                                                    <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                                                )}
                                                {isUpcoming && (
                                                    <Badge variant="secondary">Upcoming</Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stage Details */}
                                        {renderStageDetails(stage.id, index, currentStageIndex)}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    if (applicationLoading) {
        return (
            <ApplicationPortalLayout>
                <ApplicationDetailsSkeleton />
            </ApplicationPortalLayout>
        )
    }

    if (!application) {
        return (
            <ApplicationPortalLayout>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">📄</div>
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Application Found</h3>
                            <p className="text-muted-foreground">You haven't submitted an application yet.</p>
                        </div>
                    </div>
                </div>
            </ApplicationPortalLayout>
        )
    }

    return (
        <ApplicationPortalLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Application Details</h1>
                        <p className="text-muted-foreground">View your investment application status and details</p>
                    </div>
                    <Badge className={getStageColor(application.currentStage)}>
                        {application.currentStage.replaceAll('_', ' ')}
                    </Badge>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="progress" className="flex items-center gap-2">
                            <GitBranch className="w-4 h-4" />
                            Application Progress
                        </TabsTrigger>
                        <TabsTrigger value="timeline" className="flex items-center gap-2">
                            <History className="w-4 h-4" />
                            Activity Timeline
                        </TabsTrigger>
                    </TabsList>

                    {/* Application Progress Tab */}
                    <TabsContent value="progress" className="mt-6">
                        <div className="space-y-6">
                            {/* Progress Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GitBranch className="w-5 h-5" />
                                        Application Journey
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderProgressTimeline()}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Activity Timeline Tab */}
                    <TabsContent value="timeline" className="mt-6">
                        {timelineLoading ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                        <p className="mt-4 text-gray-500">Loading timeline...</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : timeline ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <History className="w-5 h-5" />
                                        Activity Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {timeline.timeline.map((event, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    {event.status === 'completed' ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <Clock className="w-5 h-5 text-amber-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-medium">{event.event}</h4>
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center py-8">
                                        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No timeline data available</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </ApplicationPortalLayout>
    )
}
