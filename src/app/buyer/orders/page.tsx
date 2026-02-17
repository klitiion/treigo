'use client'

import { useState, useEffect } from 'react'
import { BuyerLayout } from '@/components/layout/BuyerLayout'
import { OrderStatusTracker } from '@/components/buyer/OrderStatusTracker'
import { ProtectedRoute } from '@/hooks/useAuth'
import { Package, Search } from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  product: string
  seller: string
  price: number
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  estimatedDelivery: string
  image: string
}

export default function OrdersPage() {
  return (
    <ProtectedRoute requiredRole="BUYER">
      <OrdersList />
    </ProtectedRoute>
  )
}

function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          orderNumber: '#ORD-2024-001',
          product: 'Nike Air Max 90',
          seller: 'SportStyle Shop',
          price: 89.99,
          date: '2024-01-15',
          status: 'delivered',
          estimatedDelivery: '2024-01-20',
          image: '👟',
        },
        {
          id: '2',
          orderNumber: '#ORD-2024-002',
          product: 'Louis Vuitton Speedy Bag',
          seller: 'Luxury Store',
          price: 450.00,
          date: '2024-01-20',
          status: 'shipped',
          estimatedDelivery: '2024-02-05',
          image: '👜',
        },
        {
          id: '3',
          orderNumber: '#ORD-2024-003',
          product: 'Gucci Sunglasses',
          seller: 'Fashion Forward',
          price: 135.50,
          date: '2024-02-01',
          status: 'processing',
          estimatedDelivery: '2024-02-10',
          image: '🕶️',
        },
        {
          id: '4',
          orderNumber: '#ORD-2024-004',
          product: 'Adidas Running Shoes',
          seller: 'SportStyle Shop',
          price: 95.00,
          date: '2024-02-02',
          status: 'pending',
          estimatedDelivery: '2024-02-12',
          image: '👟',
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'border-orange-600 text-orange-600',
      processing: 'border-blue-600 text-blue-600',
      shipped: 'border-purple-600 text-purple-600',
      delivered: 'border-green-600 text-green-600',
      cancelled: 'border-red-600 text-red-600',
    }
    return colors[status] || 'border-gray-600 text-gray-600'
  }

  return (
    <BuyerLayout>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      ) : (
        <div className="py-12 lg:py-20">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl lg:text-6xl font-900 text-black mb-4 uppercase tracking-tight">My Orders</h1>
            <p className="text-gray-600 text-lg">
              Find and track your orders
            </p>
          </div>

          {/* Search & Filter */}
          <div className="border-2 border-black p-8 mb-12 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number, product, or seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-black focus:border-black focus:outline-none"
              />
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2 border-t-2 border-gray-300 pt-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 border-2 font-bold uppercase tracking-wide text-sm transition-all ${
                  filter === 'all'
                    ? 'bg-black text-white border-black'
                    : 'border-black text-black hover:bg-black hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 border-2 font-bold uppercase tracking-wide text-sm transition-all ${
                  filter === 'pending'
                    ? 'bg-black text-white border-black'
                    : 'border-black text-black hover:bg-black hover:text-white'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('processing')}
                className={`px-4 py-2 border-2 font-bold uppercase tracking-wide text-sm transition-all ${
                  filter === 'processing'
                    ? 'bg-black text-white border-black'
                    : 'border-black text-black hover:bg-black hover:text-white'
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setFilter('shipped')}
                className={`px-4 py-2 border-2 font-bold uppercase tracking-wide text-sm transition-all ${
                  filter === 'shipped'
                    ? 'bg-black text-white border-black'
                    : 'border-black text-black hover:bg-black hover:text-white'
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => setFilter('delivered')}
                className={`px-4 py-2 border-2 font-bold uppercase tracking-wide text-sm transition-all ${
                  filter === 'delivered'
                    ? 'bg-black text-white border-black'
                    : 'border-black text-black hover:bg-black hover:text-white'
                }`}
              >
                Delivered
              </button>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 border-2 border-black p-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <p className="text-black font-bold mb-2 uppercase text-sm tracking-wide">No orders found</p>
              <p className="text-gray-600 text-sm">
                Start shopping to see your orders here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-black p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b-2 border-gray-300">
                    <div>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">{order.orderNumber}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{order.image}</span>
                        <div>
                          <h3 className="font-bold text-black">{order.product}</h3>
                          <p className="text-sm text-gray-600">Seller: {order.seller}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-900 text-xl text-black">${order.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-600 mt-1">{order.date}</p>
                      <span className={`inline-block mt-2 px-4 py-2 border-2 font-bold uppercase tracking-wide text-xs ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Order Status Tracker */}
                  <OrderStatusTracker status={order.status as any} estimatedDelivery={order.estimatedDelivery} />

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    <Link 
                      href={`/buyer/orders/${order.id}`}
                      className="flex-1 px-4 py-3 border-2 border-black text-black font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors text-center"
                    >
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <Link
                        href={`/buyer/orders/${order.id}#review`}
                        className="flex-1 px-4 py-3 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors text-center"
                      >
                        Leave Review
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </BuyerLayout>
  )
}
