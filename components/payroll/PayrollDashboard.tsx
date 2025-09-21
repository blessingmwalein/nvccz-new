"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CiWallet, CiUser, CiCalendar, CiViewTable, CiDollar, CiFileOn, CiPercent, CiMinus, CiBuilding } from "react-icons/ci"
import { StatCard } from "@/components/payroll/StatCard"
import { PerformanceChart } from "@/components/portfolio/performance-chart"
import { 
  setTaxRules,
  setAllowanceTypes,
  setDeductionTypes,
  setBankTemplates,
  setApiEmployees,
  setApiPayrollRuns,
  setApiPayslips
} from "@/lib/store/slices/payrollSlice"
import { 
  taxRulesApi, 
  allowanceTypesApi, 
  deductionTypesApi, 
  bankTemplatesApi, 
  employeesApi, 
  payrollRunsApi, 
  payslipsApi 
} from "@/lib/api/payroll-api"

export function PayrollDashboard() {
  const dispatch = useAppDispatch()
  const payroll = useAppSelector(state => state.payroll)
  const currentRun = payroll.apiPayrollRuns[0] || payroll.payRuns[0]
  const employees = payroll.apiEmployees.length > 0 ? payroll.apiEmployees : payroll.employees
  const group = payroll.groups.find(g => g.id === currentRun?.payGroupId)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all payroll data
        const [taxRulesRes, allowanceTypesRes, deductionTypesRes, bankTemplatesRes, employeesRes, payrollRunsRes, payslipsRes] = await Promise.all([
          taxRulesApi.getAll(),
          allowanceTypesApi.getAll(),
          deductionTypesApi.getAll(),
          bankTemplatesApi.getAll(),
          employeesApi.getAll(),
          payrollRunsApi.getAll(),
          payslipsApi.getAll()
        ])

        if (taxRulesRes.success) dispatch(setTaxRules(taxRulesRes.data))
        if (allowanceTypesRes.success) dispatch(setAllowanceTypes(allowanceTypesRes.data))
        if (deductionTypesRes.success) dispatch(setDeductionTypes(deductionTypesRes.data))
        if (bankTemplatesRes.success) dispatch(setBankTemplates(bankTemplatesRes.data))
        if (employeesRes.success) dispatch(setApiEmployees(employeesRes.data))
        if (payrollRunsRes.success) dispatch(setApiPayrollRuns(payrollRunsRes.data))
        if (payslipsRes.success) dispatch(setApiPayslips(payslipsRes.data))
      } catch (error) {
        console.error('Failed to load payroll data:', error)
      }
    }

    loadData()
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Payroll Dashboard</h1>
          <p className="text-gray-600 font-normal">Overview of pay runs, employees, and postings</p>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-full gradient-primary text-white">Open Pay Run</Button>
          <Button variant="outline" className="rounded-full">Post to GL</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Net Payroll" 
          value={currentRun ? `$${currentRun.statistics.netTotal.toLocaleString()}` : '$0'} 
          icon={<CiWallet className="w-5 h-5" />} 
        />
        <StatCard 
          title="Gross Total" 
          value={currentRun ? `$${currentRun.statistics.grossTotal.toLocaleString()}` : '$0'} 
          icon={<CiDollar className="w-5 h-5" />} 
        />
        <StatCard 
          title="Employees" 
          value={employees.length} 
          icon={<CiUser className="w-5 h-5" />} 
        />
        <StatCard 
          title="Next Payout" 
          value={currentRun ? new Date(currentRun.payoutDate).toLocaleDateString() : 'N/A'} 
          icon={<CiCalendar className="w-5 h-5" />} 
        />
      </div>

      <Card className="rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-normal">
            <CiViewTable className="w-5 h-5" /> Current Pay Run
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-normal text-gray-700">Pay Group</label>
              <Select value={group?.id}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {payroll.groups.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-normal text-gray-700">Period</label>
              <div className="rounded-full border border-gray-300 bg-white px-4 py-2">
                {currentRun ? `${new Date(currentRun.periodStart).toLocaleDateString()} → ${new Date(currentRun.periodEnd).toLocaleDateString()}` : 'N/A'}
              </div>
            </div>
            <div>
              <label className="text-sm font-normal text-gray-700">Status</label>
              <div className="rounded-full border border-gray-300 bg-white px-4 py-2">
                {currentRun ? currentRun.status : 'N/A'}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <PerformanceChart />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-normal">
            <CiFileOn className="w-5 h-5" /> Recent Payslips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(payroll.apiPayslips.length > 0 ? payroll.apiPayslips : payroll.payslips).slice(0, 4).map(ps => {
              const emp = employees.find(e => e.id === ps.employeeId)
              return (
                <div key={ps.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
                  <div>
                    <div className="text-sm text-gray-900">
                      {emp?.user?.firstName} {emp?.user?.lastName} || {emp?.firstName} {emp?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{ps.id}</div>
                  </div>
                  <div className="text-sm">
                    ${ps.totals.netPay.toLocaleString()} {ps.currencyId}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


