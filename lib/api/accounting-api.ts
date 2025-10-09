import { apiClient, type ApiResponse } from '@/lib/api/api-client'

export interface Currency {
  id: string
  code: string
  name: string
  symbol: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Vendor {
  id: string
  name: string
  taxNumber: string
  contactPerson: string
  email: string
  phone: string
  address: string
  paymentTerms: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const accountingApi = {
  currencies: {
    getAll: async (): Promise<ApiResponse<Currency[]>> => {
      return apiClient.get<ApiResponse<Currency[]>>('/accounting/currencies')
    },
  },
  vendors: {
    getAll: async (): Promise<ApiResponse<Vendor[]>> => {
      return apiClient.get<ApiResponse<Vendor[]>>('/accounting/vendors')
    },
  },
}


