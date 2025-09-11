import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Currency = "USD" | "ZIG"

interface UIState {
  currency: Currency
  sidebarCollapsed: boolean
  theme: "light" | "dark"
  notifications: Array<{
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
    timestamp: number
  }>
}

const initialState: UIState = {
  currency: "USD",
  sidebarCollapsed: false,
  theme: "light",
  notifications: [],
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload
    },
    addNotification: (state, action: PayloadAction<Omit<UIState["notifications"][0], "id" | "timestamp">>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
  setCurrency,
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions

export default uiSlice.reducer
