"use client"

import { useEffect, useRef, useState } from "react"
import { PayrollLayout } from "@/components/layout/payroll-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { employeesApi, payrollRunsApi, payslipsApi } from "@/lib/api/payroll-api"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setApiEmployees, setApiPayrollRuns } from "@/lib/store/slices/payrollSlice"
import { Download, Loader2 } from "lucide-react"

export default function PayslipsPage() {
  const dispatch = useAppDispatch()
  const { apiEmployees, apiPayrollRuns } = useAppSelector(s => s.payroll)
  const [employeeId, setEmployeeId] = useState("")
  const [payrollRunId, setPayrollRunId] = useState("")
  const [loading, setLoading] = useState(false)
  const [employeesLoading, setEmployeesLoading] = useState(false)
  const [runsLoading, setRunsLoading] = useState(false)
  const [payslip, setPayslip] = useState<any | null>(null)
  const payslipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setEmployeesLoading(true)
        setRunsLoading(true)
        const [emps, runs] = await Promise.all([employeesApi.getAll(), payrollRunsApi.getAll()])
        if (emps.success) dispatch(setApiEmployees(emps.data || []))
        if (runs.success) dispatch(setApiPayrollRuns(runs.data || []))
      } catch {}
      finally {
        setEmployeesLoading(false)
        setRunsLoading(false)
      }
    }
    if (apiEmployees.length === 0 || apiPayrollRuns.length === 0) load()
  }, [apiEmployees.length, apiPayrollRuns.length, dispatch])

  const handleSearch = async () => {
    if (!employeeId || !payrollRunId) return
    try {
      setLoading(true)
      const res = await payslipsApi.getByEmployeeAndRun(employeeId, payrollRunId)
      if (res.success && res.data) setPayslip(res.data)
      else setPayslip(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = () => {
    if (!payslip?.pdfPath) return
    const base = process.env.NEXT_PUBLIC_API_URL || 'https://nvccz-pi.vercel.app'
    const pdfUrl = payslip.pdfPath.startsWith('http') ? payslip.pdfPath : `${base}${payslip.pdfPath}`
    window.open(pdfUrl, '_blank')
  }

  return (
    <PayrollLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-normal text-gray-900">Payslips</h1>
          <p className="text-gray-600">Search and view payslips by employee and pay run</p>
        </div>

        <div className="rounded-2xl border-1 border-gray-200 p-6">
          <CardHeader>
            <CardTitle className="text-base font-normal">Search Payslip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-700">Employee</label>
                <Select value={employeeId} onValueChange={setEmployeeId} disabled={employeesLoading}>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder={employeesLoading ? 'Loading employees...' : 'Select employee'} />
                  </SelectTrigger>
                  <SelectContent>
                    {employeesLoading ? (
                      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                      </div>
                    ) : (
                      apiEmployees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.user.firstName} {e.user.lastName} ({e.employeeNumber})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-700">Payroll Run</label>
                <Select value={payrollRunId} onValueChange={setPayrollRunId} disabled={runsLoading}>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder={runsLoading ? 'Loading runs...' : 'Select payroll run'} />
                  </SelectTrigger>
                  <SelectContent>
                    {runsLoading ? (
                      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                      </div>
                    ) : (
                      apiPayrollRuns.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name} — {new Date(r.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleSearch} className="rounded-full" disabled={loading || !employeeId || !payrollRunId}>
                  {loading ? 'Searching...' : 'Search Payslip'}
                </Button>
                <Button type="button" variant="outline" className="rounded-full" onClick={() => { setEmployeeId(''); setPayrollRunId(''); setPayslip(null); }} disabled={loading}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </div>

        {payslip && (
          <div className="rounded-2xl border-1 border-gray-200 p-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-normal">Payslip</CardTitle>
              <Button onClick={handleDownloadPdf} className="rounded-full gradient-primary text-white" disabled={!payslip?.pdfPath}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div ref={payslipRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Employee</p>
                  <p className="text-lg text-gray-900">{payslip?.employee?.user?.firstName ?? apiEmployees.find(e => e.id === payslip?.employeeId)?.user.firstName} {payslip?.employee?.user?.lastName ?? apiEmployees.find(e => e.id === payslip?.employeeId)?.user.lastName} ({payslip?.employee?.employeeNumber ?? apiEmployees.find(e => e.id === payslip?.employeeId)?.employeeNumber})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pay Run</p>
                  <p className="text-lg text-gray-900">{payslip?.payrollRun?.name ?? apiPayrollRuns.find(r => r.id === payslip?.payrollRunId)?.name} ({new Date((payslip?.payrollRun?.startDate ?? apiPayrollRuns.find(r => r.id === payslip?.payrollRunId)?.startDate) || '').toLocaleDateString()})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gross Pay</p>
                  <p className="text-xl text-gray-900 font-normal">{payslip?.currency?.symbol ?? '$'}{parseFloat(String(payslip?.grossPay ?? payslip?.totals?.gross ?? 0)).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Deductions</p>
                  <p className="text-xl text-red-600 font-normal">{payslip?.currency?.symbol ?? '$'}{parseFloat(String(payslip?.totalDeductions ?? 0)).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Net Pay</p>
                  <p className="text-2xl text-green-600 font-normal">{payslip?.currency?.symbol ?? '$'}{parseFloat(String(payslip?.netPay ?? payslip?.totals?.netPay ?? 0)).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </div>
        )}
      </div>
    </PayrollLayout>
  )
}