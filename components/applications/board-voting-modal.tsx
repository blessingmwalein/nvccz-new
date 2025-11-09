"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { castVote } from "@/lib/store/slices/applicationSlice"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store"

interface BoardVoteModalProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  onSuccess: () => void
}

export function BoardVoteModal({ isOpen, onClose, applicationId, onSuccess }: BoardVoteModalProps) {
  const dispatch = useAppDispatch()
  const { isSubmitting, submitError } = useAppSelector((state) => state.application)
  const [vote, setVote] = useState<'APPROVE' | 'REJECT' | null>(null)
  const [comment, setComment] = useState("")
  const [errors, setErrors] = useState<{ vote?: string; comment?: string }>({})

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setVote(null)
      setComment("")
      setErrors({})
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors: { vote?: string; comment?: string } = {}
    if (!vote) {
      newErrors.vote = "Please select a vote."
    }
    if (!comment.trim()) {
      newErrors.comment = "Please provide a comment for your vote."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm() || !vote) return

    const voteData = { vote, comment }

    const result = await dispatch(castVote({ applicationId, voteData }))

    if (castVote.fulfilled.match(result)) {
      toast.success("Vote cast successfully!")
      onSuccess()
    } else {
      toast.error("Failed to cast vote", {
        description: (result.payload as string) || "An unknown error occurred.",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cast Your Vote</DialogTitle>
          <DialogDescription>
            Review the application and cast your vote. Your decision will be recorded.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Your Vote</Label>
            <RadioGroup onValueChange={(value: 'APPROVE' | 'REJECT') => setVote(value)} value={vote || undefined}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="APPROVE" id="r1" />
                <Label htmlFor="r1">Approve</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="REJECT" id="r2" />
                <Label htmlFor="r2">Reject</Label>
              </div>
            </RadioGroup>
            {errors.vote && <p className="text-sm text-red-500">{errors.vote}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Provide a reason for your vote..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={errors.comment ? "border-red-500" : ""}
            />
            {errors.comment && <p className="text-sm text-red-500">{errors.comment}</p>}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Vote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
