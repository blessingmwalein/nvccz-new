import * as yup from "yup"

export const companyFormSchema = yup.object({
  name: yup.string().required("Company name is required").min(2, "Name must be at least 2 characters"),
  sector: yup.string().required("Sector is required"),
  stage: yup.string().required("Stage is required"),
  investment: yup.number().required("Investment amount is required").positive("Investment must be positive"),
  valuation: yup.number().required("Valuation is required").positive("Valuation must be positive"),
  ownership: yup
    .number()
    .required("Ownership percentage is required")
    .min(0, "Ownership must be at least 0%")
    .max(100, "Ownership cannot exceed 100%"),
})

export const applicationFormSchema = yup.object({
  companyName: yup.string().required("Company name is required").min(2, "Name must be at least 2 characters"),
  sector: yup.string().required("Sector is required"),
  requestedAmount: yup.number().required("Requested amount is required").positive("Amount must be positive"),
  businessPlan: yup
    .string()
    .required("Business plan is required")
    .min(50, "Business plan must be at least 50 characters"),
  contactEmail: yup.string().required("Contact email is required").email("Invalid email format"),
  contactPhone: yup.string().required("Contact phone is required"),
})

export const fundFormSchema = yup.object({
  name: yup.string().required("Fund name is required").min(2, "Name must be at least 2 characters"),
  type: yup.string().required("Fund type is required"),
  size: yup.number().required("Fund size is required").positive("Size must be positive"),
  vintage: yup.string().required("Vintage year is required"),
  strategy: yup.string().required("Investment strategy is required").min(20, "Strategy must be at least 20 characters"),
})

// API-backed Fund create schema (for /api/funds)
export const fundCreateFormSchema = yup.object({
  name: yup.string().required("Fund name is required").min(2, "Name must be at least 2 characters"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  totalAmount: yup.number().required("Total amount is required").min(0, "Must be positive"),
  minInvestment: yup.number().required("Minimum investment is required").min(0, "Must be positive"),
  maxInvestment: yup
    .number()
    .required("Maximum investment is required")
    .min(yup.ref('minInvestment'), "Max must be greater than or equal to min"),
  focusIndustries: yup.array().of(yup.string().min(2)).min(1, "Select at least one industry"),
  applicationStart: yup.string().required("Application start is required"),
  applicationEnd: yup.string().required("Application end is required"),
  status: yup.mixed<'OPEN' | 'CLOSED' | 'PAUSED'>().oneOf(['OPEN','CLOSED','PAUSED']).default('OPEN')
})

export const investorFormSchema = yup.object({
  name: yup.string().required("Investor name is required").min(2, "Name must be at least 2 characters"),
  organization: yup.string().required("Organization is required"),
  type: yup.string().required("Investor type is required"),
  commitment: yup.number().required("Commitment amount is required").positive("Commitment must be positive"),
  email: yup.string().required("Email is required").email("Invalid email format"),
  phone: yup.string().required("Phone number is required"),
})

export const profileFormSchema = yup.object({
  firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
  lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
  email: yup.string().required("Email is required").email("Invalid email format"),
  phone: yup.string().required("Phone number is required"),
  title: yup.string().required("Job title is required"),
  company: yup.string().required("Company is required"),
})

export type CompanyFormData = yup.InferType<typeof companyFormSchema>
export type ApplicationFormData = yup.InferType<typeof applicationFormSchema>
export type FundFormData = yup.InferType<typeof fundFormSchema>
export type FundCreateFormData = yup.InferType<typeof fundCreateFormSchema>
export type InvestorFormData = yup.InferType<typeof investorFormSchema>
export type ProfileFormData = yup.InferType<typeof profileFormSchema>
