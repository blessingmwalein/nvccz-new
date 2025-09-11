import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  company: string
  avatar: string
}

interface AccountState {
  profile: UserProfile | null
  preferences: {
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
      weekly: boolean
      monthly: boolean
    }
    theme: "light" | "dark"
    language: string
  }
  loading: boolean
  error: string | null
}

const initialState: AccountState = {
  profile: null,
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false,
      weekly: true,
      monthly: true,
    },
    theme: "light",
    language: "en",
  },
  loading: false,
  error: null,
}

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    setPreferences: (state, action: PayloadAction<Partial<AccountState["preferences"]>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    updateNotificationPreferences: (
      state,
      action: PayloadAction<Partial<AccountState["preferences"]["notifications"]>>,
    ) => {
      state.preferences.notifications = { ...state.preferences.notifications, ...action.payload }
    },
  },
})

export const { setLoading, setError, setProfile, updateProfile, setPreferences, updateNotificationPreferences } =
  accountSlice.actions

export default accountSlice.reducer
