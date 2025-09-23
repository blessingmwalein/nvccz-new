import { 
  CiHome, 
  CiShop, 
  CiViewTimeline, 
  CiFileOn, 
  CiWallet, 
  CiUser,
  CiSettings,
  CiDollar,
  CiCalendar,
  CiGrid41,
  CiViewBoard,
  CiViewTable,
  CiViewColumn,
  CiViewList,
  CiCircleCheck
} from "react-icons/ci"

export interface SubModuleConfig {
  id: string
  name: string
  path: string
  icon: React.ElementType
  description: string
}

export interface ModuleGroupConfig {
  id: string
  title: string
  items: SubModuleConfig[]
}

export interface ModuleConfig {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  path: string
  subModules: SubModuleConfig[]
  groups?: ModuleGroupConfig[]
}

export const MODULE_CONFIG: ModuleConfig[] = [
  {
    id: "homepage",
    name: "Homepage",
    description: "Overview of all modules and quick access",
    icon: CiHome,
    color: "oklch(0.60 0.18 252)",
    path: "/",
    subModules: []
  },
  {
    id: "portfolio-management",
    name: "Portfolio Management",
    description: "Manage investment portfolios and assets",
    icon: CiShop,
    color: "oklch(0.72 0.12 225)",
    path: "/portfolio",
    // Flat shortcuts (optional)
    subModules: [],
    // Grouped navigation per requirements
    groups: [
      {
        id: "applications",
        title: "Applications",
        items: [
          { id: "applications-dashboard", name: "Dashboard", path: "/applications/dashboard", icon: CiViewBoard, description: "Applications dashboard" },
          { id: "applications-current", name: "Current Applications", path: "/applications?tab=current", icon: CiViewList, description: "Current applications" },
          { id: "applications-past", name: "Past Applications", path: "/applications?tab=past", icon: CiViewColumn, description: "Past applications" },
          { id: "applications-due-diligence", name: "Due Diligence", path: "/applications/due-diligence", icon: CiViewColumn, description: "Due diligence" },
          { id: "applications-board-review", name: "Board Review", path: "/applications/board-review", icon: CiViewBoard, description: "Board review" },
          { id: "applications-term-sheet", name: "Term Sheet", path: "/applications/term-sheet", icon: CiFileOn, description: "Term sheet" },
          { id: "applications-disbursement", name: "Fund Disbursement", path: "/applications/disbursement", icon: CiViewTimeline, description: "Fund disbursement" }
        ]
      },
      {
        id: "funds",
        title: "Funds",
        items: [
          { id: "funds-dashboard", name: "Dashboard", path: "/funds", icon: CiGrid41, description: "Funds dashboard" },
          { id: "funds-investors", name: "Investors", path: "/funds/investors", icon: CiViewTable, description: "Fund investors" },
          { id: "funds-analytics", name: "Fund Analytics", path: "/funds/analytics", icon: CiViewBoard, description: "Analytics" }
        ]
      },
      {
        id: "companies",
        title: "Companies",
        items: [
          { id: "companies-page", name: "Companies", path: "/companies", icon: CiShop, description: "Companies" },
          { id: "companies-performance", name: "Performance Dashboard", path: "/companies/performance", icon: CiGrid41, description: "Company performance" },
          { id: "companies-updates", name: "Quarterly Updates", path: "/companies/updates", icon: CiCalendar, description: "Quarterly updates" }
        ]
      }
    ]
  },
  {
    id: "performance-management",
    name: "Performance Management",
    description: "Performance tracking and reporting",
    icon: CiViewTimeline,
    color: "oklch(0.58 0.09 260)",
    path: "/performance",
    subModules: [
      { id: "performance-dashboard", name: "Performance Dashboard", path: "/performance", icon: CiGrid41, description: "Overview and metrics" },
      { id: "kpi-management", name: "KPI Management", path: "/performance/kpis", icon: CiViewTimeline, description: "KPIs" },
      { id: "departments-management", name: "Departments", path: "/performance/departments", icon: CiUser, description: "Department management" },
      { id: "goals-management", name: "Goals Management", path: "/performance/goals", icon: CiCircleCheck, description: "Goals" },
      { id: "tasks-management", name: "Tasks Management", path: "/performance/tasks", icon: CiViewList, description: "Tasks" },
      { id: "department-scorecards", name: "Department Scorecards", path: "/performance/department-scorecards", icon: CiViewBoard, description: "Department performance scorecards" },
      { id: "user-scorecards", name: "User Scorecards", path: "/performance/user-scorecards", icon: CiViewTable, description: "User performance scorecards" }
    ]
  },
  {
    id: "accounting",
    name: "Accounting",
    description: "Accounting and financial operations",
    icon: CiDollar,
    color: "oklch(0.62 0.10 170)",
    path: "/accounting",
    subModules: [
      { id: "accounting-dashboard", name: "Dashboard", path: "/accounting", icon: CiGrid41, description: "Accounting dashboard" }
    ]
  },
  {
    id: "payroll",
    name: "Payroll",
    description: "Payroll management",
    icon: CiDollar,
    color: "oklch(0.54 0.1 280)",
    path: "/payroll",
    subModules: [
      { id: "payroll-dashboard", name: "Dashboard", path: "/payroll", icon: CiGrid41, description: "Payroll dashboard" },
      { id: "payroll-employees", name: "Employees", path: "/payroll/employees", icon: CiViewList, description: "Employees" },
      { id: "payroll-runs", name: "Pay Runs", path: "/payroll/runs", icon: CiCalendar, description: "Pay runs" },
      { id: "payroll-payslips", name: "Payslips", path: "/payroll/payslips", icon: CiFileOn, description: "Search payslips" },
      { id: "payroll-tax-rules", name: "Tax Rules", path: "/payroll/tax-rules", icon: CiDollar, description: "Tax rules management" },
      { id: "payroll-allowance-types", name: "Allowance Types", path: "/payroll/allowance-types", icon: CiViewTable, description: "Allowance types" },
      { id: "payroll-deduction-types", name: "Deduction Types", path: "/payroll/deduction-types", icon: CiViewTable, description: "Deduction types" },
      { id: "payroll-bank-templates", name: "Bank Templates", path: "/payroll/bank-templates", icon: CiViewTable, description: "Bank file templates" }
    ]
  },
  {
    id: "procurement",
    name: "Procurement",
    description: "Procurement operations",
    icon: CiViewList,
    color: "oklch(0.56 0.10 220)",
    path: "/procurement",
    subModules: [
      { id: "procurement-dashboard", name: "Dashboard", path: "/procurement", icon: CiGrid41, description: "Procurement dashboard" }
    ]
  }
]

export const getModuleById = (id: string): ModuleConfig | undefined => {
  return MODULE_CONFIG.find(module => module.id === id)
}

export const getSubModuleByPath = (path: string): SubModuleConfig | undefined => {
  for (const module of MODULE_CONFIG) {
    const subModule = module.subModules.find(sub => sub.path === path)
    if (subModule) return subModule
    if (module.groups) {
      for (const group of module.groups) {
        const item = group.items.find(sub => sub.path === path)
        if (item) return item
      }
    }
  }
  return undefined
}

export const getModuleByPath = (path: string): ModuleConfig | undefined => {
  return MODULE_CONFIG.find(module => 
    path === module.path || 
    module.subModules.some(sub => path.startsWith(sub.path)) ||
    (module.groups ? module.groups.some(g => g.items.some(sub => path.startsWith(sub.path.split("?")[0]))) : false)
  )
}
