"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, AlertCircle, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { applicationsApi, InvestmentUser, TaskAssignmentRequest } from "@/lib/api/applications-api"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DueDiligenceTaskModalProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  onSuccess?: () => void
}

export function DueDiligenceTaskModal({ isOpen, onClose, applicationId, onSuccess }: DueDiligenceTaskModalProps) {
  const [loading, setLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)
  const [users, setUsers] = useState<InvestmentUser[]>([])

  const categories = [
    { key: 'market', label: 'Market Research', category: 'Market Research' },
    { key: 'financial', label: 'Financial Assessment', category: 'Financial Assessment' },
    { key: 'competitive', label: 'Competitive Analysis', category: 'Competitive Analysis' },
    { key: 'management', label: 'Management Team Evaluation', category: 'Management Team Evaluation' },
    { key: 'legal', label: 'Legal Compliance', category: 'Legal Compliance' },
    { key: 'risk', label: 'Risk Assessment', category: 'Risk Assessment' }
  ]
  const [formData, setFormData] = useState<TaskAssignmentRequest>({
    assigneeId: '',
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default 7 days from now
    category: ''
  })
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

  useEffect(() => {
    if (isOpen) {
      loadUsers()
    }
  }, [isOpen])

  const loadUsers = async () => {
    setUsersLoading(true)
    try {
      const response = await applicationsApi.getInvestmentUsers()
      setUsers(response.data)
    } catch (error: any) {
      toast.error('Failed to load users', { description: error.message })
    } finally {
      setUsersLoading(false)
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.assigneeId) {
      toast.error('Please select an assignee')
      return
    }
    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a task description')
      return
    }
    if (!formData.category) {
      toast.error('Please select a category')
      return
    }

    try {
      setLoading(true)
      await applicationsApi.assignDueDiligenceTask(applicationId, formData)
      toast.success('Task assigned successfully', {
        description: 'The due diligence task has been assigned to the selected user.'
      })
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error('Failed to assign task', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDueDate(date)
      setFormData(prev => ({ ...prev, dueDate: date.toISOString() }))
    }
  }

  const selectedUser = users.find(u => u.id === formData.assigneeId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-normal">
            <UserPlus className="w-5 h-5 text-blue-500" />
            Assign Due Diligence Task
          </DialogTitle>
          <p className="text-gray-600">
            Create and assign a task to an investment team member
          </p>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {/* Assignee Selection */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-normal flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-500" />
                Select Assignee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assigneeId" className="text-sm font-normal">Assignee *</Label>
                <Select
                  value={formData.assigneeId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assigneeId: value }))}
                  disabled={usersLoading}
                >
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder={usersLoading ? "Loading users..." : "Select a user"} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <span>{user.firstName} {user.lastName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {user.roleCode}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedUser && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</span>
                    </p>
                    <p className="text-xs text-gray-600">{selectedUser.email}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedUser.role.name} • {selectedUser.departmentRole}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Task Details */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-normal flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-500" />
                Task Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-normal">Task Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Review financial statements"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-normal">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter detailed task description..."
                  rows={4}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-normal">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.key} value={cat.category}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-normal">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setFormData(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger className="rounded-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          High
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-normal">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-full",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-full">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || usersLoading} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full">
            {loading ? 'Assigning...' : 'Assign Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
