import { ApplicationPortalLayout } from "@/components/layout/application-portal-layout"
import { ApplicationPortalDashboard } from "@/components/user-application-portal/portal-dashboard"

export default function ApplicationPortalPage() {
  return (
    <ApplicationPortalLayout>
      <div className="p-6">
        <ApplicationPortalDashboard  />
      </div>
    </ApplicationPortalLayout>
  )
}
