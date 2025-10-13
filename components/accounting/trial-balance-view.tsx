"use client"

import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  CalendarIcon, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Building2,
  Wallet,
  CreditCard,
  BarChart3,
  AlertCircle,
  Scale,
  Download,
  FileText,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"
import type { RootState, AppDispatch } from "@/lib/store/store"
import { fetchTrialBalance, fetchTrialBalanceSummary } from "@/lib/store/slices/accounting-slice"
import { exportTrialBalanceToCSV, exportTrialBalanceToPDF } from "@/lib/utils/export"

export function TrialBalanceView() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    trialBalance,
    trialBalanceSummary,
    trialBalanceLoading,
    trialBalanceSummaryLoading,
    trialBalanceError,
    trialBalanceSummaryError
  } = useSelector((state: RootState) => state.accounting)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [generatingPDF, setGeneratingPDF] = useState(false)

  useEffect(() => {
    loadTrialBalanceData()
  }, [selectedDate])

  const loadTrialBalanceData = async () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd')
    try {
      await Promise.all([
        dispatch(fetchTrialBalance(dateString)),
        dispatch(fetchTrialBalanceSummary(dateString))
      ])
    } catch (error: any) {
      toast.error("Failed to load trial balance data", {
        description: error.message
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getAccountTypeColor = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'current asset':
      case 'fixed asset':
        return 'bg-blue-100 text-blue-800'
      case 'current liability':
      case 'long-term liability':
        return 'bg-red-100 text-red-800'
      case 'revenue':
        return 'bg-green-100 text-green-800'
      case 'expense':
        return 'bg-orange-100 text-orange-800'
      case 'equity':
        return 'bg-purple-100 text-purple-800'
      case 'contra-asset':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExportCSV = () => {
    if (!trialBalance) {
      toast.error("No trial balance data to export")
      return
    }
    
    try {
      exportTrialBalanceToCSV(trialBalance)
      toast.success("Trial balance exported to CSV successfully")
    } catch (error) {
      toast.error("Failed to export trial balance to CSV")
    }
  }

  const handleExportPDF = async () => {
    if (!trialBalance) {
      toast.error("No trial balance data to export")
      return
    }
    
    try {
      setGeneratingPDF(true)
      await exportTrialBalanceToPDF(trialBalance)
      toast.success("Trial balance PDF generated successfully")
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error("Failed to generate trial balance PDF")
    } finally {
      setGeneratingPDF(false)
    }
  }

  if (trialBalanceError || trialBalanceSummaryError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Trial Balance</h3>
          <p className="text-gray-600 mb-4">{trialBalanceError || trialBalanceSummaryError}</p>
          <Button onClick={loadTrialBalanceData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Trial Balance</h2>
          <p className="text-gray-600">
            As of {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {/* Export Buttons */}
          <Button 
            onClick={handleExportCSV}
            variant="outline" 
            className="rounded-full"
            disabled={!trialBalance}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          
          <Button 
            onClick={handleExportPDF}
            variant="outline" 
            className="rounded-full"
            disabled={!trialBalance || generatingPDF}
          >
            {generatingPDF ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
          
          <Button 
            onClick={loadTrialBalanceData} 
            disabled={trialBalanceLoading || trialBalanceSummaryLoading}
            className="rounded-full"
          >
            <RefreshCw className={cn(
              "w-4 h-4 mr-2",
              (trialBalanceLoading || trialBalanceSummaryLoading) && "animate-spin"
            )} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {trialBalanceSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 gradient-primary">
            <CardContent className="p-4 h-[80px] flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-normal text-white">
                    {trialBalanceSummary.totalAccounts}
                  </div>
                  <div className="text-white/80 text-sm">Total Accounts</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
            <CardContent className="p-4 h-[80px] flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-normal text-gray-900">
                    {formatCurrency(trialBalanceSummary.totalDebits)}
                  </div>
                  <div className="text-gray-600 text-sm">Total Debits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 gradient-primary">
            <CardContent className="p-4 h-[80px] flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-normal text-white">
                    {formatCurrency(trialBalanceSummary.totalCredits)}
                  </div>
                  <div className="text-white/80 text-sm">Total Credits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
            <CardContent className="p-4 h-[80px] flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  trialBalanceSummary.isBalanced 
                    ? "bg-green-500" 
                    : "bg-red-500"
                )}>
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className={cn(
                    "text-2xl font-normal",
                    trialBalanceSummary.isBalanced ? "text-green-600" : "text-red-600"
                  )}>
                    {trialBalanceSummary.isBalanced ? "Balanced" : "Unbalanced"}
                  </div>
                  <div className="text-gray-600 text-sm">Trial Balance Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trial Balance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Account Balances
            </CardTitle>
            <div className="flex items-center gap-3">
              {trialBalance && (
                <Badge className={cn(
                  "text-sm",
                  trialBalance.totals.isBalanced 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                )}>
                  {trialBalance.totals.isBalanced ? "✓ Balanced" : "⚠ Unbalanced"}
                </Badge>
              )}
              
              {/* Quick Export Buttons in Table Header */}
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={handleExportCSV}
                  disabled={!trialBalance}
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  CSV
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={handleExportPDF}
                  disabled={!trialBalance || generatingPDF}
                  className="text-xs"
                >
                  {generatingPDF ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <FileText className="w-3 h-3 mr-1" />
                  )}
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trialBalanceLoading ? (
            <TrialBalanceSkeleton />
          ) : trialBalance ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-700">Account No.</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Account Name</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Debit Balance</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Credit Balance</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Net Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {trialBalance.accounts.map((account, index) => (
                    <tr 
                      key={account.accountId} 
                      className={cn(
                        "hover:bg-gray-50 transition-colors border-b",
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      )}
                    >
                      <td className="p-4">
                        <span className="font-mono text-sm font-semibold text-blue-600">
                          {account.accountNo}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">
                          {account.accountName}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge className={getAccountTypeColor(account.accountType)}>
                          {account.accountType}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        {account.debitBalance > 0 && (
                          <span className="font-semibold text-green-700">
                            {formatCurrency(account.debitBalance)}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {account.creditBalance > 0 && (
                          <span className="font-semibold text-red-700">
                            {formatCurrency(account.creditBalance)}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <span className={cn(
                          "font-bold",
                          account.netBalance >= 0 ? "text-green-700" : "text-red-700"
                        )}>
                          {formatCurrency(Math.abs(account.netBalance))}
                          {account.netBalance < 0 && " (CR)"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                  <tr>
                    <td colSpan={3} className="p-4 font-bold text-gray-900 text-lg">
                      TOTALS
                    </td>
                    <td className="p-4 text-right font-bold text-green-700 text-lg">
                      {formatCurrency(trialBalance.totals.totalDebits)}
                    </td>
                    <td className="p-4 text-right font-bold text-red-700 text-lg">
                      {formatCurrency(trialBalance.totals.totalCredits)}
                    </td>
                    <td className="p-4 text-right">
                      <Badge className={cn(
                        "text-sm font-semibold",
                        trialBalance.totals.isBalanced 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      )}>
                        {trialBalance.totals.isBalanced ? "BALANCED" : "UNBALANCED"}
                      </Badge>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Trial Balance Data</h3>
              <p className="text-gray-600">No data available for the selected date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TrialBalanceSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4"><div className="h-4 w-20 bg-gray-300 rounded"></div></th>
              <th className="text-left p-4"><div className="h-4 w-32 bg-gray-300 rounded"></div></th>
              <th className="text-left p-4"><div className="h-4 w-16 bg-gray-300 rounded"></div></th>
              <th className="text-right p-4"><div className="h-4 w-24 bg-gray-300 rounded ml-auto"></div></th>
              <th className="text-right p-4"><div className="h-4 w-24 bg-gray-300 rounded ml-auto"></div></th>
              <th className="text-right p-4"><div className="h-4 w-24 bg-gray-300 rounded ml-auto"></div></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, index) => (
              <tr key={index} className="border-b">
                <td className="p-4"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
                <td className="p-4"><div className="h-4 w-40 bg-gray-200 rounded"></div></td>
                <td className="p-4"><div className="h-6 w-20 bg-blue-200 rounded-full"></div></td>
                <td className="p-4 text-right"><div className="h-4 w-20 bg-green-200 rounded ml-auto"></div></td>
                <td className="p-4 text-right"><div className="h-4 w-20 bg-red-200 rounded ml-auto"></div></td>
                <td className="p-4 text-right"><div className="h-4 w-24 bg-gray-200 rounded ml-auto"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
