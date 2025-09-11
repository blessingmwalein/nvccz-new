"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CiHeart, CiShare2, CiChat1, CiClock1 } from "react-icons/ci";
import { HiTrendingUp } from "react-icons/hi";

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  author: string;
  timeAgo: string;
  likes: number;
  shares: number;
  comments: number;
  category: string;
  trending: boolean;
}

const articles: Article[] = [
  {
    id: "1",
    title: "Zimbabwe Stock Exchange Sees Record Growth in Q4",
    description: "The ZSE All Share Index reached new heights with major gains across banking and mining sectors. Analysts predict continued growth in the coming quarter.",
    image: "https://picsum.photos/800/400?random=1",
    author: "Financial Times Zimbabwe",
    timeAgo: "2 hours ago",
    likes: 124,
    shares: 23,
    comments: 8,
    category: "Markets",
    trending: true
  },
  {
    id: "2",
    title: "RBZ Announces New Monetary Policy Framework",
    description: "The Reserve Bank of Zimbabwe introduces innovative measures to stabilize the economy and support local businesses through enhanced lending programs.",
    image: "https://picsum.photos/800/400?random=2",
    author: "Business Daily",
    timeAgo: "4 hours ago",
    likes: 89,
    shares: 15,
    comments: 12,
    category: "Policy",
    trending: false
  },
  {
    id: "3",
    title: "African Markets Show Strong Performance",
    description: "Regional exchanges including JSE, NSE, and NSE Kenya demonstrate resilience with positive returns across multiple sectors.",
    image: "https://picsum.photos/800/400?random=3",
    author: "African Finance",
    timeAgo: "6 hours ago",
    likes: 67,
    shares: 19,
    comments: 5,
    category: "Regional",
    trending: true
  },
  {
    id: "4",
    title: "Global Market Trends Impact Local Investments",
    description: "International market movements continue to influence Zimbabwe's investment landscape with opportunities in emerging sectors.",
    image: "https://picsum.photos/800/400?random=4",
    author: "Investment Weekly",
    timeAgo: "8 hours ago",
    likes: 45,
    shares: 7,
    comments: 3,
    category: "Global",
    trending: false
  }
];

const filterPills = [
  { id: "all", label: "All Articles", count: articles.length },
  { id: "trending", label: "Trending", count: articles.filter(a => a.trending).length },
  { id: "markets", label: "Markets", count: articles.filter(a => a.category === "Markets").length },
  { id: "policy", label: "Policy", count: articles.filter(a => a.category === "Policy").length },
  { id: "regional", label: "Regional", count: articles.filter(a => a.category === "Regional").length },
  { id: "global", label: "Global", count: articles.filter(a => a.category === "Global").length }
];

export function ArticlesFeed() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());

  const filteredArticles = articles.filter(article => {
    if (activeFilter === "all") return true;
    if (activeFilter === "trending") return article.trending;
    return article.category.toLowerCase() === activeFilter;
  });

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

      {/* Articles Feed */}
      <div className="space-y-4">
        {filteredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-200"
          >
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
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {article.category}
              </span>
            </div>

            {/* Article Content */}
            <div className="mb-4">
              <h3 className="text-xl text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                {article.title}
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                {article.description}
              </p>
            </div>

            {/* Article Image */}
            <div className="mb-4">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

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
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center pt-4">
        <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
          Load More Articles
        </button>
      </div>
    </div>
  );
}
