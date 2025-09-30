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
    } catch (e: any) {
      setError(e?.message || "Failed to load applications")
    } finally {
      setLoading(false)
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
          <div className="relative">
            <CiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search applications..." className="pl-9 w-64" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
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
              <SelectItem value="INITIAL_SCREENING">Initial Screening</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="DUE_DILIGENCE_COMPLETED">Due Diligence Completed</SelectItem>
              <SelectItem value="BOARD_APPROVED">Board Approved</SelectItem>
              <SelectItem value="INVESTMENT_IMPLEMENTATION">Investment Implementation</SelectItem>
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
      ) : (
        <div className="space-y-4">
          {paginated.map((app) => (
            <Card key={app.id} className="bg-white border border-gray-200 rounded-2xl shadow-none hover:shadow-lg transition-shadow duration-200">
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
                      onClick={() => openDrawer(app)}
                      title="View Details"
                    >
                      <CiViewList className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiFileOn className="w-4 h-4" />
                      <span>Company</span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2">{app.businessDescription}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiUser className="w-4 h-4" />
                      <span>Applicant</span>
                    </div>
                    <p className="text-sm font-medium">{app.applicantName}</p>
                    <p className="text-xs text-gray-600">{app.applicantEmail}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiDollar className="w-4 h-4" />
                      <span>Requested</span>
                    </div>
                    <p className="text-sm font-medium">
                      ${Number(app.requestedAmount || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CiCalendar className="w-4 h-4" />
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
        <SheetContent className="w-[35vw] min-w-[800px] max-w-[1200px] overflow-y-auto p-5">
          <SheetHeader>
            <SheetTitle className="text-2xl font-normal flex items-center gap-2">
              <CiFileOn className="w-6 h-6" /> {selected?.businessName}
            </SheetTitle>
          </SheetHeader>

          {selected && (
            <div className="mt-6 space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-normal text-gray-900 mb-4">Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Applicant</label>
                    <p className="text-sm font-medium">{selected.applicantName}</p>
                    <p className="text-xs text-gray-600">{selected.applicantEmail}</p>
                    <p className="text-xs text-gray-600">{selected.applicantPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Company</label>
                    <p className="text-sm font-medium">{selected.businessName}</p>
                    <p className="text-xs text-gray-600">{selected.industry} • {selected.businessStage}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Requested Amount</label>
                    <p className="text-sm font-medium">${Number(selected.requestedAmount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Current Stage</label>
                    <div className="mt-1"><Badge className={stageColor(selected.currentStage)}>{selected.currentStage.replaceAll('_', ' ')}</Badge></div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-normal text-gray-900 mb-4">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selected.documents?.map((d) => (
                    <div key={d.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{humanizeDocType(d.documentType)}</p>
                        <p className="text-xs text-gray-600">{d.fileName}</p>
                      </div>
                      <Badge variant={d.isRequired ? 'destructive' : 'secondary'} className="text-xs">{d.isRequired ? 'Required' : 'Optional'}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-normal text-gray-900 mb-4">Timestamps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>Submitted: {selected.submittedAt ? new Date(selected.submittedAt).toLocaleString() : 'N/A'}</div>
                  <div>Updated: {new Date(selected.updatedAt).toLocaleString()}</div>
                  <div>Created: {new Date(selected.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}


