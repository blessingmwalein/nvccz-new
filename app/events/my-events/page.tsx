import { EventsLayout } from "@/components/layout/events-layout"
import { MyEventsPage } from "@/components/events/my-events-page"
import { EventsMainPage } from "@/components/events/events-main-page"

export default function MyEvents() {
  return (
    <EventsLayout>
      <EventsMainPage />
    </EventsLayout>
  )
}
