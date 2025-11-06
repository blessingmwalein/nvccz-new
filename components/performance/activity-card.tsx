"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, User, DollarSign, FileText, Download, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"

interface ActivityCardProps {
  activity: any
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [expandedDocuments, setExpandedDocuments] = useState(false)

  // Parse documents from description if they exist
  const parseDocuments = (description: string) => {
    try {
      const match = description.match(/\[DOCUMENTS:(.*?)\]/s)
      if (match && match[1]) {
        return JSON.parse(match[1])
      }
    } catch (error) {
      console.error('Error parsing documents:', error)
    }
    return []
  }

  const cleanDescription = (description: string) => {
    // Remove the DOCUMENTS section from description
    return description.replace(/\[DOCUMENTS:.*?\]/s, '').trim()
  }

  const documents = parseDocuments(activity.description || '')
  const displayDescription = cleanDescription(activity.description || '')
  const hasMonetaryValue = activity.monetaryValueAchieved && parseFloat(activity.monetaryValueAchieved) > 0
  const hasPercentValue = activity.percentValueAchieved && parseFloat(activity.percentValueAchieved) > 0

  const getUserInitials = (user: any) => {
    if (!user) return "U"
    const first = user.firstName?.[0] || ""
    const last = user.lastName?.[0] || ""
    return `${first}${last}`.toUpperCase()
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "task_completion":
        return "bg-green-100 text-green-800"
      case "task_update":
        return "bg-blue-100 text-blue-800"
      case "task_creation":
        return "bg-purple-100 text-purple-800"
      case "comment":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatActivityType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                {getUserInitials(activity.user)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                <Badge className={getActivityTypeColor(activity.activityType)} variant="secondary">
                  {formatActivityType(activity.activityType)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>
                    {activity.user?.firstName} {activity.user?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(activity.createdAt), "MMM dd, yyyy 'at' hh:mm a")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {displayDescription && (
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <p className="whitespace-pre-wrap">{displayDescription}</p>
          </div>
        )}

        {/* Value Metrics */}
        {(hasMonetaryValue || hasPercentValue) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasMonetaryValue && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Monetary Value Achieved</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${parseFloat(activity.monetaryValueAchieved).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {hasPercentValue && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">%</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Percentage Achieved</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {parseFloat(activity.percentValueAchieved).toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Documents */}
        {documents.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Attached Documents ({documents.length})
                  </span>
                </div>
                {documents.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedDocuments(!expandedDocuments)}
                    className="text-xs h-7"
                  >
                    {expandedDocuments ? "Show Less" : "Show All"}
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {(expandedDocuments ? documents : documents.slice(0, 2)).map((doc: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                        <p className="text-xs text-gray-600">{formatFileSize(doc.fileSize)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => window.open(doc.fileUrl, "_blank")}
                        title="View document"
                      >
                        <ExternalLink className="w-4 h-4 text-purple-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = doc.fileUrl
                          link.download = doc.fileName
                          link.click()
                        }}
                        title="Download document"
                      >
                        <Download className="w-4 h-4 text-purple-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {!expandedDocuments && documents.length > 2 && (
                <p className="text-xs text-gray-500 text-center">
                  +{documents.length - 2} more document{documents.length - 2 > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </>
        )}

        {/* Goal/Task Reference */}
        {(activity.goalId || activity.taskId) && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">Reference:</span>
              {activity.goalId && <Badge variant="outline">Goal: {activity.goalId.slice(0, 8)}</Badge>}
              {activity.taskId && <Badge variant="outline">Task: {activity.taskId.slice(0, 8)}</Badge>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
