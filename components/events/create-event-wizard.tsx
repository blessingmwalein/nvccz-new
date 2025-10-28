"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useAppDispatch } from "@/lib/store"
import { addEvent } from "@/lib/store/slices/eventsSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CiCircleCheck } from "react-icons/ci"
import type { BudgetLineItem, Guest } from "@/lib/store/slices/eventsSlice"

interface CreateEventWizardProps {
  isOpen: boolean
  onClose: () => void
}

const detailsSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string(),
  venue: yup.string().required("Venue is required"),
})

export function CreateEventWizard({ isOpen, onClose }: CreateEventWizardProps) {
  const dispatch = useAppDispatch()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    venue: "",
    guests: [] as Guest[],
    budgetLineItems: [] as BudgetLineItem[],
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(detailsSchema),
    defaultValues: formData,
  })

  const steps = [
    { id: 0, name: "Details", description: "Event information" },
    { id: 1, name: "Guests", description: "Invite attendees" },
    { id: 2, name: "Budget", description: "Cost breakdown" },
    { id: 3, name: "Review", description: "Confirm & create" },
  ]

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data })
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleCreate = () => {
    const newEvent = {
      id: `evt_${Date.now()}`,
      ...formData,
      creatorId: "u_current",
      creatorName: "Current User",
      totalCost: formData.budgetLineItems.reduce((sum, item) => sum + item.total, 0),
      procurementStatus: "DRAFT" as const,
      rsvpRate: 0,
      accessList: [],
      private: false,
      guests: formData.guests,
      budgetLineItems: formData.budgetLineItems,
      activity: [
        {
          id: `a_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: "Current User",
          action: "Created event",
        },
      ],
    }

    dispatch(addEvent(newEvent))
    reset()
    setCurrentStep(0)
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      venue: "",
      guests: [],
      budgetLineItems: [],
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Event</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? <CiCircleCheck size={24} /> : index + 1}
                </div>
                <div className="text-center mt-2">
                  <div className="text-sm font-medium">{step.name}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${index < currentStep ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <form onSubmit={handleSubmit(handleNext)}>
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input id="title" {...register("title")} placeholder="Enter event title" />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter event description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date & Time *</Label>
                  <Input id="startDate" type="datetime-local" {...register("startDate")} />
                  {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input id="endDate" type="datetime-local" {...register("endDate")} />
                </div>
              </div>

              <div>
                <Label htmlFor="venue">Venue *</Label>
                <Input id="venue" {...register("venue")} placeholder="Enter venue location" />
                {errors.venue && <p className="text-sm text-red-500 mt-1">{errors.venue.message}</p>}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Guest List</h3>
                <Button type="button" size="sm">
                  Add Guest
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Add guests manually or upload a CSV file with guest information.
              </p>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No guests added yet</p>
                <p className="text-sm text-muted-foreground mt-1">Click "Add Guest" to start inviting attendees</p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Budget Line Items</h3>
                <Button type="button" size="sm">
                  Add Item
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Add budget line items to track event costs.</p>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No budget items added yet</p>
                <p className="text-sm text-muted-foreground mt-1">Click "Add Item" to start building your budget</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Review Event Details</h3>

              <div className="space-y-3 bg-muted p-4 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Title</div>
                  <div className="font-medium">{formData.title}</div>
                </div>

                {formData.description && (
                  <div>
                    <div className="text-sm text-muted-foreground">Description</div>
                    <div>{formData.description}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Start Date</div>
                    <div>{formData.startDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Venue</div>
                    <div>{formData.venue}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Guests</div>
                    <div>{formData.guests.length} invited</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Budget Items</div>
                    <div>{formData.budgetLineItems.length} items</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="submit">Next</Button>
            ) : (
              <Button type="button" onClick={handleCreate}>
                Create Event
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
