'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BuyerLayout } from '@/components/layout/BuyerLayout'
import { OrderStatusTracker } from '@/components/buyer/OrderStatusTracker'
import { ProtectedRoute, useAuth } from '@/hooks/useAuth'
import { ArrowLeft, MapPin, Calendar, Package, MessageCircle, Star } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    price: number
    image?: string
  }
  seller: {
    id: string
    name: string
    email: string
  }
}

interface OrderDetails {
  id: string
  orderNumber: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  estimatedDelivery?: string
  trackingNumber?: string
  items: OrderItem[]
  shippingFirstName: string
  shippingLastName: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  shippingPostal: string
  total: number
  review?: {
    rating: number
    comment: string
  }
}

export default function OrderDetailsPage() {
  return (
    <ProtectedRoute requiredRole="BUYER">
      <OrderDetails />
    </ProtectedRoute>
  )
}

function OrderDetails() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const orderId = params.id
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!token) return
        
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }

        const data = await response.json()
        setOrder(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order details')
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, token])

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle review submission
    console.log({ rating, comment })
    setShowReviewForm(false)
  }

  const handleContactSeller = (sellerId: string, sellerName: string) => {
    // Navigate to inbox with seller ID
    router.push(`/buyer/inbox?sellerId=${sellerId}&sellerName=${encodeURIComponent(sellerName)}`)
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pending',
      PROCESSING: 'Processing',
      SHIPPED: 'Shipped',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'border-orange-600 text-orange-600',
      PROCESSING: 'border-blue-600 text-blue-600',
      SHIPPED: 'border-purple-600 text-purple-600',
      DELIVERED: 'border-green-600 text-green-600',
      CANCELLED: 'border-red-600 text-red-600',
    }
    return colors[status] || 'border-gray-600 text-gray-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <BuyerLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      </BuyerLayout>
    )
  }

  if (error || !order) {
    return (
      <BuyerLayout>
        <div className="text-center py-20">
          <p className="text-black font-bold uppercase text-sm tracking-wide mb-4">{error || 'ORDER NOT FOUND'}</p>
          <Link href="/buyer/orders" className="text-black hover:text-gray-700 underline">
            Back to Orders
          </Link>
        </div>
      </BuyerLayout>
    )
  }

  return (
    <BuyerLayout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black font-bold uppercase text-xs tracking-wide mb-8 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO ORDERS
        </button>

        {/* Order Header */}
        <div className="border-2 border-black p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">{order.orderNumber}</p>
              <h1 className="text-2xl font-bold text-black uppercase tracking-wider mb-2">Order #{order.id.substring(0, 8)}</h1>
              <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="font-900 text-3xl text-black">${order.total.toFixed(2)}</p>
              <span className={`inline-block mt-4 px-4 py-2 border-2 font-bold uppercase tracking-wide text-xs ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t-2 border-gray-200 pt-6 mt-6">
            <h3 className="font-bold text-black uppercase text-sm tracking-wide mb-4">ORDER ITEMS</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-bold text-black">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Seller: {item.seller.name}</p>
                  </div>
                  <p className="font-bold text-black text-right">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="border-2 border-black p-8 mb-8">
          <h2 className="font-bold text-black uppercase text-sm tracking-wide mb-6">DELIVERY STATUS</h2>
          <OrderStatusTracker status={order.status as any} estimatedDelivery={order.estimatedDelivery} />
          {order.trackingNumber && (
            <div className="mt-6 pt-6 border-t-2 border-gray-300">
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">TRACKING NUMBER</p>
              <p className="font-mono font-bold text-black">{order.trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="border-2 border-black p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <MapPin className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-black uppercase text-sm tracking-wide mb-4">SHIPPING ADDRESS</h3>
              <div className="space-y-2">
                <p className="font-bold text-black">{order.shippingFirstName} {order.shippingLastName}</p>
                <p className="text-gray-700">{order.shippingAddress}</p>
                <p className="text-gray-700">{order.shippingCity}, {order.shippingPostal}</p>
                <p className="text-gray-700 mt-4">{order.shippingPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        {order.status === 'DELIVERED' && (
          <div className="border-2 border-black p-8 mb-8">
            <h3 className="font-bold text-black uppercase text-sm tracking-wide mb-6 flex items-center gap-2">
              <Star className="w-5 h-5" />
              LEAVE A REVIEW
            </h3>
            
            {!showReviewForm && !order.review ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full px-6 py-4 bg-black text-white font-bold uppercase text-sm tracking-wide hover:bg-gray-900 transition-colors"
              >
                WRITE A REVIEW
              </button>
            ) : order.review ? (
              <div className="bg-gray-50 p-6 border border-gray-300">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < order.review!.rating ? 'fill-black text-black' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700">{order.review.comment}</p>
              </div>
            ) : null}

            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-3">RATING</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= rating ? 'fill-black text-black' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-3">
                    COMMENT
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-black focus:outline-none resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-black text-white font-bold uppercase text-sm tracking-wide hover:bg-gray-900 transition-colors"
                  >
                    SUBMIT REVIEW
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 px-6 py-4 border-2 border-black text-black font-bold uppercase text-sm tracking-wide hover:bg-black hover:text-white transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Contact Sellers */}
        <div className="border-2 border-black p-8">
          <h3 className="font-bold text-black uppercase text-sm tracking-wide mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            NEED HELP?
          </h3>
          <p className="text-gray-700 mb-6">Have questions about your order? Contact the sellers or our support team.</p>
          
          {/* Seller Contact Buttons */}
          {order.items.length > 0 && (
            <div className="mb-6 space-y-3">
              <h4 className="font-bold text-black text-xs uppercase tracking-wide">CONTACT SELLERS</h4>
              <div className="flex flex-col gap-2">
                {order.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleContactSeller(item.seller.id, item.seller.name)}
                    className="px-4 py-3 border-2 border-black text-black font-bold uppercase text-xs tracking-wide hover:bg-black hover:text-white transition-colors text-left"
                  >
                    Contact {item.seller.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Support Contact Button */}
          <div className="flex gap-3">
            <button className="flex-1 px-6 py-4 bg-black text-white font-bold uppercase text-sm tracking-wide hover:bg-gray-900 transition-colors">
              CONTACT SUPPORT
            </button>
          </div>
        </div>
      </div>
    </BuyerLayout>
  )
}
