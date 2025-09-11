"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, TrendingUp, Users, Clock, ArrowUp } from "lucide-react"

interface ForumPost {
  id: string
  title: string
  author: string
  avatar: string
  replies: number
  views: number
  lastActivity: string
  category: string
  isHot: boolean
  hasNewReplies: boolean
}

const forumPosts: ForumPost[] = [
  {
    id: "1",
    title: "Q4 Market Analysis & Predictions",
    author: "Sarah Chen",
    avatar: "SC",
    replies: 12,
    views: 156,
    lastActivity: "2h ago",
    category: "Market Analysis",
    isHot: true,
    hasNewReplies: true,
  },
  {
    id: "2",
    title: "ESG Investment Criteria Updates",
    author: "Michael Rodriguez",
    avatar: "MR",
    replies: 8,
    views: 89,
    lastActivity: "4h ago",
    category: "ESG",
    isHot: false,
    hasNewReplies: true,
  },
  {
    id: "3",
    title: "Tech Sector Valuation Concerns",
    author: "David Kim",
    avatar: "DK",
    replies: 15,
    views: 203,
    lastActivity: "6h ago",
    category: "Technology",
    isHot: true,
    hasNewReplies: false,
  },
  {
    id: "4",
    title: "Portfolio Diversification Strategies",
    author: "Emma Thompson",
    avatar: "ET",
    replies: 6,
    views: 67,
    lastActivity: "1d ago",
    category: "Strategy",
    isHot: false,
    hasNewReplies: false,
  },
]

export function ForumWidget() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(forumPosts.map((post) => post.category)))
  const filteredPosts = selectedCategory
    ? forumPosts.filter((post) => post.category === selectedCategory)
    : forumPosts.slice(0, 3)

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Team Forum
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {forumPosts.reduce((acc, post) => acc + post.replies, 0)} discussions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs h-7"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs h-7"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Forum Posts */}
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/avatar-${post.author.toLowerCase().replace(" ", "-")}.png`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{post.avatar}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm leading-tight">{post.title}</h4>
                    <div className="flex items-center gap-1">
                      {post.isHot && <TrendingUp className="w-3 h-3 text-orange-500" />}
                      {post.hasNewReplies && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {post.replies}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.lastActivity}
                    </div>
                  </div>

                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 bg-transparent">
            <ArrowUp className="w-4 h-4 mr-2" />
            New Post
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            View All Discussions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
