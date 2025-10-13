import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccountingCurrency, ChartOfAccounts } from '@/lib/api/accounting-api'

export interface Account {
  id: string
  accountNumber: string
  accountName: string
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense'
  isControlAccount: boolean
  balance: number
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  id: string
  journalDate: string
  referenceNumber: string
  description: string
  userId: string
  isManualEntry: boolean
  currencyId: string
  exchangeRate: number
  lines: JournalLine[]
  createdAt: string
  updatedAt: string
}

export interface JournalLine {
  id: string
  journalId: string
  accountId: string
  account: Account
  debitAmount?: number
  creditAmount?: number
  baseDebitAmount?: number
  baseCreditAmount?: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  creditLimit: number
  balance: number
  debtorsControlAccountId: string
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  balance: number
  creditorsControlAccountId: string
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  customerId: string
  customer: Customer
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  totalAmount: number
  currencyId: string
  currency: Currency
  status: 'Draft' | 'Unpaid' | 'Partially Paid' | 'Paid' | 'Cancelled'
  journalId?: string
  lines: InvoiceLine[]
  createdAt: string
  updatedAt: string
}

export interface InvoiceLine {
  id: string
  invoiceId: string
  itemDescription: string
  quantity: number
  unitPrice: number
  totalLineAmount: number
}

export interface Currency {
  id: string
  code: string
  name: string
  symbol: string
}

export interface Asset {
  id: string
  assetName: string
  assetNumber: string
  purchaseDate: string
  cost: number
  usefulLifeYears: number
  depreciationMethod: 'Straight-Line' | 'Diminishing-Balance'
  currentBookValue: number
  assetAccountId: string
  accumulatedDepreciationAccountId: string
  depreciationExpenseAccountId: string
  status: 'In Use' | 'Disposed'
  createdAt: string
  updatedAt: string
}

interface AccountingState {
  // Currencies
  currencies: AccountingCurrency[]
  currenciesLoading: boolean
  currenciesError: string | null
  selectedCurrency: AccountingCurrency | null

  // Other accounting entities
  journalEntries: any[]
  customers: any[]
  suppliers: any[]
  invoices: any[]
  chartOfAccounts: ChartOfAccounts[]
  
  // Loading states
  journalEntriesLoading: boolean
  customersLoading: boolean
  suppliersLoading: boolean
  invoicesLoading: boolean
  dashboardLoading: boolean
  chartOfAccountsLoading: boolean
  
  // Dashboard data
  dashboardData: any | null
}

const initialState: AccountingState = {
  // Currencies
  currencies: [],
  currenciesLoading: false,
  currenciesError: null,
  selectedCurrency: null,

  // Other entities
  journalEntries: [],
  customers: [],
  suppliers: [],
  invoices: [],
  chartOfAccounts: [],
  
  // Loading states
  journalEntriesLoading: false,
  customersLoading: false,
  suppliersLoading: false,
  invoicesLoading: false,
  dashboardLoading: false,
  chartOfAccountsLoading: false,
  
  // Dashboard
  dashboardData: null
}

const accountingSlice = createSlice({
  name: 'accounting',
  initialState,
  reducers: {
    // Currencies actions
    setCurrencies: (state, action: PayloadAction<AccountingCurrency[]>) => {
      state.currencies = action.payload
    },
    addCurrency: (state, action: PayloadAction<AccountingCurrency>) => {
      state.currencies.push(action.payload)
    },
    updateCurrency: (state, action: PayloadAction<AccountingCurrency>) => {
      const index = state.currencies.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.currencies[index] = action.payload
      }
    },
    removeCurrency: (state, action: PayloadAction<string>) => {
      state.currencies = state.currencies.filter(c => c.id !== action.payload)
    },
    setCurrenciesLoading: (state, action: PayloadAction<boolean>) => {
      state.currenciesLoading = action.payload
    },
    setCurrenciesError: (state, action: PayloadAction<string | null>) => {
      state.currenciesError = action.payload
    },
    setSelectedCurrency: (state, action: PayloadAction<AccountingCurrency | null>) => {
      state.selectedCurrency = action.payload
    },

    // Journal entries actions
    setJournalEntries: (state, action: PayloadAction<any[]>) => {
      state.journalEntries = action.payload
    },
    setJournalEntriesLoading: (state, action: PayloadAction<boolean>) => {
      state.journalEntriesLoading = action.payload
    },

    // Customers actions
    setCustomers: (state, action: PayloadAction<any[]>) => {
      state.customers = action.payload
    },
    setCustomersLoading: (state, action: PayloadAction<boolean>) => {
      state.customersLoading = action.payload
    },

    // Suppliers actions
    setSuppliers: (state, action: PayloadAction<any[]>) => {
      state.suppliers = action.payload
    },
    setSuppliersLoading: (state, action: PayloadAction<boolean>) => {
      state.suppliersLoading = action.payload
    },

    // Invoices actions
    setInvoices: (state, action: PayloadAction<any[]>) => {
      state.invoices = action.payload
    },
    setInvoicesLoading: (state, action: PayloadAction<boolean>) => {
      state.invoicesLoading = action.payload
    },

    // Dashboard actions
    setDashboardData: (state, action: PayloadAction<any>) => {
      state.dashboardData = action.payload
    },
    setDashboardLoading: (state, action: PayloadAction<boolean>) => {
      state.dashboardLoading = action.payload
    },

    // Chart of Accounts actions
    setChartOfAccounts: (state, action: PayloadAction<ChartOfAccounts[]>) => {
      state.chartOfAccounts = action.payload
      state.chartOfAccountsError = null
    },
    addChartOfAccount: (state, action: PayloadAction<ChartOfAccounts>) => {
      state.chartOfAccounts.push(action.payload)
    },
    updateChartOfAccount: (state, action: PayloadAction<ChartOfAccounts>) => {
      const index = state.chartOfAccounts.findIndex(account => account.id === action.payload.id)
      if (index !== -1) {
        state.chartOfAccounts[index] = action.payload
      }
    },
    removeChartOfAccount: (state, action: PayloadAction<string>) => {
      state.chartOfAccounts = state.chartOfAccounts.filter(account => account.id !== action.payload)
    },
    setChartOfAccountsLoading: (state, action: PayloadAction<boolean>) => {
      state.chartOfAccountsLoading = action.payload
    },
    setChartOfAccountsError: (state, action: PayloadAction<string | null>) => {
      state.chartOfAccountsError = action.payload
      state.chartOfAccountsLoading = false
    },
    setSelectedChartOfAccount: (state, action: PayloadAction<ChartOfAccounts | null>) => {
      state.selectedChartOfAccount = action.payload
    },
  }
})

export const {
  // Currencies
  setCurrencies,
  addCurrency,
  updateCurrency,
  removeCurrency,
  setCurrenciesLoading,
  setCurrenciesError,
  setSelectedCurrency,
  
  // Journal entries
  setJournalEntries,
  setJournalEntriesLoading,
  
  // Customers
  setCustomers,
  setCustomersLoading,
  
  // Suppliers
  setSuppliers,
  setSuppliersLoading,
  
  // Invoices
  setInvoices,
  setInvoicesLoading,
  
  // Dashboard
  setDashboardData,
  setDashboardLoading,

  // Chart of Accounts
  setChartOfAccounts,
  addChartOfAccount,
  updateChartOfAccount,
  removeChartOfAccount,
  setChartOfAccountsLoading,
  setChartOfAccountsError,
  setSelectedChartOfAccount,
} = accountingSlice.actions

export default accountingSlice.reducer