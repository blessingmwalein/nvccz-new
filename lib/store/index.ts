import { configureStore } from "@reduxjs/toolkit"
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import portfolioSlice from "./slices/portfolioSlice"
import applicationsSlice from "./slices/applicationsSlice"
import applicationSlice from "./slices/applicationSlice"
import companiesSlice from "./slices/companiesSlice"
import fundsSlice from "./slices/fundsSlice"
import accountSlice from "./slices/accountSlice"
import uiSlice from "./slices/uiSlice"
import authSlice from "./slices/authSlice"
import financialDataSlice from "./slices/financialDataSlice"
import performanceSlice from "./slices/performanceSlice"
import payrollSlice from "./slices/payrollSlice"
import procurementSlice from "./slices/procurementSlice"
import currenciesSlice from "./slices/currenciesSlice"
import usersSlice from "./slices/usersSlice"
import taskSlice from "./slices/taskSlice"

export const store = configureStore({
  reducer: {
    portfolio: portfolioSlice,
    applications: applicationsSlice,
    application: applicationSlice,
    companies: companiesSlice,
    funds: fundsSlice,
    account: accountSlice,
    ui: uiSlice,
    auth: authSlice,
    financialData: financialDataSlice,
    performance: performanceSlice,
    payroll: payrollSlice,
    procurement: procurementSlice,
    currencies: currenciesSlice,
    users: usersSlice,
    tasks: taskSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
