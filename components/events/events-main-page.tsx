"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setViewMode, setSearchFilter, setCurrentEvent } from "@/lib/store/slices/eventsSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CiSearch, CiCalendar, CiViewList, CiCirclePlus } from "react-icons/ci"
import { EventsListView } from "./events-list-view"
import { EventsCalendarView } from "./events-calendar-view"
import { EventDetailsDrawer } from "./event-details-drawer"
import { CreateEventWizard } from "./create-event-wizard"

export function EventsMainPage() {
  const dispatch = useAppDispatch()
  const { viewMode, filters, currentEventId } = useAppSelector((state) => state.events)
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Events</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your events</p>
        </div>
        <Button onClick={() => setIsWizardOpen(true)} className="gap-2" size="lg">
          <CiCirclePlus size={20} />
          Create Event
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <CiSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => dispatch(setSearchFilter(e.target.value))}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => dispatch(setViewMode("list"))}
            className="gap-2"
          >
            <CiViewList size={18} />
            List
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => dispatch(setViewMode("calendar"))}
            className="gap-2"
          >
            <CiCalendar size={18} />
            Calendar
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? <EventsListView /> : <EventsCalendarView />}

      {/* Event Details Drawer */}
      <EventDetailsDrawer isOpen={!!currentEventId} onClose={() => dispatch(setCurrentEvent(null))} />

      {/* Create Event Wizard */}
      <CreateEventWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </div>
  )
}
