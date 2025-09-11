"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, X, FileText, Image, File, Eye, Edit, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import DocumentUploadModal from "./DocumentUploadModal"

interface Step3Props {
  formData: any
  updateField: (field: string, value: any) => void
  errors: Record<string, string>
}

const Step3 = ({ formData, updateField, errors }: Step3Props) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Ensure documents array exists
  const documents = formData.documents || []

  const handleFileUpload = (file: File, documentType: string) => {
    console.log('Uploading file:', file.name, 'Type:', documentType)
    const newDocument = {
      documentType: documentType as any,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
      isRequired: documentType !== 'HISTORICAL_FINANCIALS',
      file: file
    }
    
    const updatedDocuments = [...documents, newDocument]
    console.log('Updated documents:', updatedDocuments)
    updateField('documents', updatedDocuments)
    toast.success("Document uploaded successfully!")
  }

  const removeDocument = (index: number) => {
    const updatedDocuments = documents.filter((_: any, i: number) => i !== index)
    updateField('documents', updatedDocuments)
    toast.info("Document removed")
  }

  const previewDocument = (doc: any) => {
    setSelectedDocument(doc)
    setPreviewModalOpen(true)
  }

  const editDocument = (index: number) => {
    setEditingIndex(index)
    setUploadModalOpen(true)
  }

  const replaceDocument = (file: File, documentType: string) => {
    if (editingIndex !== null) {
      const updatedDocuments = [...documents]
      updatedDocuments[editingIndex] = {
        documentType: documentType as any,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        isRequired: documentType !== 'HISTORICAL_FINANCIALS',
        file: file
      }
      updateField('documents', updatedDocuments)
      setEditingIndex(null)
      toast.success("Document replaced successfully!")
    }
  }

  const handleUpload = (file: File, documentType: string) => {
    if (editingIndex !== null) {
      replaceDocument(file, documentType)
    } else {
      handleFileUpload(file, documentType)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (['pdf'].includes(extension || '')) return <FileText className="w-5 h-5" />
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return <Image className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Required Documents</h2>
        <p className="text-gray-600">Upload the necessary documents for your application</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {documents.map((doc: any, index: number) => (
          <motion.div 
            key={index} 
            className="group relative border rounded-2xl p-4 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Document Preview Area */}
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
              {doc.fileName.toLowerCase().endsWith('.pdf') ? (
                <div className="text-center">
                  <FileText className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs text-blue-600 font-medium">PDF Document</p>
                </div>
              ) : doc.fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
                <img 
                  src={doc.fileUrl} 
                  alt={doc.fileName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center">
                  <File className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 font-medium">Document</p>
                </div>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  size="sm"
                  onClick={() => previewDocument(doc)}
                  className="bg-white/90 hover:bg-white text-gray-900"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>

            {/* Document Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-gray-900">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Badge 
                  variant={doc.isRequired ? "destructive" : "secondary"} 
                  className="text-xs shrink-0"
                >
                  {doc.isRequired ? "Required" : "Optional"}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-2">
                <motion.button
                  onClick={() => previewDocument(doc)}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={() => editDocument(index)}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={() => removeDocument(index)}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Document Card */}
        <motion.div 
          className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
          onClick={() => setUploadModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="aspect-[4/3] flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Add Document</p>
          <p className="text-xs text-gray-500 mt-1">Click to upload</p>
        </motion.div>
      </div>

      {errors.documents && <p className="text-red-500 text-sm">{errors.documents}</p>}

      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false)
          setEditingIndex(null)
        }}
        onUpload={handleUpload}
        editingIndex={editingIndex}
      />

      {/* Document Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Document Preview
            </DialogTitle>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getFileIcon(selectedDocument.fileName)}
                <div>
                  <p className="font-medium">{selectedDocument.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedDocument.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Badge 
                  variant={selectedDocument.isRequired ? "destructive" : "secondary"}
                  className="ml-auto"
                >
                  {selectedDocument.isRequired ? "Required" : "Optional"}
                </Badge>
              </div>

              <div className="border rounded-lg overflow-hidden">
                {selectedDocument.fileName.toLowerCase().endsWith('.pdf') ? (
                  <div className="h-96 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">PDF Preview</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Click to download and view the PDF
                      </p>
                      <Button 
                        className="mt-4"
                        onClick={() => window.open(selectedDocument.fileUrl, '_blank')}
                      >
                        Open PDF
                      </Button>
                    </div>
                  </div>
                ) : selectedDocument.fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
                  <img 
                    src={selectedDocument.fileUrl} 
                    alt={selectedDocument.fileName}
                    className="w-full h-96 object-contain"
                  />
                ) : (
                  <div className="h-96 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Document Preview</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Click to download and view the document
                      </p>
                      <Button 
                        className="mt-4"
                        onClick={() => window.open(selectedDocument.fileUrl, '_blank')}
                      >
                        Open Document
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Step3
