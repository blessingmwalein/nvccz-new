"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CiUser } from "react-icons/ci"
import { formatDistanceToNow } from "date-fns"

interface ActivityCardProps {
  activity: any
}

const UserAvatar = ({ user }: { user: { firstName?: string; lastName?: string } | null }) => {
  if (!user || !user.firstName) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <CiUser className="w-5 h-5 text-gray-500" />
        </div>
        <span className="font-medium text-gray-700">Unknown User</span>
      </div>
    )
  }

  const initials = `${user.firstName[0] || ""}`.toUpperCase()
  const fullName = `${user.firstName}`

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
        {initials}
      </div>
      <span className="font-medium text-gray-800">{fullName}</span>
    </div>
  )
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <UserAvatar user={activity.user} />
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-semibold text-gray-800">{activity.user.firstName}</span>
              <span className="text-gray-600"> {activity.title.toLowerCase()}</span>
            </p>
            {activity.description && <p className="text-sm text-gray-500 mt-1">{activity.description}</p>}
            <p className="text-xs text-gray-400 mt-2">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
