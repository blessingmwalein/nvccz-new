import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface PortfolioCompany {
  id: string
  name: string
  sector: string
  stage: string
  investment: number
  valuation: number
  ownership: number
  status: "Active" | "Exited" | "Under Review"
  performance: number
}

interface PortfolioState {
  companies: PortfolioCompany[]
  totalInvestment: number
  totalValuation: number
  portfolioIRR: number
  loading: boolean
  error: string | null
}

const initialState: PortfolioState = {
  companies: [],
  totalInvestment: 0,
  totalValuation: 0,
  portfolioIRR: 0,
  loading: false,
  error: null,
}

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCompanies: (state, action: PayloadAction<PortfolioCompany[]>) => {
      state.companies = action.payload
    },
    addCompany: (state, action: PayloadAction<PortfolioCompany>) => {
      state.companies.push(action.payload)
    },
    updateCompany: (state, action: PayloadAction<{ id: string; updates: Partial<PortfolioCompany> }>) => {
      const index = state.companies.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.companies[index] = { ...state.companies[index], ...action.payload.updates }
      }
    },
    removeCompany: (state, action: PayloadAction<string>) => {
      state.companies = state.companies.filter((c) => c.id !== action.payload)
    },
    setPortfolioMetrics: (
      state,
      action: PayloadAction<{
        totalInvestment: number
        totalValuation: number
        portfolioIRR: number
      }>,
    ) => {
      state.totalInvestment = action.payload.totalInvestment
      state.totalValuation = action.payload.totalValuation
      state.portfolioIRR = action.payload.portfolioIRR
    },
  },
})

export const { setLoading, setError, setCompanies, addCompany, updateCompany, removeCompany, setPortfolioMetrics } =
  portfolioSlice.actions

export default portfolioSlice.reducer
