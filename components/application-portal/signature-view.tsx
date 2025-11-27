"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenLine, User, Building2, Calendar, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SignatureViewProps {
  type: "applicant" | "investor"
  signatureUrl?: string | null
  signedAt?: string | null
  signerName?: string
  className?: string
}

export function SignatureView({ type, signatureUrl, signedAt, signerName, className }: SignatureViewProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const isApplicant = type === "applicant"
  const title = isApplicant ? "Applicant Signature" : "Investor Signature"
  const Icon = isApplicant ? User : Building2
  const borderColor = isApplicant ? "border-l-green-500" : "border-l-blue-500"
  const iconColor = isApplicant ? "text-green-500" : "text-blue-500"
  const bgGradient = isApplicant
    ? "bg-gradient-to-br from-green-50 to-emerald-50"
    : "bg-gradient-to-br from-blue-50 to-indigo-50"

  if (!signatureUrl) {
    return (
      <Card className={cn("border-l-4 border-l-gray-300", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PenLine className="w-5 h-5 text-gray-400" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <PenLine className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Not yet signed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("border-l-4", borderColor, className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Icon className={cn("w-5 h-5", iconColor)} />
            {title}
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Signed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Signature Image */}
        <div className={cn("relative rounded-lg border p-4", bgGradient)}>
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}
          {imageError ? (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <PenLine className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Failed to load signature</p>
              </div>
            </div>
          ) : (
            <img
              src={signatureUrl || "/placeholder.svg"}
              alt={`${title}`}
              className={cn("max-h-32 w-auto mx-auto object-contain", imageLoading && "opacity-0")}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false)
                setImageError(true)
              }}
            />
          )}
        </div>

        {/* Signature Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {signerName && (
            <div>
              <label className="text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" />
                Signed by
              </label>
              <p className="font-medium mt-0.5">{signerName}</p>
            </div>
          )}
          {signedAt && (
            <div>
              <label className="text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Date & Time
              </label>
              <p className="font-medium mt-0.5">{new Date(signedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
