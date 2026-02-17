'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Clock, CheckCircle, Truck, ArrowLeft, MessageSquare } from 'lucide-react'
import { BuyerLayout } from '@/components/layout/BuyerLayout'

// Mock order data
const mockSellerOrders = [
  {
    id: 'ord-001',
    orderNumber: 'TRG-2025-001234',
    buyerInitials: 'JD',
    buyerCity: 'Tirana',
    productTitle: 'Louis Vuitton Neverfull MM',
    productPrice: 85000,
    quantity: 1,
    total: 85000,
    status: 'PENDING_CONFIRMATION',
    statusLabel: 'Pending Confirmation',
    createdAt: '2025-02-04T10:30:00',
    expectedDelivery: '2025-02-11',
  },
  {
    id: 'ord-002',
    orderNumber: 'TRG-2025-001235',
    buyerInitials: 'AB',
    buyerCity: 'Durrës',
    productTitle: 'Nike Air Jordan 1 Retro High',
    productPrice: 18500,
    quantity: 1,
    total: 18500,
    status: 'CONFIRMED',
    statusLabel: 'Confirmed',
    createdAt: '2025-02-03T14:20:00',
    expectedDelivery: '2025-02-10',
  },
  {
    id: 'ord-003',
    orderNumber: 'TRG-2025-001236',
    buyerInitials: 'MC',
    buyerCity: 'Vlorë',
    productTitle: 'Gucci GG Marmont Belt',
    productPrice: 25000,
    quantity: 1,
    total: 25000,
    status: 'SHIPPED',
    statusLabel: 'Shipped',
    createdAt: '2025-02-01T09:15:00',
    expectedDelivery: '2025-02-08',
  },
]

interface Order {
  id: string
  orderNumber: string
  buyerInitials: string
  buyerCity: string
  productTitle: string
  productPrice: number
  quantity: number
  total: number
  status: string
  statusLabel: string
  createdAt: string
  expectedDelivery: string
}

interface MessageDialogProps {
  order: Order | null
  onClose: () => void
}

function MessageDialog({ order, onClose }: MessageDialogProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'seller' | 'buyer'; text: string; time: string }>>([
    { id: '1', sender: 'buyer', text: 'Is the item still available?', time: '2025-02-04 10:45' },
    { id: '2', sender: 'seller', text: 'Yes, it is in perfect condition', time: '2025-02-04 10:50' },
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          sender: 'seller',
          text: message,
          time: new Date().toLocaleString(),
        },
      ])
      setMessage('')
    }
  }

  if (!order) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white border-2 border-black max-w-md w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-black flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-black uppercase text-sm tracking-wide">ORDER {order.orderNumber}</h2>
            <p className="text-xs text-gray-600">Buyer from {order.buyerCity}</p>
          </div>
          <button onClick={onClose} className="text-black hover:opacity-70 text-2xl">
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'seller' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs p-3 border-2 ${
                  msg.sender === 'seller'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t-2 border-black flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Send a message..."
            className="flex-1 px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-sm placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors font-semibold uppercase tracking-wide text-xs"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockSellerOrders)
  const [filter, setFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showMessageDialog, setShowMessageDialog] = useState(false)

  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => {
          if (filter === 'pending') return order.status === 'PENDING_CONFIRMATION'
          if (filter === 'confirmed') return order.status === 'CONFIRMED'
          if (filter === 'shipped') return order.status === 'SHIPPED'
          return true
        })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING_CONFIRMATION':
        return <Clock className="w-5 h-5 text-black" />
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-black" />
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-black" />
      default:
        return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_CONFIRMATION':
        return 'bg-yellow-50 text-black border-black'
      case 'CONFIRMED':
        return 'bg-white text-black border-black'
      case 'SHIPPED':
        return 'bg-white text-black border-black'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300'
    }
  }

  const handleContactBuyer = (order: Order) => {
    setSelectedOrder(order)
    setShowMessageDialog(true)
  }

  return (
    <BuyerLayout>
      <div className="min-h-screen py-12 bg-white">
        <div className="container-treigo">
          {/* Header */}
          <div className="mb-12">
            <Link href="/seller/dashboard" className="inline-flex items-center gap-2 text-black mb-6 hover:opacity-70 font-semibold uppercase text-sm tracking-wide">
              <ArrowLeft className="w-4 h-4" />
              BACK TO DASHBOARD
            </Link>
            <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-tight">MY ORDERS</h1>
            <p className="text-gray-600 text-sm">Manage and track all buyer orders</p>
          </div>

          {/* Filter */}
          <div className="flex gap-3 mb-8 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-semibold uppercase tracking-wide text-sm transition-all border-2 ${
                filter === 'all' ? 'bg-black text-white border-black' : 'bg-white border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              ALL ORDERS
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 font-semibold uppercase tracking-wide text-sm transition-all border-2 flex items-center gap-2 ${
                filter === 'pending' ? 'bg-black text-white border-black' : 'bg-white border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              PENDING
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-6 py-3 font-semibold uppercase tracking-wide text-sm transition-all border-2 flex items-center gap-2 ${
                filter === 'confirmed' ? 'bg-black text-white border-black' : 'bg-white border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              CONFIRMED
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`px-6 py-3 font-semibold uppercase tracking-wide text-sm transition-all border-2 flex items-center gap-2 ${
                filter === 'shipped' ? 'bg-black text-white border-black' : 'bg-white border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              SHIPPED
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold text-sm uppercase tracking-wide">NO ORDERS FOUND</p>
                <p className="text-gray-500 text-sm">Check back later for new buyer orders</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white border-2 border-black p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-black uppercase tracking-wide text-sm">{order.orderNumber}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold flex items-center gap-1 border-2 uppercase tracking-wide ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.statusLabel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-black">{order.total.toLocaleString()}L</p>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">TOTAL AMOUNT</p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-3 gap-6 py-6 border-y-2 border-black mb-6">
                    <div>
                      <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-semibold">BUYER</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 border-2 border-black flex items-center justify-center">
                          <span className="text-xs font-bold text-black">{order.buyerInitials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black">{order.buyerInitials}</p>
                          <p className="text-xs text-gray-600">{order.buyerCity}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-semibold">PRODUCT</p>
                      <p className="text-sm font-semibold text-black line-clamp-2">{order.productTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-semibold">EXPECTED DELIVERY</p>
                      <p className="text-sm font-semibold text-black">
                        {new Date(order.expectedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleContactBuyer(order)}
                      className="flex-1 px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      CONTACT BUYER
                    </button>
                    <button className="px-4 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors font-semibold uppercase tracking-wide text-sm">
                      UPDATE STATUS
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Message Dialog */}
      <MessageDialog order={selectedOrder} onClose={() => setShowMessageDialog(false)} />
    </BuyerLayout>
  )
}
