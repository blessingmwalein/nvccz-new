import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { accountingApi, AccountingCurrency, ChartOfAccount, Customer, Vendor, ExpenseCategory, Expense, TrialBalanceData, TrialBalanceSummary, IncomeStatementData, Asset, CreditNote, CreateCreditNoteRequest } from '@/lib/api/accounting-api'

// Async thunks for expenses
export const fetchExpenses = createAsyncThunk(
  'accounting/fetchExpenses',
  async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean; status?: 'DRAFT' | 'POSTED' | 'VOID' }) => {
    const response = await accountingApi.getExpenses(params)
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch expenses')
    }
    return response.data
  }
)

export const fetchExpenseById = createAsyncThunk(
  'accounting/fetchExpenseById',
  async (id: string) => {
    const response = await accountingApi.getExpenseById(id)
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch expense')
    }
    return response.data
  }
)

export const createExpense = createAsyncThunk(
  'accounting/createExpense',
  async (data: any) => {
    const response = await accountingApi.createExpense(data)
    if (!response.success) {
      throw new Error(response.error || 'Failed to create expense')
    }
    return response.data
  }
)

export const updateExpense = createAsyncThunk(
  'accounting/updateExpense',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await accountingApi.updateExpense(id, data)
    if (!response.success) {
      throw new Error(response.error || 'Failed to update expense')
    }
    return response.data
  }
)

export const deleteExpense = createAsyncThunk(
  'accounting/deleteExpense',
  async (id: string) => {
    const response = await accountingApi.deleteExpense(id)
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete expense')
    }
    return id
  }
)

// Async thunks for reference data
export const fetchCurrencies = createAsyncThunk(
  'accounting/fetchCurrencies',
  async () => {
    const response = await accountingApi.getCurrencies()
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch currencies')
    }
    return response.data
  }
)

export const fetchVendors = createAsyncThunk(
  'accounting/fetchVendors',
  async () => {
    const response = await accountingApi.getVendors()
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch vendors')
    }
    return response.data
  }
)

export const fetchExpenseCategories = createAsyncThunk(
  'accounting/fetchExpenseCategories',
  async () => {
    const response = await accountingApi.getExpenseCategories()
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch expense categories')
    }
    return response.data
  }
)

// Add new async thunks for posting and voiding journal entries
export const postJournalEntry = createAsyncThunk(
  'accounting/postJournalEntry',
  async (entryId: string, { rejectWithValue }) => {
    try {
      const response = await accountingApi.postJournalEntry(entryId)
      if (!response.success) {
        return rejectWithValue(response.error || response.message || 'Failed to post journal entry')
      }
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const voidJournalEntry = createAsyncThunk(
  'accounting/voidJournalEntry',
  async (entryId: string, { rejectWithValue }) => {
    try {
      const response = await accountingApi.voidJournalEntry(entryId)
      if (!response.success) {
        return rejectWithValue(response.error || response.message || 'Failed to void journal entry')
      }
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

// Add the missing async thunk for chart of accounts
export const fetchChartOfAccounts = createAsyncThunk(
  'accounting/fetchChartOfAccounts',
  async (params?: {
    accountType?: string
    isActive?: boolean
    parentId?: string
  }) => {
    const response = await accountingApi.getChartOfAccounts(params)
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch chart of accounts')
    }
    return response.data
  }
)

// Trial Balance thunks
export const fetchTrialBalance = createAsyncThunk(
  'accounting/fetchTrialBalance',
  async (date?: string) => {
    const response = await accountingApi.getTrialBalance(date)
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch trial balance')
    }
    return response.data
  }
)

export const fetchTrialBalanceSummary = createAsyncThunk(
  'accounting/fetchTrialBalanceSummary',
  async (date?: string) => {
    const response = await accountingApi.getTrialBalanceSummary(date)
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch trial balance summary')
    }
    return response.data
  }
)

// Income Statement thunk
export const fetchIncomeStatement = createAsyncThunk(
  'accounting/fetchIncomeStatement',
  async (params: { startDate: string; endDate: string }) => {
    const response = await accountingApi.getIncomeStatement(params.startDate, params.endDate)
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch income statement')
    }
    return response.data
  }
)

// Assets thunks
export const fetchAssets = createAsyncThunk(
  'accounting/fetchAssets',
  async () => {
    const response = await accountingApi.getAssets()
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch assets')
    }
    return response.data
  }
)

export const fetchAsset = createAsyncThunk(
  'accounting/fetchAsset',
  async (id: string) => {
    const response = await accountingApi.getAsset(id)
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch asset')
    }
    return response.data
  }
)

// Assets thunks
export const postDepreciation = createAsyncThunk(
  'accounting/postDepreciation',
  async (depreciationId: string) => {
    const response = await accountingApi.postDepreciation(depreciationId)
    if (!response.success) {
      throw new Error(response.error || 'Failed to post depreciation')
    }
    return depreciationId
  }
)

// Credit Notes thunks
export const fetchCreditNotes = createAsyncThunk(
  'accounting/fetchCreditNotes',
  async (filters?: { status?: string }) => {
    const response = await accountingApi.getCreditNotes()
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch credit notes')
    }
    return response.data
  }
)

export const fetchCreditNote = createAsyncThunk(
  'accounting/fetchCreditNote',
  async (id: string) => {
    const response = await accountingApi.getCreditNote(id)
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch credit note')
    }
    return response.data
  }
)

export const createCreditNote = createAsyncThunk(
  'accounting/createCreditNote',
  async (data: CreateCreditNoteRequest) => {
    const response = await accountingApi.createCreditNote(data)
    if (!response.success) {
      throw new Error(response.error || 'Failed to create credit note')
    }
    return response.data
  }
)

export const sendCreditNote = createAsyncThunk(
  'accounting/sendCreditNote',
  async (id: string) => {
    const response = await accountingApi.sendCreditNote(id)
    if (!response.success) {
      throw new Error(response.error || 'Failed to send credit note')
    }
    return response.data
  }
)

export const applyCreditNote = createAsyncThunk(
  'accounting/applyCreditNote',
  async ({ id, data }: { id: string, data: { invoiceId: string, amount: number } }) => {
    const response = await accountingApi.applyCreditNote(id, data)
    if (!response.success) {
      throw new Error(response.error || 'Failed to apply credit note')
    }
    return { id, ...data }
  }
)

export const deleteCreditNote = createAsyncThunk(
  'accounting/deleteCreditNote',
  async (id: string) => {
    const response = await accountingApi.deleteCreditNote(id)
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete credit note')
    }
    return id
  }
)

// Make sure these thunks exist and are exported
export const fetchCustomers = createAsyncThunk(
  'accounting/fetchCustomers',
  async () => {
    console.log('Fetching customers...')
    const response = await accountingApi.getCustomers()
    console.log('Customers response:', response)
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch customers')
    }
    return response.data
  }
)

interface AccountingState {
  // Expenses
  expenses: Expense[]
  selectedExpense: Expense | null
  invoices: Invoice[]
  customers: InvoiceCustomer[]
  selectedInvoice: Invoice | null
  expensesLoading: boolean
  expensesError: string | null
  expensesTotalPages: number
  expensesCurrentPage: number
  
  // Reference data
  currencies: AccountingCurrency[]
  vendors: Vendor[]
  expenseCategories: ExpenseCategory[]
  
  // Loading states for reference data
  currenciesLoading: boolean
  vendorsLoading: boolean
  categoriesLoading: boolean
  
  // Error states for reference data
  currenciesError: string | null
  vendorsError: string | null
  categoriesError: string | null

  // Posting and voiding states
  isPosting: boolean
  isVoiding: boolean
  isPostingJournalEntry: boolean
  isVoidingJournalEntry: boolean

  // Journal entries
  journalEntries: any[]

  // Chart of accounts
  chartOfAccounts: ChartOfAccount[]
  chartOfAccountsLoading: boolean
  chartOfAccountsError: string | null

  // Trial Balance
  trialBalance: TrialBalanceData | null
  trialBalanceSummary: TrialBalanceSummary | null
  trialBalanceLoading: boolean
  trialBalanceError: string | null
  trialBalanceSummaryLoading: boolean
  trialBalanceSummaryError: string | null

  // Income Statement
  incomeStatement: IncomeStatementData | null
  incomeStatementLoading: boolean
  incomeStatementError: string | null

  // Assets
  assets: Asset[]
  assetsLoading: boolean
  assetsError: string | null
  selectedAsset: Asset | null
  selectedAssetLoading: boolean
  selectedAssetError: string | null

  // Credit Notes
  creditNotes: CreditNote[]
  creditNotesLoading: boolean
  creditNotesError: string | null
  selectedCreditNote: CreditNote | null
  selectedCreditNoteLoading: boolean
  selectedCreditNoteError: string | null
}

const initialState: AccountingState = {
  // Expenses
  expenses: [],
  selectedExpense: null,
  expensesLoading: false,
  expensesError: null,
  expensesTotalPages: 0,
  expensesCurrentPage: 1,
  
  // Reference data
  currencies: [],
  vendors: [],
  expenseCategories: [],
  
  // Loading states
  currenciesLoading: false,
  vendorsLoading: false,
  categoriesLoading: false,
  
  // Error states
  currenciesError: null,
  vendorsError: null,
  categoriesError: null,

  // Posting and voiding states
  isPosting: false,
  isVoiding: false,
  isPostingJournalEntry: false,
  isVoidingJournalEntry: false,

  // Journal entries
  journalEntries: [],

  // Chart of accounts
  chartOfAccounts: [],
  chartOfAccountsLoading: false,
  chartOfAccountsError: null,

  // Trial Balance
  trialBalance: null,
  trialBalanceSummary: null,
  trialBalanceLoading: false,
  trialBalanceError: null,
  trialBalanceSummaryLoading: false,
  trialBalanceSummaryError: null,

  // Income Statement
  incomeStatement: null,
  incomeStatementLoading: false,
  incomeStatementError: null,

  // Assets
  assets: [],
  assetsLoading: false,
  assetsError: null,
  selectedAsset: null,
  selectedAssetLoading: false,
  selectedAssetError: null,

  // Credit Notes
  creditNotes: [],
  creditNotesLoading: false,
  creditNotesError: null,
  selectedCreditNote: null,
  selectedCreditNoteLoading: false,
  selectedCreditNoteError: null,
}

const accountingSlice = createSlice({
  name: 'accounting',
  initialState,
  reducers: {
    setSelectedExpense: (state, action: PayloadAction<Expense | null>) => {
      state.selectedExpense = action.payload
    },
    clearExpensesError: (state) => {
      state.expensesError = null
    },
    clearTrialBalanceError: (state) => {
      state.trialBalanceError = null
    },
    clearTrialBalanceSummaryError: (state) => {
      state.trialBalanceSummaryError = null
    },
    clearIncomeStatementError: (state) => {
      state.incomeStatementError = null
    },
    clearAssetsError: (state) => {
      state.assetsError = null
    },
    setSelectedAsset: (state, action) => {
      state.selectedAsset = action.payload
    },
    clearCreditNotesError: (state) => {
      state.creditNotesError = null
    },
    setSelectedCreditNote: (state, action) => {
      state.selectedCreditNote = action.payload
    },
    clearSelectedCreditNote: (state) => {
      state.selectedCreditNote = null
    },
    clearDashboardErrors: (state) => {
      state.dashboardStatsError = null
      state.salesChartError = null
      state.creditNotesChartError = null
      state.recentExpensesError = null
    }
  },
  extraReducers: (builder) => {
    // Fetch expenses
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.expensesLoading = true
        state.expensesError = null
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expensesLoading = false
        // API returns expenses directly in data array
        state.expenses = action.payload || []
        // For now, we don't have pagination info in the response
        state.expensesTotalPages = 1
        state.expensesCurrentPage = 1
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.expensesLoading = false
        state.expensesError = action.error.message || 'Failed to fetch expenses'
      })

    // Fetch expense by ID
    builder
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.selectedExpense = action.payload
      })

    // Create expense
    builder
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload)
      })

    // Update expense
    builder
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id)
        if (index !== -1) {
          state.expenses[index] = action.payload
        }
        if (state.selectedExpense?.id === action.payload.id) {
          state.selectedExpense = action.payload
        }
      })

    // Delete expense
    builder
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(expense => expense.id !== action.payload)
        if (state.selectedExpense?.id === action.payload) {
          state.selectedExpense = null
        }
      })

    // Fetch currencies
    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.currenciesLoading = true
        state.currenciesError = null
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.currenciesLoading = false
        state.currencies = action.payload
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.currenciesLoading = false
        state.currenciesError = action.error.message || 'Failed to fetch currencies'
      })

    // Fetch vendors
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.vendorsLoading = true
        state.vendorsError = null
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.vendorsLoading = false
        state.vendors = action.payload
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.vendorsLoading = false
        state.vendorsError = action.error.message || 'Failed to fetch vendors'
      })

    // Fetch expense categories
    builder
      .addCase(fetchExpenseCategories.pending, (state) => {
        state.categoriesLoading = true
        state.categoriesError = null
      })
      .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false
        state.expenseCategories = action.payload
      })
      .addCase(fetchExpenseCategories.rejected, (state, action) => {
        state.categoriesLoading = false
        state.categoriesError = action.error.message || 'Failed to fetch expense categories'
      })

      // Post journal entry
      .addCase(postJournalEntry.pending, (state) => {
        state.isPostingJournalEntry = true
      })
      .addCase(postJournalEntry.fulfilled, (state, action) => {
        state.isPostingJournalEntry = false
        // Update the journal entry in the list if it exists
        const index = state.journalEntries.findIndex(entry => entry.id === action.meta.arg)
        if (index !== -1) {
          // Update the entry with the returned data from API
          state.journalEntries[index] = { ...state.journalEntries[index], ...action.payload }
        }
      })
      .addCase(postJournalEntry.rejected, (state) => {
        state.isPostingJournalEntry = false
      })
      
      // Void journal entry
      .addCase(voidJournalEntry.pending, (state) => {
        state.isVoidingJournalEntry = true
      })
      .addCase(voidJournalEntry.fulfilled, (state, action) => {
        state.isVoidingJournalEntry = false
        // Update the journal entry in the list if it exists
        const index = state.journalEntries.findIndex(entry => entry.id === action.meta.arg)
        if (index !== -1) {
          // Update the entry with the returned data from API
          state.journalEntries[index] = { ...state.journalEntries[index], ...action.payload }
        }
      })
      .addCase(voidJournalEntry.rejected, (state) => {
        state.isVoidingJournalEntry = false
      })

      // Fetch chart of accounts
      .addCase(fetchChartOfAccounts.pending, (state) => {
        state.chartOfAccountsLoading = true
        state.chartOfAccountsError = null
      })
      .addCase(fetchChartOfAccounts.fulfilled, (state, action) => {
        state.chartOfAccountsLoading = false
        state.chartOfAccounts = action.payload
      })
      .addCase(fetchChartOfAccounts.rejected, (state, action) => {
        state.chartOfAccountsLoading = false
        state.chartOfAccountsError = action.error.message || 'Failed to fetch chart of accounts'
      })

      // Fetch trial balance
      .addCase(fetchTrialBalance.pending, (state) => {
        state.trialBalanceLoading = true
        state.trialBalanceError = null
      })
      .addCase(fetchTrialBalance.fulfilled, (state, action) => {
        state.trialBalanceLoading = false
        state.trialBalance = action.payload
      })
      .addCase(fetchTrialBalance.rejected, (state, action) => {
        state.trialBalanceLoading = false
        state.trialBalanceError = action.error.message || 'Failed to fetch trial balance'
      })
      
      // Fetch trial balance summary
      .addCase(fetchTrialBalanceSummary.pending, (state) => {
        state.trialBalanceSummaryLoading = true
        state.trialBalanceSummaryError = null
      })
      .addCase(fetchTrialBalanceSummary.fulfilled, (state, action) => {
        state.trialBalanceSummaryLoading = false
        state.trialBalanceSummary = action.payload
      })
      .addCase(fetchTrialBalanceSummary.rejected, (state, action) => {
        state.trialBalanceSummaryLoading = false
        state.trialBalanceSummaryError = action.error.message || 'Failed to fetch trial balance summary'
      })

      // Fetch income statement
      .addCase(fetchIncomeStatement.pending, (state) => {
        state.incomeStatementLoading = true
        state.incomeStatementError = null
      })
      .addCase(fetchIncomeStatement.fulfilled, (state, action) => {
        state.incomeStatementLoading = false
        state.incomeStatement = action.payload
      })
      .addCase(fetchIncomeStatement.rejected, (state, action) => {
        state.incomeStatementLoading = false
        state.incomeStatementError = action.error.message || 'Failed to fetch income statement'
      })

      // Fetch assets
      .addCase(fetchAssets.pending, (state) => {
        state.assetsLoading = true
        state.assetsError = null
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.assetsLoading = false
        state.assets = action.payload.assets
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.assetsLoading = false
        state.assetsError = action.error.message || 'Failed to fetch assets'
      })
      
      // Fetch asset
      .addCase(fetchAsset.pending, (state) => {
        state.selectedAssetLoading = true
        state.selectedAssetError = null
      })
      .addCase(fetchAsset.fulfilled, (state, action) => {
        state.selectedAssetLoading = false
        state.selectedAsset = action.payload
      })
      .addCase(fetchAsset.rejected, (state, action) => {
        state.selectedAssetLoading = false
        state.selectedAssetError = action.error.message || 'Failed to fetch asset'
      })

      // Fetch credit notes
      .addCase(fetchCreditNotes.pending, (state) => {
        state.creditNotesLoading = true
        state.creditNotesError = null
      })
      .addCase(fetchCreditNotes.fulfilled, (state, action) => {
        state.creditNotesLoading = false
        state.creditNotes = action.payload.creditNotes
      })
      .addCase(fetchCreditNotes.rejected, (state, action) => {
        state.creditNotesLoading = false
        state.creditNotesError = action.error.message || 'Failed to fetch credit notes'
      })
      
      // Fetch single credit note
      .addCase(fetchCreditNote.pending, (state) => {
        state.selectedCreditNoteLoading = true
        state.selectedCreditNoteError = null
      })
      .addCase(fetchCreditNote.fulfilled, (state, action) => {
        state.selectedCreditNoteLoading = false
        state.selectedCreditNote = action.payload
      })
      .addCase(fetchCreditNote.rejected, (state, action) => {
        state.selectedCreditNoteLoading = false
        state.selectedCreditNoteError = action.error.message || 'Failed to fetch credit note'
      })
      
      // Create credit note
      .addCase(createCreditNote.pending, (state) => {
        state.creditNotesLoading = true
        state.creditNotesError = null
      })
      .addCase(createCreditNote.fulfilled, (state, action) => {
        state.creditNotesLoading = false
        state.creditNotes.push(action.payload)
      })
      .addCase(createCreditNote.rejected, (state, action) => {
        state.creditNotesLoading = false
        state.creditNotesError = action.error.message || 'Failed to create credit note'
      })
      
      // Send credit note
      .addCase(sendCreditNote.fulfilled, (state, action) => {
        const index = state.creditNotes.findIndex(cn => cn.id === action.payload.id)
        if (index !== -1) {
          state.creditNotes[index] = action.payload
        }
        if (state.selectedCreditNote?.id === action.payload.id) {
          state.selectedCreditNote = action.payload
        }
      })
      
      // Apply credit note
      .addCase(applyCreditNote.fulfilled, (state, action) => {
        const index = state.creditNotes.findIndex(cn => cn.id === action.payload.id)
        if (index !== -1) {
          state.creditNotes[index].status = 'APPLIED'
        }
      })
      
      // Delete credit note
      .addCase(deleteCreditNote.fulfilled, (state, action) => {
        state.creditNotes = state.creditNotes.filter(cn => cn.id !== action.payload)
        if (state.selectedCreditNote?.id === action.payload) {
          state.selectedCreditNote = null
        }
      })
  }
})

export const { 
  setSelectedExpense, 
  clearExpensesError, 
  clearTrialBalanceError, 
  clearTrialBalanceSummaryError,
  clearIncomeStatementError,
  clearAssetsError,
  setSelectedAsset,
  clearCreditNotesError,
  setSelectedCreditNote,
  clearSelectedCreditNote,
  clearDashboardErrors
} = accountingSlice.actions

export default accountingSlice.reducer