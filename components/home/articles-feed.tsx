"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CiHeart, CiShare2, CiChat1, CiClock1 } from "react-icons/ci";
import { HiTrendingUp } from "react-icons/hi";
import { postsApi, type Post } from "@/lib/api/posts-api";
import { useAppSelector } from "@/lib/store";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostForm, type PostFormValues } from "./post-form";

const FALLBACK_IMAGE = "https://picsum.photos/800/400?random=10";

export function ArticlesFeed() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [isPostOpen, setIsPostOpen] = useState(false)
  const [editPost, setEditPost] = useState<Post | null>(null)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await postsApi.getAll()
        setPosts(res.data || [])
      } catch (e) {
        // keep silent
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const articles = posts.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.content,
    image: FALLBACK_IMAGE,
    author: `${p.author.firstName} ${p.author.lastName}`,
    timeAgo: new Date(p.createdAt).toLocaleString(),
    likes: 0,
    shares: 0,
    comments: (p.replies?.length ?? 0),
    category: 'News',
    trending: false,
  }))

  const filterPills = [
    { id: "all", label: "All Articles", count: articles.length },
    { id: "trending", label: "Trending", count: articles.filter(a => a.trending).length },
    { id: "news", label: "News", count: articles.length },
  ]

  const filteredArticles = articles.filter(article => {
    if (activeFilter === "all") return true;
    if (activeFilter === "trending") return article.trending;
    return activeFilter === 'news'
  });

  const handleCreatePost = async (values: PostFormValues) => {
    if (editPost) {
      const res = await postsApi.update(editPost.id, { title: values.title, content: values.content })
      if (res.success && res.data) {
        setPosts(prev => prev.map(p => p.id === editPost.id ? (res.data as any) : p))
        toast.success('Post updated successfully')
      } else {
        toast.error('Failed to update post')
      }
      setEditPost(null)
    } else {
      const res = await postsApi.create({ title: values.title, content: values.content })
      if (res.success && res.data) {
        setPosts(prev => [res.data as any, ...prev])
        toast.success('Post created successfully')
      } else {
        toast.error('Failed to create post')
      }
    }
  }

  const canManagePost = (p: Post) => {
    const postEmail = p.author?.email?.toLowerCase?.() || ""
    const currentEmail = user?.email?.toLowerCase?.() || ""
    return postEmail && currentEmail && postEmail === currentEmail
  }

  const handleDelete = async (p: Post) => {
    const res = await postsApi.delete(p.id)
    if (res.success) {
      setPosts(prev => prev.filter(x => x.id !== p.id))
      toast.success('Post deleted')
    } else {
      toast.error('Failed to delete post')
    }
  }

  const handleLike = (articleId: string) => {
    setLikedArticles(prev => {
      const newSet = new Set(prev);
      const wasLiked = newSet.has(articleId);
      
      if (wasLiked) {
        newSet.delete(articleId);
        // Show unliked toast
        const article = articles.find(a => a.id === articleId);
        if (article) {
          toast.info("💔 Unliked article", {
            description: `"${article.title}" removed from your favorites`,
            duration: 3000,
          });
        }
      } else {
        newSet.add(articleId);
        // Show liked toast
        const article = articles.find(a => a.id === articleId);
        if (article) {
          toast.success("❤️ Liked article!", {
            description: `"${article.title}" added to your favorites`,
            duration: 3000,
          });
        }
      }
      return newSet;
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mt-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filterPills.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
              <span className="ml-1 text-xs opacity-75">({filter.count})</span>
            </button>
          ))}
        </div>
        <Button className="rounded-full gradient-primary text-white" onClick={() => setIsPostOpen(true)}>
          Create Post
        </Button>
      </div>

      {/* Articles Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="space-y-2">
                      <div className="w-40 h-3 bg-gray-200 rounded animate-pulse" />
                      <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="w-3/5 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="w-11/12 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="transition-all duration-300 border rounded-xl border-gray-200">
              <div className="p-6">
            {/* Article Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm">
                    {article.author.split(' ').map(word => word[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h4 className="text-base text-gray-900">{article.author}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CiClock1 className="w-4 h-4" />
                    <span>{article.timeAgo}</span>
                    {article.trending && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1 text-orange-500">
                          <HiTrendingUp className="w-4 h-4" />
                          <span className="text-xs">Trending</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {article.category}
                </span>
                {canManagePost(posts[index]) && (
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => { setEditPost(posts[index]); setIsPostOpen(true) }}
                      className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 border border-gray-200"
                      aria-label="Edit post"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(posts[index])}
                      className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-100"
                      aria-label="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Article Content */}
            <div className="mb-4">
              <h3 className="text-xl text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                {article.title}
              </h3>
              <div className="prose max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.description }} />
            </div>

            {/* Image removed per request */}

            {/* Article Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleLike(article.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    likedArticles.has(article.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <CiHeart className={`w-5 h-5 ${likedArticles.has(article.id) ? 'fill-current' : ''}`} />
                  <span className="text-sm">{formatNumber(article.likes + (likedArticles.has(article.id) ? 1 : 0))}</span>
                </button>
                
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <CiChat1 className="w-5 h-5" />
                  <span className="text-sm">{formatNumber(article.comments)}</span>
                </button>
                
                <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                  <CiShare2 className="w-5 h-5" />
                  <span className="text-sm">{formatNumber(article.shares)}</span>
                </button>
              </div>
              </div>
            </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center pt-4">
        <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
          Load More Articles
        </button>
      </div>

      <PostForm
        open={isPostOpen}
        onClose={() => { setIsPostOpen(false); setEditPost(null) }}
        onSubmit={handleCreatePost}
        mode={editPost ? 'edit' : 'create'}
        initialValues={editPost ? { title: editPost.title, content: editPost.content } : undefined}
      />
    </div>
  );
}
