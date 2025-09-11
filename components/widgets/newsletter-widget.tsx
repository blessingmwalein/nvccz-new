"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CiMail, CiUser, CiPaperplane, CiCheckCircle, CiTrendingUp, CiUserGroup, CiCalendar } from "react-icons/ci"

export function NewsletterWidget() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true)
      setEmail("")
    }
  }

  return (
    <Card className="transition-all duration-300 border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CiMail className="w-5 h-5 text-primary" />
          Investment Insights Newsletter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSubscribed ? (
          <>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Get weekly market analysis, portfolio insights, and investment opportunities delivered to your inbox.
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <CiTrendingUp className="w-3 h-3 mr-1" />
                  Market Analysis
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <CiUserGroup className="w-3 h-3 mr-1" />
                  Portfolio Updates
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <CiCalendar className="w-3 h-3 mr-1" />
                  Weekly Digest
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600 underline decoration-gray-300 decoration-1 underline-offset-2">
                  Email Address
                </label>
                <div className="relative">
                  <CiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-0 border-b-2 border-gray-200 rounded-none focus:border-blue-500 focus:ring-0 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSubscribe} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full py-2 px-6 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <CiPaperplane className="w-4 h-4" />
                Subscribe to Newsletter
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <CiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <h3 className="text-lg text-green-700">Successfully Subscribed!</h3>
            <p className="text-sm text-muted-foreground">You'll receive our next newsletter on Monday.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
