"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight } from "lucide-react"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: "meeting" | "call" | "event"
  attendees: number
  priority: "high" | "medium" | "low"
}

const events: Event[] = [
  {
    id: "1",
    title: "Q4 Portfolio Review",
    date: "Nov 15",
    time: "2:00 PM - 4:00 PM",
    location: "Conference Room A",
    type: "meeting",
    attendees: 8,
    priority: "high",
  },
  {
    id: "2",
    title: "LP Quarterly Call",
    date: "Nov 18",
    time: "10:00 AM - 12:00 PM",
    location: "Virtual",
    type: "call",
    attendees: 25,
    priority: "high",
  },
  {
    id: "3",
    title: "Due Diligence: TechCorp",
    date: "Nov 20",
    time: "3:00 PM - 5:00 PM",
    location: "TechCorp HQ",
    type: "meeting",
    attendees: 4,
    priority: "medium",
  },
  {
    id: "4",
    title: "Investment Committee",
    date: "Nov 22",
    time: "9:00 AM - 11:00 AM",
    location: "Conference Room B",
    type: "meeting",
    attendees: 12,
    priority: "high",
  },
]

export function EventsCalendarWidget() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const visibleEvents = events.slice(currentWeek * 2, (currentWeek + 1) * 2)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return Users
      case "call":
        return Calendar
      case "event":
        return Calendar
      default:
        return Calendar
    }
  }

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Events
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Events List */}
        <div className="space-y-3">
          {visibleEvents.map((event) => {
            const TypeIcon = getTypeIcon(event.type)
            const isSelected = selectedEvent === event.id

            return (
              <div
                key={event.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected ? "bg-accent border-primary shadow-sm" : "bg-card hover:bg-accent/50 border-border"
                }`}
                onClick={() => setSelectedEvent(isSelected ? null : event.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-center min-w-[40px]">
                    <div className="text-xs text-muted-foreground">{event.date.split(" ")[0]}</div>
                    <div className="text-sm font-bold">{event.date.split(" ")[1]}</div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>{event.priority}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <TypeIcon className="w-3 h-3" />
                        {event.attendees} attendees
                      </div>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Join Meeting
                      </Button>
                      <Button size="sm" variant="ghost" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
            disabled={currentWeek === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <span className="text-xs text-muted-foreground">
            {visibleEvents.length} of {events.length} events
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeek(Math.min(Math.floor(events.length / 2), currentWeek + 1))}
            disabled={(currentWeek + 1) * 2 >= events.length}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="outline" className="w-full bg-transparent">
          View Full Calendar
        </Button>
      </CardContent>
    </Card>
  )
}
