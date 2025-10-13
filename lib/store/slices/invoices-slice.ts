import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { accountingApi, Invoice, InvoiceCustomer, CreateInvoiceRequest, MarkAsPaidRequest, VoidInvoiceRequest } from '@/lib/api/accounting-api'

interface InvoicesState {
  invoices: Invoice[]
  customers: InvoiceCustomer[]
  selectedInvoice: Invoice | null
  loading: boolean
  customersLoading: boolean
  error: string | null
  filters: {
    customerId?: string
    currencyId?: string
    startDate?: string
    endDate?: string
    status?: 'DRAFT' | 'SENT' | 'PAID' | 'VOID'
    search?: string
    page?: number
    limit?: number
  }
  stats: {
    total: number
    draft: number
    sent: number
    paid: number
    void: number
    totalAmount: number
    draftAmount: number
    sentAmount: number
    paidAmount: number
    voidAmount: number
  }
}

const initialState: InvoicesState = {
  invoices: [],
  customers: [],
  selectedInvoice: null,
  loading: false,
  customersLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 100
  },
  stats: {
    total: 0,
    draft: 0,
    sent: 0,
    paid: 0,
    void: 0,
    totalAmount: 0,
    draftAmount: 0,
    sentAmount: 0,
    paidAmount: 0,
    voidAmount: 0
  }
}

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (filters?: Partial<InvoicesState['filters']>) => {
    const response = await accountingApi.getInvoices(filters || {})
    return response.data
  }
)

export const fetchCustomers = createAsyncThunk(
  'invoices/fetchCustomers',
  async () => {
    const response = await accountingApi.getCustomers()
    return response.data.customers
  }
)

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData: CreateInvoiceRequest) => {
    const response = await accountingApi.createInvoice(invoiceData)
    return response.data
  }
)

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, data }: { id: string; data: Partial<CreateInvoiceRequest> }) => {
    const response = await accountingApi.updateInvoice(id, data)
    return response.data
  }
)

export const sendInvoice = createAsyncThunk(
  'invoices/sendInvoice',
  async (invoiceId: string) => {
    await accountingApi.sendInvoice(invoiceId)
    // Fetch the updated invoice
    const response = await accountingApi.getInvoice(invoiceId)
    return response.data
  }
)

export const markInvoiceAsPaid = createAsyncThunk(
  'invoices/markInvoiceAsPaid',
  async ({ id, data }: { id: string; data: MarkAsPaidRequest }) => {
    const response = await accountingApi.markInvoiceAsPaid(id, data)
    return response.data
  }
)

export const voidInvoice = createAsyncThunk(
  'invoices/voidInvoice',
  async ({ id, data }: { id: string; data: VoidInvoiceRequest }) => {
    const response = await accountingApi.voidInvoice(id, data)
    return response.data
  }
)

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (invoiceId: string) => {
    const response = await accountingApi.getInvoice(invoiceId)
    return response.data
  }
)

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<InvoicesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = { page: 1, limit: 100 }
    },
    setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.selectedInvoice = action.payload
    },
    updateInvoiceInList: (state, action: PayloadAction<Invoice>) => {
      const index = state.invoices.findIndex(inv => inv.id === action.payload.id)
      if (index !== -1) {
        state.invoices[index] = action.payload
      }
      if (state.selectedInvoice?.id === action.payload.id) {
        state.selectedInvoice = action.payload
      }
    },
    calculateStats: (state) => {
      const calculateAmount = (invoicesList: Invoice[]) => {
        return invoicesList.reduce((total, invoice) => total + parseFloat(invoice.totalAmount || '0'), 0)
      }

      const draftInvoices = state.invoices.filter(i => i.status === 'DRAFT')
      const sentInvoices = state.invoices.filter(i => i.status === 'SENT')
      const paidInvoices = state.invoices.filter(i => i.status === 'PAID')
      const voidInvoices = state.invoices.filter(i => i.status === 'VOID')

      state.stats = {
        total: state.invoices.length,
        draft: draftInvoices.length,
        sent: sentInvoices.length,
        paid: paidInvoices.length,
        void: voidInvoices.length,
        totalAmount: calculateAmount(state.invoices),
        draftAmount: calculateAmount(draftInvoices),
        sentAmount: calculateAmount(sentInvoices),
        paidAmount: calculateAmount(paidInvoices),
        voidAmount: calculateAmount(voidInvoices)
      }
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Invoices
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = action.payload.invoices || []
        invoicesSlice.caseReducers.calculateStats(state)
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch invoices'
      })

    // Fetch Customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.customersLoading = true
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customersLoading = false
        state.customers = action.payload || []
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.customersLoading = false
        state.error = action.error.message || 'Failed to fetch customers'
      })

    // Create Invoice
    builder
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload)
        invoicesSlice.caseReducers.calculateStats(state)
      })

    // Update Invoice
    builder
      .addCase(updateInvoice.fulfilled, (state, action) => {
        invoicesSlice.caseReducers.updateInvoiceInList(state, action)
        invoicesSlice.caseReducers.calculateStats(state)
      })

    // Send Invoice
    builder
      .addCase(sendInvoice.fulfilled, (state, action) => {
        invoicesSlice.caseReducers.updateInvoiceInList(state, action)
        invoicesSlice.caseReducers.calculateStats(state)
      })

    // Mark as Paid
    builder
      .addCase(markInvoiceAsPaid.fulfilled, (state, action) => {
        invoicesSlice.caseReducers.updateInvoiceInList(state, action)
        invoicesSlice.caseReducers.calculateStats(state)
      })

    // Void Invoice
    builder
      .addCase(voidInvoice.fulfilled, (state, action) => {
        invoicesSlice.caseReducers.updateInvoiceInList(state, action)
        invoicesSlice.caseReducers.calculateStats(state)
      })

    // Fetch Invoice by ID
    builder
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        invoicesSlice.caseReducers.updateInvoiceInList(state, action)
      })
  }
})

export const {
  setFilters,
  clearFilters,
  setSelectedInvoice,
  updateInvoiceInList,
  calculateStats,
  clearError
} = invoicesSlice.actions

export default invoicesSlice.reducer
