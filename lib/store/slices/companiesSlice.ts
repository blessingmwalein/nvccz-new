import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Company {
  id: string
  name: string
  sector: string
  stage: string
  investment: number
  valuation: number
  ownership: number
  status: "Active" | "Exited" | "Under Review"
  lastUpdate: string
  performance: number
}

interface CompaniesState {
  companies: Company[]
  loading: boolean
  error: string | null
  selectedSector: string
  searchTerm: string
}

const initialState: CompaniesState = {
  companies: [],
  loading: false,
  error: null,
  selectedSector: "All",
  searchTerm: "",
}

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload
    },
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload)
    },
    updateCompany: (state, action: PayloadAction<{ id: string; updates: Partial<Company> }>) => {
      const index = state.companies.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.companies[index] = { ...state.companies[index], ...action.payload.updates }
      }
    },
    removeCompany: (state, action: PayloadAction<string>) => {
      state.companies = state.companies.filter((c) => c.id !== action.payload)
    },
    setSelectedSector: (state, action: PayloadAction<string>) => {
      state.selectedSector = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  setCompanies,
  addCompany,
  updateCompany,
  removeCompany,
  setSelectedSector,
  setSearchTerm,
} = companiesSlice.actions

export default companiesSlice.reducer
