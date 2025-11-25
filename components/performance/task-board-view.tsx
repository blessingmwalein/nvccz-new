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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
      toast.success("Stage updated")
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
                onChange={(e) => setNewStage(e.target.value as any)}
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
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    taskId: string
    taskTitle: string
    fromStage: string
    toStage: string
  }>({
    open: false,
    taskId: "",
    taskTitle: "",
    fromStage: "",
    toStage: ""
  })

  const getStageTitle = (stageId: string) => {
    return stages.find(s => s.id === stageId)?.title || stageId
  }

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
      // Show confirmation dialog
      setConfirmDialog({
        open: true,
        taskId: task.id,
        taskTitle: task.title,
        fromStage: task.stage,
        toStage: targetStage
      })
    }
  }

  const handleConfirmStageChange = async () => {
    setIsUpdating(true)
    try {
      await onUpdateStage(
        confirmDialog.taskId,
        confirmDialog.toStage,
        `Moved from ${getStageTitle(confirmDialog.fromStage)} to ${getStageTitle(confirmDialog.toStage)}`
      )
      toast.success("Task moved successfully")
    } catch (error) {
      toast.error("Failed to move task")
    } finally {
      setIsUpdating(false)
      setConfirmDialog({ open: false, taskId: "", taskTitle: "", fromStage: "", toStage: "" })
    }
  }

  const getTasksByStage = (stageId: string) => {
    return tasks.filter(task => task.stage === stageId)
  }

  if (loading || isUpdating) {
    return <TaskManagementSkeleton />
  }

  return (
    <>
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
              className={`min-h-[400px] p-3 rounded-lg border-2 border-dashed transition-all duration-200 ${
                draggedOver === stage.id 
                  ? "border-blue-500 bg-blue-50 border-solid shadow-lg scale-[1.02]" 
                  : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
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
                    <p className="text-xs mt-1">Drag tasks here</p>
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

      {/* Drag & Drop Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, open: false })}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              Confirm Task Move
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-2">
              <p className="text-sm">Are you sure you want to move this task?</p>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl space-y-3 border border-gray-200">
                <p className="font-medium text-gray-900 text-sm leading-relaxed">{confirmDialog.taskTitle}</p>
                <div className="flex items-center gap-3 text-sm">
                  <Badge variant="outline" className="bg-white shadow-sm border-gray-300">
                    {getStageTitle(confirmDialog.fromStage)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <div className="h-px w-4 bg-gray-300"></div>
                    <span className="text-gray-400">→</span>
                    <div className="h-px w-4 bg-blue-300"></div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 shadow-sm">
                    {getStageTitle(confirmDialog.toStage)}
                  </Badge>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStageChange} className="bg-blue-600 hover:bg-blue-700 rounded-full">
              Confirm Move
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
})
