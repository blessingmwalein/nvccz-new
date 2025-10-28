"use client"

import { useAppSelector } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CiTrendingUp, CiDollar, CiStar, CiUser } from "react-icons/ci"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function AnalyticsPage() {
  const { list } = useAppSelector((state) => state.events)

  // Calculate analytics
  const totalEvents = list.length
  const totalGuests = list.reduce((sum, e) => sum + e.guests.length, 0)
  const avgRSVPRate = list.reduce((sum, e) => sum + e.rsvpRate, 0) / list.length || 0
  const totalBudget = list.reduce((sum, e) => sum + e.totalCost, 0)
  const avgCostPerEvent = totalBudget / totalEvents || 0

  // RSVP trend data
  const rsvpTrendData = list.map((event) => ({
    name: event.title.substring(0, 15),
    rsvpRate: event.rsvpRate,
    guests: event.guests.length,
  }))

  // Budget by category
  const budgetByCategory = list.reduce(
    (acc, event) => {
      event.budgetLineItems.forEach((item) => {
        if (!acc[item.category]) {
          acc[item.category] = 0
        }
        acc[item.category] += item.total
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const budgetCategoryData = Object.entries(budgetByCategory).map(([name, value]) => ({
    name,
    value,
  }))

  // Status distribution
  const statusData = [
    { name: "Approved", value: list.filter((e) => e.procurementStatus === "APPROVED").length },
    { name: "Pending", value: list.filter((e) => e.procurementStatus === "PENDING").length },
    { name: "Draft", value: list.filter((e) => e.procurementStatus === "DRAFT").length },
  ]

  const COLORS = ["#10b981", "#f59e0b", "#6b7280"]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Event Analytics</h1>
        <p className="text-muted-foreground mt-1">Performance metrics and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CiTrendingUp size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg RSVP Rate</div>
                <div className="text-2xl font-semibold">{avgRSVPRate.toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CiUser size={24} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Guests</div>
                <div className="text-2xl font-semibold">{totalGuests}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <CiDollar size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
                <div className="text-2xl font-semibold">${totalBudget.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <CiStar size={24} className="text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg Cost/Event</div>
                <div className="text-2xl font-semibold">
                  ${avgCostPerEvent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSVP Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>RSVP Rate by Event</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rsvpTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rsvpRate" fill="hsl(var(--primary))" name="RSVP Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Budget by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {budgetCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Guest Count Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Count by Event</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rsvpTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="guests" stroke="hsl(var(--primary))" name="Guests" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Event Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
