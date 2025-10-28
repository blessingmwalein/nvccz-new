"use client"

import { useAppSelector, useAppDispatch } from "@/lib/store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CiLocationOn, CiCalendar, CiDollar, CiUser, CiMail, CiPhone } from "react-icons/ci"
import { format } from "date-fns"

interface EventDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function EventDetailsDrawer({ isOpen, onClose }: EventDetailsDrawerProps) {
  const dispatch = useAppDispatch()
  const { list, currentEventId } = useAppSelector((state) => state.events)
  const event = list.find((e) => e.id === currentEventId)

  if (!event) return null

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

  const getGuestStatusColor = (status: string) => {
    switch (status) {
      case "RSVP_YES":
        return "bg-green-100 text-green-700 border-green-200"
      case "RSVP_NO":
        return "bg-red-100 text-red-700 border-red-200"
      case "CHECKED_IN":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[600px] sm:max-w-[50vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{event.title}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(event.procurementStatus)}>{event.procurementStatus}</Badge>
                  {event.private && <Badge variant="outline">Private</Badge>}
                </div>

                {event.description && <p className="text-muted-foreground">{event.description}</p>}

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CiCalendar size={20} className="text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Date & Time</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(event.startDate), "PPP p")}
                        {event.endDate && ` - ${format(new Date(event.endDate), "p")}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CiLocationOn size={20} className="text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Venue</div>
                      <div className="text-sm text-muted-foreground">{event.venue}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CiUser size={20} className="text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Organizer</div>
                      <div className="text-sm text-muted-foreground">{event.creatorName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CiDollar size={20} className="text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Total Cost</div>
                      <div className="text-sm text-muted-foreground">${event.totalCost.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Event Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-semibold">{event.rsvpRate}%</div>
                  <div className="text-sm text-muted-foreground">RSVP Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">{event.guests.length}</div>
                  <div className="text-sm text-muted-foreground">Total Guests</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {event.guests.filter((g) => g.status === "RSVP_YES").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Confirmed</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">{event.guests.filter((g) => g.checkedIn).length}</div>
                  <div className="text-sm text-muted-foreground">Checked In</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Guests Tab */}
          <TabsContent value="guests" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Guest List ({event.guests.length})</h3>
              <Button size="sm">Add Guest</Button>
            </div>

            <div className="space-y-2">
              {event.guests.map((guest) => (
                <Card key={guest.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{guest.name}</h4>
                        <Badge className={getGuestStatusColor(guest.status)}>{guest.status.replace("_", " ")}</Badge>
                        {guest.internalAttendee && <Badge variant="outline">Internal</Badge>}
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CiMail size={16} />
                          {guest.email}
                        </div>
                        {guest.phone && (
                          <div className="flex items-center gap-2">
                            <CiPhone size={16} />
                            {guest.phone}
                          </div>
                        )}
                      </div>

                      {guest.feedbackRating && (
                        <div className="mt-2 text-sm">Rating: {"⭐".repeat(guest.feedbackRating)}</div>
                      )}
                    </div>

                    {guest.status === "INVITED" && (
                      <Button size="sm" variant="outline">
                        Resend Invite
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Budget Breakdown</h3>
              <Button size="sm">Add Line Item</Button>
            </div>

            <Card className="p-4">
              <div className="space-y-3">
                {event.budgetLineItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.category} • Qty: {item.qty} × ${item.unitCost.toLocaleString()}
                      </div>
                    </div>
                    <div className="font-semibold">${item.total.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div className="font-semibold text-lg">Total</div>
                <div className="font-semibold text-lg">${event.totalCost.toLocaleString()}</div>
              </div>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <h3 className="font-semibold">Activity Log</h3>

            <div className="space-y-3">
              {event.activity.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm text-muted-foreground">
                        {log.actor} • {format(new Date(log.timestamp), "PPp")}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
