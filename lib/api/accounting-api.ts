import { apiClient } from './api-client'

// Types matching accounting entities
export interface AccountingCurrency {
  id: string
  code: string
  name: string
  symbol: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCurrencyRequest {
  code: string
  name: string
  symbol: string
  isDefault?: boolean
  isActive?: boolean
}

// Invoice interfaces
export interface InvoiceItem {
  description: string
  amount?: number
  category?: string
  taxRate?: number
  quantity?: number
  unitPrice?: number
}

export interface Invoice {
  id: string
  customerId: string
  amount: string
  vatAmount: string
  totalAmount: string
  currencyId: string
  transactionDate: string
  description: string
  invoiceNumber: string
  items: InvoiceItem[]
  isTaxable: boolean
  status: 'DRAFT' | 'SENT' | 'PAID' | 'VOID'
  paymentMethod: string
  exchangeRateAtCreation: string | null
  paymentCurrencyId: string | null
  amountInPaymentCurrency: string | null
  paymentDate: string | null
  journalEntryId: string
  isActive: boolean
  createdById: string
  createdAt: string
  updatedAt: string
  customer: InvoiceCustomer
  currency: AccountingCurrency
  journalEntry: {
    id: string
    referenceNumber: string
    status: string
  }
}

export interface InvoiceCustomer {
  id: string
  name: string
  taxNumber: string
  contactPerson: string
  email: string
  phone: string
  address: string
  paymentTerms: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateInvoiceRequest {
  customerId: string
  amount: number
  currencyId: string
  transactionDate: string
  description: string
  invoiceDate?: string
  invoiceNumber?: string
  isTaxable: boolean
  exchangeRateAtCreation?: number
  items: InvoiceItem[]
}

export interface MarkAsPaidRequest {
  paymentMethod: 'CASH' | 'BANK' | 'CARD' | 'CHEQUE'
  paymentCurrencyId: string
}

export interface VoidInvoiceRequest {
  reason: string
}

export interface InvoicesResponse {
  invoices: Invoice[]
  total: number
  page: number
  limit: number
  totalPages: number
}


export interface Account {
  id: string
  accountNumber: string
  accountName: string
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE'
  parentAccountId?: string
  isActive: boolean
  balance: number
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  id: string
  journalNumber: string
  description: string
  journalDate: string
  totalDebit: number
  totalCredit: number
  status: 'DRAFT' | 'POSTED' | 'REVERSED'
  createdAt: string
  updatedAt: string
  lines: JournalLine[]
}

export interface JournalLine {
  id: string
  accountId: string
  description: string
  debitAmount: number
  creditAmount: number
  account: Account
}

export interface Customer {
  id: string
  name: string
  taxNumber?: string | null
  contactPerson?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  paymentTerms?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerRequest {
  name: string
  taxNumber?: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  paymentTerms?: string
  isActive?: boolean
}

export interface CustomersResponse {
  customers: Customer[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Supplier {
  id: string
  supplierNumber: string
  name: string
  email: string
  phone: string
  address: string
  isActive: boolean
  balance: number
  createdAt: string
  updatedAt: string
}

// Removed duplicate Invoice interface - using the one above with proper types

// Asset interfaces
export interface Asset {
  id: string
  assetName: string
  assetCode: string
  description: string
  purchaseDate: string
  cost: string
  usefulLifeYears: number
  depreciationMethod: string
  currentBookValue: string
  salvageValue: string
  assetAccountId: string
  accumulatedDepreciationAccountId: string
  depreciationExpenseAccountId: string
  status: string
  disposalDate?: string
  disposalValue?: string
  disposalGainLoss?: string
  location?: string
  serialNumber?: string
  warrantyExpiry?: string
  isActive: boolean
  createdById: string
  createdAt: string
  updatedAt: string
  assetAccount: ChartOfAccount
  accumulatedDepreciationAccount: ChartOfAccount
  depreciationExpenseAccount: ChartOfAccount
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  depreciationRecords: DepreciationRecord[]
  disposalRecords?: any[]
}

export interface DepreciationRecord {
  id: string
  assetId: string
  period: string
  depreciationAmount: string
  accumulatedDepreciation: string
  bookValue: string
  isPosted: boolean
  postedAt?: string
  createdById: string
  createdAt: string
}

export interface CreateAssetRequest {
  assetName: string
  assetCode: string
  description: string
  cost: number
  usefulLifeYears: number
  depreciationMethod: string
  assetAccountId: string
  accumulatedDepreciationAccountId: string
  depreciationExpenseAccountId: string
  purchaseDate: string
  location?: string
  vendor?: string
}

export interface UpdateAssetRequest {
  assetName: string
  description: string
  location?: string
  vendor?: string
}

export interface CalculateDepreciationRequest {
  depreciationDate: string
  period: string
}

export interface DisposeAssetRequest {
  disposalDate: string
  disposalAmount: number
  notes?: string
  disposalValue: number
  disposalMethod: 'SALE' | 'SCRAP' | 'DONATION' | 'TRADE_IN'
}

export interface DepreciationScheduleItem {
  period: string
  depreciationAmount: number
  accumulatedDepreciation: number
  bookValue: number
  isPosted: boolean
}

export interface RevalueAssetRequest {
  newValue: number
  revaluationDate: string
  notes?: string
}

// Credit Note interfaces
export interface CreditNote {
  id: string
  customerId: string
  invoiceId: string
  amount: string
  vatAmount: string
  totalAmount: string
  currencyId: string
  creditNoteNumber: string
  reason: string
  status: 'DRAFT' | 'SENT' | 'APPLIED' | 'VOID'
  appliedAmount: string
  remainingAmount: string
  isActive: boolean
  journalEntryId: string | null
  createdById: string
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    name: string
    email: string
  }
  originalInvoice: {
    id: string
    invoiceNumber: string
    totalAmount: string
  }
  currency: {
    id: string
    code: string
    symbol: string
  }
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface CreateCreditNoteRequest {
  invoiceId: string
  amount: number
  totalAmount: number
  reason: string
  description: string
  creditNoteDate: string
}

export interface UpdateCreditNoteRequest {
  amount: number
  reason: string
  description: string
}

export interface ApplyCreditNoteRequest {
  invoiceId: string
  amount: number
}

export interface DashboardStats {
  invoices: {
    count: number
    totalAmount: number
    change: number
  }
  creditNotes: {
    count: number
    totalAmount: number
    change: number
  }
  customers: {
    count: number
    totalValue: number
    change: number
  }
  expenses: {
    count: number
    totalAmount: number
    change: number
  }
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    fill: boolean
  }[]
}

class AccountingApiService {
  // Currencies
  async getCurrencies(): Promise<AccountingResponse<AccountingCurrency[]>> {
    return apiClient.get<AccountingResponse<AccountingCurrency[]>>('/accounting/currencies')
  }

  async getCurrencyById(id: string): Promise<AccountingResponse<AccountingCurrency>> {
    return apiClient.get<AccountingResponse<AccountingCurrency>>(`/accounting/currencies/${id}`)
  }

  async createCurrency(data: CreateCurrencyRequest): Promise<AccountingResponse<AccountingCurrency>> {
    return apiClient.post<AccountingResponse<AccountingCurrency>>('/accounting/currencies', data)
  }

  async updateCurrency(id: string, data: CreateCurrencyRequest): Promise<AccountingResponse<AccountingCurrency>> {
    return apiClient.put<AccountingResponse<AccountingCurrency>>(`/accounting/currencies/${id}`, data)
  }

  async deleteCurrency(id: string): Promise<AccountingResponse<any>> {
    return apiClient.delete<AccountingResponse<any>>(`/accounting/currencies/${id}`)
  }

  // Chart of Accounts
  async getAccounts(): Promise<AccountingResponse<Account[]>> {
    return apiClient.get<AccountingResponse<Account[]>>('/accounting/accounts')
  }

  async getAccountById(id: string): Promise<AccountingResponse<Account>> {
    return apiClient.get<AccountingResponse<Account>>(`/accounting/accounts/${id}`)
  }

  async createAccount(data: Partial<Account>): Promise<AccountingResponse<Account>> {
    return apiClient.post<AccountingResponse<Account>>('/accounting/accounts', data)
  }

  async updateAccount(id: string, data: Partial<Account>): Promise<AccountingResponse<Account>> {
    return apiClient.put<AccountingResponse<Account>>(`/accounting/accounts/${id}`, data)
  }

  async deleteAccount(id: string): Promise<AccountingResponse<any>> {
    return apiClient.delete<AccountingResponse<any>>(`/accounting/accounts/${id}`)
  }

  // Journal Entries
  async getJournalEntries(): Promise<AccountingResponse<JournalEntry[]>> {
    return apiClient.get<AccountingResponse<JournalEntry[]>>('/accounting/journal-entries')
  }

  async getJournalEntryById(id: string): Promise<AccountingResponse<JournalEntry>> {
    return apiClient.get<AccountingResponse<JournalEntry>>(`/accounting/journal-entries/${id}`)
  }

  async createJournalEntry(data: any): Promise<AccountingResponse<JournalEntry>> {
    return apiClient.post<AccountingResponse<JournalEntry>>('/accounting/journal-entries', data)
  }

  async updateJournalEntry(id: string, data: Partial<JournalEntry>): Promise<AccountingResponse<JournalEntry>> {
    return apiClient.put<AccountingResponse<JournalEntry>>(`/accounting/journal-entries/${id}`, data)
  }

  async deleteJournalEntry(id: string): Promise<AccountingResponse<any>> {
    return apiClient.delete<AccountingResponse<any>>(`/accounting/journal-entries/${id}`)
  }

  // Customers
  async getCustomers(params?: {
    page?: number
    limit?: number
    isActive?: boolean
  }): Promise<AccountingResponse<CustomersResponse>> {
    const queryString = params ? `?${new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined).map(([key, value]) => [key, String(value)])
    ).toString()}` : ''
    
    const response = await apiClient.get<AccountingResponse<CustomersResponse>>(`/accounting/customers${queryString}`)
    return response
  }

  async getCustomerById(id: string): Promise<AccountingResponse<Customer>> {
    const response = await apiClient.get<AccountingResponse<Customer>>(`/accounting/customers/${id}`)
    return response
  }

  async createCustomer(data: CreateCustomerRequest): Promise<AccountingResponse<Customer>> {
    const response = await apiClient.post<AccountingResponse<Customer>>('/accounting/customers', data)
    return response
  }

  async updateCustomer(id: string, data: CreateCustomerRequest): Promise<AccountingResponse<Customer>> {
    const response = await apiClient.put<AccountingResponse<Customer>>(`/accounting/customers/${id}`, data)
    return response
  }

  async deleteCustomer(id: string): Promise<AccountingResponse<any>> {
    const response = await apiClient.delete<AccountingResponse<any>>(`/accounting/customers/${id}`)
    return response
  }

  // Suppliers
  async getSuppliers(): Promise<AccountingResponse<Supplier[]>> {
    return apiClient.get<AccountingResponse<Supplier[]>>('/accounting/suppliers')
  }

  async getSupplierById(id: string): Promise<AccountingResponse<Supplier>> {
    return apiClient.get<AccountingResponse<Supplier>>(`/accounting/suppliers/${id}`)
  }

  async createSupplier(data: Partial<Supplier>): Promise<AccountingResponse<Supplier>> {
    return apiClient.post<AccountingResponse<Supplier>>('/accounting/suppliers', data)
  }

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<AccountingResponse<Supplier>> {
    return apiClient.put<AccountingResponse<Supplier>>(`/accounting/suppliers/${id}`, data)
  }

  async deleteSupplier(id: string): Promise<AccountingResponse<any>> {
    return apiClient.delete<AccountingResponse<any>>(`/accounting/suppliers/${id}`)
  }

  // Invoices
  async getInvoices(params?: {
    page?: number
    limit?: number
    status?: 'DRAFT' | 'SENT' | 'PAID' | 'VOID'
    search?: string
    isActive?: boolean
  }): Promise<AccountingResponse<InvoicesResponse>> {
    const queryString = params ? `?${new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined).map(([key, value]) => [key, String(value)])
    ).toString()}` : ''
    
    return apiClient.get<AccountingResponse<InvoicesResponse>>(`/accounting/invoices${queryString}`)
  }

  async getInvoiceById(id: string): Promise<AccountingResponse<Invoice>> {
    return apiClient.get<AccountingResponse<Invoice>>(`/accounting/invoices/${id}`)
  }

  async createInvoice(data: CreateInvoiceRequest): Promise<AccountingResponse<Invoice>> {
    return apiClient.post<AccountingResponse<Invoice>>('/accounting/invoices', data)
  }

  async updateInvoice(id: string, data: CreateInvoiceRequest): Promise<AccountingResponse<Invoice>> {
    return apiClient.put<AccountingResponse<Invoice>>(`/accounting/invoices/${id}`, data)
  }

  async deleteInvoice(id: string): Promise<AccountingResponse<any>> {
    return apiClient.delete<AccountingResponse<any>>(`/accounting/invoices/${id}`)
  }

  async sendInvoice(id: string): Promise<AccountingResponse<Invoice>> {
    return apiClient.patch<AccountingResponse<Invoice>>(`/accounting/invoices/${id}/send`)
  }

  async markInvoiceAsPaid(id: string, data: MarkAsPaidRequest): Promise<AccountingResponse<Invoice>> {
    return apiClient.patch<AccountingResponse<Invoice>>(`/accounting/invoices/${id}/mark-as-paid`, data)
  }

  async voidInvoice(id: string, data: VoidInvoiceRequest): Promise<AccountingResponse<Invoice>> {
    return apiClient.patch<AccountingResponse<Invoice>>(`/accounting/invoices/${id}/void`, data)
  }

  // Assets
  async getAssets(): Promise<AccountingResponse<{ assets: Asset[], total: number, page: number, totalPages: number }>> {
    return apiClient.get<AccountingResponse<{ assets: Asset[], total: number, page: number, totalPages: number }>>('/accounting/assets')
  }

  async getAsset(id: string): Promise<AccountingResponse<Asset>> {
    return apiClient.get<AccountingResponse<Asset>>(`/accounting/assets/${id}`)
  }

  async createAsset(data: CreateAssetRequest): Promise<AccountingResponse<Asset>> {
    return apiClient.post<AccountingResponse<Asset>>('/accounting/assets', data)
  }

  async updateAsset(id: string, data: UpdateAssetRequest): Promise<AccountingResponse<Asset>> {
    return apiClient.put<AccountingResponse<Asset>>(`/accounting/assets/${id}`, data)
  }

  async deleteAsset(id: string): Promise<AccountingResponse<void>> {
    return apiClient.delete<AccountingResponse<void>>(`/accounting/assets/${id}`)
  }

  async calculateDepreciation(id: string, data: CalculateDepreciationRequest): Promise<AccountingResponse<DepreciationRecord>> {
    return apiClient.post<AccountingResponse<DepreciationRecord>>(`/accounting/assets/${id}/depreciation`, data)
  }

  // Post depreciation
  async postDepreciation(depreciationId: string): Promise<AccountingResponse<void>> {
    return apiClient.post<AccountingResponse<void>>(`/accounting/assets/depreciation/${depreciationId}/post`, {})
  }

  async disposeAsset(id: string, data: DisposeAssetRequest): Promise<AccountingResponse<void>> {
    return apiClient.post<AccountingResponse<void>>(`/accounting/assets/${id}/dispose`, data)
  }

  async getDepreciationSchedule(id: string): Promise<AccountingResponse<DepreciationScheduleItem[]>> {
    return apiClient.get<AccountingResponse<DepreciationScheduleItem[]>>(`/accounting/assets/${id}/depreciation-schedule`)
  }

  // Dashboard
  async getDashboardStats(month: string, currencyId: string): Promise<AccountingResponse<DashboardStats>> {
    return apiClient.get<AccountingResponse<DashboardStats>>(`/accounting/dashboard/stats?month=${month}&currencyId=${currencyId}`)
  }

  async getSalesChart(currencyId: string): Promise<AccountingResponse<ChartData>> {
    return apiClient.get<AccountingResponse<ChartData>>(`/accounting/dashboard/sales-chart?currencyId=${currencyId}`)
  }

  async getCreditNotesChart(currencyId: string): Promise<AccountingResponse<ChartData>> {
    return apiClient.get<AccountingResponse<ChartData>>(`/accounting/dashboard/credit-notes-chart?currencyId=${currencyId}`)
  }

  async getRecentExpenses(limit: number = 10, currencyId: string): Promise<AccountingResponse<Expense[]>> {
    return apiClient.get<AccountingResponse<Expense[]>>(`/accounting/expenses/recent?limit=${limit}&currencyId=${currencyId}`)
  }

  // Reports
  async getTrialBalance(date?: string): Promise<AccountingResponse<any>> {
    return apiClient.get<AccountingResponse<any>>('/accounting/reports/trial-balance', { params: { date } })
  }

  async getBalanceSheet(date?: string): Promise<AccountingResponse<any>> {
    return apiClient.get<AccountingResponse<any>>('/accounting/reports/balance-sheet', { params: { date } })
  }

  async getIncomeStatement(startDate: string, endDate: string): Promise<AccountingResponse<IncomeStatementData>> {
    const queryString = `?startDate=${startDate}&endDate=${endDate}`
    return apiClient.get<AccountingResponse<IncomeStatementData>>(`/accounting/income-statement${queryString}`)
  }

  // Chart of Accounts
  async getChartOfAccounts(params?: {
    accountType?: string
    isActive?: boolean
    parentId?: string
  }): Promise<AccountingResponse<ChartOfAccount[]>> {
    const queryString = params ? `?${new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined).map(([key, value]) => [key, String(value)])
    ).toString()}` : ''
    
    const response = await apiClient.get<AccountingResponse<ChartOfAccount[]>>(`/accounting/chart-of-accounts${queryString}`)
    return response
  }

  async getChartOfAccountById(id: string): Promise<AccountingResponse<ChartOfAccount>> {
    const response = await apiClient.get<AccountingResponse<ChartOfAccount>>(`/accounting/chart-of-accounts/${id}`)
    return response
  }

  async createChartOfAccount(data: CreateChartOfAccountRequest): Promise<AccountingResponse<ChartOfAccount>> {
    const response = await apiClient.post<AccountingResponse<ChartOfAccount>>('/accounting/chart-of-accounts', data)
    return response
  }

  async updateChartOfAccount(id: string, data: CreateChartOfAccountRequest): Promise<AccountingResponse<ChartOfAccount>> {
    const response = await apiClient.put<AccountingResponse<ChartOfAccount>>(`/accounting/chart-of-accounts/${id}`, data)
    return response
  }

  async deleteChartOfAccount(id: string): Promise<AccountingResponse<any>> {
    const response = await apiClient.delete<AccountingResponse<any>>(`/accounting/chart-of-accounts/${id}`)
    return response
  }

  // Vendors
  async getVendors(params?: {
    page?: number
    limit?: number
    isActive?: boolean
  }): Promise<AccountingResponse<Vendor[]>> {
    const queryString = params ? `?${new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined).map(([key, value]) => [key, String(value)])
    ).toString()}` : ''
    
    const response = await apiClient.get<AccountingResponse<Vendor[]>>(`/accounting/vendors${queryString}`)
    return response
  }

  async getVendorById(id: string): Promise<AccountingResponse<Vendor>> {
    const response = await apiClient.get<AccountingResponse<Vendor>>(`/accounting/vendors/${id}`)
    return response
  }

  async createVendor(data: CreateVendorRequest): Promise<AccountingResponse<Vendor>> {
    const response = await apiClient.post<AccountingResponse<Vendor>>('/accounting/vendors', data)
    return response
  }

  async updateVendor(id: string, data: CreateVendorRequest): Promise<AccountingResponse<Vendor>> {
    const response = await apiClient.put<AccountingResponse<Vendor>>(`/accounting/vendors/${id}`, data)
    return response
  }

  async deleteVendor(id: string): Promise<AccountingResponse<any>> {
    const response = await apiClient.delete<AccountingResponse<any>>(`/accounting/vendors/${id}`)
    return response
  }

  // Expense Categories
  async getExpenseCategories(params?: {
    page?: number
    limit?: number
    isActive?: boolean
    parentId?: string
  }): Promise<AccountingResponse<ExpenseCategory[]>> {
    const queryString = params ? `?${new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined).map(([key, value]) => [key, String(value)])
    ).toString()}` : ''
    
    const response = await apiClient.get<AccountingResponse<ExpenseCategory[]>>(`/accounting/expense-categories${queryString}`)
    return response
  }

  async getExpenseCategoryById(id: string): Promise<AccountingResponse<ExpenseCategory>> {
    const response = await apiClient.get<AccountingResponse<ExpenseCategory>>(`/accounting/expense-categories/${id}`)
    return response
  }

  async createExpenseCategory(data: CreateExpenseCategoryRequest): Promise<AccountingResponse<ExpenseCategory>> {
    const response = await apiClient.post<AccountingResponse<ExpenseCategory>>('/accounting/expense-categories', data)
    return response
  }

  async updateExpenseCategory(id: string, data: CreateExpenseCategoryRequest): Promise<AccountingResponse<ExpenseCategory>> {
    const response = await apiClient.put<AccountingResponse<ExpenseCategory>>(`/accounting/expense-categories/${id}`, data)
    return response
  }

  async deleteExpenseCategory(id: string): Promise<AccountingResponse<any>> {
    const response = await apiClient.delete<AccountingResponse<any>>(`/accounting/expense-categories/${id}`)
    return response
  }

  // Expenses
  async getExpenses(params?: {
    page?: number
    limit?: number
    search?: string
    isActive?: boolean
    status?: 'DRAFT' | 'POSTED' | 'VOID'
  }): Promise<AccountingResponse<Expense[]>> {
    const queryString = params ? `?${new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined).map(([key, value]) => [key, String(value)])
    ).toString()}` : ''
    
    const response = await apiClient.get<AccountingResponse<Expense[]>>(`/accounting/expenses${queryString}`)
    return response
  }

  async getExpenseById(id: string): Promise<AccountingResponse<Expense>> {
    const response = await apiClient.get<AccountingResponse<Expense>>(`/accounting/expenses/${id}`)
    return response
  }

  async createExpense(data: CreateExpenseRequest): Promise<AccountingResponse<Expense>> {
    const response = await apiClient.post<AccountingResponse<Expense>>('/accounting/expenses', data)
    return response
  }

  async updateExpense(id: string, data: CreateExpenseRequest): Promise<AccountingResponse<Expense>> {
    const response = await apiClient.put<AccountingResponse<Expense>>(`/accounting/expenses/${id}`, data)
    return response
  }

  async deleteExpense(id: string): Promise<AccountingResponse<any>> {
    const response = await apiClient.delete<AccountingResponse<any>>(`/accounting/expenses/${id}`)
    return response
  }

  // Journal Entry Actions
  async postJournalEntry(entryId: string): Promise<AccountingResponse<any>> {
    return apiClient.patch<AccountingResponse<any>>(`/accounting/journal-entries/${entryId}/post`)
  }

  async voidJournalEntry(entryId: string): Promise<AccountingResponse<any>> {
    return apiClient.patch<AccountingResponse<any>>(`/accounting/journal-entries/${entryId}/void`)
  }

  // Trial Balance
  async getTrialBalance(date?: string): Promise<AccountingResponse<TrialBalanceData>> {
    const queryString = date ? `?date=${date}` : ''
    return apiClient.get<AccountingResponse<TrialBalanceData>>(`/accounting/trial-balance${queryString}`)
  }

  async getTrialBalanceSummary(date?: string): Promise<AccountingResponse<TrialBalanceSummary>> {
    const queryString = date ? `?date=${date}` : ''
    return apiClient.get<AccountingResponse<TrialBalanceSummary>>(`/accounting/trial-balance/summary${queryString}`)
  }

  // Credit Notes
  async getCreditNotes(): Promise<AccountingResponse<{ creditNotes: CreditNote[], total: number, page: number, totalPages: number }>> {
    return apiClient.get<AccountingResponse<{ creditNotes: CreditNote[], total: number, page: number, totalPages: number }>>('/accounting/credit-notes')
  }

  async getCreditNote(id: string): Promise<AccountingResponse<CreditNote>> {
    return apiClient.get<AccountingResponse<CreditNote>>(`/accounting/credit-notes/${id}`)
  }

  async getCustomerCreditNotes(customerId: string): Promise<AccountingResponse<{ creditNotes: CreditNote[], total: number, page: number, totalPages: number }>> {
    return apiClient.get<AccountingResponse<{ creditNotes: CreditNote[], total: number, page: number, totalPages: number }>>(`/accounting/credit-notes/customer/${customerId}`)
  }

  async createCreditNote(data: CreateCreditNoteRequest): Promise<AccountingResponse<CreditNote>> {
    return apiClient.post<AccountingResponse<CreditNote>>('/accounting/credit-notes', data)
  }

  async updateCreditNote(id: string, data: UpdateCreditNoteRequest): Promise<AccountingResponse<CreditNote>> {
    return apiClient.put<AccountingResponse<CreditNote>>(`/accounting/credit-notes/${id}`, data)
  }

  async sendCreditNote(id: string): Promise<AccountingResponse<CreditNote>> {
    return apiClient.post<AccountingResponse<CreditNote>>(`/accounting/credit-notes/${id}/send`, {})
  }

  async applyCreditNote(id: string, data: ApplyCreditNoteRequest): Promise<AccountingResponse<void>> {
    return apiClient.post<AccountingResponse<void>>(`/accounting/credit-notes/${id}/apply`, data)
  }

  async deleteCreditNote(id: string): Promise<AccountingResponse<void>> {
    return apiClient.delete<AccountingResponse<void>>(`/accounting/credit-notes/${id}`)
  }
}

export const accountingApi = new AccountingApiService()




