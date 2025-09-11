import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Fund {
  id: string
  name: string
  type: string
  vintage: string
  size: number
  committed: number
  deployed: number
  remaining: number
  irr: number
  multiple: number
  status: "Active" | "Mature" | "Closed"
  investors: number
  companies: number
}

interface FundsState {
  funds: Fund[]
  loading: boolean
  error: string | null
  selectedType: string
  searchTerm: string
}

const initialState: FundsState = {
  funds: [],
  loading: false,
  error: null,
  selectedType: "All",
  searchTerm: "",
}

const fundsSlice = createSlice({
  name: "funds",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setFunds: (state, action: PayloadAction<Fund[]>) => {
      state.funds = action.payload
    },
    addFund: (state, action: PayloadAction<Fund>) => {
      state.funds.push(action.payload)
    },
    updateFund: (state, action: PayloadAction<{ id: string; updates: Partial<Fund> }>) => {
      const index = state.funds.findIndex((f) => f.id === action.payload.id)
      if (index !== -1) {
        state.funds[index] = { ...state.funds[index], ...action.payload.updates }
      }
    },
    removeFund: (state, action: PayloadAction<string>) => {
      state.funds = state.funds.filter((f) => f.id !== action.payload)
    },
    setSelectedType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
  },
})

export const { setLoading, setError, setFunds, addFund, updateFund, removeFund, setSelectedType, setSearchTerm } =
  fundsSlice.actions

export default fundsSlice.reducer
