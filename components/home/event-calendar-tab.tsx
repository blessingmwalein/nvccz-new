"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  X
} from "lucide-react"
import { EventForm, type EventFormValues } from "./event-form"

import { eventsApi, type AppEvent } from "@/lib/api/events-api"

const eventTypes = [
  { id: "all", label: "All Events", color: "bg-gray-500" },
  { id: "meeting", label: "Meetings", color: "bg-blue-500" },
  { id: "presentation", label: "Presentations", color: "bg-green-500" },
  { id: "workshop", label: "Workshops", color: "bg-purple-500" },
  { id: "conference", label: "Conferences", color: "bg-indigo-500" },
  { id: "celebration", label: "Celebrations", color: "bg-orange-500" }
]

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500"
}

export function EventCalendarTab() {
  const [currentDate, setCurrentDate] = useState(new Date())
  // Removed filter by type for now
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [apiEvents, setApiEvents] = useState<AppEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [isEventFormOpen, setIsEventFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await eventsApi.getAll()
        setApiEvents(res.data || [])
      } catch (e) {
        // silent
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    const dayStr = date.toDateString()
    return apiEvents.filter(evt => {
      const start = new Date(evt.startDate)
      const end = new Date(evt.endDate || evt.startDate)
      const inRange = start <= date && date <= end
      return inRange
    }).map(evt => ({
      id: evt.id,
      title: evt.title,
      date,
      time: new Date(evt.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: '',
      location: evt.location,
      priority: 'high',
      description: evt.description
    }))
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const handleSubmitEvent = async (values: EventFormValues) => {
    try {
      if (editingEvent) {
        const res = await eventsApi.update(editingEvent.id, {
          title: values.title,
          description: values.description,
          location: values.location,
          startDate: values.startDate,
          endDate: values.endDate,
        })
        if (res.success && res.data) {
          setApiEvents(prev => prev.map(e => e.id === editingEvent.id ? (res.data as any) : e))
        }
        setEditingEvent(null)
      } else {
        const res = await eventsApi.create({
          title: values.title,
          description: values.description,
          location: values.location,
          startDate: values.startDate,
          endDate: values.endDate,
        })
        if (res.success && res.data) {
          setApiEvents(prev => [res.data as any, ...prev])
        }
      }
    } finally {
      setIsEventFormOpen(false)
    }
  }

  return (<>
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="border rounded-xl border-gray-200 p-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Event Calendar
            </CardTitle>
            <Button onClick={() => { setEditingEvent(null); setIsEventFormOpen(true) }} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-full border-0 cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </div>
        </CardHeader>
      </div>

      {/* Filters removed per request */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="border rounded-xl border-gray-200 p-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-gray-900">{monthName}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const dayEvents = day ? getEventsForDate(day) : []
                  const isToday = day && day.toDateString() === new Date().toDateString()
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border border-gray-200 ${
                        day ? 'bg-white hover:bg-gray-50' : 'bg-gray-100'
                      } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm mb-2 ${
                            isToday ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map(event => (
                              <Dialog key={event.id}>
                                <DialogTrigger asChild>
                                  <div
                                    className={`text-xs p-2 rounded border-2 border-dashed cursor-pointer hover:shadow-sm transition-all ${
                                      'bg-blue-500'
                                    } text-white hover:scale-105`}
                                    onClick={() => {
                                      setSelectedEvent(apiEvents.find(e => e.id === event.id) || null)
                                      setIsDialogOpen(true)
                                    }}
                                  >
                                    <div className="truncate">{event.title}</div>
                                    <div className="text-xs opacity-80">{event.time}</div>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full bg-blue-500`} />
                                      {event.title}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3">
                                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                                        <div>
                                          <div className="text-sm">{new Date(event.date).toLocaleDateString()}</div>
                                          <div className="text-xs text-gray-500">{event.time}</div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <div className="text-sm">{event.location}</div>
                                      </div>
                                      
                                      <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <div className="text-sm">{event.attendees} attendees</div>
                                      </div>
                                      
                                      
                                    </div>
                                    
                                    <div className="pt-3 border-t">
                                      <p className="text-sm text-gray-600">{event.description}</p>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <Button 
                                        size="sm" 
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full border-0 cursor-pointer"
                                        onClick={() => { const evt = apiEvents.find(e => e.id === event.id); if (evt) { setEditingEvent(evt); setIsEventFormOpen(true); }}}
                                      >
                                        Edit
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="bg-transparent border-2 border-transparent bg-gradient-to-r from-green-500 to-teal-600 bg-clip-border rounded-full text-gray-700 hover:from-green-600 hover:to-teal-700 hover:text-white transition-all duration-200 cursor-pointer"
                                        style={{
                                          background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #10b981, #0d9488) border-box',
                                          border: '2px solid transparent'
                                        }}
                                      >
                                        Close
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <div className="border rounded-xl border-gray-200 p-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-gray-900">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {apiEvents
                .filter(evt => new Date(evt.startDate) >= new Date())
                .slice(0, 5)
                .map((evt, index) => (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-2 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEvent(evt)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full mt-1 bg-blue-500" />
                      <div className="flex-1">
                        <h4 className="text-xs text-gray-900 mb-1">
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(evt.startDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(evt.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </CardContent>
          </div>

          {/* Selected Event Details */}
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="border rounded-xl border-gray-200 p-4">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{selectedEvent.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-sm">{new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate || selectedEvent.startDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(selectedEvent.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {selectedEvent.endDate ? ` - ${new Date(selectedEvent.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div className="text-sm">{selectedEvent.location}</div>
                    </div>
                    
                    {/* Attendees not available from API */}
                    
                    {/* Priority not available from API */}
                  </div>
                  
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => { setEditingEvent(selectedEvent); setIsEventFormOpen(true) }}
                      variant="outline" 
                      size="sm"
                      className="bg-transparent border-2 border-transparent bg-gradient-to-r from-green-500 to-teal-600 bg-clip-border rounded-full text-gray-700 hover:from-green-600 hover:to-teal-700 hover:text-white transition-all duration-200 cursor-pointer"
                      style={{
                        background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #10b981, #0d9488) border-box',
                        border: '2px solid transparent'
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    <EventForm
      open={isEventFormOpen}
      onClose={() => { setIsEventFormOpen(false); setEditingEvent(null) }}
      onSubmit={handleSubmitEvent}
      mode={editingEvent ? 'edit' : 'create'}
      initialValues={editingEvent ? {
        title: editingEvent.title,
        description: editingEvent.description,
        location: editingEvent.location,
        startDate: editingEvent.startDate?.slice(0,16),
        endDate: editingEvent.endDate?.slice(0,16),
      } : undefined}
    />
  </>)
}
