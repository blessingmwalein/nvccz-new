import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { 
  PurchaseRequisition, 
  PurchaseOrder, 
  ProcurementInvoice, 
  GoodsReceivedNote,
  ApprovalConfiguration,
  ApprovalRequest
} from "@/lib/api/procurement-api"

export interface ProcurementState {
  // Purchase Requisitions
  requisitions: PurchaseRequisition[]
  requisitionsLoading: boolean
  requisitionsError: string | null
  
  // Purchase Orders
  purchaseOrders: PurchaseOrder[]
  purchaseOrdersLoading: boolean
  purchaseOrdersError: string | null
  
  // Invoices
  invoices: ProcurementInvoice[]
  invoicesLoading: boolean
  invoicesError: string | null
  
  // Goods Received Notes
  goodsReceivedNotes: GoodsReceivedNote[]
  grnLoading: boolean
  grnError: string | null
  
  // Approval Configurations
  approvalConfigs: ApprovalConfiguration[]
  approvalConfigsLoading: boolean
  approvalConfigsError: string | null
  
  // Approval Requests
  approvalRequests: ApprovalRequest[]
  approvalRequestsLoading: boolean
  approvalRequestsError: string | null
  
  // UI State
  selectedRequisition: PurchaseRequisition | null
  selectedPurchaseOrder: PurchaseOrder | null
  selectedInvoice: ProcurementInvoice | null
  selectedGRN: GoodsReceivedNote | null
}

const initialState: ProcurementState = {
  // Purchase Requisitions
  requisitions: [],
  requisitionsLoading: false,
  requisitionsError: null,
  
  // Purchase Orders
  purchaseOrders: [],
  purchaseOrdersLoading: false,
  purchaseOrdersError: null,
  
  // Invoices
  invoices: [],
  invoicesLoading: false,
  invoicesError: null,
  
  // Goods Received Notes
  goodsReceivedNotes: [],
  grnLoading: false,
  grnError: null,
  
  // Approval Configurations
  approvalConfigs: [],
  approvalConfigsLoading: false,
  approvalConfigsError: null,
  
  // Approval Requests
  approvalRequests: [],
  approvalRequestsLoading: false,
  approvalRequestsError: null,
  
  // UI State
  selectedRequisition: null,
  selectedPurchaseOrder: null,
  selectedInvoice: null,
  selectedGRN: null,
}

const procurementSlice = createSlice({
  name: "procurement",
  initialState,
  reducers: {
    // Purchase Requisitions
    setRequisitions: (state, action: PayloadAction<PurchaseRequisition[]>) => {
      state.requisitions = action.payload
      state.requisitionsLoading = false
      state.requisitionsError = null
    },
    addRequisition: (state, action: PayloadAction<PurchaseRequisition>) => {
      state.requisitions.push(action.payload)
    },
    updateRequisition: (state, action: PayloadAction<PurchaseRequisition>) => {
      const index = state.requisitions.findIndex(r => r.id === action.payload.id)
      if (index !== -1) {
        state.requisitions[index] = action.payload
      }
    },
    removeRequisition: (state, action: PayloadAction<string>) => {
      state.requisitions = state.requisitions.filter(r => r.id !== action.payload)
    },
    setRequisitionsLoading: (state, action: PayloadAction<boolean>) => {
      state.requisitionsLoading = action.payload
    },
    setRequisitionsError: (state, action: PayloadAction<string | null>) => {
      state.requisitionsError = action.payload
      state.requisitionsLoading = false
    },
    setSelectedRequisition: (state, action: PayloadAction<PurchaseRequisition | null>) => {
      state.selectedRequisition = action.payload
    },

    // Purchase Orders
    setPurchaseOrders: (state, action: PayloadAction<PurchaseOrder[]>) => {
      state.purchaseOrders = action.payload
      state.purchaseOrdersLoading = false
      state.purchaseOrdersError = null
    },
    addPurchaseOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      state.purchaseOrders.push(action.payload)
    },
    updatePurchaseOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      const index = state.purchaseOrders.findIndex(po => po.id === action.payload.id)
      if (index !== -1) {
        state.purchaseOrders[index] = action.payload
      }
    },
    removePurchaseOrder: (state, action: PayloadAction<string>) => {
      state.purchaseOrders = state.purchaseOrders.filter(po => po.id !== action.payload)
    },
    setPurchaseOrdersLoading: (state, action: PayloadAction<boolean>) => {
      state.purchaseOrdersLoading = action.payload
    },
    setPurchaseOrdersError: (state, action: PayloadAction<string | null>) => {
      state.purchaseOrdersError = action.payload
      state.purchaseOrdersLoading = false
    },
    setSelectedPurchaseOrder: (state, action: PayloadAction<PurchaseOrder | null>) => {
      state.selectedPurchaseOrder = action.payload
    },

    // Invoices
    setInvoices: (state, action: PayloadAction<ProcurementInvoice[]>) => {
      state.invoices = action.payload
      state.invoicesLoading = false
      state.invoicesError = null
    },
    addInvoice: (state, action: PayloadAction<ProcurementInvoice>) => {
      state.invoices.push(action.payload)
    },
    updateInvoice: (state, action: PayloadAction<ProcurementInvoice>) => {
      const index = state.invoices.findIndex(inv => inv.id === action.payload.id)
      if (index !== -1) {
        state.invoices[index] = action.payload
      }
    },
    removeInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter(inv => inv.id !== action.payload)
    },
    setInvoicesLoading: (state, action: PayloadAction<boolean>) => {
      state.invoicesLoading = action.payload
    },
    setInvoicesError: (state, action: PayloadAction<string | null>) => {
      state.invoicesError = action.payload
      state.invoicesLoading = false
    },
    setSelectedInvoice: (state, action: PayloadAction<ProcurementInvoice | null>) => {
      state.selectedInvoice = action.payload
    },

    // Goods Received Notes
    setGoodsReceivedNotes: (state, action: PayloadAction<GoodsReceivedNote[]>) => {
      state.goodsReceivedNotes = action.payload
      state.grnLoading = false
      state.grnError = null
    },
    addGoodsReceivedNote: (state, action: PayloadAction<GoodsReceivedNote>) => {
      state.goodsReceivedNotes.push(action.payload)
    },
    updateGoodsReceivedNote: (state, action: PayloadAction<GoodsReceivedNote>) => {
      const index = state.goodsReceivedNotes.findIndex(grn => grn.id === action.payload.id)
      if (index !== -1) {
        state.goodsReceivedNotes[index] = action.payload
      }
    },
    removeGoodsReceivedNote: (state, action: PayloadAction<string>) => {
      state.goodsReceivedNotes = state.goodsReceivedNotes.filter(grn => grn.id !== action.payload)
    },
    setGRNLoading: (state, action: PayloadAction<boolean>) => {
      state.grnLoading = action.payload
    },
    setGRNError: (state, action: PayloadAction<string | null>) => {
      state.grnError = action.payload
      state.grnLoading = false
    },
    setSelectedGRN: (state, action: PayloadAction<GoodsReceivedNote | null>) => {
      state.selectedGRN = action.payload
    },

    // Approval Configurations
    setApprovalConfigs: (state, action: PayloadAction<ApprovalConfiguration[]>) => {
      state.approvalConfigs = action.payload
      state.approvalConfigsLoading = false
      state.approvalConfigsError = null
    },
    addApprovalConfig: (state, action: PayloadAction<ApprovalConfiguration>) => {
      state.approvalConfigs.push(action.payload)
    },
    updateApprovalConfig: (state, action: PayloadAction<ApprovalConfiguration>) => {
      const index = state.approvalConfigs.findIndex(config => config.id === action.payload.id)
      if (index !== -1) {
        state.approvalConfigs[index] = action.payload
      }
    },
    removeApprovalConfig: (state, action: PayloadAction<string>) => {
      state.approvalConfigs = state.approvalConfigs.filter(config => config.id !== action.payload)
    },
    setApprovalConfigsLoading: (state, action: PayloadAction<boolean>) => {
      state.approvalConfigsLoading = action.payload
    },
    setApprovalConfigsError: (state, action: PayloadAction<string | null>) => {
      state.approvalConfigsError = action.payload
      state.approvalConfigsLoading = false
    },

    // Approval Requests
    setApprovalRequests: (state, action: PayloadAction<ApprovalRequest[]>) => {
      state.approvalRequests = action.payload
      state.approvalRequestsLoading = false
      state.approvalRequestsError = null
    },
    addApprovalRequest: (state, action: PayloadAction<ApprovalRequest>) => {
      state.approvalRequests.push(action.payload)
    },
    updateApprovalRequest: (state, action: PayloadAction<ApprovalRequest>) => {
      const index = state.approvalRequests.findIndex(req => req.id === action.payload.id)
      if (index !== -1) {
        state.approvalRequests[index] = action.payload
      }
    },
    removeApprovalRequest: (state, action: PayloadAction<string>) => {
      state.approvalRequests = state.approvalRequests.filter(req => req.id !== action.payload)
    },
    setApprovalRequestsLoading: (state, action: PayloadAction<boolean>) => {
      state.approvalRequestsLoading = action.payload
    },
    setApprovalRequestsError: (state, action: PayloadAction<string | null>) => {
      state.approvalRequestsError = action.payload
      state.approvalRequestsLoading = false
    },

    // Clear all errors
    clearAllErrors: (state) => {
      state.requisitionsError = null
      state.purchaseOrdersError = null
      state.invoicesError = null
      state.grnError = null
      state.approvalConfigsError = null
      state.approvalRequestsError = null
    },
  },
})

export const {
  // Purchase Requisitions
  setRequisitions,
  addRequisition,
  updateRequisition,
  removeRequisition,
  setRequisitionsLoading,
  setRequisitionsError,
  setSelectedRequisition,

  // Purchase Orders
  setPurchaseOrders,
  addPurchaseOrder,
  updatePurchaseOrder,
  removePurchaseOrder,
  setPurchaseOrdersLoading,
  setPurchaseOrdersError,
  setSelectedPurchaseOrder,

  // Invoices
  setInvoices,
  addInvoice,
  updateInvoice,
  removeInvoice,
  setInvoicesLoading,
  setInvoicesError,
  setSelectedInvoice,

  // Goods Received Notes
  setGoodsReceivedNotes,
  addGoodsReceivedNote,
  updateGoodsReceivedNote,
  removeGoodsReceivedNote,
  setGRNLoading,
  setGRNError,
  setSelectedGRN,

  // Approval Configurations
  setApprovalConfigs,
  addApprovalConfig,
  updateApprovalConfig,
  removeApprovalConfig,
  setApprovalConfigsLoading,
  setApprovalConfigsError,

  // Approval Requests
  setApprovalRequests,
  addApprovalRequest,
  updateApprovalRequest,
  removeApprovalRequest,
  setApprovalRequestsLoading,
  setApprovalRequestsError,

  // Utilities
  clearAllErrors,
} = procurementSlice.actions

export default procurementSlice.reducer
