"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Vote, AlertCircle, Loader2 } from "lucide-react"
import { useAppSelector } from "@/lib/store"

interface VotingMemberFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { votingPower: number }) => void
  userId: string
  userName: string
  loading?: boolean
}

export function VotingMemberForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  userId, 
  userName, 
  loading 
}: VotingMemberFormProps) {
  const { boardVotingMembers } = useAppSelector(state => state.admin)
  const [availablePower, setAvailablePower] = useState(100)
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      votingPower: 0
    }
  })

  const votingPower = watch('votingPower')

  useEffect(() => {
    // Calculate available voting power
    const totalAssigned = boardVotingMembers.reduce((sum, member) => sum + member.votingPower, 0)
    setAvailablePower(100 - totalAssigned)
  }, [boardVotingMembers])

  useEffect(() => {
    if (isOpen) {
      reset({ votingPower: 0 })
    }
  }, [isOpen, reset])

  const handleFormSubmit = (data: { votingPower: number }) => {
    onSubmit(data)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Assign Board Voting Member
          </DialogTitle>
          <DialogDescription>
            Assign voting power to {userName} for board reviews
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Available Power Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Available Voting Power:</strong> {availablePower}%
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Total voting power must equal 100%. Currently {100 - availablePower}% is assigned.
            </p>
          </div>

          {/* Voting Power Input */}
          <div className="space-y-2">
            <Label>Voting Power (%) *</Label>
            <Controller
              name="votingPower"
              control={control}
              rules={{ 
                required: 'Voting power is required',
                min: { value: 1, message: 'Voting power must be at least 1%' },
                max: { value: availablePower, message: `Cannot exceed available power of ${availablePower}%` }
              }}
              render={({ field }) => (
                <div className="relative">
                  <Input 
                    {...field} 
                    type="number"
                    min={1}
                    max={availablePower}
                    placeholder="e.g., 25"
                    className="rounded-full pr-12"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              )}
            />
            {errors.votingPower && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.votingPower.message}
              </p>
            )}
            {votingPower > 0 && (
              <p className="text-xs text-gray-500">
                Remaining power after assignment: {availablePower - (votingPower || 0)}%
              </p>
            )}
          </div>

          {/* Current Members Preview */}
          {boardVotingMembers.length > 0 && (
            <div className="space-y-2">
              <Label>Current Voting Members</Label>
              <div className="border rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
                {boardVotingMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{member.firstName} {member.lastName}</span>
                    <span className="font-medium text-blue-600">{member.votingPower}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-primary" 
              disabled={loading || availablePower === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Voting Power'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
