import { createSlice } from "@reduxjs/toolkit"

export interface KPIDataPoint {
  date: string
  value: number
  label?: string
}

export interface AnalyticsState {
  rsvpRateTrend: KPIDataPoint[]
  costPerAttendeeTrend: KPIDataPoint[]
  feedbackRatingTrend: KPIDataPoint[]
}

// Dummy analytics data
const initialState: AnalyticsState = {
  rsvpRateTrend: [
    { date: "2025-07", value: 45, label: "Jul" },
    { date: "2025-08", value: 58, label: "Aug" },
    { date: "2025-09", value: 62, label: "Sep" },
    { date: "2025-10", value: 71, label: "Oct" },
    { date: "2025-11", value: 64, label: "Nov" },
    { date: "2025-12", value: 78, label: "Dec" },
  ],
  costPerAttendeeTrend: [
    { date: "2025-07", value: 125, label: "Jul" },
    { date: "2025-08", value: 142, label: "Aug" },
    { date: "2025-09", value: 138, label: "Sep" },
    { date: "2025-10", value: 156, label: "Oct" },
    { date: "2025-11", value: 148, label: "Nov" },
    { date: "2025-12", value: 165, label: "Dec" },
  ],
  feedbackRatingTrend: [
    { date: "2025-07", value: 4.2, label: "Jul" },
    { date: "2025-08", value: 4.5, label: "Aug" },
    { date: "2025-09", value: 4.3, label: "Sep" },
    { date: "2025-10", value: 4.7, label: "Oct" },
    { date: "2025-11", value: 4.6, label: "Nov" },
    { date: "2025-12", value: 4.8, label: "Dec" },
  ],
}

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
})

export default analyticsSlice.reducer
