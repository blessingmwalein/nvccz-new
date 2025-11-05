"use client"

import { useState, useEffect } from "react"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CiViewList as List, CiCircleCheck as Activity } from "react-icons/ci"
import { X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { fetchTaskActivities } from "@/lib/store/slices/taskSlice"
import { TaskCard } from "./task-card"
import { ActivityCard } from "./activity-card"
import { CreateActivityModal } from "./create-activity-modal"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface TaskDrawerViewProps {
  task: any
  onClose: () => void
}

type DrawerTab = "details" | "activity"

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in_progress":
      return "bg-blue-100 text-blue-800"
    case "todo":
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "blocked":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800"
    case "high":
      return "bg-orange-100 text-orange-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const ActivityListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 border rounded-lg animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

export function TaskDrawerView({ task, onClose }: TaskDrawerViewProps) {
  const dispatch = useAppDispatch()
  const { activities, activitiesLoading, activitiesError } = useAppSelector((state) => state.tasks)
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTab>("details")
  const [isCreateActivityModalOpen, setCreateActivityModalOpen] = useState(false)

  useEffect(() => {
    if (activeDrawerTab === "activity" && task?.id) {
      dispatch(fetchTaskActivities(task.id))
    }
  }, [activeDrawerTab, task?.id, dispatch])

  useEffect(() => {
    if (activitiesError) {
      toast.error("Failed to load task activities.", {
        description: activitiesError,
      })
    }
  }, [activitiesError])

  if (!task) return null

  const drawerTabs = [
    { id: "details", label: "Task Details", icon: List },
    { id: "activity", label: "Activity Log", icon: Activity },
  ]

  return (
    <>
      <SheetHeader>
        <div className="flex items-center justify-between">
          <SheetTitle className="flex items-center gap-3 truncate">
            <span className="truncate">Task View</span>
          </SheetTitle>
          <div className="flex items-center gap-2 mr-8">
            <Button 
              onClick={() => setCreateActivityModalOpen(true)}
              className="rounded-full h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <Activity className="w-4 h-4 mr-2" />
              Log Activity
            </Button>
            
            {/* Custom Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-10 w-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      
      </SheetHeader>

      {/* Tab Navigation */}
      <div className="mt-4 border-b">
        <nav className="flex -mb-px space-x-6">
          {drawerTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDrawerTab(tab.id as DrawerTab)}
              className={cn(
                "flex items-center gap-2 py-3 px-1 text-sm font-medium transition-colors",
                activeDrawerTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "border-b-2 border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6 space-y-6">
        {activeDrawerTab === "details" && <TaskCard task={task} isDrawerVersion />}
        {activeDrawerTab === "activity" && (
          <div>
            {activitiesLoading ? (
              <ActivityListSkeleton />
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Activity Found</h3>
                <p className="text-gray-600">There are no activity logs for this task yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateActivityModal
        isOpen={isCreateActivityModalOpen}
        onClose={() => setCreateActivityModalOpen(false)}
        task={task}
        onSuccess={() => {
          setCreateActivityModalOpen(false)
          if (task?.id) {
            dispatch(fetchTaskActivities(task.id))
          }
        }}
      />
    </>
  )
}
