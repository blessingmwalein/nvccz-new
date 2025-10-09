"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Fund } from "@/lib/api/funds-api"
import { Wallet, Calendar, DollarSign, X, Tag, FileText } from "lucide-react"

interface FundDrawerProps {
  isOpen: boolean
  onClose: () => void
  fund: Fund | null
}

export function FundDrawer({ isOpen, onClose, fund }: FundDrawerProps) {
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

        <div className="mt-6 space-y-6">
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
        </div>
      </SheetContent>
    </Sheet>
  )
}
