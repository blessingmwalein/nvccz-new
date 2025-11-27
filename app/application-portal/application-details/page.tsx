"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchApplication, fetchTimeline, signTermSheet } from "@/lib/store/slices/applicationPortalSlice"
import { ApplicationPortalLayout } from "@/components/layout/application-portal-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentPreviewModal } from "@/components/applications/document-preview-modal"
// import { ApplicationProgressTimeline } from "@/components/applicant-timeline/application-progress-timeline"
// import { getStageColor } from "@/components/applicant-timeline/stage-config"
import { Clock, CheckCircle, History, GitBranch } from "lucide-react"
import { ApplicationProgressTimeline } from "@/components/application-portal/applicant-timeline/application-progress-timeline"
import { getStageColor } from "@/components/application-portal/applicant-timeline/stage-config"
import { TermSheet } from "@/lib/api/application-portal-api"
import { SignTermSheetModal } from "@/components/applications/SignTermSheetModal"
import { toast } from "sonner"

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
                    <div className="p-6 border-b">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-gray-200 rounded"></div>
                            <div className="h-6 w-48 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="border rounded-lg p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <div className="h-5 w-48 bg-gray-200 rounded"></div>
                                                <div className="h-4 w-64 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                                        </div>
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
        (state) => state.applicationPortal,
    )
    const [activeTab, setActiveTab] = useState("progress")
    const [isDocPreviewOpen, setIsDocPreviewOpen] = useState(false)
    const [selectedDocIndex, setSelectedDocIndex] = useState(0)

    const [showSignDialog, setShowSignDialog] = useState(false)
    const [termSheetToSign, setTermSheetToSign] = useState<TermSheet | null>(null)

    const [signError, setSignError] = useState<string | null>(null)

    const [signing, setSigning] = useState(false)




    useEffect(() => {
        dispatch(fetchApplication())
        dispatch(fetchTimeline())
    }, [dispatch])

    const handlePreviewDocument = (index: number) => {
        setSelectedDocIndex(index)
        setIsDocPreviewOpen(true)
    }

    const handleSignTermSheet = (termSheet:TermSheet)  => {
        setTermSheetToSign(termSheet)
        setShowSignDialog(true)
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
                        {application.currentStage.replaceAll("_", " ")}
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

                    {/* Application Progress Tab - Using new refactored component */}
                    <TabsContent value="progress" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GitBranch className="w-5 h-5" />
                                    Application Journey
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ApplicationProgressTimeline
                                    application={application}
                                    onPreviewDocument={handlePreviewDocument}
                                    onSignTermsheet={handleSignTermSheet}
                                />
                            </CardContent>
                        </Card>
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
                                                    {event.status === "completed" ? (
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

            {/* Document Preview Modal */}
            {application?.documents && (
                <DocumentPreviewModal
                    isOpen={isDocPreviewOpen}
                    onClose={() => setIsDocPreviewOpen(false)}
                    documents={application.documents}
                    initialDocumentIndex={selectedDocIndex}
                />
            )}

            {termSheetToSign && (
                <SignTermSheetModal
                    open={showSignDialog}
                    onOpenChange={setShowSignDialog}
                    loading={signing}
                    onSubmit={async (signature) => {
                        
                        setSigning(true)
                        setSignError(null)
                        try {
                            await dispatch(signTermSheet({ termSheetId: application.id, signature })).unwrap();
                            toast.success('Term sheet signed successfully');
                            // Optionally refresh application data
                            dispatch(fetchApplication());
                        } catch (err: any) {
                            console.log(err);
                            setSignError(err || "Failed to sign term sheet")
                            toast.error(err || "Failed to sign term sheet");
                        }
                        setSigning(false)
                    }}
                />
            )}
        </ApplicationPortalLayout>
    )
}
