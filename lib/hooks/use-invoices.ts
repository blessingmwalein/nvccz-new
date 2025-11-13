import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { toast } from 'sonner'
import type { RootState, AppDispatch } from '@/lib/store'
import {
  fetchInvoices,
  fetchCustomers,
  createInvoice,
  updateInvoice,
  sendInvoice,
  markInvoiceAsPaid,
  voidInvoice,
  fetchInvoiceById,
  setFilters,
  clearFilters,
  setSelectedInvoice,
  clearError
} from '@/lib/store/slices/invoices-slice'
import { CreateInvoiceRequest, MarkAsPaidRequest, VoidInvoiceRequest, Invoice } from '@/lib/api/accounting-api'

export const useInvoices = () => {
  const dispatch = useDispatch<AppDispatch>()
  
  const {
    invoices,
    customers,
    selectedInvoice,
    loading,
    customersLoading,
    error,
    filters,
    stats,
    pagination
  } = useSelector((state: RootState) => state.invoices)

  // Load invoices with filters
  const loadInvoices = useCallback(async (newFilters?: any) => {
    try {
      const result = await dispatch(fetchInvoices(newFilters)).unwrap()
      return result
    } catch (error: any) {
      toast.error('Failed to load invoices', {
        description: error.message || 'Unknown error occurred'
      })
      throw error
    }
  }, [dispatch])

  // Load customers
  const loadCustomers = useCallback(async () => {
    try {
      await dispatch(fetchCustomers()).unwrap()
    } catch (error: any) {
      toast.error('Failed to load customers', {
        description: error.message || 'Unknown error occurred'
      })
    }
  }, [dispatch])

  // Create new invoice
  const handleCreateInvoice = useCallback(async (invoiceData: CreateInvoiceRequest) => {
    try {
      const result = await dispatch(createInvoice(invoiceData)).unwrap()
      toast.success('Invoice created successfully')
      return result
    } catch (error: any) {
      toast.error('Failed to create invoice', {
        description: error.message || 'Unknown error occurred'
      })
      throw error
    }
  }, [dispatch])

  // Update existing invoice
  const handleUpdateInvoice = useCallback(async (id: string, data: Partial<CreateInvoiceRequest>) => {
    try {
      const result = await dispatch(updateInvoice({ id, data })).unwrap()
      toast.success('Invoice updated successfully')
      return result
    } catch (error: any) {
      toast.error('Failed to update invoice', {
        description: error.message || 'Unknown error occurred'
      })
      throw error
    }
  }, [dispatch])

  // Send invoice
  const handleSendInvoice = useCallback(async (invoice: Invoice): Promise<Invoice> => {
    if (invoice.status !== 'DRAFT') {
      toast.error('Only draft invoices can be sent')
      throw new Error('Invalid invoice status')
    }

    try {
      const result = await dispatch(sendInvoice(invoice.id)).unwrap()
      toast.success('Invoice sent successfully')
      return result
    } catch (error: any) {
      toast.error('Failed to send invoice', {
        description: error.message || 'Unknown error occurred'
      })
      throw error
    }
  }, [dispatch])

  // Mark invoice as paid
  const handleMarkAsPaid = useCallback(async (invoice: Invoice, data: MarkAsPaidRequest): Promise<Invoice> => {
    if (invoice.status !== 'SENT') {
      toast.error('Only sent invoices can be marked as paid')
      throw new Error('Invalid invoice status')
    }

    try {
      const result = await dispatch(markInvoiceAsPaid({ id: invoice.id, data })).unwrap()
      toast.success('Invoice marked as paid successfully')
      return result
    } catch (error: any) {
      toast.error('Failed to mark invoice as paid', {
        description: error.message || 'Unknown error occurred'
      })
      throw error
    }
  }, [dispatch])

  // Void invoice
  const handleVoidInvoice = useCallback(async (invoice: Invoice, data: VoidInvoiceRequest): Promise<Invoice> => {
    try {
      const result = await dispatch(voidInvoice({ id: invoice.id, data })).unwrap()
      toast.success('Invoice voided successfully')
      return result
    } catch (error: any) {
      toast.error('Failed to void invoice', {
        description: error.message || 'Unknown error occurred'
      })
      throw error
    }
  }, [dispatch])

  // Refresh single invoice
  const refreshInvoice = useCallback(async (invoiceId: string): Promise<Invoice> => {
    try {
      const result = await dispatch(fetchInvoiceById(invoiceId)).unwrap()
      return result
    } catch (error: any) {
      toast.error('Failed to refresh invoice', {
        description: error.message || 'Unknown error occurred'
      })
      throw error
    }
  }, [dispatch])

  // Filter management
  const updateFilters = useCallback((newFilters: any) => {
    dispatch(setFilters(newFilters))
  }, [dispatch])

  const resetFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  // Selection management
  const selectInvoice = useCallback((invoice: Invoice | null) => {
    dispatch(setSelectedInvoice(invoice))
  }, [dispatch])

  // Error management
  const clearErrorState = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    // State
    invoices,
    customers,
    selectedInvoice,
    loading,
    customersLoading,
    error,
    filters,
    stats,
    pagination,
    
    // Actions
    loadInvoices,
    loadCustomers,
    handleCreateInvoice,
    handleUpdateInvoice,
    handleSendInvoice,
    handleMarkAsPaid,
    handleVoidInvoice,
    refreshInvoice,
    updateFilters,
    resetFilters,
    selectInvoice,
    clearErrorState
  }
}
