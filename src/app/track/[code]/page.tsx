'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Package, Truck, CheckCircle, Clock, ArrowLeft, MessageCircle } from 'lucide-react'

export default function TrackPage() {
  const params = useParams()
  const code = params.code as string
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const foundOrder = orders.find((o: any) => o.code === code)
    
    if (foundOrder) {
      setOrder(foundOrder)
    }
    setLoading(false)
  }, [code])

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; description: string; color: string; icon: any }> = {
      'PENDING_CASH_PAYMENT': {
        label: 'Awaiting Payment',
        description: 'Awaiting cash payment on delivery',
        color: 'border-yellow-300 bg-yellow-50',
        icon: Clock,
      },
      'CONFIRMED': {
        label: 'Confirmed',
        description: 'Your order has been confirmed',
        color: 'border-blue-300 bg-blue-50',
        icon: CheckCircle,
      },
      'SHIPPED': {
        label: 'In Transit',
        description: 'Your order is on its way',
        color: 'border-purple-300 bg-purple-50',
        icon: Truck,
      },
      'DELIVERED': {
        label: 'Delivered',
        description: 'Your order has been delivered',
        color: 'border-green-300 bg-green-50',
        icon: CheckCircle,
      },
    }
    return statusMap[status] || { label: 'Unknown', description: 'Order status unknown', color: 'border-gray-300 bg-gray-50', icon: Package }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-black"></div>
            </div>
            <p className="text-gray-600 mt-4 font-500">Loading your order...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-black mb-12 hover:opacity-60 transition-opacity font-600 text-sm uppercase tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="border-2 border-black p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-900 text-black mb-4 uppercase tracking-tight">Order Not Found</h1>
            <p className="text-gray-600 mb-8 text-sm">
              We couldn't find an order with code: <strong className="font-900">{code}</strong>
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-black text-white font-900 uppercase tracking-wide text-sm hover:opacity-80 transition-opacity"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link 
          href="/buyer/orders" 
          className="inline-flex items-center gap-2 text-black mb-12 hover:opacity-60 transition-opacity font-600 text-sm uppercase tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="border-2 border-black p-12 mb-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-xs uppercase tracking-widest font-700 mb-4">Order Code</p>
            <h1 className="text-5xl font-900 text-black font-mono mb-8 tracking-tight break-all">{order.code}</h1>
            
            <div className={`inline-flex items-center gap-3 px-6 py-3 border-2 ${statusInfo.color} font-900 uppercase text-sm tracking-wide`}>
              <StatusIcon className="w-5 h-5" />
              <span>{statusInfo.label}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-8 border-t-2 border-black">
            <div className="text-center">
              <p className="text-gray-600 text-xs uppercase tracking-widest font-700 mb-2">Amount</p>
              <p className="text-3xl font-900 text-black">{order.amount.toLocaleString()} L</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-xs uppercase tracking-widest font-700 mb-2">Payment Method</p>
              <p className="text-xl font-900 text-black">
                {order.paymentMethod === 'CASH' ? 'Cash on Delivery' : 'Card/PayPal'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-xs uppercase tracking-widest font-700 mb-2">Order Date</p>
              <p className="text-xl font-900 text-black">
                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="border-2 border-black p-8 mb-8">
          <h2 className="font-900 text-black text-lg mb-6 uppercase tracking-wide">📍 Delivery Address</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600 font-600">Name:</span>
              <span className="font-700 text-black">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600 font-600">Email:</span>
              <span className="font-700 text-black">{order.shippingInfo.email}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600 font-600">Phone:</span>
              <span className="font-700 text-black">{order.shippingInfo.phone}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600 font-600">Address:</span>
              <span className="font-700 text-black">{order.shippingInfo.address}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600 font-600">City:</span>
              <span className="font-700 text-black">{order.shippingInfo.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-600">Postal Code:</span>
              <span className="font-700 text-black">{order.shippingInfo.postalCode}</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="border-2 border-black p-8 mb-8">
          <h2 className="font-900 text-black text-lg mb-6 uppercase tracking-wide">📦 Items</h2>
          
          <div className="space-y-4">
            {order.products && order.products.map((product: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                <div>
                  <p className="font-700 text-black">{product.name}</p>
                  <p className="text-sm text-gray-600 font-600">Qty: {product.quantity}</p>
                </div>
                <span className="font-900 text-black text-lg">
                  {(product.price * product.quantity).toLocaleString()} L
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="border-2 border-black p-8 mb-8">
          <h2 className="font-900 text-black text-lg mb-8 uppercase tracking-wide">Order Status</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="w-0.5 h-16 bg-black mt-2"></div>
              </div>
              <div>
                <p className="font-900 text-black text-sm uppercase tracking-wide">Order Received</p>
                <p className="text-gray-600 text-sm mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  order.status === 'PENDING_CASH_PAYMENT' 
                    ? 'border-black bg-white' 
                    : 'bg-black'
                }`}>
                  {order.status !== 'PENDING_CASH_PAYMENT' && <CheckCircle className="w-6 h-6 text-white" />}
                </div>
                <div className="w-0.5 h-16 bg-black mt-2"></div>
              </div>
              <div>
                <p className="font-900 text-black text-sm uppercase tracking-wide">Payment Confirmed</p>
                <p className="text-gray-600 text-sm mt-1">
                  {order.status === 'PENDING_CASH_PAYMENT' 
                    ? 'Awaiting payment on delivery' 
                    : 'Payment received'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  ['SHIPPED', 'DELIVERED'].includes(order.status)
                    ? 'bg-black' 
                    : 'border-black bg-white'
                }`}>
                  {['SHIPPED', 'DELIVERED'].includes(order.status) && <Truck className="w-6 h-6 text-white" />}
                </div>
                <div className="w-0.5 h-16 bg-black mt-2"></div>
              </div>
              <div>
                <p className="font-900 text-black text-sm uppercase tracking-wide">In Transit</p>
                <p className="text-gray-600 text-sm mt-1">
                  {['SHIPPED', 'DELIVERED'].includes(order.status) 
                    ? 'Your order is on the way' 
                    : 'Preparing your order'}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  order.status === 'DELIVERED'
                    ? 'bg-black' 
                    : 'border-black bg-white'
                }`}>
                  {order.status === 'DELIVERED' && <CheckCircle className="w-6 h-6 text-white" />}
                </div>
              </div>
              <div>
                <p className="font-900 text-black text-sm uppercase tracking-wide">Delivered</p>
                <p className="text-gray-600 text-sm mt-1">
                  {order.status === 'DELIVERED' 
                    ? 'Order successfully delivered' 
                    : 'Awaiting delivery'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="border-2 border-black p-8 text-center bg-gray-50">
          <MessageCircle className="w-8 h-8 mx-auto mb-4 text-black" />
          <p className="font-900 text-black text-sm uppercase tracking-wide mb-3">Need Help?</p>
          <p className="text-gray-700 text-sm mb-6">
            Contact our support team for any questions about your order.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-black text-white font-900 uppercase tracking-wide text-sm hover:opacity-80 transition-opacity"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
