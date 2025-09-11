import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Application {
  id: string
  companyName: string
  sector: string
  requestedAmount: number
  stage: "Initial Screening" | "Due Diligence" | "Board Review" | "Term Sheet" | "Fund Disbursement"
  status: "Pending" | "In Progress" | "Approved" | "Rejected"
  submittedDate: string
  lastUpdated: string
}

interface ApplicationsState {
  applications: Application[]
  loading: boolean
  error: string | null
  filters: {
    stage: string
    status: string
    sector: string
  }
}

const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null,
  filters: {
    stage: "All",
    status: "All",
    sector: "All",
  },
}

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload
    },
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.push(action.payload)
    },
    updateApplication: (state, action: PayloadAction<{ id: string; updates: Partial<Application> }>) => {
      const index = state.applications.findIndex((a) => a.id === action.payload.id)
      if (index !== -1) {
        state.applications[index] = { ...state.applications[index], ...action.payload.updates }
      }
    },
    removeApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter((a) => a.id !== action.payload)
    },
    setFilters: (state, action: PayloadAction<Partial<ApplicationsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
})

export const {
  setLoading,
  setError,
  setApplications,
  addApplication,
  updateApplication,
  removeApplication,
  setFilters,
} = applicationsSlice.actions

export default applicationsSlice.reducer
