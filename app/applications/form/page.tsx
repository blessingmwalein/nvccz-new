"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { 
  updateFormField, 
  nextStep, 
  previousStep, 
  setCurrentStep,
  setSubmitting,
  resetForm,
  clearErrors,
  setErrors,
  submitApplication
} from "@/lib/store/slices/applicationSlice"
import { toast } from "sonner"
import * as yup from "yup"
// import StepperProgress from "../components/StepperProgress"
// import Step1 from "../components/Step1"
// import Step2 from "../components/Step2"
// import Step3 from "../components/Step3"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Step1 from "@/app/portfolio/applications/components/Step1"
import Step2 from "@/app/portfolio/applications/components/Step2"
import Step3 from "@/app/portfolio/applications/components/Step3"
import StepperProgress from "@/app/portfolio/applications/components/StepperProgress"

// Validation schemas for each step
const step1Schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  applicantEmail: yup.string().email("Invalid email").required("Email is required"),
  applicantPhone: yup.string().required("Phone number is required"),
  phoneCountryCode: yup.string().required("Country code is required"),
  applicantAddress: yup.string().required("Address is required")
})

const step2Schema = yup.object({
  businessName: yup.string().required("Business name is required"),
  businessDescription: yup.string().required("Business description is required"),
  industry: yup.string().required("Industry is required"),
  businessStage: yup.string().required("Business stage is required"),
  foundingDate: yup.string().required("Founding date is required"),
  requestedAmount: yup.number().min(1000, "Minimum amount is $1,000").required("Requested amount is required")
})

const step3Schema = yup.object({
  documents: yup.array().test('required-docs', 'Please upload all required documents with files', (docs: any) => {
    const required = ['BUSINESS_PLAN','PROOF_OF_CONCEPT','MARKET_RESEARCH','PROJECTED_CASH_FLOWS']
    const uploadedDocs = (docs || []).filter((d: any) => d && d.documentType && d.file)
    const uploadedTypes = new Set(uploadedDocs.map((d: any) => d.documentType))
    return required.every(t => uploadedTypes.has(t))
  })
})

export default function ApplicationFormPage() {
  const dispatch = useAppDispatch()
  const applicationState = useAppSelector(state => state.application)
  const { currentStep, isSubmitting, errors, submitError, ...formData } = applicationState
  const router = useRouter()

  const updateField = (field: string, value: any) => {
    dispatch(updateFormField({ field: field as any, value }))
  }

  const validateStep = async (step: number) => {
    try {
      let schema
      switch (step) {
        case 1:
          schema = step1Schema
          break
        case 2:
          schema = step2Schema
          break
        case 3:
          schema = step3Schema
          break
        default:
          return true
      }
      
      await schema.validate(formData, { abortEarly: false })
      dispatch(clearErrors())
      return true
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {}
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message
          }
        })
        dispatch(setErrors(validationErrors))
      }
      return false
    }
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid) {
      dispatch(nextStep())
    }
  }

  const handlePrevious = () => {
    dispatch(previousStep())
  }

  const handleSubmit = async () => {
    const isValid = await validateStep(3)
    if (!isValid) {
      toast.error('Validation failed', {
        description: 'Please ensure all required documents are uploaded with files'
      })
      return
    }
    
    // Check if files are present
    const filesPresent = applicationState.documents.some(doc => doc.file)
    if (!filesPresent) {
      toast.error('No files uploaded', {
        description: 'Please upload at least one document file'
      })
      return
    }
    
    try {
      const result = await dispatch(submitApplication(applicationState))
      
      if (submitApplication.fulfilled.match(result)) {
        toast.success('Application created successfully')
        router.push('/applications/form/success')
      } else {
        toast.error('Failed to submit application', { 
          description: submitError || 'Please try again.' 
        })
      }
    } catch (error: any) {
      toast.error('Failed to submit application', { 
        description: error?.message || 'Please try again.' 
      })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} updateField={updateField} errors={errors} />
      case 2:
        return <Step2 formData={formData} updateField={updateField} errors={errors} />
      case 3:
        return <Step3 formData={formData} updateField={updateField} errors={errors} />
      default:
        return <Step1 formData={formData} updateField={updateField} errors={errors} />
    }
  }

  return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-12">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Application</h1>
              <p className="text-gray-600">Complete your application in 3 simple steps</p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
              <a href="/" className="text-sm text-gray-600 hover:text-gray-800 underline-offset-4 hover:underline">Cancel application</a>
              <span className="text-gray-300">|</span>
              <a href="/login" className="text-sm text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline">Go to login</a>
            </div>
          </div>

          {/* Stepper Progress */}
          <StepperProgress currentStep={currentStep} />

          {/* Form Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6"
              >
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-full"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}
