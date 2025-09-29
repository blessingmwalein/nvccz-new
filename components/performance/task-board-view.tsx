"use client"

import { useState, memo } from "react"
// Removed Card usage per new design
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  User,
  Target,
  Flag,
  Clock,
  CheckCircle2,
  AlertCircle,
  List,
  Edit,
  Trash,
  Activity
} from "lucide-react"
import { Task } from "@/lib/store/slices/taskSlice"
import { format } from "date-fns"
import { TaskManagementSkeleton } from "@/components/ui/skeleton-loaders"
import { TaskActivityDialog } from "@/components/performance/task-activity-dialog"
import { useTaskStore } from "@/lib/store/slices/useTaskStore"
import { toast } from "sonner"

interface TaskBoardViewProps {
  tasks: Task[]
  loading: boolean
  onUpdateStage: (taskId: string, stage: string, notes?: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
}

interface TaskCardProps {
  task: Task
  onUpdateStage: (taskId: string, stage: string, notes?: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
}

const stages = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-100" },
  { id: "completed", title: "Completed", color: "bg-green-100" },
  { id: "overdue", title: "Overdue", color: "bg-red-100" }
]

const TaskCard = memo(function TaskCard({ task, onUpdateStage, onEditTask, onDeleteTask }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showStageDialog, setShowStageDialog] = useState(false)
  const [newStage, setNewStage] = useState(task.stage)
  const [stageNotes, setStageNotes] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showActivityDialog, setShowActivityDialog] = useState(false)
  const { addTaskActivity } = useTaskStore()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return <AlertCircle className="h-4 w-4" />
      case "todo":
        return <Target className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd")
    } catch {
      return "Invalid date"
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.setData("text/plain", task.id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleStageUpdate = async () => {
    try {
      await onUpdateStage(task.id, newStage, stageNotes)
      toast({
        title: "Stage updated",
        description: `Task moved to ${newStage.replace("_", " ")}.`,
      })
    } finally {
      setShowStageDialog(false)
      setStageNotes("")
    }
  }

  return (
    <>
      <div 
        className={`cursor-move transition-all ${
          isDragging ? "opacity-50 scale-95" : ""
        }`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <div className="space-y-3">
            {/* Task Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                    <Flag className="h-3 w-3 mr-1" />
                    {task.priority}
                  </Badge>
                  {task.isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                    <List className="h-3 w-3 mr-2" />
                    View Details
                  </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowActivityDialog(true)}>
                  <Activity className="h-3 w-3 mr-2" />
                  Add Activity
                </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditTask(task)}>
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowStageDialog(true)}>
                    <Target className="h-3 w-3 mr-2" />
                    Change Stage
                  </DropdownMenuItem>
                  {onDeleteTask && (
                    <DropdownMenuItem 
                      onClick={() => onDeleteTask(task.id)}
                      className="text-red-600"
                    >
                      <Trash className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Task Description */}
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Task Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.date)}</span>
              </div>
              
              {task.goal && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span className="truncate">{task.goal.title}</span>
                </div>
              )}

              {task.department && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{task.department}</span>
                </div>
              )}
            </div>

            {/* Team Members */}
            {task.team && task.team.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  {task.team.slice(0, 3).map((memberId, index) => {
                    // Different background colors for each team member - darker for better contrast
                    const backgroundColors = [
                      "bg-blue-600",
                      "bg-green-600", 
                      "bg-purple-600",
                      "bg-orange-600",
                      "bg-pink-600",
                      "bg-indigo-600",
                      "bg-teal-600",
                      "bg-red-600"
                    ]
                    const bgColor = backgroundColors[index % backgroundColors.length]
                    
                    return (
                      <Avatar key={index} className="h-6 w-6 border-2 border-white">
                        <AvatarImage src="" />
                        <AvatarFallback className={`text-xs text-white font-medium ${bgColor}`}>
                          {memberId.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )
                  })}
                  {task.team.length > 3 && (
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="text-xs text-white font-medium bg-gray-600">
                        +{task.team.length - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            {task.isPerformanceTask && (
              <div className="flex gap-2 text-xs">
                {task.monetaryValue && (
                    <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    ${parseInt(task.monetaryValue).toLocaleString()}
                  </div>
                )}
                {task.percentValue && (
                  <div className="bg-green-50 text-green-700 px-2 py-1 rounded">
                    {task.percentValue}%
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stage Update Dialog */}
      <Dialog open={showStageDialog} onOpenChange={setShowStageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task Stage</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Stage</label>
              <select 
                value={newStage} 
                onChange={(e) => setNewStage(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes (Optional)</label>
              <textarea
                placeholder="Add notes about the stage change..."
                value={stageNotes}
                onChange={(e) => setStageNotes(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowStageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleStageUpdate}>
                Update Stage
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <TaskActivityDialog
        isOpen={showActivityDialog}
        onClose={() => setShowActivityDialog(false)}
        onSubmit={async (payload) => {
          await addTaskActivity(task.id, payload)
        }}
      />

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedTask.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedTask.description && (
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-muted-foreground">{selectedTask.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium">Priority</h4>
                  <Badge className={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">Stage</h4>
                  <Badge>
                    {selectedTask.stage}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">Due Date</h4>
                  <p className="text-muted-foreground">{formatDate(selectedTask.date)}</p>
                </div>
                {selectedTask.department && (
                  <div>
                    <h4 className="font-medium">Department</h4>
                    <p className="text-muted-foreground">{selectedTask.department}</p>
                  </div>
                )}
                {selectedTask.goal && (
                  <div>
                    <h4 className="font-medium">Goal</h4>
                    <p className="text-muted-foreground">{selectedTask.goal.title}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium">Created By</h4>
                  <p className="text-muted-foreground">
                    {selectedTask.creator.firstName} {selectedTask.creator.lastName}
                  </p>
                </div>
              </div>

              {(selectedTask.monetaryValue || selectedTask.percentValue) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedTask.monetaryValue && (
                    <div>
                      <h4 className="font-medium">Value</h4>
                      <p className="text-muted-foreground">${parseInt(selectedTask.monetaryValue).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedTask.percentValue && (
                    <div>
                      <h4 className="font-medium">Progress</h4>
                      <p className="text-muted-foreground">{selectedTask.percentValue}%</p>
                    </div>
                  )}
                </div>
              )}

              {selectedTask.team && selectedTask.team.length > 0 && (
                <div>
                  <h4 className="font-medium">Team</h4>
                  <div className="flex -space-x-2 mt-2">
                    {selectedTask.team.slice(0, 6).map((memberId, index) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-white">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs bg-gray-600 text-white">
                          {memberId.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {selectedTask.team.length > 6 && (
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="text-xs text-white font-medium bg-gray-600">
                          +{selectedTask.team.length - 6}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              )}

              {selectedTask.activities && selectedTask.activities.length > 0 && (
                <div>
                  <h4 className="font-medium">Recent Activities</h4>
                  <div className="space-y-2 mt-2">
                    {selectedTask.activities.slice(0, 5).map((activity, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        <p>{activity.activity}</p>
                        <p className="text-xs">{formatDate(activity.date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
})

export const TaskBoardView = memo(function TaskBoardView({ tasks, loading, onUpdateStage, onEditTask, onDeleteTask }: TaskBoardViewProps) {
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    setDraggedOver(stageId)
  }

  const handleDragLeave = () => {
    setDraggedOver(null)
  }

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault()
    setDraggedOver(null)
    
    const taskId = e.dataTransfer.getData("text/plain")
    const task = tasks.find(t => t.id === taskId)
    
    if (task && task.stage !== targetStage) {
      setIsUpdating(true)
      try {
        await onUpdateStage(taskId, targetStage, `Moved from ${task.stage} to ${targetStage}`)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const getTasksByStage = (stageId: string) => {
    return tasks.filter(task => task.stage === stageId)
  }

  if (loading || isUpdating) {
    return <TaskManagementSkeleton />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stages.map((stage) => {
        const stageTasks = getTasksByStage(stage.id)
        
        return (
          <div key={stage.id} className="space-y-4">
            {/* Stage Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="font-semibold">{stage.title}</h3>
                <Badge variant="secondary" className="ml-2">
                  {stageTasks.length}
                </Badge>
              </div>
            </div>

            {/* Stage Column */}
            <div
              className={`min-h-[400px] p-3 rounded-lg border-2 border-dashed transition-colors ${
                draggedOver === stage.id 
                  ? "border-primary bg-primary/5" 
                  : "border-muted-foreground/20"
              }`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="space-y-3">
                {stageTasks.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks</p>
                  </div>
                  </div>
                ) : (
                  stageTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStage={onUpdateStage}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
                  ))
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})
