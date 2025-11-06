import { configureStore } from '@reduxjs/toolkit'
import accountingReducer from './slices/accountingSlice'
import cashbookReducer from './slices/cashbookSlice'
import portfolioDashboardReducer from './slices/portfolioDashboardSlice'

export const store = configureStore({
  reducer: {
    accounting: accountingReducer,
    cashbook: cashbookReducer,
    portfolioDashboard: portfolioDashboardReducer,
  },
  // ...existing middleware...
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch