import { apiClient } from './api-client'

export interface ProcurementItem {
  id?: string
  requisitionId?: string
  itemName: string
  description: string
  quantity: string | number
  unitPrice: string | number
  totalPrice?: string | number
  unit: string
  preferredVendorId?: string
  specifications?: string | null
  createdAt?: string
  updatedAt?: string
  preferredVendor?: any
}

export interface PurchaseOrder {
  id: string
  purchaseOrderNumber: string
  requisitionId?: string
  vendorId: string
  status: 'DRAFT' | 'SENT' | 'ACKNOWLEDGED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  totalAmount: string
  currencyId: string
  expectedDeliveryDate: string
  shippingAddress: string
  paymentTerms: string
  deliveryTerms: string
  createdAt: string
  updatedAt: string
  vendor: {
    id: string
    name: string
  }
  items: ProcurementItem[]
  approvalRequest?: ApprovalRequest
}

export interface ProcurementInvoice {
  id: string
  invoiceNumber: string
  purchaseOrderId?: string
  vendorId: string
  status: 'RECEIVED' | 'PROCESSING' | 'MATCHED' | 'DISCREPANCY' | 'APPROVED' | 'PAID' | 'REJECTED'
  matchingStatus: 'PENDING' | 'MATCHED' | 'DISCREPANCY' | 'MANUAL_REVIEW'
  matchScore?: number
  invoiceDate: string
  dueDate: string
  totalAmount: string
  currencyId: string
  documentPath?: string
  documentType?: string
  ocrData?: any
  createdAt: string
  updatedAt: string
  vendor: {
    id: string
    name: string
  }
  items: ProcurementItem[]
  approvalRequest?: ApprovalRequest
}

export interface GoodsReceivedNote {
  id: string
  grnNumber: string
  purchaseOrderId: string
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  purchaseOrder: {
    id: string
    purchaseOrderNumber: string
  }
  items: GRNItem[]
  approvalRequest?: ApprovalRequest
}

export interface GRNItem {
  id: string
  purchaseOrderItemId: string
  quantityReceived: number
  quantityAccepted: number
  quantityRejected: number
  qualityStatus: 'PASSED' | 'FAILED' | 'PENDING'
  qualityNotes?: string
}

export interface ApprovalConfiguration {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  stages: ApprovalStage[]
}

export interface ApprovalStage {
  id: string
  stageType: 'PURCHASE_REQUISITION' | 'PURCHASE_ORDER' | 'INVOICE' | 'GRN'
  steps: ApprovalStep[]
}

export interface ApprovalStep {
  id: string
  stepNumber: number
  stepName: string
  stepType: 'USER' | 'ROLE' | 'DEPARTMENT'
  userId?: string
  roleId?: string
  departmentId?: string
  isRequired: boolean
  canDelegate: boolean
  autoApprove: boolean
  approvalOrder: 'SEQUENTIAL' | 'PARALLEL'
}

export interface ApprovalRequest {
  id: string
  stageType: 'PURCHASE_REQUISITION' | 'PURCHASE_ORDER' | 'INVOICE' | 'GRN'
  entityId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  currentStep: number
  totalSteps: number
  requestedBy: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  approvals: Approval[]
}

export interface Approval {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  comments?: string
  signatureData?: string
  approvedAt?: string
  approver: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  stage: {
    stepNumber: number
    stepName: string
    stepType: string
  }
}

export interface PurchaseRequisition {
  id: string
  requisitionNumber: string
  title: string
  description: string
  departmentId: string
  requestedById: string
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'CONVERTED_TO_PO'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  justification: string
  approvedById?: string | null
  approvedAt?: string | null
  rejectionReason?: string | null
  totalAmount: string
  currencyId: string
  createdAt: string
  updatedAt: string
  requestedBy: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  approvedBy?: any
  department?: {
    id: string
    name: string
  } | null
  currency?: {
    id: string
    code: string
    name: string
    symbol: string
  } | null
  items: ProcurementItem[]
  purchaseOrders?: PurchaseOrder[]
}

export interface CreateRequisitionRequest {
  title: string
  description: string
  departmentId: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  justification: string
  currencyId: string
  items: {
    itemName: string
    description: string
    quantity: number
    unitPrice: number
    unit: string
    preferredVendorId?: string
  }[]
}

export interface ProcurementResponse<T> {
  success: boolean
  message?: string
  data: T
}

class ProcurementApiService {
  // Purchase Requisitions
  async getRequisitions(): Promise<ProcurementResponse<PurchaseRequisition[]>> {
    return apiClient.get<ProcurementResponse<PurchaseRequisition[]>>('/procurement/requisitions')
  }

  async getRequisitionById(id: string): Promise<ProcurementResponse<PurchaseRequisition>> {
    return apiClient.get<ProcurementResponse<PurchaseRequisition>>(`/procurement/requisitions/${id}`)
  }

  async createRequisition(data: CreateRequisitionRequest): Promise<ProcurementResponse<PurchaseRequisition>> {
    return apiClient.post<ProcurementResponse<PurchaseRequisition>>('/procurement/requisitions', data)
  }

  async updateRequisition(id: string, data: Partial<CreateRequisitionRequest>): Promise<ProcurementResponse<PurchaseRequisition>> {
    return apiClient.put<ProcurementResponse<PurchaseRequisition>>(`/procurement/requisitions/${id}`, data)
  }

  async submitRequisition(id: string): Promise<ProcurementResponse<PurchaseRequisition>> {
    return apiClient.put<ProcurementResponse<PurchaseRequisition>>(`/procurement/requisitions/${id}/submit`)
  }

  async approveRequisition(id: string): Promise<ProcurementResponse<PurchaseRequisition>> {
    return apiClient.put<ProcurementResponse<PurchaseRequisition>>(`/procurement/requisitions/${id}/approve`)
  }

  async rejectRequisition(id: string, reason: string): Promise<ProcurementResponse<PurchaseRequisition>> {
    return apiClient.put<ProcurementResponse<PurchaseRequisition>>(`/procurement/requisitions/${id}/reject`, { reason })
  }

  async deleteRequisition(id: string): Promise<ProcurementResponse<any>> {
    return apiClient.delete<ProcurementResponse<any>>(`/procurement/requisitions/${id}`)
  }

  // Purchase Orders
  async getPurchaseOrders(): Promise<ProcurementResponse<PurchaseOrder[]>> {
    return apiClient.get<ProcurementResponse<PurchaseOrder[]>>('/procurement/purchase-orders')
  }

  async getPurchaseOrderById(id: string): Promise<ProcurementResponse<PurchaseOrder>> {
    return apiClient.get<ProcurementResponse<PurchaseOrder>>(`/procurement/purchase-orders/${id}`)
  }

  async createPurchaseOrder(data: any): Promise<ProcurementResponse<PurchaseOrder>> {
    return apiClient.post<ProcurementResponse<PurchaseOrder>>('/procurement/purchase-orders', data)
  }

  async createPurchaseOrderFromRequisition(requisitionId: string): Promise<ProcurementResponse<PurchaseOrder>> {
    return apiClient.post<ProcurementResponse<PurchaseOrder>>(`/procurement/requisitions/${requisitionId}/create-purchase-order`)
  }

  // Procurement Invoices
  async getInvoices(): Promise<ProcurementResponse<ProcurementInvoice[]>> {
    return apiClient.get<ProcurementResponse<ProcurementInvoice[]>>('/procurement/invoices')
  }

  async getInvoiceById(id: string): Promise<ProcurementResponse<ProcurementInvoice>> {
    return apiClient.get<ProcurementResponse<ProcurementInvoice>>(`/procurement/invoices/${id}`)
  }

  async createInvoice(data: any): Promise<ProcurementResponse<ProcurementInvoice>> {
    return apiClient.post<ProcurementResponse<ProcurementInvoice>>('/procurement/invoices', data)
  }

  async processOCR(invoiceId: string, ocrData: any): Promise<ProcurementResponse<ProcurementInvoice>> {
    return apiClient.post<ProcurementResponse<ProcurementInvoice>>(`/procurement/invoices/${invoiceId}/ocr`, ocrData)
  }

  async performAIMatching(invoiceId: string, matchingData: any): Promise<ProcurementResponse<ProcurementInvoice>> {
    return apiClient.post<ProcurementResponse<ProcurementInvoice>>(`/procurement/invoices/${invoiceId}/ai-matching`, matchingData)
  }

  async approveInvoice(id: string): Promise<ProcurementResponse<ProcurementInvoice>> {
    return apiClient.put<ProcurementResponse<ProcurementInvoice>>(`/procurement/invoices/${id}/approve`)
  }

  // Goods Received Notes
  async getGoodsReceivedNotes(): Promise<ProcurementResponse<GoodsReceivedNote[]>> {
    return apiClient.get<ProcurementResponse<GoodsReceivedNote[]>>('/procurement/goods-received-notes')
  }

  async getGRNById(id: string): Promise<ProcurementResponse<GoodsReceivedNote>> {
    return apiClient.get<ProcurementResponse<GoodsReceivedNote>>(`/procurement/goods-received-notes/${id}`)
  }

  async createGRN(data: any): Promise<ProcurementResponse<GoodsReceivedNote>> {
    return apiClient.post<ProcurementResponse<GoodsReceivedNote>>('/procurement/goods-received-notes', data)
  }

  // Approval Configurations
  async getApprovalConfigs(): Promise<ProcurementResponse<ApprovalConfiguration[]>> {
    return apiClient.get<ProcurementResponse<ApprovalConfiguration[]>>('/procurement-approval-configs')
  }

  async getActiveApprovalConfig(): Promise<ProcurementResponse<ApprovalConfiguration>> {
    return apiClient.get<ProcurementResponse<ApprovalConfiguration>>('/procurement-approval-configs/active')
  }

  async createApprovalConfig(data: any): Promise<ProcurementResponse<ApprovalConfiguration>> {
    return apiClient.post<ProcurementResponse<ApprovalConfiguration>>('/procurement-approval-configs', data)
  }

  async getApprovalSteps(stageType: string): Promise<ProcurementResponse<ApprovalStep[]>> {
    return apiClient.get<ProcurementResponse<ApprovalStep[]>>(`/procurement-approval-configs/stages/${stageType}/steps`)
  }

  // Approval Workflow
  async createApprovalRequest(data: any): Promise<ProcurementResponse<ApprovalRequest>> {
    return apiClient.post<ProcurementResponse<ApprovalRequest>>('/procurement-approval-configs/requests', data)
  }

  async getMyApprovalRequests(): Promise<ProcurementResponse<ApprovalRequest[]>> {
    return apiClient.get<ProcurementResponse<ApprovalRequest[]>>('/procurement-approval-configs/requests/my')
  }

  async processApproval(requestId: string, stageId: string, data: any): Promise<ProcurementResponse<Approval>> {
    return apiClient.put<ProcurementResponse<Approval>>(`/procurement-approval-configs/requests/${requestId}/stages/${stageId}/approve`, data)
  }
}

export const procurementApi = new ProcurementApiService()
