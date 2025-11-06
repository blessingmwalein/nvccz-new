"use client"

import { useEffect, useMemo, useState } from "react"
import { useAppSelector } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CiSearch, CiViewList, CiRedo, CiFileOn, CiUser, CiDollar, CiCalendar, CiCircleCheck } from "react-icons/ci"
import { Progress } from "@/components/ui/progress"
import { FileText, Users, CheckCircle, Clock, AlertCircle, Building2 } from "lucide-react"
import { ApplicationTimeline } from "./application-timeline"
import { DueDiligenceConfirmationDialog } from "./due-diligence-confirmation-dialog"
import { CompleteDueDiligenceConfirmationDialog } from "./complete-due-diligence-confirmation-dialog"
import { DueDiligenceModal } from "./due-diligence-modal"
import { BoardReviewModal } from "./board-review-modal"
import { BoardReviewConfirmationDialog } from "./board-review-confirmation-dialog"
import { CompleteBoardReviewConfirmationDialog } from "./complete-board-review-confirmation-dialog"
import { TermSheetModal } from "./term-sheet-modal"
import { TermSheetConfirmationDialog } from "./term-sheet-confirmation-dialog"
import { FinalizeTermSheetConfirmationDialog } from "./finalize-term-sheet-confirmation-dialog"
import { FundDisbursementModal } from "./fund-disbursement-modal"
import { CreateFundDisbursementModal } from "./create-fund-disbursement-modal"
import { dueDiligenceApi } from "@/lib/api/due-diligence-api"
import { boardReviewApi } from "@/lib/api/board-review-api"
import { termSheetApi } from "@/lib/api/term-sheet-api"
import { toast } from "sonner"
import { se } from "date-fns/locale"

type Application = {
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
  portfolioCompanyId: string
  fundId: string
  portfolioCompany?: {
    id: string
    name: string
    industry: string
    status: string
  }
  investmentImplementation?: {
    id: string
    portfolioCompanyId: string
  } | null
  documents: Array<{
    id: string
    documentType: string
    fileName: string
    isRequired: boolean
    isSubmitted: boolean
  }>
}

const humanizeDocType = (type: string) => {
  const map: Record<string, string> = {
    BUSINESS_PLAN: "Business Plan",
    PROOF_OF_CONCEPT: "Proof of Concept",
    MARKET_RESEARCH: "Market Research",
    PROJECTED_CASH_FLOWS: "Projected Cash Flows",
    HISTORICAL_FINANCIALS: "Historical Financials",
  }
  return map[type] || type
}

const stageColor = (stage: string) => {
  const s = stage.toUpperCase()
  if (s.includes("IMPLEMENT")) return "bg-green-100 text-green-800"
  if (s.includes("BOARD")) return "bg-purple-100 text-purple-800"
  if (s.includes("DILIGENCE")) return "bg-blue-100 text-blue-800"
  if (s.includes("SCREEN")) return "bg-amber-100 text-amber-800"
  if (s.includes("SHORTLIST")) return "bg-cyan-100 text-cyan-800"
  return "bg-gray-100 text-gray-800"
}

const getStageProgress = (stage: string) => {
  const stageOrder = [
    'SUBMITTED',
    'INITIAL_SCREENING', 
    'SHORTLISTED',
    'UNDER_DUE_DILIGENCE',
    'DUE_DILIGENCE_COMPLETED',
    'UNDER_BOARD_REVIEW',
    'BOARD_APPROVED',
    'TERM_SHEET',
    'TERM_SHEET_SIGNED',
    'INVESTMENT_IMPLEMENTATION',
    'FUND_DISBURSED'
  ]
  
  const currentIndex = stageOrder.indexOf(stage)
  if (currentIndex === -1) return 0
  return Math.round((currentIndex / (stageOrder.length - 1)) * 100)
}

const getStageIcon = (stage: string) => {
  const s = stage.toUpperCase()
  if (s.includes("IMPLEMENT") || s.includes("DISBURSED")) return <CheckCircle className="w-4 h-4" />
  if (s.includes("BOARD")) return <Users className="w-4 h-4" />
  if (s.includes("DILIGENCE")) return <FileText className="w-4 h-4" />
  if (s.includes("SCREEN")) return <AlertCircle className="w-4 h-4" />
  if (s.includes("SHORTLIST")) return <Building2 className="w-4 h-4" />
  if (s.includes("TERM_SHEET")) return <FileText className="w-4 h-4" />
  return <Clock className="w-4 h-4" />
}

export function UserApplications() {
  const token = useAppSelector((s) => s.auth.token)
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [selectedStage, setSelectedStage] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [selected, setSelected] = useState<Application | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dueDiligenceModalOpen, setDueDiligenceModalOpen] = useState(false)
  const [dueDiligenceConfirmationOpen, setDueDiligenceConfirmationOpen] = useState(false)
  const [completeDueDiligenceConfirmationOpen, setCompleteDueDiligenceConfirmationOpen] = useState(false)
  const [boardReviewModalOpen, setBoardReviewModalOpen] = useState(false)
  const [boardReviewConfirmationOpen, setBoardReviewConfirmationOpen] = useState(false)
  const [completeBoardReviewConfirmationOpen, setCompleteBoardReviewConfirmationOpen] = useState(false)
  const [termSheetModalOpen, setTermSheetModalOpen] = useState(false)
  const [initiateFundDisbursementModalOpen, setInitiateFundDisbursementModalOpen] = useState(false)
  const [createFundDisbursementModalOpen, setCreateFundDisbursementModalOpen] = useState(false)
  const [termSheetConfirmationOpen, setTermSheetConfirmationOpen] = useState(false)
  const [finalizeTermSheetConfirmationOpen, setFinalizeTermSheetConfirmationOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchApps = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("https://nvccz-pi.vercel.app/api/applications", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      const list: Application[] = json?.data?.applications || []
      setApps(list)
      return list // Return the fresh data
    } catch (e: any) {
      setError(e?.message || "Failed to load applications")
      return null
    } finally {
      setLoading(false)
    }
  }

  const refreshSelectedApplication = async () => {
    if (!selected) return
    try {
      const freshApps = await fetchApps()
      if (freshApps) {
        const updatedSelected = freshApps.find((app: Application) => app.id === selected.id)
        if (updatedSelected) {
          setSelected(updatedSelected)
        }
      }
    } catch (error) {
      console.error('Failed to refresh selected application:', error)
    }
  }

  useEffect(() => {
    fetchApps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return apps.filter((a) => {
      const matchesQuery = !q || a.businessName.toLowerCase().includes(q) || a.applicantName.toLowerCase().includes(q)
      const matchesStage = selectedStage === 'all' || a.currentStage === selectedStage
      return matchesQuery && matchesStage
    })
  }, [apps, query, selectedStage])

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginated = filtered.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [query, selectedStage])

  const openDrawer = (app: Application) => {
    setSelected(app)
    setDrawerOpen(true)
  }

  const EmptyStateWidget = ({ stage }: { stage: string }) => (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Applications Found</h3>
        <p className="text-sm text-gray-500 mb-4">
          No applications found for the <strong>{stage.replaceAll('_', ' ').toLowerCase()}</strong> stage.
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full"
            onClick={() => setSelectedStage('all')}
          >
            View All Applications
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full"
          >
            <CiViewList className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Timeline action handlers
  const handleInitiateDueDiligence = () => {
    setDueDiligenceConfirmationOpen(true)
  }

  const handleUpdateDueDiligence = () => {
    setDueDiligenceModalOpen(true)
  }

  const handleCompleteDueDiligence = () => {
    setCompleteDueDiligenceConfirmationOpen(true)
  }

  const handleInitiateBoardReview = () => {
    setBoardReviewConfirmationOpen(true)
  }

  const handleUpdateBoardReview = () => {
    setBoardReviewModalOpen(true)
  }

  const handleCompleteBoardReview = () => {
    setCompleteBoardReviewConfirmationOpen(true)
  }

  const handleCreateTermSheet = () => {
    setTermSheetModalOpen(true)
  }

  const handleUpdateTermSheet = () => {
    setTermSheetModalOpen(true)
  }

  const handleFinalizeTermSheet = () => {
    setFinalizeTermSheetConfirmationOpen(true)
  }

  const handleInitiateFundDisbursement = async () => {
    setInitiateFundDisbursementModalOpen(true)
  }

  const handleUpdateFundDisbursement = () => {
    setInitiateFundDisbursementModalOpen(true)
  }

  const handleCreateFundDisbursement = () => {
    setCreateFundDisbursementModalOpen(true)
  }

  const stages = [
    "REQUIREMENTS_FORM",
    "INITIAL_SCREENING",
    "DUE_DILIGENCE",
    "BOARD_REVIEW",
    "TERM_SHEET",
    "FUND_DISBURSEMENT",
    "INVESTMENT_IMPLEMENTATION",
  ] as const

  const humanStage = (s: string) => s.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase())

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Applications Management</h1>
          <p className="text-gray-600">Filter and review all applications</p>
        </div>
        <div className="flex items-center gap-3">
          
          <Button variant="outline" onClick={fetchApps} disabled={loading}>
            <CiRedo size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Stage</label>
          <Select value={selectedStage} onValueChange={(v) => setSelectedStage(v)}>
            <SelectTrigger className="h-10 rounded-full">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="INITIAL_SCREENING">Initial Screening</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="UNDER_DUE_DILIGENCE">Under Due Diligence</SelectItem>
              <SelectItem value="DUE_DILIGENCE_COMPLETED">Due Diligence Completed</SelectItem>
              <SelectItem value="UNDER_BOARD_REVIEW">Under Board Review</SelectItem>
              <SelectItem value="BOARD_APPROVED">Board Approved</SelectItem>
              <SelectItem value="TERM_SHEET">Term Sheet</SelectItem>
              <SelectItem value="TERM_SHEET_SIGNED">Term Sheet Signed</SelectItem>
              <SelectItem value="INVESTMENT_IMPLEMENTATION">Investment Implementation</SelectItem>
              <SelectItem value="FUND_DISBURSED">Fund Disbursed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Company Name</label>
          <Input placeholder="Search by company..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Applicant Name</label>
          <Input placeholder="Search by applicant..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{error}</div>
      )}

      {/* Applications List (no current card) */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-white border border-gray-200 rounded-2xl">
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyStateWidget stage={selectedStage} />
      ) : (
        <div className="space-y-4">
          {paginated.map((app) => (
            <Card 
              key={app.id} 
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-300 hover:scale-[1.02]"
              onClick={() => openDrawer(app)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-normal">{app.businessName}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={stageColor(app.currentStage)}>
                      {app.currentStage.replaceAll('_', ' ')}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        openDrawer(app)
                      }}
                      title="View Details"
                    >
                      <CiViewList className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Application Progress</span>
                    <span className="text-sm text-gray-500">{getStageProgress(app.currentStage)}%</span>
                  </div>
                  <Progress value={getStageProgress(app.currentStage)} className="h-2" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <CiFileOn className="w-3 h-3 text-blue-600" />
                      </div>
                      <span>Company</span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2">{app.businessDescription}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CiUser className="w-3 h-3 text-green-600" />
                      </div>
                      <span>Applicant</span>
                    </div>
                    <p className="text-sm font-medium">{app.applicantName}</p>
                    <p className="text-xs text-gray-600">{app.applicantEmail}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                        <CiDollar className="w-3 h-3 text-yellow-600" />
                      </div>
                      <span>Requested</span>
                    </div>
                    <p className="text-sm font-medium">
                      ${Number(app.requestedAmount || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                        <CiCalendar className="w-3 h-3 text-purple-600" />
                      </div>
                      <span>Updated</span>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(app.updatedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} applications</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Prev</Button>
            <div className="text-sm">Page {currentPage} of {totalPages}</div>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
      )}

      {/* Previous Applications section removed (we now list all with filters) */}

      {/* Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[50vw] min-w-[1000px] max-w-[1600px] overflow-y-auto p-5 [&>button[aria-label='Close']]:hidden">
          <SheetHeader>
            <SheetTitle className="text-2xl font-normal flex items-center gap-2">
              <CiFileOn className="w-6 h-6" /> {selected?.businessName}
            </SheetTitle>
          </SheetHeader>

          {selected && (
            <ApplicationTimeline
              application={selected}
              onInitiateDueDiligence={handleInitiateDueDiligence}
              onUpdateDueDiligence={handleUpdateDueDiligence}
              onCompleteDueDiligence={handleCompleteDueDiligence}
              onInitiateBoardReview={handleInitiateBoardReview}
              onUpdateBoardReview={handleUpdateBoardReview}
              onCompleteBoardReview={handleCompleteBoardReview}
              onCreateTermSheet={handleCreateTermSheet}
              onUpdateTermSheet={handleUpdateTermSheet}
              onFinalizeTermSheet={handleFinalizeTermSheet}
              onInitiateFundDisbursement={handleInitiateFundDisbursement}
              onCreateFundDisbursement={handleCreateFundDisbursement}
              refreshTrigger={refreshTrigger}
              onClose={() => {
                //remove setSelectedApplication
                setSelected(null)
                setDrawerOpen(false)
              }}

            />
          )}
        </SheetContent>
      </Sheet>

      {/* Modals */}
      <DueDiligenceModal
        isOpen={dueDiligenceModalOpen}
        onClose={() => setDueDiligenceModalOpen(false)}
        applicationId={selected?.id || ''}
        onSuccess={async () => {
          setDueDiligenceModalOpen(false)
          await refreshSelectedApplication() // Refresh the selected application data
          setRefreshTrigger(prev => prev + 1) // Trigger drawer refresh
        }}
      />

      <BoardReviewModal
        isOpen={boardReviewModalOpen}
        onClose={() => setBoardReviewModalOpen(false)}
        applicationId={selected?.id || ''}
        onSuccess={async () => {
          setBoardReviewModalOpen(false)
          await refreshSelectedApplication() // Refresh the selected application data
          setRefreshTrigger(prev => prev + 1) // Trigger drawer refresh
        }}
      />

      <TermSheetModal
        isOpen={termSheetModalOpen}
        onClose={() => setTermSheetModalOpen(false)}
        applicationId={selected?.id || ''}
        onSuccess={async () => {
          setTermSheetModalOpen(false)
          await refreshSelectedApplication() // Refresh the selected application data
          setRefreshTrigger(prev => prev + 1) // Trigger drawer refresh
        }}
      />

      {selected?.portfolioCompanyId && (
        <FundDisbursementModal
          isOpen={initiateFundDisbursementModalOpen}
          onClose={() => setInitiateFundDisbursementModalOpen(false)}
          applicationId={selected.id}
          portfolioCompanyId={selected.portfolioCompanyId}
          onSuccess={async () => {
            setInitiateFundDisbursementModalOpen(false)
            await refreshSelectedApplication() // Refresh the selected application data
            setRefreshTrigger(prev => prev + 1) // Trigger drawer refresh
          }}
        />
      )}

      {selected?.investmentImplementation && (
        <CreateFundDisbursementModal
          isOpen={createFundDisbursementModalOpen}
          onClose={() => setCreateFundDisbursementModalOpen(false)}
          investmentImplementationId={selected.investmentImplementation.id}
          companyName={selected.businessName}
          onSuccess={async () => {
            setCreateFundDisbursementModalOpen(false)
            await refreshSelectedApplication() // Refresh the selected application data
            setRefreshTrigger(prev => prev + 1) // Trigger drawer refresh
          }}
        />
      )}

      {/* Due Diligence Confirmation Dialog */}
      <DueDiligenceConfirmationDialog
        isOpen={dueDiligenceConfirmationOpen}
        onClose={() => setDueDiligenceConfirmationOpen(false)}
        applicationId={selected?.id || ''}
        applicationName={selected?.businessName || ''}
        onSuccess={() => {
          setDueDiligenceConfirmationOpen(false)
          fetchApps() // Reload application data
        }}
      />

      {/* Complete Due Diligence Confirmation Dialog */}
      <CompleteDueDiligenceConfirmationDialog
        isOpen={completeDueDiligenceConfirmationOpen}
        onClose={() => setCompleteDueDiligenceConfirmationOpen(false)}
        applicationId={selected?.id || ''}
        applicationName={selected?.businessName || ''}
        onSuccess={async () => {
          setCompleteDueDiligenceConfirmationOpen(false)
          await refreshSelectedApplication() // Refresh the selected application data
          setRefreshTrigger(prev => prev + 1) // Trigger drawer refresh
        }}
      />

      {/* Board Review Confirmation Dialog */}
      <BoardReviewConfirmationDialog
        isOpen={boardReviewConfirmationOpen}
        onClose={() => setBoardReviewConfirmationOpen(false)}
        applicationId={selected?.id || ''}
        applicationName={selected?.businessName || ''}
        onSuccess={async () => {
          setBoardReviewConfirmationOpen(false)
          await refreshSelectedApplication() // Refresh the selected application data
          setRefreshTrigger(prev => prev + 1) // Trigger drawer refresh
        }}
      />

      {/* Complete Board Review Confirmation Dialog */}
      <CompleteBoardReviewConfirmationDialog
        isOpen={completeBoardReviewConfirmationOpen}
        onClose={() => setCompleteBoardReviewConfirmationOpen(false)}
        applicationId={selected?.id || ''}
        applicationName={selected?.businessName || ''}
        onSuccess={async () => {
          setCompleteBoardReviewConfirmationOpen(false)
          await refreshSelectedApplication() // Refresh the selected application data
          setRefreshTrigger(prev => prev + 1) // Trigger drawer refresh
        }}
      />

      {/* Term Sheet Confirmation Dialog */}
      <TermSheetConfirmationDialog
        isOpen={termSheetConfirmationOpen}
        onClose={() => setTermSheetConfirmationOpen(false)}
        applicationId={selected?.id || ''}
        applicationName={selected?.businessName || ''}
        onSuccess={async () => {
          setTermSheetConfirmationOpen(false)
          await refreshSelectedApplication() // Refresh the selected application data
          setRefreshTrigger(prev => prev + 1) // Trigger drawer refresh
        }}
      />

      {/* Finalize Term Sheet Confirmation Dialog */}
      <FinalizeTermSheetConfirmationDialog
        isOpen={finalizeTermSheetConfirmationOpen}
        onClose={() => setFinalizeTermSheetConfirmationOpen(false)}
        applicationId={selected?.id || ''}
        applicationName={selected?.businessName || ''}
        onSuccess={async () => {
          setFinalizeTermSheetConfirmationOpen(false)
          await refreshSelectedApplication() // Refresh the selected application data
          setRefreshTrigger(prev => prev + 1) // Trigger drawer refresh
        }}
      />

     
    </div>
  )
}


