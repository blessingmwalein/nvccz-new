"use client"

import { useAppSelector } from "@/lib/store"
import { CiCalendar, CiDollar, CiUser, CiTrophy } from "react-icons/ci"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function EventsDashboard() {
  const events = useAppSelector((state) => state.events.list)
  const analytics = useAppSelector((state) => state.analytics)

  // Calculate summary metrics
  const today = new Date()
  const upcomingEvents = events.filter((e) => new Date(e.startDate) > today)

  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const thisMonthBudget = events
    .filter((e) => {
      const eventDate = new Date(e.startDate)
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
    })
    .reduce((sum, e) => sum + e.totalCost, 0)

  const avgRsvpRate = events.length > 0 ? events.reduce((sum, e) => sum + e.rsvpRate, 0) / events.length : 0

  const totalCost = events.reduce((sum, e) => sum + e.totalCost, 0)
  const totalCheckedIn = events.reduce((sum, e) => sum + e.guests.filter((g) => g.checkedIn).length, 0)
  const costPerAttendee = totalCheckedIn > 0 ? totalCost / totalCheckedIn : 0

  // Get next 10 upcoming events sorted by date
  const upcomingTimeline = [...upcomingEvents]
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 10)

  // Add trend and amount for stat cards for parity with accounting dashboard
  const statCards = [
    {
      title: "Total Upcoming Events",
      value: upcomingEvents.length,
      amount: `${upcomingEvents.length} scheduled`,
      change: "5% from last month",
      trend: "up",
      icon: CiCalendar,
      color: "gradient-primary",
    },
    {
      title: "This Month's Budget",
      value: `$${thisMonthBudget.toLocaleString()}`,
      amount: "Budgeted",
      change: "2% from last month",
      trend: "up",
      icon: CiDollar,
      color: "bg-white",
    },
    {
      title: "RSVP Rate",
      value: `${avgRsvpRate.toFixed(1)}%`,
      amount: "Avg RSVP",
      change: "1% from last month",
      trend: "down",
      icon: CiUser,
      color: "gradient-primary",
    },
    {
      title: "Cost per Attendee",
      value: `$${costPerAttendee.toFixed(0)}`,
      amount: "Avg cost",
      change: "0% from last month",
      trend: "up",
      icon: CiTrophy,
      color: "bg-white",
    },
  ]

  // Chart data for events (dummy, replace with real analytics if needed)
  const eventsChartData = [
    { month: "Jan", events: 8, rsvp: 70 },
    { month: "Feb", events: 10, rsvp: 75 },
    { month: "Mar", events: 12, rsvp: 80 },
    { month: "Apr", events: 9, rsvp: 78 },
    { month: "May", events: 11, rsvp: 82 },
    { month: "Jun", events: 13, rsvp: 85 },
  ]

  function EventsChart({ data }: { data: any[] }) {
    const config = {
      events: { label: "Events", color: "#a78bfa" },
      rsvp: { label: "RSVP Rate", color: "#60a5fa" },
    }
    return (
      <Card className="rounded-2xl border border-gray-200 py-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base font-normal mb-3">
            <div className="flex items-center gap-2">
              <CiCalendar className="w-5 h-5" /> Events Overview
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#111827' }} />
              <YAxis tick={{ fontSize: 14, fill: '#111827' }} />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="#a78bfa" strokeWidth={5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rsvp" stroke="#60a5fa" strokeWidth={5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700"
      case "DRAFT":
        return "bg-gray-100 text-gray-700"
      case "REJECTED":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">Events Dashboard</h1>
          <p className="text-gray-600 font-normal">Overview of your events performance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((metric, index) => {
          const Icon = metric.icon
          const isPositive = metric.trend === "up"
          return (
            <Card key={metric.title} className={`border border-gray-200 hover:border-gray-300 transition-all duration-300 ${index % 2 === 0 ? 'gradient-primary' : 'bg-white'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${index % 2 === 0 ? 'text-white' : ''}`}>{metric.title}</CardTitle>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index % 2 === 0 ? 'bg-white/20' : 'gradient-primary'}`}>
                  <Icon className={`h-4 w-4 ${index % 2 === 0 ? 'text-white' : 'text-white'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-5xl ${index % 2 === 0 ? 'text-white' : 'text-gray-900'}`}>{metric.value}</div>
                <div className={`text-lg font-semibold ${index % 2 === 0 ? 'text-white/90' : 'text-gray-700'} mb-2`}>{metric.amount}</div>
                <div className={`flex items-center gap-1 ${index % 2 === 0 ? 'text-white/80' : 'text-gray-600'}`}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span className="text-xs">{metric.change}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart Section */}
      <EventsChart data={eventsChartData} />

      {/* Upcoming Events Timeline */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Upcoming Events Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingTimeline.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming events</p>
            ) : (
              upcomingTimeline.map((event) => {
                const startDate = new Date(event.startDate)
                const rsvpCount = event.guests.filter((g) => g.status === "RSVP_YES").length
                const totalGuests = event.guests.length
                const rsvpPercentage = totalGuests > 0 ? (rsvpCount / totalGuests) * 100 : 0

                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium truncate">{event.title}</h4>
                        <Badge className={getStatusColor(event.procurementStatus)}>{event.procurementStatus}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CiCalendar className="w-4 h-4" />
                          {startDate.toLocaleDateString()} at{" "}
                          {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span>Budget: ${event.totalCost.toLocaleString()}</span>
                        <span>
                          RSVP: {rsvpPercentage.toFixed(0)}% ({rsvpCount}/{totalGuests})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-md hover:from-purple-600 hover:to-purple-700"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-md hover:from-purple-600 hover:to-purple-700"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-md hover:from-purple-600 hover:to-purple-700"
                      >
                        Guests
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
