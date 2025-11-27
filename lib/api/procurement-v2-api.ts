// ============================================================================
// PROCUREMENT API SERVICE
// Complete API service for the new procurement flow
// ============================================================================

// import { apiClient } from '../api-client'
import { apiClient } from './api-client'
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
  CreateApprovalConfigPayload,
  UpdateApprovalConfigPayload,
  ProcurementDashboard,
  ApiResponse,
  PaginatedResponse,
  Vendor,
} from './types/procurement.types'

const BASE_URL = '/api/procurement'

// ============================================================================
// DASHBOARD
// ============================================================================

export const procurementDashboardApi = {
  getDashboard: async (): Promise<ApiResponse<ProcurementDashboard>> => {
    const response = await apiClient.get<ApiResponse<ProcurementDashboard>>(`${BASE_URL}/dashboard`)
    return response.data
  },
}

// ============================================================================
// APPROVAL CONFIGURATIONS
// ============================================================================

export const approvalConfigApi = {
  getAll: async (): Promise<ApiResponse<ApprovalConfiguration[]>> => {
    const response = await apiClient.get<ApiResponse<ApprovalConfiguration[]>>(
      '/api/procurement-approval-configs'
    )
    return response.data
  },

  update: async (id: string, payload: UpdateApprovalConfigPayload): Promise<ApiResponse<ApprovalConfiguration>> => {
    const response = await apiClient.put<ApiResponse<ApprovalConfiguration>>(
      `/api/procurement-approval-configs/${id}`,
      payload
    )
    return response.data
  },
}

// ============================================================================
// PURCHASE REQUISITIONS
// ============================================================================

export const requisitionApi = {
  getAll: async (filters?: RequisitionFilters): Promise<PaginatedResponse<PurchaseRequisition>> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.department) params.append('department', filters.department)
    params.append('limit', String(filters?.limit || 50))
    params.append('offset', String(filters?.offset || 0))

    const response = await apiClient.get<PaginatedResponse<PurchaseRequisition>>(
      `${BASE_URL}/requisitions?${params.toString()}`
    )
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<PurchaseRequisition>> => {
    const response = await apiClient.get<ApiResponse<PurchaseRequisition>>(`${BASE_URL}/requisitions/${id}`)
    return response.data
  },

  getPendingApproval: async (): Promise<PaginatedResponse<PurchaseRequisition>> => {
    const response = await apiClient.get<PaginatedResponse<PurchaseRequisition>>(
      `${BASE_URL}/requisitions/pending-approval`
    )
    return response.data
  },

  create: async (payload: CreateRequisitionPayload): Promise<ApiResponse<PurchaseRequisition>> => {
    const response = await apiClient.post<ApiResponse<PurchaseRequisition>>(`${BASE_URL}/requisitions`, payload)
    return response.data
  },

  submit: async (id: string): Promise<ApiResponse<PurchaseRequisition>> => {
    const response = await apiClient.put<ApiResponse<PurchaseRequisition>>(`${BASE_URL}/requisitions/${id}/submit`)
    return response.data
  },

  approve: async (id: string): Promise<ApiResponse<PurchaseRequisition>> => {
    const response = await apiClient.put<ApiResponse<PurchaseRequisition>>(`${BASE_URL}/requisitions/${id}/approve`)
    return response.data
  },

  reject: async (id: string, reason: string): Promise<ApiResponse<PurchaseRequisition>> => {
    const response = await apiClient.put<ApiResponse<PurchaseRequisition>>(`${BASE_URL}/requisitions/${id}/reject`, {
      rejectionReason: reason,
    })
    return response.data
  },
}

// ============================================================================
// RFQ (REQUEST FOR QUOTATION)
// ============================================================================

export const rfqApi = {
  getAll: async (filters?: RFQFilters): Promise<PaginatedResponse<RFQ>> => {
    const params = new URLSearchParams()
    if (filters?.rfqNumber) params.append('rfqNumber', filters.rfqNumber)
    if (filters?.requisitionId) params.append('requisitionId', filters.requisitionId)
    if (filters?.status) params.append('status', filters.status)
    params.append('limit', String(filters?.limit || 50))
    params.append('offset', String(filters?.offset || 0))

    const response = await apiClient.get<PaginatedResponse<RFQ>>(`${BASE_URL}/rfq?${params.toString()}`)
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<RFQ>> => {
    const response = await apiClient.get<ApiResponse<RFQ>>(`${BASE_URL}/rfq/${id}`)
    return response.data
  },

  create: async (payload: CreateRFQPayload): Promise<ApiResponse<RFQ>> => {
    const response = await apiClient.post<ApiResponse<RFQ>>(`${BASE_URL}/rfq`, payload)
    return response.data
  },
}

// ============================================================================
// VENDOR QUOTATIONS
// ============================================================================

export const quotationApi = {
  getAll: async (filters?: QuotationFilters): Promise<PaginatedResponse<VendorQuotation>> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.rfqNumber) params.append('rfqNumber', filters.rfqNumber)
    if (filters?.vendorEmail) params.append('vendorEmail', filters.vendorEmail)
    params.append('limit', String(filters?.limit || 50))
    params.append('offset', String(filters?.offset || 0))

    const response = await apiClient.get<PaginatedResponse<VendorQuotation>>(
      `/api/vendor-quotations?${params.toString()}`
    )
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<VendorQuotation>> => {
    const response = await apiClient.get<ApiResponse<VendorQuotation>>(`/api/vendor-quotations/${id}`)
    return response.data
  },

  getByRfq: async (rfqNumber: string): Promise<PaginatedResponse<VendorQuotation>> => {
    const response = await apiClient.get<PaginatedResponse<VendorQuotation>>(
      `/api/vendor-quotations/rfq/${rfqNumber}`
    )
    return response.data
  },

  submit: async (payload: SubmitQuotationPayload): Promise<ApiResponse<VendorQuotation>> => {
    const response = await apiClient.post<ApiResponse<VendorQuotation>>(`/api/vendor-quotations/submit`, payload)
    return response.data
  },

  accept: async (id: string, payload: AcceptQuotationPayload): Promise<ApiResponse<VendorQuotation>> => {
    const response = await apiClient.post<ApiResponse<VendorQuotation>>(
      `/api/vendor-quotations/${id}/accept`,
      payload
    )
    return response.data
  },

  reject: async (id: string, payload: RejectQuotationPayload): Promise<ApiResponse<VendorQuotation>> => {
    const response = await apiClient.post<ApiResponse<VendorQuotation>>(
      `/api/vendor-quotations/${id}/reject`,
      payload
    )
    return response.data
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/vendor-quotations/${id}`)
    return response.data
  },
}

// ============================================================================
// PURCHASE ORDERS
// ============================================================================

export const purchaseOrderApi = {
  getAll: async (filters?: PurchaseOrderFilters): Promise<ApiResponse<PurchaseOrder[]>> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.vendorId) params.append('vendorId', filters.vendorId)
    if (filters?.priority) params.append('priority', filters.priority)
    params.append('limit', String(filters?.limit || 50))
    params.append('offset', String(filters?.offset || 0))

    const response = await apiClient.get<ApiResponse<PurchaseOrder[]>>(
      `${BASE_URL}/purchase-orders?${params.toString()}`
    )
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await apiClient.get<ApiResponse<PurchaseOrder>>(`${BASE_URL}/purchase-orders/${id}`)
    return response.data
  },

  create: async (payload: CreatePurchaseOrderPayload): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await apiClient.post<ApiResponse<PurchaseOrder>>(`${BASE_URL}/purchase-orders`, payload)
    return response.data
  },

  send: async (id: string): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await apiClient.post<ApiResponse<PurchaseOrder>>(`${BASE_URL}/purchase-orders/${id}/send`)
    return response.data
  },

  convertToBill: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(`${BASE_URL}/purchase-orders/${id}/convert-to-bill`)
    return response.data
  },
}

// ============================================================================
// VENDORS (Helper)
// ============================================================================

export const vendorApi = {
  getAll: async (): Promise<ApiResponse<Vendor[]>> => {
    const response = await apiClient.get<ApiResponse<Vendor[]>>('/api/vendors')
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<Vendor>> => {
    const response = await apiClient.get<ApiResponse<Vendor>>(`/api/vendors/${id}`)
    return response.data
  },
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export const procurementApi = {
  dashboard: procurementDashboardApi,
  approvalConfig: approvalConfigApi,
  requisitions: requisitionApi,
  rfq: rfqApi,
  quotations: quotationApi,
  purchaseOrders: purchaseOrderApi,
  vendors: vendorApi,
}

export default procurementApi
