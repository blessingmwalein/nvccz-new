"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield } from "lucide-react"
import type { BoardVotingMember } from "@/lib/api/admin-api"

interface UpdateVotingPowerDialogProps {
  isOpen: boolean
  onClose: () => void
  member: BoardVotingMember
  onSubmit: (userId: string, votingPower: number) => Promise<void>
}

export function UpdateVotingPowerDialog({
  isOpen,
  onClose,
  member,
  onSubmit
}: UpdateVotingPowerDialogProps) {
  const [votingPower, setVotingPower] = useState<number>(member.votingPower)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (votingPower < 0 || votingPower > 100) {
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(member.id, votingPower)
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Update Voting Power
          </DialogTitle>
          <DialogDescription>
            Adjust the voting power for this board member (0-100%)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                {getInitials(member.firstName, member.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {member.firstName} {member.lastName}
              </p>
              <p className="text-sm text-gray-600">{member.email}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {member.departmentRole}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {member.roleCode}
                </Badge>
              </div>
            </div>
          </div>

          {/* Voting Power Input */}
          <div className="space-y-2">
            <Label>Voting Power (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={votingPower}
              onChange={(e) => setVotingPower(Number(e.target.value))}
              className="rounded-full"
            />
            <p className="text-xs text-gray-500">
              Current: {member.votingPower}% → New: {votingPower}%
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || votingPower === member.votingPower}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Power'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
