"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, Shield } from "lucide-react"
import { useAppDispatch } from "@/lib/store"
import { assignVotingMember } from "@/lib/store/slices/adminSlice"
import { toast } from "sonner"
import type { User } from "@/lib/api/admin-api"

interface AssignVotingMemberDialogProps {
  isOpen: boolean
  onClose: () => void
  availableUsers: User[]
  loading?: boolean
}

export function AssignVotingMemberDialog({
  isOpen,
  onClose,
  availableUsers,
  loading
}: AssignVotingMemberDialogProps) {
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [votingPower, setVotingPower] = useState<number>(1)
  const [submitting, setSubmitting] = useState(false)

  const filteredUsers = availableUsers.filter(user =>
    `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async () => {
    if (!selectedUser || votingPower < 1 || votingPower > 5) {
      toast.error('Please select a user and enter a valid voting power (1-5)')
      return
    }

    setSubmitting(true)
    try {
      await dispatch(assignVotingMember({
        userId: selectedUser.id,
        votingPower
      })).unwrap()
      
      toast.success('Voting member assigned successfully')
      setSelectedUser(null)
      setVotingPower(1)
      setSearchTerm('')
      onClose()
    } catch (error: any) {
      toast.error('Failed to assign voting member', {
        description: error || 'Please try again.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Assign Voting Member
          </DialogTitle>
          <DialogDescription>
            Select a user and assign their voting power (1-5)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Users */}
          <div className="space-y-2">
            <Label>Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-10 rounded-full"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-2">
            <Label>Available Users</Label>
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No users found matching your search' : 'No eligible users available'}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex gap-2 mt-1">
                        {user.userDepartment && (
                          <Badge variant="outline" className="text-xs">
                            {user.userDepartment}
                          </Badge>
                        )}
                        {user.roleCode && (
                          <Badge variant="outline" className="text-xs">
                            {user.roleCode}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Voting Power */}
          {selectedUser && (
            <div className="space-y-2">
              <Label>Voting Power (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={votingPower}
                onChange={(e) => setVotingPower(Number(e.target.value))}
                className="rounded-full"
              />
              <p className="text-xs text-gray-500">
                Higher voting power gives more weight to board decisions
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedUser || submitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Member'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
