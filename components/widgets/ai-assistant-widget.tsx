"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react"

interface AIInsight {
  type: "suggestion" | "alert" | "trend"
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const aiInsights: AIInsight[] = [
  {
    type: "suggestion",
    title: "Portfolio Rebalancing",
    description: "Consider increasing tech allocation by 5% based on Q4 trends",
    icon: Lightbulb,
  },
  {
    type: "trend",
    title: "Market Opportunity",
    description: "ESG funds showing 12% higher returns this quarter",
    icon: TrendingUp,
  },
  {
    type: "alert",
    title: "Risk Assessment",
    description: "High correlation detected in energy sector holdings",
    icon: AlertTriangle,
  },
]

export function AIAssistantWidget() {
  const [currentInsight, setCurrentInsight] = useState(0)
  const [question, setQuestion] = useState("")
  const [isAsking, setIsAsking] = useState(false)

  const handleAskQuestion = () => {
    if (question.trim()) {
      setIsAsking(true)
      // Simulate AI response delay
      setTimeout(() => {
        setIsAsking(false)
        setQuestion("")
      }, 2000)
    }
  }

  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % aiInsights.length)
  }

  const insight = aiInsights[currentInsight]
  const Icon = insight.icon

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI Investment Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Insight */}
        <div className="p-4 rounded-lg gradient-card border border-primary/20">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                insight.type === "suggestion"
                  ? "bg-blue-100 text-blue-600"
                  : insight.type === "trend"
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{insight.title}</h4>
                <Badge variant={insight.type === "alert" ? "destructive" : "secondary"} className="text-xs">
                  {insight.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {currentInsight + 1} of {aiInsights.length} insights
          </span>
          <Button variant="ghost" size="sm" onClick={nextInsight}>
            Next Insight
          </Button>
        </div>

        {/* Ask AI */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Ask AI about your portfolio..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 text-sm"
              disabled={isAsking}
            />
            <Button
              size="sm"
              onClick={handleAskQuestion}
              disabled={!question.trim() || isAsking}
              className="gradient-primary text-white"
            >
              {isAsking ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          {isAsking && <p className="text-xs text-muted-foreground animate-pulse">AI is analyzing your question...</p>}
        </div>
      </CardContent>
    </Card>
  )
}
