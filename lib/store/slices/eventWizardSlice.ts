import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { BudgetLineItem, Guest } from "./eventsSlice"

interface EventWizardState {
  isOpen: boolean
  currentStep: number
  formData: {
    title: string
    description: string
    startDate: string
    endDate: string
    venue: string
    private: boolean
    accessList: string[]
    guests: Guest[]
    budgetLineItems: BudgetLineItem[]
  }
}

const initialState: EventWizardState = {
  isOpen: false,
  currentStep: 0,
  formData: {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    venue: "",
    private: false,
    accessList: [],
    guests: [],
    budgetLineItems: [],
  },
}

const eventWizardSlice = createSlice({
  name: "eventWizard",
  initialState,
  reducers: {
    openWizard: (state) => {
      state.isOpen = true
      state.currentStep = 0
    },
    closeWizard: (state) => {
      state.isOpen = false
      state.currentStep = 0
      state.formData = initialState.formData
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    nextStep: (state) => {
      state.currentStep += 1
    },
    prevStep: (state) => {
      state.currentStep -= 1
    },
    updateFormData: (state, action: PayloadAction<Partial<EventWizardState["formData"]>>) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    resetWizard: (state) => {
      state.formData = initialState.formData
      state.currentStep = 0
    },
  },
})

export const { openWizard, closeWizard, setStep, nextStep, prevStep, updateFormData, resetWizard } =
  eventWizardSlice.actions

export default eventWizardSlice.reducer
