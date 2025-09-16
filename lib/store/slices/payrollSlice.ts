import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type PayrollSettings = {
  id: string
  currencyId: string
  baseCountry: string
  defaultPayScheduleId: string
  rounding: { method: "HALF_UP"; scale: number }
  journalMappings: Record<string, string>
  approvalWorkflow: { requiresTwoStepApproval: boolean; approverRoleNames: string[] }
}

export type PaySchedule = {
  id: string
  name: string
  frequency: "MONTHLY" | "WEEKLY" | "BIWEEKLY"
  cutoffDay: number
  payoutDay: number
  proRataBasis: "CALENDAR_DAYS" | "WORKING_DAYS"
}

export type PayGroup = {
  id: string
  name: string
  scheduleId: string
  currencyId: string
  defaultCoaOverrides: Record<string, string> | null
}

export type Employee = {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  employment: {
    startDate: string
    endDate: string | null
    status: "ACTIVE" | "SUSPENDED" | "TERMINATED"
    payGroupId: string
    jobTitle: string
    grade: string
  }
  identifiers: { nationalId?: string; taxId?: string; pensionId?: string }
  banking: { bankName: string; accountName: string; accountNumber: string; branch?: string }
}

export type PayComponent = {
  id: string
  name: string
  type: "EARNING" | "DEDUCTION" | "CONTRIBUTION"
  calculation: { method: "FIXED" | "FORMULA"; formula?: string }
  taxTreatment: Record<string, unknown>
  posting?: Record<string, string>
  priority: number
  active: boolean
}

export type EmployeeAssignment = {
  id: string
  employeeId: string
  componentId: string
  value: { amount: number; currencyId: string }
  effectiveFrom: string
  effectiveTo: string | null
}

export type PayRun = {
  id: string
  name: string
  payGroupId: string
  periodStart: string
  periodEnd: string
  payoutDate: string
  status: "DRAFT" | "APPROVED" | "POSTED" | "PAID"
  statistics: { employeeCount: number; grossTotal: number; netTotal: number }
}

export type Payslip = {
  id: string
  payRunId: string
  employeeId: string
  currencyId: string
  lines: { id: string; componentId: string; type: PayComponent["type"]; amount: number }[]
  totals: { gross: number; netPay: number }
}

export type PaymentBatch = {
  id: string
  payRunId: string
  status: "PENDING" | "PROCESSING" | "COMPLETED"
  payments: { id: string; payslipId: string; employeeId: string; amount: number }[]
}

type PayrollState = {
  settings: PayrollSettings
  schedules: PaySchedule[]
  groups: PayGroup[]
  employees: Employee[]
  components: PayComponent[]
  assignments: EmployeeAssignment[]
  payRuns: PayRun[]
  payslips: Payslip[]
  paymentBatches: PaymentBatch[]
  timeSheets: {
    id: string
    employeeId: string
    periodStart: string
    periodEnd: string
    entries: { date: string; hours: number; type: string; componentId?: string }[]
    status: "DRAFT" | "APPROVED"
  }[]
}

const initialState: PayrollState = {
  settings: {
    id: "payroll-settings-001",
    currencyId: "USD",
    baseCountry: "ZW",
    defaultPayScheduleId: "sched-monthly-001",
    rounding: { method: "HALF_UP", scale: 2 },
    journalMappings: {
      wagesExpenseCoAId: "coa-wages-exp",
      employerPensionExpenseCoAId: "coa-pension-exp",
      employerTaxExpenseCoAId: "coa-tax-exp",
      netPayrollPayableCoAId: "coa-net-payable",
      payeWithholdingCoAId: "coa-paye-liab",
      pensionPayableCoAId: "coa-pension-liab",
      healthInsurancePayableCoAId: "coa-health-liab",
      cashBankCoAId: "coa-bank-001",
    },
    approvalWorkflow: { requiresTwoStepApproval: true, approverRoleNames: ["Payroll Manager", "Finance Manager"] },
  },
  schedules: [
    { id: "sched-monthly-001", name: "Monthly", frequency: "MONTHLY", cutoffDay: 25, payoutDay: 28, proRataBasis: "CALENDAR_DAYS" },
  ],
  groups: [
    { id: "paygroup-hq-001", name: "Head Office", scheduleId: "sched-monthly-001", currencyId: "USD", defaultCoaOverrides: null },
  ],
  employees: [
    {
      id: "emp-1001",
      userId: "user-1001",
      firstName: "Tariro",
      lastName: "Nyathi",
      email: "tariro@example.com",
      employment: { startDate: "2025-01-05", endDate: null, status: "ACTIVE", payGroupId: "paygroup-hq-001", jobTitle: "Accountant", grade: "G6" },
      identifiers: { nationalId: "XX-12345", taxId: "TIN-99887", pensionId: "PEN-445566" },
      banking: { bankName: "ABC Bank", accountName: "T Nyathi", accountNumber: "123456789", branch: "Harare Main" },
    },
    {
      id: "emp-1002",
      userId: "user-1002",
      firstName: "Kudzi",
      lastName: "Moyo",
      email: "kudzi@example.com",
      employment: { startDate: "2024-09-10", endDate: null, status: "ACTIVE", payGroupId: "paygroup-hq-001", jobTitle: "Analyst", grade: "G4" },
      identifiers: { nationalId: "YY-67890", taxId: "TIN-22334", pensionId: "PEN-778899" },
      banking: { bankName: "ZB Bank", accountName: "K Moyo", accountNumber: "987654321", branch: "Borrowdale" },
    },
    {
      id: "emp-1003",
      userId: "user-1003",
      firstName: "Rudo",
      lastName: "Chirwa",
      email: "rudo@example.com",
      employment: { startDate: "2023-05-01", endDate: null, status: "ACTIVE", payGroupId: "paygroup-hq-001", jobTitle: "HR Officer", grade: "G5" },
      identifiers: { nationalId: "ZZ-45678", taxId: "TIN-55667", pensionId: "PEN-112233" },
      banking: { bankName: "CBZ", accountName: "R Chirwa", accountNumber: "111222333", branch: "Avondale" },
    },
  ],
  components: [
    { id: "comp-basic-salary", name: "Basic Salary", type: "EARNING", calculation: { method: "FIXED" }, taxTreatment: { taxable: true, subjectToPAYE: true, subjectToPension: true, preTax: false }, posting: { expenseCoAId: "coa-wages-exp" }, priority: 10, active: true },
    { id: "comp-paye", name: "PAYE", type: "DEDUCTION", calculation: { method: "FORMULA", formula: "TAX_TABLE_PY.ZW_2025(progressive, taxableIncome)" }, taxTreatment: { taxable: false }, posting: { liabilityCoAId: "coa-paye-liab" }, priority: 90, active: true },
    { id: "comp-pension-employer", name: "Pension Employer", type: "CONTRIBUTION", calculation: { method: "FORMULA", formula: "gross * 0.05" }, taxTreatment: { taxable: false }, posting: { expenseCoAId: "coa-pension-exp" }, priority: 40, active: true },
    { id: "comp-pension-employee", name: "Pension Employee", type: "DEDUCTION", calculation: { method: "FORMULA", formula: "gross * 0.05" }, taxTreatment: { taxable: false }, posting: { liabilityCoAId: "coa-pension-liab" }, priority: 50, active: true },
    { id: "comp-ot150", name: "Overtime 1.5x", type: "EARNING", calculation: { method: "FORMULA", formula: "hourlyRate * 1.5 * hours" }, taxTreatment: { taxable: true }, priority: 30, active: true },
  ],
  assignments: [
    { id: "emp-comp-1001-basic", employeeId: "emp-1001", componentId: "comp-basic-salary", value: { amount: 1500.0, currencyId: "USD" }, effectiveFrom: "2025-02-01", effectiveTo: null },
    { id: "emp-comp-1002-basic", employeeId: "emp-1002", componentId: "comp-basic-salary", value: { amount: 1100.0, currencyId: "USD" }, effectiveFrom: "2024-10-01", effectiveTo: null },
    { id: "emp-comp-1003-basic", employeeId: "emp-1003", componentId: "comp-basic-salary", value: { amount: 1300.0, currencyId: "USD" }, effectiveFrom: "2023-05-01", effectiveTo: null },
  ],
  payRuns: [
    { id: "payrun-2025-08-hq", name: "HQ August 2025", payGroupId: "paygroup-hq-001", periodStart: "2025-08-01", periodEnd: "2025-08-31", payoutDate: "2025-08-28", status: "DRAFT", statistics: { employeeCount: 3, grossTotal: 3900, netTotal: 3400.5 } },
    { id: "payrun-2025-07-hq", name: "HQ July 2025", payGroupId: "paygroup-hq-001", periodStart: "2025-07-01", periodEnd: "2025-07-31", payoutDate: "2025-07-28", status: "POSTED", statistics: { employeeCount: 3, grossTotal: 3800, netTotal: 3320.0 } },
  ],
  payslips: [
    { id: "payslip-2025-08-emp-1001", payRunId: "payrun-2025-08-hq", employeeId: "emp-1001", currencyId: "USD", lines: [ { id: "line-1", componentId: "comp-basic-salary", type: "EARNING", amount: 1500 }, { id: "line-2", componentId: "comp-paye", type: "DEDUCTION", amount: 120.5 } ], totals: { gross: 1500, netPay: 1304.5 } },
    { id: "payslip-2025-08-emp-1002", payRunId: "payrun-2025-08-hq", employeeId: "emp-1002", currencyId: "USD", lines: [ { id: "line-1", componentId: "comp-basic-salary", type: "EARNING", amount: 1100 }, { id: "line-2", componentId: "comp-paye", type: "DEDUCTION", amount: 80.25 } ], totals: { gross: 1100, netPay: 1012.5 } },
    { id: "payslip-2025-08-emp-1003", payRunId: "payrun-2025-08-hq", employeeId: "emp-1003", currencyId: "USD", lines: [ { id: "line-1", componentId: "comp-basic-salary", type: "EARNING", amount: 1300 }, { id: "line-2", componentId: "comp-paye", type: "DEDUCTION", amount: 95.0 } ], totals: { gross: 1300, netPay: 1192.0 } },
  ],
  paymentBatches: [
    { id: "paybatch-2025-08-hq", payRunId: "payrun-2025-08-hq", status: "PENDING", payments: [ { id: "pay-emp-1001", payslipId: "payslip-2025-08-emp-1001", employeeId: "emp-1001", amount: 1304.5 }, { id: "pay-emp-1002", payslipId: "payslip-2025-08-emp-1002", employeeId: "emp-1002", amount: 1012.5 }, { id: "pay-emp-1003", payslipId: "payslip-2025-08-emp-1003", employeeId: "emp-1003", amount: 1192.0 } ] },
  ],
  timeSheets: [
    { id: "ts-2025-08-emp-1001", employeeId: "emp-1001", periodStart: "2025-08-01", periodEnd: "2025-08-31", status: "APPROVED", entries: [ { date: "2025-08-12", hours: 3.0, type: "OVERTIME", componentId: "comp-ot150" } ] },
  ],
}

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    setActivePayRun(state, action: PayloadAction<string>) {
      const runId = action.payload
      const run = state.payRuns.find(r => r.id === runId)
      if (run) {
        state.payRuns = state.payRuns.map(r => ({ ...r, status: r.id === runId ? r.status : r.status }))
      }
    },
  },
})

export const { setActivePayRun } = payrollSlice.actions
export default payrollSlice.reducer


