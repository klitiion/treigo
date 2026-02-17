'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BuyerLayout } from '@/components/layout/BuyerLayout'
import { ProtectedRoute } from '@/hooks/useAuth'
import { ShoppingBag, Package, Truck, CheckCircle, TrendingUp, AlertCircle, Trash2 } from 'lucide-react'

interface OrderStats {
  total: number
  pending: number
  shipped: number
  delivered: number
}

interface DashboardData {
  stats: OrderStats
  recentOrders: any[]
  totalSpent: number
}

export default function BuyerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="BUYER">
      <BuyerDashboard />
    </ProtectedRoute>
  )
}

function BuyerDashboard() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setData({
        stats: {
          total: 12,
          pending: 2,
          shipped: 3,
          delivered: 7,
        },
        recentOrders: [
          { id: '1', product: 'Nike Air Max', price: 45, status: 'delivered', date: '2024-02-01' },
          { id: '2', product: 'Louis Vuitton Bag', price: 120, status: 'shipped', date: '2024-02-02' },
          { id: '3', product: 'Gucci Sunglasses', price: 35, status: 'pending', date: '2024-02-03' },
        ],
        totalSpent: 890.50,
      })
      setLoading(false)
    }, 500)
  }, [])

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const userStr = localStorage.getItem('treigo_user')
      if (!userStr) {
        throw new Error('User data not found')
      }

      const user = JSON.parse(userStr)
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      setShowDeleteModal(false)
      setShowSuccessModal(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        localStorage.removeItem('treigo_user')
        router.push('/')
      }, 3000)
    } catch (error) {
      console.error('Delete account error:', error)
      alert('Dicka shkoi keq gjatë fshirjes së llogaris')
    } finally {
      setIsDeleting(false)
    }
  }

  const statItems = [
    {
      label: 'Total Orders',
      value: data?.stats.total || 0,
      icon: ShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Pending',
      value: data?.stats.pending || 0,
      icon: AlertCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Shipped',
      value: data?.stats.shipped || 0,
      icon: Truck,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Delivered',
      value: data?.stats.delivered || 0,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ]

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
            <h1 className="text-5xl lg:text-6xl font-900 text-black mb-4 uppercase tracking-tight">Dashboard</h1>
            <p className="text-gray-600 text-lg">
              Welcome back! Here's a summary of your activity
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {statItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="border-2 border-black p-6">
                  <Icon className="w-6 h-6 text-black mb-4" />
                  <p className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">{item.label}</p>
                  <p className="text-4xl font-900 text-black">{item.value}</p>
                </div>
              )
            })}
          </div>

          {/* Total Spent & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Total Spent */}
            <div className="lg:col-span-1">
              <div className="border-2 border-black p-8">
                <h3 className="font-bold uppercase tracking-wide text-black mb-4">Total Spent</h3>
                <p className="text-5xl font-900 text-black mb-3">
                  ${data?.totalSpent.toFixed(2) || 0}
                </p>
                <p className="text-gray-600 text-sm">across all orders</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="border-2 border-black p-8">
                <h3 className="text-2xl font-900 text-black mb-6 uppercase tracking-tight">Recent Orders</h3>
                <div className="space-y-4">
                  {data?.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border-b-2 border-gray-300 pb-4"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-black">{order.product}</p>
                        <p className="text-xs text-gray-600 mt-1">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">${order.price}</p>
                        <span
                          className={`text-xs font-bold uppercase tracking-wide mt-1 inline-block px-3 py-1 border-2 ${
                            order.status === 'delivered'
                              ? 'border-green-600 text-green-600'
                              : order.status === 'shipped'
                              ? 'border-blue-600 text-blue-600'
                              : 'border-orange-600 text-orange-600'
                          }`}
                        >
                          {order.status === 'delivered'
                            ? 'Delivered'
                            : order.status === 'shipped'
                            ? 'Shipped'
                            : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Delete Account Button */}
          <div className="mt-12">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 font-bold uppercase tracking-wide hover:bg-red-600 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-black mb-4">
              Delete Account?
            </h2>

            <p className="text-center text-gray-600 mb-4">
              This action cannot be undone. Your data will be retained for 30 days before being permanently deleted.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>⚠️ Note:</strong> After deletion, you cannot create a new account with the same data for 5 days.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete account permanently'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full py-3 bg-gray-100 text-black font-medium rounded-none hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-black mb-4">
              Your account has been successfully deleted! ✓
            </h2>

            <p className="text-gray-600 mb-4">
              Your account has been deleted. Your data will be retained for 30 days for security reasons.
            </p>

            <p className="text-sm text-gray-600">
              A confirmation email has been sent to your email address.
            </p>

            <p className="text-xs text-treigo-olive mt-4">
              Redirecting to home page...
            </p>
          </div>
        </div>
      )}
    </BuyerLayout>
  )
}
