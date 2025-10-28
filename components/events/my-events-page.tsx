"use client"

import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setCurrentEvent } from "@/lib/store/slices/eventsSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CiSearch, CiExport, CiMail } from "react-icons/ci"
import { format } from "date-fns"
import { useState } from "react"

export function MyEventsPage() {
  const dispatch = useAppDispatch()
  const { list } = useAppSelector((state) => state.events)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter events created by current user
  const myEvents = list.filter((event) => event.creatorId === "u_admin" || event.creatorId === "u_current")

  const filteredEvents = myEvents.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">My Events</h1>
          <p className="text-muted-foreground mt-1">Events you are hosting</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <CiExport size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <CiSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search my events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Events</div>
          <div className="text-2xl font-semibold mt-1">{myEvents.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Approved</div>
          <div className="text-2xl font-semibold mt-1 text-green-600">
            {myEvents.filter((e) => e.procurementStatus === "APPROVED").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="text-2xl font-semibold mt-1 text-yellow-600">
            {myEvents.filter((e) => e.procurementStatus === "PENDING").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Budget</div>
          <div className="text-2xl font-semibold mt-1">
            ${myEvents.reduce((sum, e) => sum + e.totalCost, 0).toLocaleString()}
          </div>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>RSVP Rate</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow
                key={event.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => dispatch(setCurrentEvent(event.id))}
              >
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{format(new Date(event.startDate), "MMM dd, yyyy")}</TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>{event.guests.length}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${event.rsvpRate}%` }} />
                    </div>
                    <span className="text-sm">{event.rsvpRate}%</span>
                  </div>
                </TableCell>
                <TableCell>${event.totalCost.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(event.procurementStatus)}>{event.procurementStatus}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle send reminder
                      }}
                    >
                      <CiMail size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
