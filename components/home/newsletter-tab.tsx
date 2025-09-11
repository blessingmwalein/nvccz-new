"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  CiCirclePlus, 
  CiHeart, 
  CiShare2, 
  CiCalendar,
  CiUser,
  CiPaperplane,
  CiMail
} from "react-icons/ci"

const newsletters = [
  {
    id: 1,
    title: "Weekly Market Update - Q4 2024",
    content: "This week's market analysis shows strong performance across all major indices...",
    image: "https://picsum.photos/400/300?random=1",
    author: "Investment Team",
    date: "Dec 15, 2024",
    likes: 42,
    shares: 18,
    isLiked: false
  },
  {
    id: 2,
    title: "Zimbabwe Economic Outlook 2025",
    content: "Our comprehensive analysis of Zimbabwe's economic prospects for the coming year...",
    image: "https://picsum.photos/400/300?random=2",
    author: "Research Department", 
    date: "Dec 12, 2024",
    likes: 28,
    shares: 12,
    isLiked: true
  },
  {
    id: 3,
    title: "Portfolio Performance Review",
    content: "Q4 portfolio performance exceeded expectations with strong returns across all sectors...",
    image: "https://picsum.photos/400/300?random=3",
    author: "Portfolio Management",
    date: "Dec 10, 2024",
    likes: 35,
    shares: 22,
    isLiked: false
  }
]

export function NewsletterTab() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newsletterData, setNewsletterData] = useState(newsletters)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: ""
  })

  const handleCreateNewsletter = () => {
    if (formData.title && formData.content) {
      const newNewsletter = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        image: formData.image || "/placeholder.jpg",
        author: "You",
        date: new Date().toLocaleDateString(),
        likes: 0,
        shares: 0,
        isLiked: false
      }
      setNewsletterData([newNewsletter, ...newsletterData])
      setFormData({ title: "", content: "", image: "" })
      setShowCreateForm(false)
    }
  }

  const toggleLike = (id: number) => {
    setNewsletterData(prev => prev.map(newsletter => {
      if (newsletter.id === id) {
        const wasLiked = newsletter.isLiked
        const newLiked = !wasLiked
        
        // Show toast notification
        if (newLiked) {
          toast.success("❤️ Liked newsletter!", {
            description: `"${newsletter.title}" added to your favorites`,
            duration: 3000,
          })
        } else {
          toast.info("💔 Unliked newsletter", {
            description: `"${newsletter.title}" removed from your favorites`,
            duration: 3000,
          })
        }
        
        return { 
          ...newsletter, 
          isLiked: newLiked,
          likes: wasLiked ? newsletter.likes - 1 : newsletter.likes + 1
        }
      }
      return newsletter
    }))
  }

  return (
    <div className="space-y-6">
      {/* Create Newsletter Section */}
      <div className="border border-gray-200 rounded-xl p-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-normal text-xl">
              <CiMail className="w-5 h-5" />
              Newsletter Management
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-6 py-2"
            >
              <CiCirclePlus className="w-4 h-4" />
              Create New Newsletter
            </Button>
          </div>
        </CardHeader>
        
        {showCreateForm && (
          <CardContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 border rounded-lg bg-gray-50"
            >
              <div className="space-y-2">
                <label className="text-sm text-gray-600 underline decoration-gray-300 decoration-1 underline-offset-2">
                  Newsletter Title
                </label>
                <div className="relative">
                  <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Enter newsletter title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="pl-10 border-0 border-b-2 border-gray-200 rounded-none focus:border-blue-500 focus:ring-0 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-600 underline decoration-gray-300 decoration-1 underline-offset-2">
                  Content
                </label>
                <Textarea
                  placeholder="Write your newsletter content..."
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="border-0 border-b-2 border-gray-200 rounded-none focus:border-blue-500 focus:ring-0 focus:outline-none bg-transparent resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-600 underline decoration-gray-300 decoration-1 underline-offset-2">
                  Image URL
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">📷</span>
                    <Input
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="pl-10 border-0 border-b-2 border-gray-200 rounded-none focus:border-blue-500 focus:ring-0 focus:outline-none bg-transparent"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <span className="text-sm">📷</span>
                    Choose Image
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateNewsletter} 
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-full px-6 py-2"
                >
                  <CiPaperplane className="w-4 h-4" />
                  Publish Newsletter
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </CardContent>
        )}
      </div>

      {/* Newsletter List */}
      <div className="space-y-4">
        <h3 className="text-xl text-gray-900">Recent Newsletters</h3>
        {newsletterData.map((newsletter, index) => (
          <motion.div
            key={newsletter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="transition-all duration-300 border rounded-xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-200 to-indigo-200 flex-shrink-0">
                    <img 
                      src={newsletter.image} 
                      alt={newsletter.title}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-lg text-gray-900 mb-2">
                        {newsletter.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {newsletter.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <CiUser className="w-4 h-4" />
                          {newsletter.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <CiCalendar className="w-4 h-4" />
                          {newsletter.date}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(newsletter.id)}
                          className={`flex items-center gap-1 ${
                            newsletter.isLiked ? 'text-red-500' : 'text-gray-500'
                          }`}
                        >
                          <CiHeart className={`w-4 h-4 ${newsletter.isLiked ? 'fill-current' : ''}`} />
                          {newsletter.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                          <CiShare2 className="w-4 h-4" />
                          {newsletter.shares}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
