// ============================================================================
// PROCUREMENT MODULE TYPES
// Complete type definitions for the new procurement flow
// ============================================================================

// ============================================================================
// ENUMS
// ============================================================================

export enum RequisitionStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONVERTED_TO_PO = 'CONVERTED_TO_PO',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum RFQStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  RESPONSES_RECEIVED = 'RESPONSES_RECEIVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum QuotationStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

export enum StageType {
  PURCHASE_REQUISITION = 'PURCHASE_REQUISITION',
  INVOICE = 'INVOICE',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
}

export enum StepType {
  USER = 'USER',
  ROLE = 'ROLE',
}

export enum ApprovalOrder {
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
}

export enum DepartmentType {
  Finance = 'Finance',
  Procurement = 'Procurement',
  Operations = 'Operations',
  IT = 'IT',
  HR = 'HR',
}

// ============================================================================
// USER & DEPARTMENT TYPES
// ============================================================================

export interface UserInfo {
  id: string
  firstName: string
  lastName: string
  email: string
  userDepartment?: string
  departmentRole?: 'HEAD' | 'DEPUTY' | 'MEMBER' | null
  roleCode?: string | null
}

// ============================================================================
// ITEM TYPES
// ============================================================================

export interface RequisitionItem {
  id?: string
  requisitionId?: string
  itemName: string
  description: string
  quantity: string | number
  unitPrice: string | number
  totalPrice?: string | number
  unit: string
  preferredVendorId?: string | null
  specifications?: Record<string, any> | null
  createdAt?: string
  updatedAt?: string
}

export interface RFQItem {
  itemName: string
  description: string
  quantity: number
  unit: string
  specifications?: Record<string, any>
}

export interface QuotationItem {
  id?: string
  quotationId?: string
  itemName: string
  description: string | null
  quantity: string | number
  unit: string
  unitPrice: string | number
  totalPrice: string | number
  specifications?: Record<string, any> | null
  brand?: string | null
  model?: string | null
  warranty?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface PurchaseOrderItem {
  id?: string
  purchaseOrderId?: string
  itemName: string
  description: string | null
  quantity: string | number
  unitPrice: string | number
  totalPrice: string | number
  unit: string
  quantityReceived: string | number
  quantityPending: string | number
  specifications?: Record<string, any> | null
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// VENDOR TYPES
// ============================================================================

export interface Vendor {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  taxNumber?: string | null
  contactPerson?: string | null
  paymentTerms?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface VendorBasic {
  id: string
  name: string
  email: string
  phone?: string | null
}

// ============================================================================
// PURCHASE REQUISITION TYPES
// ============================================================================

export interface PurchaseRequisition {
  id: string
  requisitionNumber: string
  title: string
  description: string | null
  requestedById: string
  status: RequisitionStatus
  priority: Priority
  justification: string | null
  approvedById: string | null
  approvedAt: string | null
  rejectionReason: string | null
  totalAmount: string
  currencyId: string | null
  createdAt: string
  updatedAt: string
  department: string
  requestedBy: UserInfo
  approvedBy?: UserInfo | null
  currency?: any
  items: RequisitionItem[]
  purchaseOrders?: any[]
}

export interface CreateRequisitionPayload {
  title: string
  description?: string
  department: DepartmentType
  priority: Priority
  justification?: string
  items: Omit<RequisitionItem, 'id' | 'requisitionId' | 'createdAt' | 'updatedAt'>[]
}

export interface RequisitionFilters {
  status?: RequisitionStatus
  priority?: Priority
  department?: string
  limit?: number
  offset?: number
}

// ============================================================================
// RFQ TYPES
// ============================================================================

export interface RFQ {
  id: string
  rfqNumber: string
  requisitionId: string | null
  title: string
  description: string | null
  status: RFQStatus
  priority: Priority
  expectedDeliveryDate: string | null
  deliveryAddress: string | null
  rfqDeadline: string | null
  specialRequirements: string | null
  createdById: string
  createdAt: string
  updatedAt: string
  items: RFQItem[]
  vendors: VendorBasic[]
  quotations?: VendorQuotation[]
}

export interface CreateRFQPayload {
  requisitionId?: string
  title: string
  description?: string
  vendorIds: string[]
  priority: Priority
  expectedDeliveryDate: string
  deliveryAddress: string
  rfqDeadline: string
  specialRequirements?: string
  items: RFQItem[]
}

export interface RFQFilters {
  rfqNumber?: string
  requisitionId?: string
  status?: RFQStatus
  limit?: number
  offset?: number
}

// ============================================================================
// VENDOR QUOTATION TYPES
// ============================================================================

export interface VendorQuotation {
  id: string
  quotationNumber: string
  rfqNumber: string
  requisitionId: string | null
  vendorName: string
  vendorEmail: string
  companyName: string
  taxEIN: string | null
  contactPerson: string | null
  phoneNumber: string | null
  address: string | null
  status: QuotationStatus
  validUntil: string | null
  subtotal: string
  taxAmount: string
  totalAmount: string
  currencyCode: string
  paymentTerms: string | null
  deliveryTerms: string | null
  deliveryTime: string | null
  notes: string | null
  attachments: Record<string, any> | null
  reviewedById: string | null
  reviewedAt: string | null
  reviewNotes: string | null
  rejectionReason: string | null
  invoiceId: string | null
  submittedAt: string
  updatedAt: string
  items: QuotationItem[]
  reviewedBy?: UserInfo | null
  invoice?: any
}

export interface SubmitQuotationPayload {
  rfqNumber: string
  requisitionId?: string
  vendorName: string
  vendorEmail: string
  companyName: string
  taxEIN?: string
  contactPerson?: string
  phoneNumber: string
  address?: string
  validUntil: string
  currencyCode: string
  paymentTerms?: string
  deliveryTerms?: string
  deliveryTime?: string
  notes?: string
  attachments?: Record<string, any>
  items: {
    itemName: string
    description: string
    quantity: number
    unit: string
    unitPrice: number
    specifications?: Record<string, any>
    brand?: string
    model?: string
    warranty?: string
  }[]
}

export interface AcceptQuotationPayload {
  reviewNotes: string
  createPO?: boolean
  createInvoice?: boolean
}

export interface RejectQuotationPayload {
  rejectionReason: string
  reviewNotes?: string
}

export interface QuotationFilters {
  status?: QuotationStatus
  rfqNumber?: string
  vendorEmail?: string
  limit?: number
  offset?: number
}

// ============================================================================
// PURCHASE ORDER TYPES
// ============================================================================

export interface PurchaseOrder {
  id: string
  poNumber: string
  requisitionId: string | null
  quotationId: string | null
  vendorId: string
  status: PurchaseOrderStatus
  priority: Priority
  subtotal: string
  taxAmount: string
  totalAmount: string
  currencyId: string | null
  orderDate: string
  expectedDeliveryDate: string | null
  actualDeliveryDate: string | null
  shippingAddress: string | null
  paymentTerms: string | null
  deliveryTerms: string | null
  sentAt: string | null
  sentById: string | null
  approvedById: string | null
  approvedAt: string | null
  createdById: string
  createdAt: string
  updatedAt: string
  vendor: VendorBasic & { address?: string }
  requisition?: {
    id: string
    requisitionNumber: string
    title: string
  } | null
  currency?: {
    id: string
    code: string
    name: string
    symbol: string
  } | null
  items: PurchaseOrderItem[]
  createdBy: UserInfo
  approvedBy?: UserInfo | null
}

export interface CreatePurchaseOrderPayload {
  requisitionId?: string
  quotationId?: string
  vendorId: string
  priority: Priority
  currencyId?: string
  expectedDeliveryDate: string
  shippingAddress?: string
  paymentTerms?: string
  deliveryTerms?: string
  items: {
    itemName: string
    description?: string
    quantity: number
    unitPrice: number
    unit: string
    specifications?: Record<string, any>
  }[]
}

export interface PurchaseOrderFilters {
  status?: PurchaseOrderStatus
  vendorId?: string
  priority?: Priority
  limit?: number
  offset?: number
}

// ============================================================================
// APPROVAL CONFIGURATION TYPES
// ============================================================================

export interface ApprovalStep {
  stepNumber: number
  stepName: string
  stepType: StepType
  roleCode?: string
  isRequired: boolean
  approvalOrder: ApprovalOrder
}

export interface ApprovalStage {
  id?: string
  configId?: string
  stageType: StageType
  stepNumber: number
  stepName: string
  stepType: StepType
  isRequired: boolean
  canDelegate: boolean
  autoApprove: boolean
  approvalOrder: ApprovalOrder
  roleCode?: string | null
}

export interface ApprovalConfiguration {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdById: string
  createdAt: any
  updatedAt: any
  department: string
  createdBy: UserInfo
  stages: ApprovalStage[]
  _count?: {
    requests: number
  }
}

export interface CreateApprovalConfigPayload {
  name: string
  description?: string
  department: DepartmentType
  stages: {
    stageType: StageType
    steps: ApprovalStep[]
  }[]
}

export interface UpdateApprovalConfigPayload extends CreateApprovalConfigPayload {}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface ProcurementDashboard {
  requisitions: {
    total: number
    pending: number
    approved: number
  }
  purchaseOrders: {
    total: number
    pending: number
    received: number
  }
  invoices: {
    total: number
    pending: number
    approved: number
  }
  grns: {
    total: number
    pending: number
  }
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  count?: number
  limit?: number
  offset?: number
  department?: string
  timestamp?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number
  limit?: number
  offset?: number
}
