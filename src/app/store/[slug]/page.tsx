'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, MessageCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Store {
  id: string
  userId: string
  name: string
  slug: string
  description: string
  storePhotoUrl: string | null
  bio: string | null
  website: string | null
  isVerified: boolean
  averageRating: number
  totalReviews: number
  totalSales: number
  productsCount: number
  reviews: Array<{
    id: string
    rating: number
    title: string
    comment: string
    author: {
      firstName: string
      lastName: string
      avatarUrl: string | null
    }
    createdAt: string
  }>
}

interface Product {
  id: string
  title: string
  price: number
  images: Array<{ url: string }>
}

export default function StorePage({ params }: { params: { slug: string } }) {
  const { user } = useAuth()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')

  useEffect(() => {
    fetchStore()
  }, [params.slug])

  const fetchStore = async () => {
    try {
      // In a real implementation, you would fetch from the API
      // For now, this is a placeholder
      setLoading(false)
    } catch (error) {
      console.error('Error fetching store:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Store not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={16}
            className={i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-black hover:text-gray-600 mb-6">
            <ArrowLeft size={20} />
            Back
          </Link>
        </div>
      </div>

      {/* Store Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Store Photo */}
            <div className="flex justify-center">
              {store.storePhotoUrl ? (
                <img
                  src={store.storePhotoUrl}
                  alt={store.name}
                  className="w-32 h-32 rounded-lg object-cover border-2 border-black"
                />
              ) : (
                <div className="w-32 h-32 rounded-lg bg-gray-200 border-2 border-black flex items-center justify-center">
                  <span className="text-gray-500 text-center text-sm">No image</span>
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className="md:col-span-3">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold ">{store.name}</h1>
                  {store.isVerified && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      VERIFIED
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{store.bio || store.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-2xl font-bold">{store.totalSales}</p>
                  <p className="text-gray-600 text-sm">Total Sales</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{store.productsCount}</p>
                  <p className="text-gray-600 text-sm">Products</p>
                </div>
                <div>
                  <p className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{store.averageRating.toFixed(1)}</span>
                    {renderStars(store.averageRating)}
                  </p>
                  <p className="text-gray-600 text-sm">({store.totalReviews} reviews)</p>
                </div>
              </div>

              {/* Action Buttons */}
              {user && user.id !== store.userId && (
                <div className="flex gap-3">
                  <Link
                    href={`/buyer/chat?sellerId=${store.userId}`}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition-colors"
                  >
                    <MessageCircle size={20} />
                    Contact Seller
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 font-semibold text-sm uppercase tracking-wide border-b-2 ${
                activeTab === 'products'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              Products ({store.productsCount})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-2 font-semibold text-sm uppercase tracking-wide border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              Reviews ({store.totalReviews})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'products' && (
          <div>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group"
                  >
                    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
                        <p className="text-lg font-bold">${product.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-12">No products available</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {store.reviews.length > 0 ? (
              store.reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {review.author.avatarUrl ? (
                      <img
                        src={review.author.avatarUrl}
                        alt={review.author.firstName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {review.author.firstName} {review.author.lastName}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-12">No reviews yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
