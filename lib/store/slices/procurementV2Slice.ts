// ============================================================================
// PROCUREMENT REDUX SLICE
// Complete state management for the new procurement flow
// ============================================================================

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import procurementApi from '@/lib/api/procurement-v2-api'
import type {
  PurchaseRequisition,
  CreateRequisitionPayload,
  RequisitionFilters,
  RFQ,
  CreateRFQPayload,
  RFQFilters,
  VendorQuotation,
  SubmitQuotationPayload,
  AcceptQuotationPayload,
  RejectQuotationPayload,
  QuotationFilters,
  PurchaseOrder,
  CreatePurchaseOrderPayload,
  PurchaseOrderFilters,
  ApprovalConfiguration,
  UpdateApprovalConfigPayload,
  ProcurementDashboard,
  Vendor,
} from '@/lib/api/types/procurement.types'

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface ProcurementState {
  // Dashboard
  dashboard: ProcurementDashboard | null
  dashboardLoading: boolean

  // Approval Configurations
  approvalConfigs: ApprovalConfiguration[]
  approvalConfigsLoading: boolean

  // Purchase Requisitions
  requisitions: PurchaseRequisition[]
  requisitionsCount: number
  currentRequisition: PurchaseRequisition | null
  requisitionsLoading: boolean
  pendingApprovalRequisitions: PurchaseRequisition[]
  pendingApprovalCount: number

  // RFQs
  rfqs: RFQ[]
  rfqsCount: number
  currentRfq: RFQ | null
  rfqsLoading: boolean

  // Quotations
  quotations: VendorQuotation[]
  quotationsCount: number
  currentQuotation: VendorQuotation | null
  quotationsLoading: boolean

  // Purchase Orders
  purchaseOrders: PurchaseOrder[]
  purchaseOrdersCount: number
  currentPurchaseOrder: PurchaseOrder | null
  purchaseOrdersLoading: boolean

  // Vendors
  vendors: Vendor[]
  vendorsLoading: boolean

  // UI State
  error: string | null
  successMessage: string | null
  filters: {
    requisitions: RequisitionFilters
    rfqs: RFQFilters
    quotations: QuotationFilters
    purchaseOrders: PurchaseOrderFilters
  }
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ProcurementState = {
  dashboard: null,
  dashboardLoading: false,

  approvalConfigs: [],
  approvalConfigsLoading: false,

  requisitions: [],
  requisitionsCount: 0,
  currentRequisition: null,
  requisitionsLoading: false,
  pendingApprovalRequisitions: [],
  pendingApprovalCount: 0,

  rfqs: [],
  rfqsCount: 0,
  currentRfq: null,
  rfqsLoading: false,

  quotations: [],
  quotationsCount: 0,
  currentQuotation: null,
  quotationsLoading: false,

  purchaseOrders: [],
  purchaseOrdersCount: 0,
  currentPurchaseOrder: null,
  purchaseOrdersLoading: false,

  vendors: [],
  vendorsLoading: false,

  error: null,
  successMessage: null,
  filters: {
    requisitions: { limit: 50, offset: 0 },
    rfqs: { limit: 50, offset: 0 },
    quotations: { limit: 50, offset: 0 },
    purchaseOrders: { limit: 50, offset: 0 },
  },
}

// ============================================================================
// ASYNC THUNKS - DASHBOARD
// ============================================================================

export const fetchDashboard = createAsyncThunk('procurementV2/fetchDashboard', async () => {
  const response = await procurementApi.dashboard.getDashboard()
  return response.data
})

// ============================================================================
// ASYNC THUNKS - APPROVAL CONFIGURATIONS
// ============================================================================

export const fetchApprovalConfigs = createAsyncThunk('procurementV2/fetchApprovalConfigs', async () => {
  const response = await procurementApi.approvalConfig.getAll()
  return response.data
})

export const updateApprovalConfig = createAsyncThunk(
  'procurementV2/updateApprovalConfig',
  async ({ id, payload }: { id: string; payload: UpdateApprovalConfigPayload }) => {
    const response = await procurementApi.approvalConfig.update(id, payload)
    return response.data
  }
)

// ============================================================================
// ASYNC THUNKS - REQUISITIONS
// ============================================================================

export const fetchRequisitions = createAsyncThunk(
  'procurementV2/fetchRequisitions',
  async (filters?: RequisitionFilters) => {
    const response = await procurementApi.requisitions.getAll(filters)
    return response
  }
)

export const fetchRequisitionById = createAsyncThunk('procurementV2/fetchRequisitionById', async (id: string) => {
  const response = await procurementApi.requisitions.getById(id)
  return response.data
})

export const fetchPendingApprovalRequisitions = createAsyncThunk(
  'procurementV2/fetchPendingApprovalRequisitions',
  async () => {
    const response = await procurementApi.requisitions.getPendingApproval()
    return response
  }
)

export const createRequisition = createAsyncThunk(
  'procurementV2/createRequisition',
  async (payload: CreateRequisitionPayload) => {
    const response = await procurementApi.requisitions.create(payload)
    return response.data
  }
)

export const submitRequisition = createAsyncThunk('procurementV2/submitRequisition', async (id: string) => {
  const response = await procurementApi.requisitions.submit(id)
  return response.data
})

export const approveRequisition = createAsyncThunk('procurementV2/approveRequisition', async (id: string) => {
  const response = await procurementApi.requisitions.approve(id)
  return response.data
})

export const rejectRequisition = createAsyncThunk(
  'procurementV2/rejectRequisition',
  async ({ id, reason }: { id: string; reason: string }) => {
    const response = await procurementApi.requisitions.reject(id, reason)
    return response.data
  }
)

// ============================================================================
// ASYNC THUNKS - RFQ
// ============================================================================

export const fetchRfqs = createAsyncThunk('procurementV2/fetchRfqs', async (filters?: RFQFilters) => {
  const response = await procurementApi.rfq.getAll(filters)
  return response
})

export const fetchRfqById = createAsyncThunk('procurementV2/fetchRfqById', async (id: string) => {
  const response = await procurementApi.rfq.getById(id)
  return response.data
})

export const createRfq = createAsyncThunk('procurementV2/createRfq', async (payload: CreateRFQPayload) => {
  const response = await procurementApi.rfq.create(payload)
  return response.data
})

// ============================================================================
// ASYNC THUNKS - QUOTATIONS
// ============================================================================

export const fetchQuotations = createAsyncThunk('procurementV2/fetchQuotations', async (filters?: QuotationFilters) => {
  const response = await procurementApi.quotations.getAll(filters)
  return response
})

export const fetchQuotationById = createAsyncThunk('procurementV2/fetchQuotationById', async (id: string) => {
  const response = await procurementApi.quotations.getById(id)
  return response.data
})

export const fetchQuotationsByRfq = createAsyncThunk('procurementV2/fetchQuotationsByRfq', async (rfqNumber: string) => {
  const response = await procurementApi.quotations.getByRfq(rfqNumber)
  return response
})

export const submitQuotation = createAsyncThunk(
  'procurementV2/submitQuotation',
  async (payload: SubmitQuotationPayload) => {
    const response = await procurementApi.quotations.submit(payload)
    return response.data
  }
)

export const acceptQuotation = createAsyncThunk(
  'procurementV2/acceptQuotation',
  async ({ id, payload }: { id: string; payload: AcceptQuotationPayload }) => {
    const response = await procurementApi.quotations.accept(id, payload)
    return response.data
  }
)

export const rejectQuotation = createAsyncThunk(
  'procurementV2/rejectQuotation',
  async ({ id, payload }: { id: string; payload: RejectQuotationPayload }) => {
    const response = await procurementApi.quotations.reject(id, payload)
    return response.data
  }
)

export const deleteQuotation = createAsyncThunk('procurementV2/deleteQuotation', async (id: string) => {
  await procurementApi.quotations.delete(id)
  return id
})

// ============================================================================
// ASYNC THUNKS - PURCHASE ORDERS
// ============================================================================

export const fetchPurchaseOrders = createAsyncThunk(
  'procurementV2/fetchPurchaseOrders',
  async (filters?: PurchaseOrderFilters) => {
    const response = await procurementApi.purchaseOrders.getAll(filters)
    return response
  }
)

export const fetchPurchaseOrderById = createAsyncThunk('procurementV2/fetchPurchaseOrderById', async (id: string) => {
  const response = await procurementApi.purchaseOrders.getById(id)
  return response.data
})

export const createPurchaseOrder = createAsyncThunk(
  'procurementV2/createPurchaseOrder',
  async (payload: CreatePurchaseOrderPayload) => {
    const response = await procurementApi.purchaseOrders.create(payload)
    return response.data
  }
)

export const sendPurchaseOrder = createAsyncThunk('procurementV2/sendPurchaseOrder', async (id: string) => {
  const response = await procurementApi.purchaseOrders.send(id)
  return response.data
})

export const convertPurchaseOrderToBill = createAsyncThunk(
  'procurementV2/convertPurchaseOrderToBill',
  async (id: string) => {
    const response = await procurementApi.purchaseOrders.convertToBill(id)
    return response.data
  }
)

// ============================================================================
// ASYNC THUNKS - VENDORS
// ============================================================================

export const fetchVendors = createAsyncThunk('procurementV2/fetchVendors', async () => {
  const response = await procurementApi.vendors.getAll()
  return response.data
})

// ============================================================================
// SLICE
// ============================================================================

const procurementV2Slice = createSlice({
  name: 'procurementV2',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    },
    setRequisitionFilters: (state, action: PayloadAction<Partial<RequisitionFilters>>) => {
      state.filters.requisitions = { ...state.filters.requisitions, ...action.payload }
    },
    setRfqFilters: (state, action: PayloadAction<Partial<RFQFilters>>) => {
      state.filters.rfqs = { ...state.filters.rfqs, ...action.payload }
    },
    setQuotationFilters: (state, action: PayloadAction<Partial<QuotationFilters>>) => {
      state.filters.quotations = { ...state.filters.quotations, ...action.payload }
    },
    setPurchaseOrderFilters: (state, action: PayloadAction<Partial<PurchaseOrderFilters>>) => {
      state.filters.purchaseOrders = { ...state.filters.purchaseOrders, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
  },
  extraReducers: (builder) => {
    // Dashboard
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboardLoading = true
        state.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false
        state.dashboard = action.payload
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboardLoading = false
        state.error = action.error.message || 'Failed to fetch dashboard'
      })

    // Approval Configurations
    builder
      .addCase(fetchApprovalConfigs.pending, (state) => {
        state.approvalConfigsLoading = true
        state.error = null
      })
      .addCase(fetchApprovalConfigs.fulfilled, (state, action) => {
        state.approvalConfigsLoading = false
        state.approvalConfigs = action.payload
      })
      .addCase(fetchApprovalConfigs.rejected, (state, action) => {
        state.approvalConfigsLoading = false
        state.error = action.error.message || 'Failed to fetch approval configurations'
      })
      .addCase(updateApprovalConfig.fulfilled, (state, action) => {
        const index = state.approvalConfigs.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.approvalConfigs[index] = action.payload
        }
        state.successMessage = 'Approval configuration updated successfully'
      })

    // Requisitions
    builder
      .addCase(fetchRequisitions.pending, (state) => {
        state.requisitionsLoading = true
        state.error = null
      })
      .addCase(fetchRequisitions.fulfilled, (state, action) => {
        state.requisitionsLoading = false
        state.requisitions = action.payload.data
        state.requisitionsCount = action.payload.count || 0
      })
      .addCase(fetchRequisitions.rejected, (state, action) => {
        state.requisitionsLoading = false
        state.error = action.error.message || 'Failed to fetch requisitions'
      })
      .addCase(fetchRequisitionById.fulfilled, (state, action) => {
        state.currentRequisition = action.payload
      })
      .addCase(fetchPendingApprovalRequisitions.fulfilled, (state, action) => {
        state.pendingApprovalRequisitions = action.payload.data
        state.pendingApprovalCount = action.payload.count || 0
      })
      .addCase(createRequisition.fulfilled, (state, action) => {
        state.requisitions.unshift(action.payload)
        state.successMessage = 'Requisition created successfully'
      })
      .addCase(submitRequisition.fulfilled, (state, action) => {
        const index = state.requisitions.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.requisitions[index] = action.payload
        }
        if (state.currentRequisition?.id === action.payload.id) {
          state.currentRequisition = action.payload
        }
        state.successMessage = 'Requisition submitted for approval'
      })
      .addCase(approveRequisition.fulfilled, (state, action) => {
        const index = state.requisitions.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.requisitions[index] = action.payload
        }
        state.pendingApprovalRequisitions = state.pendingApprovalRequisitions.filter((r) => r.id !== action.payload.id)
        state.successMessage = 'Requisition approved successfully'
      })
      .addCase(rejectRequisition.fulfilled, (state, action) => {
        const index = state.requisitions.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.requisitions[index] = action.payload
        }
        state.pendingApprovalRequisitions = state.pendingApprovalRequisitions.filter((r) => r.id !== action.payload.id)
        state.successMessage = 'Requisition rejected'
      })

    // RFQs
    builder
      .addCase(fetchRfqs.pending, (state) => {
        state.rfqsLoading = true
        state.error = null
      })
      .addCase(fetchRfqs.fulfilled, (state, action) => {
        state.rfqsLoading = false
        state.rfqs = action.payload.data
        state.rfqsCount = action.payload.count || 0
      })
      .addCase(fetchRfqs.rejected, (state, action) => {
        state.rfqsLoading = false
        state.error = action.error.message || 'Failed to fetch RFQs'
      })
      .addCase(fetchRfqById.fulfilled, (state, action) => {
        state.currentRfq = action.payload
      })
      .addCase(createRfq.fulfilled, (state, action) => {
        state.rfqs.unshift(action.payload)
        state.successMessage = 'RFQ created and sent to vendors successfully'
      })

    // Quotations
    builder
      .addCase(fetchQuotations.pending, (state) => {
        state.quotationsLoading = true
        state.error = null
      })
      .addCase(fetchQuotations.fulfilled, (state, action) => {
        state.quotationsLoading = false
        state.quotations = action.payload.data
        state.quotationsCount = action.payload.count || 0
      })
      .addCase(fetchQuotations.rejected, (state, action) => {
        state.quotationsLoading = false
        state.error = action.error.message || 'Failed to fetch quotations'
      })
      .addCase(fetchQuotationById.fulfilled, (state, action) => {
        state.currentQuotation = action.payload
      })
      .addCase(fetchQuotationsByRfq.fulfilled, (state, action) => {
        state.quotations = action.payload.data
        state.quotationsCount = action.payload.count || 0
      })
      .addCase(submitQuotation.fulfilled, (state, action) => {
        state.quotations.unshift(action.payload)
        state.successMessage = 'Quotation submitted successfully'
      })
      .addCase(acceptQuotation.fulfilled, (state, action) => {
        const index = state.quotations.findIndex((q) => q.id === action.payload.id)
        if (index !== -1) {
          state.quotations[index] = action.payload
        }
        state.successMessage = 'Quotation accepted successfully'
      })
      .addCase(rejectQuotation.fulfilled, (state, action) => {
        const index = state.quotations.findIndex((q) => q.id === action.payload.id)
        if (index !== -1) {
          state.quotations[index] = action.payload
        }
        state.successMessage = 'Quotation rejected'
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.quotations = state.quotations.filter((q) => q.id !== action.payload)
        state.successMessage = 'Quotation deleted successfully'
      })

    // Purchase Orders
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.purchaseOrdersLoading = true
        state.error = null
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.purchaseOrdersLoading = false
        state.purchaseOrders = action.payload.data
        state.purchaseOrdersCount = action.payload.data.length
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.purchaseOrdersLoading = false
        state.error = action.error.message || 'Failed to fetch purchase orders'
      })
      .addCase(fetchPurchaseOrderById.fulfilled, (state, action) => {
        state.currentPurchaseOrder = action.payload
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.purchaseOrders.unshift(action.payload)
        state.successMessage = 'Purchase order created successfully'
      })
      .addCase(sendPurchaseOrder.fulfilled, (state, action) => {
        const index = state.purchaseOrders.findIndex((po) => po.id === action.payload.id)
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload
        }
        state.successMessage = 'Purchase order sent to vendor'
      })
      .addCase(convertPurchaseOrderToBill.fulfilled, (state) => {
        state.successMessage = 'Purchase order converted to bill successfully'
      })

    // Vendors
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.vendorsLoading = true
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.vendorsLoading = false
        state.vendors = action.payload
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.vendorsLoading = false
        state.error = action.error.message || 'Failed to fetch vendors'
      })
  },
})

// ============================================================================
// EXPORTS
// ============================================================================

export const {
  clearError,
  clearSuccessMessage,
  setRequisitionFilters,
  setRfqFilters,
  setQuotationFilters,
  setPurchaseOrderFilters,
  resetFilters,
} = procurementV2Slice.actions

export default procurementV2Slice.reducer
