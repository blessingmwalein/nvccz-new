"use client"

import { useState } from "react"
import { useAppDispatch } from "@/lib/store"
import { createActivity, fetchTaskActivities } from "@/lib/store/slices/taskSlice"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface CreateActivityModalProps {
  isOpen: boolean
  onClose: () => void
  task: any
  onSuccess: () => void
}

export function CreateActivityModal({ isOpen, onClose, task, onSuccess }: CreateActivityModalProps) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [valueCollected, setValueCollected] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task || !title) {
      toast.error("Title is required.")
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(
        createActivity({
          taskId: task.id,
          goalId: task.goalId,
          activityType: "task",
          title,
          description,
          valueCollected: valueCollected ? Number(valueCollected) : undefined,
        }),
      ).unwrap()

      toast.success("Activity logged successfully.")
      onSuccess()
      // Reset form
      setTitle("")
      setDescription("")
      setValueCollected("")
    } catch (error: any) {
      toast.error("Failed to log activity.", {
        description: error.message || "An unexpected error occurred.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log New Activity for: {task?.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="activity-title">Activity Title</Label>
            <Input
              id="activity-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Completed client meeting"
              required
            />
          </div>
          <div>
            <Label htmlFor="activity-description">Description (Optional)</Label>
            <Textarea
              id="activity-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about the activity..."
            />
          </div>
          <div>
            <Label htmlFor="value-collected">Value Collected (Optional)</Label>
            <Input
              id="value-collected"
              type="number"
              value={valueCollected}
              onChange={(e) => setValueCollected(e.target.value)}
              placeholder="e.g., 50000"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging..." : "Log Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
