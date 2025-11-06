import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { applicationsApi, ApplicationCreateRequest, Application } from '@/lib/api/applications-api'

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
  lastResponse?: any
  submitError?: string
  
  // Applications list state
  applications: Application[]
  isLoading: boolean
  fetchError?: string
  investmentUsers: any[]
  usersLoading: boolean
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
  errors: {},
  lastResponse: undefined,
  submitError: undefined,
  applications: [],
  isLoading: false,
  fetchError: undefined,
  investmentUsers: [],
  usersLoading: false
}

// Async thunk for submitting application
export const submitApplication = createAsyncThunk(
  'application/submitApplication',
  async (formData: ApplicationFormData, { rejectWithValue }) => {
    try {
      // Extract files and document types from documents
      const files: File[] = []
      const documentTypes: string[] = []
      
      formData.documents.forEach((doc) => {
        if (doc.file) {
          files.push(doc.file)
          documentTypes.push(doc.documentType)
        }
      })
      
      if (files.length === 0) {
        return rejectWithValue('Please upload at least one document')
      }

      const payload: ApplicationCreateRequest = {
        applicantName: `${formData.firstName} ${formData.lastName}`.trim(),
        applicantEmail: formData.applicantEmail,
        applicantPhone: `${formData.phoneCountryCode}${formData.applicantPhone}`,
        applicantAddress: formData.applicantAddress,
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        industry: formData.industry,
        businessStage: formData.businessStage,
        foundingDate: formData.foundingDate,
        requestedAmount: formData.requestedAmount,
        files: files,
        documentTypes: documentTypes,
      }

      const response = await applicationsApi.create(payload)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit application')
    }
  }
)

// Async thunk for fetching applications
export const fetchApplications = createAsyncThunk(
  'application/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.getAll()
      return response.data.applications
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch applications')
    }
  }
)

// Async thunk for fetching investment users
export const fetchInvestmentUsers = createAsyncThunk(
  'application/fetchInvestmentUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.getInvestmentUsers()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch investment users')
    }
  }
)

// Async thunk for assigning due diligence task
export const assignDueDiligenceTask = createAsyncThunk(
  'application/assignDueDiligenceTask',
  async ({ applicationId, taskData }: { applicationId: string, taskData: any }, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.assignDueDiligenceTask(applicationId, taskData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign task')
    }
  }
)

// Async thunk for creating task activity
export const createTaskActivity = createAsyncThunk(
  'application/createTaskActivity',
  async ({ taskId, activityData }: { taskId: string, activityData: any }, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.createTaskActivity(taskId, activityData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create activity')
    }
  }
)

// Async thunk for getting activity for approval
export const getActivityForApproval = createAsyncThunk(
  'application/getActivityForApproval',
  async (activityId: string, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.getActivityForApproval(activityId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch activity')
    }
  }
)

// Async thunk for approving activity
export const approveActivity = createAsyncThunk(
  'application/approveActivity',
  async ({ activityId, approvalData }: { activityId: string, approvalData: any }, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.approveActivity(activityId, approvalData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to approve activity')
    }
  }
)

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
    setLastResponse: (state, action: PayloadAction<any>) => {
      state.lastResponse = action.payload
    },
    
    resetForm: (state) => {
      return { ...initialState }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitApplication.pending, (state) => {
        state.isSubmitting = true
        state.submitError = undefined
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.lastResponse = action.payload
        state.submitError = undefined
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.isSubmitting = false
        state.submitError = action.payload as string
      })
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true
        state.fetchError = undefined
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false
        state.applications = action.payload
        state.fetchError = undefined
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false
        state.fetchError = action.payload as string
      })
      .addCase(fetchInvestmentUsers.pending, (state) => {
        state.usersLoading = true
        state.fetchError = undefined
      })
      .addCase(fetchInvestmentUsers.fulfilled, (state, action) => {
        state.usersLoading = false
        state.investmentUsers = action.payload
        state.fetchError = undefined
      })
      .addCase(fetchInvestmentUsers.rejected, (state, action) => {
        state.usersLoading = false
        state.fetchError = action.payload as string
      })
      .addCase(assignDueDiligenceTask.pending, (state) => {
        state.isSubmitting = true
        state.submitError = undefined
      })
      .addCase(assignDueDiligenceTask.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.lastResponse = action.payload
        state.submitError = undefined
      })
      .addCase(assignDueDiligenceTask.rejected, (state, action) => {
        state.isSubmitting = false
        state.submitError = action.payload as string
      })
      .addCase(createTaskActivity.pending, (state) => {
        state.isSubmitting = true
        state.submitError = undefined
      })
      .addCase(createTaskActivity.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.lastResponse = action.payload
        state.submitError = undefined
      })
      .addCase(createTaskActivity.rejected, (state, action) => {
        state.isSubmitting = false
        state.submitError = action.payload as string
      })
      .addCase(getActivityForApproval.pending, (state) => {
        state.isLoading = true
        state.fetchError = undefined
      })
      .addCase(getActivityForApproval.fulfilled, (state, action) => {
        state.isLoading = false
        state.lastResponse = action.payload
        state.fetchError = undefined
      })
      .addCase(getActivityForApproval.rejected, (state, action) => {
        state.isLoading = false
        state.fetchError = action.payload as string
      })
      .addCase(approveActivity.pending, (state) => {
        state.isSubmitting = true
        state.submitError = undefined
      })
      .addCase(approveActivity.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.lastResponse = action.payload
        state.submitError = undefined
      })
      .addCase(approveActivity.rejected, (state, action) => {
        state.isSubmitting = false
        state.submitError = action.payload as string
      })
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
  setLastResponse,
  resetForm
} = applicationSlice.actions

export default applicationSlice.reducer
