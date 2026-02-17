'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Star, MapPin, Shield, ExternalLink } from 'lucide-react'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  city: string
  country: string
  role: 'BUYER' | 'SELLER'
  isVerified: boolean
  createdAt: string
  avatarUrl?: string
  // Seller fields
  shop?: {
    id: string
    name: string
    slug: string
    description: string
    bio: string
    isVerified: boolean
    trustScore: number
    averageRating: number
    totalReviews: number
    totalSales: number
  }
  // Stats
  reviews?: Array<{
    id: string
    rating: number
    title: string
    comment: string
    createdAt: string
    author: {
      firstName: string
      lastName: string
    }
  }>
  products?: Array<{
    id: string
    title: string
    price: number
    images?: string[]
  }>
}

export default function PublicProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${username}`)
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-black rounded-full"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/" className="flex items-center gap-2 text-black font-bold uppercase text-xs tracking-wide mb-8 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
          <div className="text-center py-20">
            <p className="text-black font-bold uppercase text-sm tracking-wide">USER NOT FOUND</p>
            <p className="text-gray-600 text-sm mt-2">@{username}</p>
          </div>
        </div>
      </div>
    )
  }

  const isSeller = profile.role === 'SELLER'

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-black to-gray-800"></div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mt-4 mb-8">
          <Link href="/" className="flex items-center gap-2 text-black font-bold uppercase text-xs tracking-wide hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-8 mb-12">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.firstName}
                className="w-32 h-32 rounded-full border-4 border-black object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-black bg-gray-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-black">{profile.firstName[0]}{profile.lastName[0]}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-black uppercase tracking-wide">
                {profile.firstName} {profile.lastName}
              </h1>
              {profile.isVerified && (
                <Shield className="w-6 h-6 text-black" fill="currentColor" />
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-4 font-semibold">@{profile.username}</p>

            <div className="space-y-2 text-sm text-gray-700 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{profile.city}, {profile.country}</span>
              </div>
              <p className="text-xs text-gray-500">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 border-2 border-black text-black font-bold uppercase text-xs tracking-wide hover:bg-black hover:text-white transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                SEND MESSAGE
              </button>
              {isSeller && profile.shop && (
                <Link 
                  href={`/store/${profile.shop.slug}`}
                  className="px-6 py-3 bg-black text-white font-bold uppercase text-xs tracking-wide hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  VIEW SHOP
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Seller Stats */}
        {isSeller && profile.shop && (
          <div className="grid grid-cols-4 gap-4 mb-12 p-8 border-2 border-black">
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{profile.shop.totalSales}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Sales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{profile.shop.averageRating.toFixed(1)}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{profile.shop.totalReviews}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{profile.shop.trustScore}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Trust Score</p>
            </div>
          </div>
        )}

        {/* About Section */}
        {isSeller && profile.shop && (
          <div className="mb-12 p-8 border-2 border-black">
            <h2 className="text-xl font-bold text-black uppercase tracking-wide mb-4">ABOUT THIS SHOP</h2>
            <p className="text-gray-700 mb-4">{profile.shop.description}</p>
            {profile.shop.bio && (
              <>
                <h3 className="text-sm font-bold text-black uppercase tracking-wide mb-2">BIO</h3>
                <p className="text-gray-700">{profile.shop.bio}</p>
              </>
            )}
          </div>
        )}

        {/* Reviews Section */}
        {profile.reviews && profile.reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">REVIEWS ({profile.reviews.length})</h2>
            <div className="space-y-4">
              {profile.reviews.map((review) => (
                <div key={review.id} className="p-6 border-2 border-gray-300">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-black">{review.author.firstName} {review.author.lastName}</p>
                      <p className="text-xs text-gray-600 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'fill-black text-black' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-bold text-black mb-2">{review.title}</h4>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Section (for sellers) */}
        {isSeller && profile.products && profile.products.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">FEATURED PRODUCTS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {profile.products.slice(0, 4).map((product) => (
                <Link 
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group border border-gray-200 hover:border-black transition-colors"
                >
                  {product.images && product.images.length > 0 && (
                    <img src={product.images[0]} alt={product.title} className="w-full aspect-square object-cover" />
                  )}
                  <div className="p-3">
                    <p className="font-bold text-black text-sm line-clamp-2">{product.title}</p>
                    <p className="text-sm text-black font-bold mt-2">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
