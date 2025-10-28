"use client"

import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setCurrentEvent } from "@/lib/store/slices/eventsSlice"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CiLocationOn, CiCalendar, CiDollar, CiUser } from "react-icons/ci"
import { format } from "date-fns"

export function EventsListView() {
  const dispatch = useAppDispatch()
  const { list, filters } = useAppSelector((state) => state.events)

  const filteredEvents = list.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.venue.toLowerCase().includes(filters.search.toLowerCase())
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getRSVPColor = (status?: string) => {
    switch (status) {
      case "RSVP_YES":
        return "bg-green-100 text-green-700 border-green-200"
      case "RSVP_NO":
        return "bg-red-100 text-red-700 border-red-200"
      case "INVITED":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
        <Card
          key={event.id}
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => dispatch(setCurrentEvent(event.id))}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                <Badge className={getStatusColor(event.procurementStatus)}>{event.procurementStatus}</Badge>
                {event.myStatus && (
                  <Badge className={getRSVPColor(event.myStatus)}>{event.myStatus.replace("_", " ")}</Badge>
                )}
              </div>

              {event.description && <p className="text-muted-foreground mb-4">{event.description}</p>}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CiCalendar size={18} className="text-muted-foreground" />
                  <span>{format(new Date(event.startDate), "MMM dd, yyyy HH:mm")}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CiLocationOn size={18} className="text-muted-foreground" />
                  <span>{event.venue}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CiDollar size={18} className="text-muted-foreground" />
                  <span>${event.totalCost.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CiUser size={18} className="text-muted-foreground" />
                  <span>{event.creatorName}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">RSVP Rate</div>
              <div className="text-2xl font-semibold text-foreground">{event.rsvpRate}%</div>
              <div className="text-sm text-muted-foreground mt-2">{event.guests.length} guests</div>
            </div>
          </div>
        </Card>
      ))}

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No events found</p>
        </div>
      )}
    </div>
  )
}
