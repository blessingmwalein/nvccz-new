"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, RefreshCw, FileText, Loader2, AlertCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"
import type { RootState, AppDispatch } from "@/lib/store/store"
import { generateCashFlow } from "@/lib/store/slices/accountingSlice"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function formatMoney(v: number | string) {
  return (
    <span className="font-mono tabular-nums">
      {Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  )
}

function CashFlowSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-2"></div>
        <div className="h-5 w-32 bg-gray-100 rounded mx-auto mb-2"></div>
        <div className="h-4 w-40 bg-gray-100 rounded mx-auto"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-2">Description</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(20)].map((_, i) => (
              <tr key={i}>
                <td className={cn("py-1 pl-2", i % 6 === 0 && "pt-4 pb-1")}>
                  <div className={cn("h-4 rounded", i % 6 === 0 ? "w-32 bg-gray-100" : "w-56 bg-gray-200")}></div>
                </td>
                <td className="py-1 pr-2 text-right">
                  <div className="h-4 w-24 bg-gray-200 rounded ml-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CashFlowView() {
  const dispatch = useDispatch<AppDispatch>()
  const { cashFlow, cashFlowLoading, cashFlowError, currencies } = useSelector((s: RootState) => s.accounting)
  
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const endOfYear = new Date(now.getFullYear(), 11, 31)
  const defaultCurrencyId = currencies.find(c => c.code === "USD")?.id || currencies[0]?.id || ""
  
  const [startDate, setStartDate] = useState<Date>(startOfYear)
  const [endDate, setEndDate] = useState<Date>(endOfYear)
  const [currencyId, setCurrencyId] = useState(defaultCurrencyId)
  const [generatingPDF, setGeneratingPDF] = useState(false)

  useEffect(() => {
    if (currencies.length && !currencyId) setCurrencyId(defaultCurrencyId)
  }, [currencies])

  useEffect(() => {
    if (currencyId) {
      dispatch(generateCashFlow({
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        currencyId
      }) as any)
    }
  }, [currencyId])

  const handleGenerate = async () => {
    if (startDate && endDate && currencyId) {
      try {
        await dispatch(generateCashFlow({
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
          currencyId
        }) as any)
      } catch (error: any) {
        toast.error("Failed to generate cash flow statement", { description: error.message })
      }
    }
  }

  // Custom dropdown for currency selection
  const currencyDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full min-w-[90px] flex justify-between items-center"
        >
          {currencies.find(c => c.id === currencyId)?.code || "Select"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="rounded-xl min-w-[120px]">
        {currencies.map(c => (
          <DropdownMenuItem
            key={c.id}
            onClick={() => setCurrencyId(c.id)}
            className={cn(
              "flex items-center justify-between rounded-full cursor-pointer",
              c.id === currencyId && "bg-blue-100"
            )}
          >
            <span>{c.code} <span className="text-xs text-gray-400 ml-1">{c.name}</span></span>
            {c.id === currencyId && <Check className="w-4 h-4 text-blue-600 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // Export to PDF implementation
  const handleExportPDF = async () => {
    if (!cashFlow || !cashFlow.presentation) {
      toast.error("No cash flow data to export")
      return
    }
    setGeneratingPDF(true)
    try {
      const doc = new jsPDF()
      const { presentation } = cashFlow
      
      doc.setFontSize(16)
      doc.text("Cash Flow Statement", 14, 18)
      doc.setFontSize(11)
      doc.text(
        `For the period ${format(new Date(cashFlow.period.startDate), "MMMM d, yyyy")} to ${format(new Date(cashFlow.period.endDate), "MMMM d, yyyy")}`,
        14, 26
      )
      doc.text(`Currency: ${cashFlow.currency.name}`, 14, 32)

      const rows: any[] = []
      const pushSection = (label: string) => rows.push([{ content: label, colSpan: 2, styles: { fontStyle: 'bold', fillColor: [240,240,240] } }])
      const pushItem = (label: string, value: number) => rows.push([`  ${label}`, value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })])
      const pushTotal = (label: string, value: number) => rows.push([{ content: label, styles: { fontStyle: 'bold' } }, { content: value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { fontStyle: 'bold' } }])

      // Operating Activities
      pushSection(presentation.operating.label)
      presentation.operating.cashReceipts?.forEach(item => pushItem(item.label, item.amount))
      presentation.operating.cashPayments?.forEach(item => pushItem(item.label, item.amount))
      presentation.operating.additions?.forEach(item => pushItem(item.label, item.amount))
      presentation.operating.adjustments?.forEach(item => pushItem(item.label, item.amount))
      pushTotal(`Total ${presentation.operating.label}`, presentation.operating.total)

      // Investing Activities
      pushSection(presentation.investing.label)
      presentation.investing.cashReceipts?.forEach(item => pushItem(item.label, item.amount))
      presentation.investing.cashPayments?.forEach(item => pushItem(item.label, item.amount))
      pushTotal(`Total ${presentation.investing.label}`, presentation.investing.total)

      // Financing Activities
      pushSection(presentation.financing.label)
      presentation.financing.cashReceipts?.forEach(item => pushItem(item.label, item.amount))
      presentation.financing.cashPayments?.forEach(item => pushItem(item.label, item.amount))
      pushTotal(`Total ${presentation.financing.label}`, presentation.financing.total)

      // Summary
      pushTotal("Net Change in Cash", presentation.netChangeInCash)
      pushItem("Beginning Cash Balance", presentation.beginningCashBalance)
      pushItem("Ending Cash Balance", presentation.endingCashBalance)

      autoTable(doc, {
        head: [["Description", "Amount"]],
        body: rows,
        startY: 38,
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [220, 220, 220] },
        columnStyles: { 1: { halign: 'right' } }
      })

      doc.save(`CashFlow_${cashFlow.period.startDate}_${cashFlow.period.endDate}.pdf`)
      toast.success("Cash flow PDF generated successfully")
    } catch (err) {
      toast.error("Failed to generate cash flow PDF")
    } finally {
      setGeneratingPDF(false)
    }
  }

  if (cashFlowError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Cash Flow Statement</h3>
          <p className="text-gray-600 mb-4">{cashFlowError}</p>
          <Button onClick={handleGenerate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  function renderTraditionalCashFlow() {
    if (!cashFlow || !cashFlow.presentation) return null
    const { presentation } = cashFlow

    const rows: { label: string; value: number | null; type: "section" | "item" | "total" | "subtotal" }[] = []
    
    // Operating Activities
    rows.push({ label: presentation.operating.label, value: null, type: "section" })
    presentation.operating.cashReceipts?.forEach(item => {
      rows.push({ label: item.label, value: item.amount, type: "item" })
    })
    presentation.operating.cashPayments?.forEach(item => {
      rows.push({ label: item.label, value: item.amount, type: "item" })
    })
    presentation.operating.additions?.forEach(item => {
      if (item.amount !== 0) rows.push({ label: item.label, value: item.amount, type: "item" })
    })
    presentation.operating.adjustments?.forEach(item => {
      if (item.amount !== 0) rows.push({ label: item.label, value: item.amount, type: "item" })
    })
    rows.push({ label: `Total ${presentation.operating.label}`, value: presentation.operating.total, type: "subtotal" })

    // Investing Activities
    rows.push({ label: presentation.investing.label, value: null, type: "section" })
    presentation.investing.cashReceipts?.forEach(item => {
      if (item.amount !== 0) rows.push({ label: item.label, value: item.amount, type: "item" })
    })
    presentation.investing.cashPayments?.forEach(item => {
      if (item.amount !== 0) rows.push({ label: item.label, value: item.amount, type: "item" })
    })
    rows.push({ label: `Total ${presentation.investing.label}`, value: presentation.investing.total, type: "subtotal" })

    // Financing Activities
    rows.push({ label: presentation.financing.label, value: null, type: "section" })
    presentation.financing.cashReceipts?.forEach(item => {
      if (item.amount !== 0) rows.push({ label: item.label, value: item.amount, type: "item" })
    })
    presentation.financing.cashPayments?.forEach(item => {
      if (item.amount !== 0) rows.push({ label: item.label, value: item.amount, type: "item" })
    })
    rows.push({ label: `Total ${presentation.financing.label}`, value: presentation.financing.total, type: "subtotal" })

    // Summary
    rows.push({ label: "Net Change in Cash", value: presentation.netChangeInCash, type: "total" })
    rows.push({ label: "Beginning Cash Balance", value: presentation.beginningCashBalance, type: "item" })
    rows.push({ label: "Ending Cash Balance", value: presentation.endingCashBalance, type: "total" })

    return (
      <div className="max-w-3xl mx-auto">
        {/* Company Header */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Company Name</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Cash Flow Statement</h2>
          <p className="text-gray-600">
            For the period {format(new Date(cashFlow.period.startDate), "MMMM d, yyyy")} to {format(new Date(cashFlow.period.endDate), "MMMM d, yyyy")}
          </p>
          <p className="text-sm text-gray-500 mt-1">Currency: {cashFlow.currency.name} ({cashFlow.currency.code})</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-400">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-2">Description</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}
                  className={cn(
                    row.type === "section" && "bg-gray-100 border-t-2 border-gray-300",
                    row.type === "subtotal" && "border-t border-gray-300 font-semibold bg-gray-50",
                    row.type === "total" && "border-t-2 border-gray-400 font-bold"
                  )}
                >
                  <td className={cn(
                    "py-2",
                    row.type === "section" && "pl-2 font-bold text-sm text-gray-700 uppercase",
                    row.type === "item" && "pl-6 text-sm",
                    row.type === "subtotal" && "pl-4 text-sm",
                    row.type === "total" && "pl-2 text-base"
                  )}>
                    {row.label}
                  </td>
                  <td className={cn(
                    "py-2 pr-2 text-right",
                    row.type === "total" && "text-blue-700 text-base font-bold",
                    row.type === "subtotal" && "font-semibold",
                    row.type === "section" && "text-sm"
                  )}>
                    {row.value !== null ? (
                      <span className={cn(
                        row.value < 0 && "text-red-600"
                      )}>
                        {formatMoney(row.value)}
                      </span>
                    ) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          Generated on {format(new Date(cashFlow.generatedAt), "PPP 'at' p")}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Cash Flow Statement</h2>
          <p className="text-gray-600">
            For the period {format(startDate, "MMM d, yyyy")} to {format(endDate, "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">From:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(startDate, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">To:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(endDate, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Custom currency dropdown */}
          <div>
            {currencyDropdown}
          </div>
          <Button
            onClick={handleGenerate}
            disabled={cashFlowLoading}
            className="rounded-full"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", cashFlowLoading && "animate-spin")} />
            Generate
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="rounded-full"
            disabled={generatingPDF || !cashFlow}
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
        </div>
      </div>

      {/* Cash Flow Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Cash Flow Statement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cashFlowLoading ? (
            <CashFlowSkeleton />
          ) : cashFlow ? (
            renderTraditionalCashFlow()
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Cash Flow Data</h3>
              <p className="text-gray-600">No data available for the selected period</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
