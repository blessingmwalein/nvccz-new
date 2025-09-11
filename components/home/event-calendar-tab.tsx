"use client"

import { useState } from "react"
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

const events = [
  // September 2024 Events
  {
    id: 1,
    title: "Q3 Portfolio Review",
    date: new Date(2024, 8, 5),
    time: "14:00",
    duration: "2 hours",
    location: "Conference Room A",
    attendees: 12,
    type: "meeting",
    priority: "high",
    description: "Quarterly portfolio performance review and strategy discussion for Q3 2024"
  },
  {
    id: 2,
    title: "African Markets Summit",
    date: new Date(2024, 8, 12),
    time: "09:00",
    duration: "6 hours",
    location: "Convention Center",
    attendees: 150,
    type: "conference",
    priority: "high",
    description: "Annual summit discussing investment opportunities across African markets"
  },
  {
    id: 3,
    title: "Investment Committee Meeting",
    date: new Date(2024, 8, 18),
    time: "10:00",
    duration: "3 hours",
    location: "Board Room",
    attendees: 8,
    type: "meeting",
    priority: "high",
    description: "Review new investment opportunities and approve funding decisions"
  },
  {
    id: 4,
    title: "Client Presentation - TechCorp",
    date: new Date(2024, 8, 20),
    time: "15:30",
    duration: "1 hour",
    location: "Presentation Hall",
    attendees: 25,
    type: "presentation",
    priority: "medium",
    description: "Present investment proposal to TechCorp management team"
  },
  {
    id: 5,
    title: "Market Analysis Workshop",
    date: new Date(2024, 8, 22),
    time: "09:00",
    duration: "4 hours",
    location: "Training Center",
    attendees: 15,
    type: "workshop",
    priority: "medium",
    description: "Deep dive into African market trends and opportunities"
  },
  {
    id: 6,
    title: "Fund II Annual Meeting",
    date: new Date(2024, 8, 25),
    time: "18:00",
    duration: "3 hours",
    location: "Grand Hotel",
    attendees: 100,
    type: "celebration",
    priority: "high",
    description: "Annual meeting for Fund II investors and stakeholders"
  },
  {
    id: 7,
    title: "Risk Management Training",
    date: new Date(2024, 8, 28),
    time: "10:00",
    duration: "3 hours",
    location: "Training Room B",
    attendees: 20,
    type: "workshop",
    priority: "medium",
    description: "Advanced risk management techniques for investment professionals"
  },
  // December 2024 Events (keeping some for variety)
  {
    id: 8,
    title: "Q4 Portfolio Review Meeting",
    date: new Date(2024, 11, 15),
    time: "14:00",
    duration: "2 hours",
    location: "Conference Room A",
    attendees: 12,
    type: "meeting",
    priority: "high",
    description: "Quarterly portfolio performance review and strategy discussion"
  },
  {
    id: 9,
    title: "Fund III Closing Ceremony",
    date: new Date(2024, 11, 25),
    time: "18:00",
    duration: "3 hours",
    location: "Grand Hotel",
    attendees: 100,
    type: "celebration",
    priority: "high",
    description: "Celebrate the successful closing of Fund III"
  }
]

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
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 1)) // Start with September 2024
  const [selectedType, setSelectedType] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    return events.filter(event => 
      event.date.toDateString() === date.toDateString() &&
      (selectedType === "all" || event.type === selectedType)
    )
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

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="border rounded-xl border-gray-200 p-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Event Calendar
            </CardTitle>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-full border-0 cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </div>
        </CardHeader>
      </div>

      {/* Filters */}
      <div className="border rounded-xl border-gray-200 p-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Filter by type:</span>
            <div className="flex gap-2">
              {eventTypes.map(type => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 rounded-full cursor-pointer transition-all duration-200 ${
                    selectedType === type.id 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0" 
                      : "bg-transparent border-2 border-transparent text-gray-700 hover:text-white hover:from-green-600 hover:to-teal-700"
                  }`}
                  style={selectedType === type.id ? {
                    color: 'white'
                  } : {
                    color: '#374151',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #10b981, #0d9488) border-box',
                    border: '2px solid transparent'
                  }}
                >
                  <div className={`w-2 h-2 rounded-full ${type.color}`} />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </div>

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
                                      priorityColors[event.priority as keyof typeof priorityColors]
                                    } text-white hover:scale-105`}
                                    onClick={() => {
                                      setSelectedEvent(event)
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
                                      <div className={`w-3 h-3 rounded-full ${
                                        priorityColors[event.priority as keyof typeof priorityColors]
                                      }`} />
                                      {event.title}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3">
                                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                                        <div>
                                          <div className="text-sm">{event.date.toLocaleDateString()}</div>
                                          <div className="text-xs text-gray-500">{event.time} • {event.duration}</div>
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
                                      
                                      <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${
                                          priorityColors[event.priority as keyof typeof priorityColors]
                                        }`} />
                                        <Badge variant="outline" className="capitalize">
                                          {event.priority} priority
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <div className="pt-3 border-t">
                                      <p className="text-sm text-gray-600">{event.description}</p>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <Button 
                                        size="sm" 
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full border-0 cursor-pointer"
                                      >
                                        Join Event
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
                                        Edit
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
              {events
                .filter(event => event.date >= new Date() && (selectedType === "all" || event.type === selectedType))
                .slice(0, 5)
                .map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-2 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        priorityColors[event.priority as keyof typeof priorityColors]
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-xs text-gray-900 mb-1">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {event.date.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
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
                        <div className="text-sm">{selectedEvent.date.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{selectedEvent.time} • {selectedEvent.duration}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div className="text-sm">{selectedEvent.location}</div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div className="text-sm">{selectedEvent.attendees} attendees</div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        priorityColors[selectedEvent.priority as keyof typeof priorityColors]
                      }`} />
                      <Badge variant="outline" className="capitalize">
                        {selectedEvent.priority} priority
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full border-0 cursor-pointer"
                    >
                      Join Event
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
  )
}
