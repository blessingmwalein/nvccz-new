import { EventsLayout } from "@/components/layout/events-layout"
import { AttendeesPage } from "@/components/events/attendees-page"

export default function Attendees() {
  return (
    <EventsLayout>
      <AttendeesPage />
    </EventsLayout>
  )
}
