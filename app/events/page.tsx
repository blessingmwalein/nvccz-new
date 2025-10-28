import { EventsLayout } from "@/components/layout/events-layout"
import { EventsDashboard } from "@/components/events/events-dashboard"

export default function EventsPage() {
  return (
    <EventsLayout>
      <div className="p-6">
        <EventsDashboard />
      </div>
    </EventsLayout>
  )
}
