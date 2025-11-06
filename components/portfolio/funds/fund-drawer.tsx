"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Fund } from "@/lib/api/funds-api"
import { Wallet, Calendar, DollarSign, X, Tag, FileText, TrendingUp, CheckCircle2, Clock, Building2, Receipt } from "lucide-react"
import { useState } from "react"

interface FundDrawerProps {
  isOpen: boolean
  onClose: () => void
  fund: Fund | null
}

export function FundDrawer({ isOpen, onClose, fund }: FundDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'disbursements'>('overview')

  const formatDate = (iso: string | null) => {
    if (!iso) return '-'
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return iso
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISBURSED': return 'bg-green-100 text-green-700'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'
      case 'APPROVED': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const totalDisbursed = (fund?.fundDisbursements || [])
    .filter(d => d.status === 'DISBURSED')
    .reduce((sum, d) => sum + Number(d.amount), 0)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-5 [&>button[aria-label='Close']]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <SheetTitle className="text-xl font-normal">Fund Details</SheetTitle>
                <SheetDescription>{fund?.name}</SheetDescription>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={onClose} className="rounded-full h-10 w-10">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <div className="mt-6 flex gap-6 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'overview' 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Overview
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('disbursements')}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'disbursements' 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Disbursements ({fund?.fundDisbursements?.length || 0})
            {activeTab === 'disbursements' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-normal flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Name</div>
                      <div className="font-medium">{fund?.name}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Status</div>
                      <div>
                        {fund && (
                          <Badge variant={fund.status === 'OPEN' ? 'default' : 'secondary'}>{fund.status}</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Total Amount</div>
                      <div className="font-medium">${Number(fund?.totalAmount || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Remaining</div>
                      <div className="font-medium text-blue-600">${Number(fund?.remainingAmount || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Disbursed</div>
                      <div className="font-medium text-green-600">${totalDisbursed.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Min Investment</div>
                      <div className="font-medium">${Number(fund?.minInvestment || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Max Investment</div>
                      <div className="font-medium">${Number(fund?.maxInvestment || 0).toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-normal flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    Application Window
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Start</div>
                      <div className="font-medium">{fund ? new Date(fund.applicationStart).toLocaleString() : '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">End</div>
                      <div className="font-medium">{fund ? new Date(fund.applicationEnd).toLocaleString() : '-'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-normal flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-amber-600" />
                    </div>
                    Focus Industries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(fund?.focusIndustries || []).map((i) => (
                      <Badge key={i} variant="secondary">{i}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-normal flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-emerald-600" />
                    </div>
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{fund?.description}</p>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'disbursements' && (
            <div className="space-y-4">
              {(!fund?.fundDisbursements || fund.fundDisbursements.length === 0) ? (
                <Card>
                  <CardContent className="text-center py-12 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-base">No disbursements recorded yet</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Summary Card */}
                  <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-emerald-700 mb-1">Total Disbursed</div>
                          <div className="text-3xl font-semibold text-emerald-900">
                            ${totalDisbursed.toLocaleString()}
                          </div>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                          <TrendingUp className="w-7 h-7 text-emerald-600" />
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-emerald-700">
                        {fund.fundDisbursements.filter(d => d.status === 'DISBURSED').length} of {fund.fundDisbursements.length} disbursements completed
                      </div>
                    </CardContent>
                  </Card>

                  {/* Disbursement Tiles */}
                  {fund.fundDisbursements.map((d) => (
                    <Card key={d.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              <h4 className="font-semibold text-lg text-gray-900">
                                {d.investmentImplementation?.portfolioCompany?.name || 'Unknown Company'}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {d.notes}
                            </p>
                          </div>
                          <div className="ml-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(d.status)}`}>
                              {d.status === 'DISBURSED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {d.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                              {d.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {d.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Amount
                            </div>
                            <div className="text-lg font-semibold text-green-600">
                              ${Number(d.amount).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              Type
                            </div>
                            <Badge variant="outline" className="text-xs font-medium">
                              {d.disbursementType}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Disbursement Date
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(d.disbursementDate)}
                            </div>
                          </div>
                        </div>

                        {(d.disbursedAt || d.approvedAt || d.transactionReference) && (
                          <div className="pt-4 border-t space-y-2">
                            {d.disbursedAt && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Disbursed on</span>
                                <span className="font-medium text-gray-700">{formatDate(d.disbursedAt)}</span>
                              </div>
                            )}
                            {d.approvedAt && !d.disbursedAt && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Approved on</span>
                                <span className="font-medium text-gray-700">{formatDate(d.approvedAt)}</span>
                              </div>
                            )}
                            {d.transactionReference && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 flex items-center gap-1">
                                  <Receipt className="w-3 h-3" />
                                  Transaction Ref
                                </span>
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                  {d.transactionReference}
                                </code>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
