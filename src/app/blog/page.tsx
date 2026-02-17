'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, ChevronRight } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  image: string
  featured: boolean
  readTime: number
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of E-Commerce in 2024: Trends and Predictions',
    excerpt: 'Explore the emerging trends that are shaping the future of online shopping. From AI-powered personalization to sustainable packaging, discover what\'s next.',
    category: 'TRENDS',
    author: 'Sarah Anderson',
    date: 'December 15, 2024',
    image: 'https://images.unsplash.com/photo-1460925895917-adf4e565d4ee?w=800&h=450&fit=crop',
    featured: true,
    readTime: 8
  },
  {
    id: '2',
    title: 'Building Your First Online Store: A Seller\'s Guide',
    excerpt: 'Everything you need to know to launch your first online store. From product photography to pricing strategies, we cover it all.',
    category: 'GUIDES',
    author: 'Marcus Chen',
    date: 'December 10, 2024',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
    featured: true,
    readTime: 12
  },
  {
    id: '3',
    title: 'Customer Service Excellence: How Top Sellers Succeed',
    excerpt: 'Learn the strategies that top-performing sellers use to deliver exceptional customer service and build loyal customer bases.',
    category: 'GUIDES',
    author: 'Emma Rodriguez',
    date: 'December 5, 2024',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
    featured: false,
    readTime: 6
  },
  {
    id: '4',
    title: 'Sustainable Shopping: Why It Matters',
    excerpt: 'Discover how choosing sustainable products can make a real difference for the environment and your wallet.',
    category: 'SUSTAINABILITY',
    author: 'John Miller',
    date: 'November 28, 2024',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
    featured: false,
    readTime: 7
  },
  {
    id: '5',
    title: 'Mobile Shopping Optimization: Tips for On-The-Go Buying',
    excerpt: 'With more people shopping on mobile devices, here\'s how to make the best purchasing decisions from your phone.',
    category: 'TIPS',
    author: 'Lisa Thompson',
    date: 'November 20, 2024',
    image: 'https://images.unsplash.com/photo-1512941691920-25bda36dc643?w=800&h=450&fit=crop',
    featured: false,
    readTime: 5
  },
  {
    id: '6',
    title: 'Payment Security: Keeping Your Information Safe',
    excerpt: 'Understand the security measures that protect your payment information and how to shop safely online.',
    category: 'SECURITY',
    author: 'Robert Zhang',
    date: 'November 15, 2024',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=800&h=450&fit=crop',
    featured: false,
    readTime: 6
  }
]

const categories = [
  'ALL',
  'TRENDS',
  'GUIDES',
  'TIPS',
  'SUSTAINABILITY',
  'SECURITY'
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const filteredPosts = selectedCategory === 'ALL' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const featuredPosts = filteredPosts.filter(p => p.featured).slice(0, 2)
  const regularPosts = filteredPosts.filter(p => !p.featured)

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-4">BLOG</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Discover insights, tips, and stories from the Treigo community. Stay updated with the latest trends in e-commerce.
          </p>
        </div>
      </div>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-12">FEATURED</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Link 
                key={post.id}
                href={`/blog/${post.id}`}
                className="group border-2 border-gray-200 overflow-hidden hover:border-black transition-colors"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-black text-black uppercase tracking-widest bg-gray-100 px-3 py-1">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-600">{post.readTime} MIN READ</span>
                  </div>

                  <h3 className="text-xl font-black text-black uppercase tracking-tight mb-3 line-clamp-2 group-hover:underline">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-black">{post.author}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex overflow-x-auto gap-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 whitespace-nowrap font-bold uppercase text-xs tracking-wider transition-colors ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black hover:bg-black hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-12">
          {selectedCategory === 'ALL' ? 'ALL ARTICLES' : selectedCategory}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link 
              key={post.id}
              href={`/blog/${post.id}`}
              className="group flex flex-col border border-gray-200 hover:border-black transition-colors overflow-hidden"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black text-black uppercase tracking-widest bg-gray-100 px-2 py-1">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-600">{post.readTime} MIN</span>
                </div>

                <h3 className="text-lg font-black text-black uppercase tracking-tight mb-2 line-clamp-2 group-hover:underline flex-1">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="pt-4 border-t border-gray-200 mt-auto">
                  <p className="text-xs font-semibold text-black mb-1">{post.author}</p>
                  <p className="text-xs text-gray-500">{post.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600">No articles found in this category.</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-4">STAY UPDATED</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Subscribe to receive the latest articles and insights delivered to your inbox.
            </p>
          </div>

          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 font-semibold text-black placeholder-gray-400 focus:outline-none focus:border-black"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white font-bold uppercase text-xs tracking-wide hover:bg-gray-800 transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
