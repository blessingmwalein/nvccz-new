"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setCurrentEvent } from "@/lib/store/slices/eventsSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"

export function EventsCalendarView() {
  const dispatch = useAppDispatch()
  const { list } = useAppSelector((state) => state.events)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDay = (day: Date) => {
    return list.filter((event) => isSameDay(new Date(event.startDate), day))
  }

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  return (
    <Card className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <CiCircleChevLeft size={20} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <CiCircleChevRight size={20} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-sm text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {daysInMonth.map((day) => {
          const dayEvents = getEventsForDay(day)
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={day.toString()}
              className={`min-h-24 p-2 border rounded-lg ${
                isToday ? "bg-primary/5 border-primary" : "bg-background border-border"
              } ${!isSameMonth(day, currentMonth) ? "opacity-50" : ""}`}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 bg-primary/10 rounded cursor-pointer hover:bg-primary/20 transition-colors truncate"
                    onClick={() => dispatch(setCurrentEvent(event.id))}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
