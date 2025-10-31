import { configureStore } from '@reduxjs/toolkit'
import accountingReducer from './slices/accountingSlice'
import cashbookReducer from './slices/cashbookSlice'

export const store = configureStore({
  reducer: {
    accounting: accountingReducer,
    cashbook: cashbookReducer,
  },
  // ...existing middleware...
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch