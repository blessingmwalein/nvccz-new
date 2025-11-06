"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Upload, X, FileText } from "lucide-react"
import { toast } from "sonner"
import { applicationsApi } from "@/lib/api/applications-api"

const activitySchema = yup.object({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  valueCollected: yup.number().typeError("Value must be a number").min(0, "Value cannot be negative"),
})

interface TaskActivityModalProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
  taskTitle?: string
  onSuccess?: () => void
}

interface ActivityFormData {
  title: string
  description: string
  valueCollected?: number
}

export function TaskActivityModal({ isOpen, onClose, taskId, taskTitle, onSuccess }: TaskActivityModalProps) {
  const [documents, setDocuments] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ActivityFormData>({
    resolver: yupResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      valueCollected: 0,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setDocuments((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ActivityFormData) => {
    try {
      setUploading(true)
      await applicationsApi.createTaskActivity(taskId, {
        title: data.title,
        description: data.description,
        valueCollected: data.valueCollected,
        documents: documents.length > 0 ? documents : undefined,
      })
      
      toast.success('Activity created successfully', {
        description: 'The activity has been logged for this task.'
      })
      
      reset()
      setDocuments([])
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error('Failed to create activity', {
        description: error.message || 'Please try again.'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    reset()
    setDocuments([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-normal">
            <Activity className="w-5 h-5 text-blue-500" />
            Log Activity for Task
          </DialogTitle>
          {taskTitle && (
            <p className="text-sm text-gray-600 mt-2">
              Task: <span className="font-medium">{taskTitle}</span>
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Activity Title */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6 space-y-4">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-normal">
                      Activity Title *
                    </Label>
                    <Input
                      id="title"
                      {...field}
                      placeholder="e.g., Completed financial review"
                      className={`rounded-full ${errors.title ? "border-red-500" : ""}`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-normal">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      {...field}
                      placeholder="Describe what was accomplished, findings, or progress made..."
                      className={`rounded-lg ${errors.description ? "border-red-500" : ""}`}
                      rows={4}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="valueCollected"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="valueCollected" className="text-sm font-normal">
                      Value Collected (Optional)
                    </Label>
                    <Input
                      id="valueCollected"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="e.g., 100"
                      className={`rounded-full ${errors.valueCollected ? "border-red-500" : ""}`}
                    />
                    {errors.valueCollected && (
                      <p className="text-sm text-red-600">{errors.valueCollected.message}</p>
                    )}
                  </div>
                )}
              />
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-normal flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Supporting Documents (Optional)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="rounded-full"
                    id="document-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('document-upload')?.click()}
                    className="rounded-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                </p>
              </div>

              {/* Uploaded Files List */}
              {documents.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-normal">Uploaded Files ({documents.length})</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {documents.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(2)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="rounded-full h-8 w-8 flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || uploading}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || uploading}
            className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            {isSubmitting || uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 mr-2" />
                Create Activity
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
