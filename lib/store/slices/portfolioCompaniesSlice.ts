import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { portfolioCompaniesApi, PortfolioCompany } from '@/lib/api/portfolio-companies-api'

interface PortfolioCompaniesState {
  companies: PortfolioCompany[]
  selectedCompany: PortfolioCompany | null
  loading: boolean
  error: string | null
}

const initialState: PortfolioCompaniesState = {
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null
}

export const fetchPortfolioCompanies = createAsyncThunk(
  'portfolioCompanies/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await portfolioCompaniesApi.getAllWithInvestments()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch portfolio companies')
    }
  }
)

export const fetchCompanyById = createAsyncThunk(
  'portfolioCompanies/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await portfolioCompaniesApi.getById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch company details')
    }
  }
)

const portfolioCompaniesSlice = createSlice({
  name: 'portfolioCompanies',
  initialState,
  reducers: {
    setSelectedCompany: (state, action: PayloadAction<PortfolioCompany | null>) => {
      state.selectedCompany = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolioCompanies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPortfolioCompanies.fulfilled, (state, action) => {
        state.loading = false
        state.companies = action.payload
      })
      .addCase(fetchPortfolioCompanies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.selectedCompany = action.payload
      })
  }
})

export const { setSelectedCompany, clearError } = portfolioCompaniesSlice.actions
export default portfolioCompaniesSlice.reducer
