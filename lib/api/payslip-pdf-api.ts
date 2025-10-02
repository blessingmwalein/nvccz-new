import { apiClient } from './api-client'

export interface GeneratePayslipPDFRequest {
  payslipId: string
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
}

export interface GeneratePayslipPDFResponse {
  success: boolean
  message: string
  data: {
    pdfPath: string
    downloadUrl: string
  }
  timestamp: string
}

class PayslipPDFApiService {
  async generatePDF(payslipId: string, options?: {
    format?: 'a4' | 'letter'
    orientation?: 'portrait' | 'landscape'
  }): Promise<GeneratePayslipPDFResponse> {
    return apiClient.post<GeneratePayslipPDFResponse>(`/payslips/${payslipId}/generate-pdf`, {
      format: options?.format || 'a4',
      orientation: options?.orientation || 'portrait'
    })
  }

  async downloadPDF(payslipId: string): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payslips/${payslipId}/download-pdf`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to download PDF')
    }
    
    return response.blob()
  }
}

export const payslipPDFApi = new PayslipPDFApiService()
