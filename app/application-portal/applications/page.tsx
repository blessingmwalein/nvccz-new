"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchApplication, fetchTimeline } from "@/lib/store/slices/applicationPortalSlice"
import { ApplicationPortalLayout } from "@/components/layout/application-portal-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  CiFileOn, 
  CiUser, 
  CiDollar, 
  CiCalendar,
  CiCircleCheck,
  CiShop,
  CiViewTimeline
} from "react-icons/ci"
import { Building2, FileText, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"

export default function ApplicationDetailsPage() {
  const dispatch = useAppDispatch()
  const { application, applicationLoading, timeline, timelineLoading } = useAppSelector(
    (state) => state.applicationPortal
  )

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

  if (applicationLoading) {
    return (
      <ApplicationPortalLayout>
        <DashboardSkeleton />
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

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Application Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {getStageProgress(application.currentStage)}%
                </span>
              </div>
              <Progress value={getStageProgress(application.currentStage)} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Application Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CiUser className="w-5 h-5" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <p className="font-medium">{application.applicantName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium">{application.applicantEmail}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="font-medium">{application.applicantPhone}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Address</label>
                <p className="font-medium">{application.applicantAddress}</p>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Business Name</label>
                <p className="font-medium">{application.businessName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Industry</label>
                <p className="font-medium">{application.industry}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Business Stage</label>
                <p className="font-medium">{application.businessStage}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Founding Date</label>
                <p className="font-medium">
                  {new Date(application.foundingDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CiFileOn className="w-5 h-5" />
              Business Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{application.businessDescription}</p>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CiDollar className="w-5 h-5" />
              Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-muted-foreground">Requested Amount</label>
                <p className="text-2xl font-bold text-primary">
                  ${Number(application.requestedAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Submitted Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {application.documents?.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {doc.documentType.replaceAll('_', ' ')}
                    </p>
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

        {/* Timeline */}
        {timeline && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CiViewTimeline className="w-5 h-5" />
                Application Timeline
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
        )}

        {/* Reviews */}
        <Accordion type="single" collapsible className="w-full">
          {application.dueDiligenceReview && (
            <AccordionItem value="due-diligence">
              <AccordionTrigger>Due Diligence Review</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Status</label>
                        <Badge className="mt-1">
                          {application.dueDiligenceReview.status}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Overall Score</label>
                        <p className="font-medium">{application.dueDiligenceReview.overallScore}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Recommendation</label>
                        <Badge variant={
                          application.dueDiligenceReview.recommendation === 'APPROVE' 
                            ? 'default' 
                            : 'destructive'
                        }>
                          {application.dueDiligenceReview.recommendation}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Reviewer</label>
                        <p className="font-medium">
                          {application.dueDiligenceReview.reviewer.firstName}{' '}
                          {application.dueDiligenceReview.reviewer.lastName}
                        </p>
                      </div>
                    </div>
                    {application.dueDiligenceReview.finalComments && (
                      <div>
                        <label className="text-sm text-muted-foreground">Final Comments</label>
                        <p className="mt-1">{application.dueDiligenceReview.finalComments}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          )}

          {application.boardReview && (
            <AccordionItem value="board-review">
              <AccordionTrigger>Board Review</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Status</label>
                        <Badge className="mt-1">{application.boardReview.status}</Badge>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Overall Score</label>
                        <p className="font-medium">{application.boardReview.overallScore}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Decision</label>
                        <Badge variant={
                          application.boardReview.investmentApproved 
                            ? 'default' 
                            : 'destructive'
                        }>
                          {application.boardReview.investmentApproved 
                            ? 'Approved' 
                            : application.boardReview.investmentRejected 
                            ? 'Rejected' 
                            : 'Pending'}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Reviewer</label>
                        <p className="font-medium">
                          {application.boardReview.reviewer.firstName}{' '}
                          {application.boardReview.reviewer.lastName}
                        </p>
                      </div>
                    </div>
                    {application.boardReview.decisionReason && (
                      <div>
                        <label className="text-sm text-muted-foreground">Decision Reason</label>
                        <p className="mt-1">{application.boardReview.decisionReason}</p>
                      </div>
                    )}
                    {application.boardReview.nextSteps && (
                      <div>
                        <label className="text-sm text-muted-foreground">Next Steps</label>
                        <p className="mt-1">{application.boardReview.nextSteps}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </ApplicationPortalLayout>
  )
}
