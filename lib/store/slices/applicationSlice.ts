import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Document {
  documentType: 'BUSINESS_PLAN' | 'PROOF_OF_CONCEPT' | 'MARKET_RESEARCH' | 'PROJECTED_CASH_FLOWS' | 'HISTORICAL_FINANCIALS'
  fileName: string
  fileUrl: string
  fileSize: number
  isRequired: boolean
  file?: File
}

export interface ApplicationFormData {
  // Step 1: Basic Information
  firstName: string
  lastName: string
  applicantEmail: string
  applicantPhone: string
  phoneCountryCode: string
  applicantAddress: string
  
  // Step 2: Business Information
  businessName: string
  businessDescription: string
  industry: string
  businessStage: 'STARTUP' | 'GROWTH' | 'MATURE' | 'EXPANSION'
  foundingDate: string
  requestedAmount: number
  
  // Step 3: Documents
  documents: Document[]
  
  // Form state
  currentStep: number
  isSubmitting: boolean
  errors: Record<string, string>
}

const initialState: ApplicationFormData = {
  firstName: '',
  lastName: '',
  applicantEmail: '',
  applicantPhone: '',
  phoneCountryCode: '+263',
  applicantAddress: '',
  businessName: '',
  businessDescription: '',
  industry: '',
  businessStage: 'STARTUP',
  foundingDate: '',
  requestedAmount: 0,
  documents: [],
  currentStep: 1,
  isSubmitting: false,
  errors: {}
}

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateFormField: (state, action: PayloadAction<{ field: keyof ApplicationFormData; value: any }>) => {
      const { field, value } = action.payload
      state[field] = value
      // Clear error for this field when updated
      if (state.errors[field]) {
        delete state.errors[field]
      }
    },
    
    updateDocument: (state, action: PayloadAction<{ index: number; document: Partial<Document> }>) => {
      const { index, document } = action.payload
      if (state.documents[index]) {
        state.documents[index] = { ...state.documents[index], ...document }
      }
    },
    
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload)
    },
    
    removeDocument: (state, action: PayloadAction<number>) => {
      state.documents.splice(action.payload, 1)
    },
    
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    
    nextStep: (state) => {
      if (state.currentStep < 3) {
        state.currentStep += 1
      }
    },
    
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
      }
    },
    
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload
    },
    
    clearErrors: (state) => {
      state.errors = {}
    },
    
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload
    },
    
    resetForm: (state) => {
      return { ...initialState }
    }
  }
})

export const {
  updateFormField,
  updateDocument,
  addDocument,
  removeDocument,
  setCurrentStep,
  nextStep,
  previousStep,
  setErrors,
  clearErrors,
  setSubmitting,
  resetForm
} = applicationSlice.actions

export default applicationSlice.reducer
