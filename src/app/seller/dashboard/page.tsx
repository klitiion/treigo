'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Package, Plus, TrendingUp, Eye, ShoppingBag, 
  Star, BadgeCheck, AlertCircle, ChevronRight,
  Clock, CheckCircle, XCircle, Trash2
} from 'lucide-react'

// Mock data
const mockStats = {
  totalProducts: 12,
  activeProducts: 8,
  pendingVerification: 2,
  totalViews: 1234,
  totalSales: 47,
  totalRevenue: 425000,
  rating: 4.9,
  reviewCount: 38,
}

const mockProducts = [
  {
    id: '1',
    title: 'Louis Vuitton Neverfull MM',
    price: 85000,
    status: 'ACTIVE',
    verificationLevel: 'LEVEL_2',
    views: 234,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Gucci GG Marmont Belt',
    price: 25000,
    status: 'PENDING_REVIEW',
    verificationLevel: 'PENDING',
    views: 56,
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Prada Saffiano Bag',
    price: 95000,
    status: 'ACTIVE',
    verificationLevel: 'LEVEL_2',
    views: 189,
    createdAt: '2024-01-10',
  },
]

const mockOrders = [
  {
    id: 'ORD-001',
    product: 'Nike Air Jordan 1',
    buyer: 'Andi M.',
    total: 18500,
    status: 'DELIVERED',
    date: '2024-01-18',
  },
  {
    id: 'ORD-002',
    product: 'Dior Sauvage 100ml',
    buyer: 'Lira K.',
    total: 9500,
    status: 'SHIPPED',
    date: '2024-01-22',
  },
]

export default function SellerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; id?: string; email?: string; firstName?: string; lastName?: string; phone?: string } | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('treigo_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      if (!user) {
        throw new Error('User data not found')
      }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-black text-xs font-semibold border border-black uppercase tracking-wide"><CheckCircle className="w-3 h-3" /> ACTIVE</span>
      case 'PENDING_REVIEW':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-black text-xs font-semibold border border-black uppercase tracking-wide"><Clock className="w-3 h-3" /> PENDING</span>
      case 'SOLD':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-black text-xs font-semibold border border-black uppercase tracking-wide"><ShoppingBag className="w-3 h-3" /> SOLD</span>
      case 'REMOVED':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-black text-xs font-semibold border border-black uppercase tracking-wide"><XCircle className="w-3 h-3" /> REMOVED</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-black text-xs font-semibold border border-black uppercase tracking-wide">{status}</span>
    }
  }

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case 'LEVEL_1':
        return <span className="text-xs text-black font-semibold uppercase tracking-wide">LEVEL 1</span>
      case 'LEVEL_2':
        return <span className="inline-flex items-center gap-1 text-xs text-black font-semibold uppercase tracking-wide"><BadgeCheck className="w-3 h-3" /> LEVEL 2</span>
      case 'LEVEL_3':
        return <span className="inline-flex items-center gap-1 text-xs text-black font-semibold uppercase tracking-wide"><BadgeCheck className="w-3 h-3" /> LEVEL 3</span>
      case 'PENDING':
        return <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">VERIFYING</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-12 bg-white">
      <div className="container-treigo">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-black uppercase tracking-tight">
              WELCOME, {(user?.name || 'SELLER').toUpperCase()}
            </h1>
            <p className="text-gray-600 text-sm">Manage your shop and products</p>
          </div>
          <Link
            href="/seller/products/new"
            className="inline-flex items-center gap-2 px-6 py-4 bg-black text-white font-semibold uppercase tracking-wide text-sm hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            ADD PRODUCT
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-black" />
              <span className="text-xs text-gray-600 uppercase tracking-wide font-semibold">PRODUCTS</span>
            </div>
            <p className="text-3xl font-bold text-black mb-2">{mockStats.totalProducts}</p>
            <p className="text-sm text-gray-600">{mockStats.activeProducts} active</p>
          </div>

          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-8 h-8 text-black" />
              <span className="text-xs text-gray-600 uppercase tracking-wide font-semibold">VIEWS</span>
            </div>
            <p className="text-3xl font-bold text-black mb-2">{mockStats.totalViews.toLocaleString()}</p>
            <p className="text-sm text-green-600 font-semibold">+12% THIS WEEK</p>
          </div>

          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center justify-between mb-4">
              <ShoppingBag className="w-8 h-8 text-black" />
              <span className="text-xs text-gray-600 uppercase tracking-wide font-semibold">SALES</span>
            </div>
            <p className="text-3xl font-bold text-black mb-2">{mockStats.totalSales}</p>
            <p className="text-sm text-gray-600">{mockStats.totalRevenue.toLocaleString()}L revenue</p>
          </div>

          <div className="bg-white border-2 border-black p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-black" />
              <span className="text-xs text-gray-600 uppercase tracking-wide font-semibold">RATING</span>
            </div>
            <p className="text-3xl font-bold text-black mb-2">{mockStats.rating}</p>
            <p className="text-sm text-gray-600">{mockStats.reviewCount} reviews</p>
          </div>
        </div>

        {/* Pending Verification Alert */}
        {mockStats.pendingVerification > 0 && (
          <div className="bg-yellow-50 border-l-4 border-black p-6 mb-12 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-black flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-black uppercase text-sm tracking-wide">
                {mockStats.pendingVerification} PRODUCTS PENDING VERIFICATION
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Verification typically takes 24-48 hours. You'll receive an email when complete.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-black overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b-2 border-black">
                <h2 className="font-semibold text-black uppercase text-sm tracking-wide">MY PRODUCTS</h2>
                <Link href="/seller/products" className="text-black hover:opacity-70 text-sm font-semibold flex items-center gap-1 uppercase tracking-wide">
                  VIEW ALL <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y divide-black">
                {mockProducts.map((product) => (
                  <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-6">
                      {/* Image placeholder */}
                      <div className="w-20 h-20 bg-gray-200 border-2 border-black flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl opacity-40">📦</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-black truncate text-sm">{product.title}</h3>
                          {getVerificationBadge(product.verificationLevel)}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-bold text-black">{product.price.toLocaleString()}L</span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-600">{product.views} views</span>
                        </div>
                      </div>

                      <div className="text-right">
                        {getStatusBadge(product.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Orders */}
            <div className="bg-white border-2 border-black">
              <div className="flex items-center justify-between p-6 border-b-2 border-black">
                <h2 className="font-semibold text-black uppercase text-sm tracking-wide">RECENT ORDERS</h2>
                <Link href="/seller/orders" className="text-black hover:opacity-70 text-sm font-semibold">
                  VIEW ALL
                </Link>
              </div>

              <div className="divide-y divide-black">
                {mockOrders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-black">{order.product}</span>
                      <span className="text-sm font-bold text-black">{order.total.toLocaleString()}L</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{order.buyer}</span>
                      <span className={`px-3 py-1 border text-xs font-semibold uppercase tracking-wide ${
                        order.status === 'DELIVERED' 
                          ? 'bg-white text-black border-black'
                          : 'bg-yellow-50 text-black border-black'
                      }`}>
                        {order.status === 'DELIVERED' ? 'DELIVERED' : 'SHIPPED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white border-2 border-black p-6">
              <h2 className="font-semibold text-black mb-4 uppercase text-sm tracking-wide">QUICK ACTIONS</h2>
              <div className="space-y-3">
                <Link
                  href="/seller/products/new"
                  className="flex items-center gap-3 p-3 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-all uppercase text-xs tracking-wide"
                >
                  <Plus className="w-5 h-5" />
                  ADD PRODUCT
                </Link>
                <Link
                  href="/seller/products"
                  className="flex items-center gap-3 p-3 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-all uppercase text-xs tracking-wide"
                >
                  <Package className="w-5 h-5" />
                  MANAGE PRODUCTS
                </Link>
                <Link
                  href="/seller/shop"
                  className="flex items-center gap-3 p-3 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-all uppercase text-xs tracking-wide"
                >
                  <TrendingUp className="w-5 h-5" />
                  EDIT SHOP
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center gap-3 p-3 border-2 border-red-600 text-red-600 font-semibold hover:bg-red-600 hover:text-white transition-all uppercase text-xs tracking-wide"
                >
                  <Trash2 className="w-5 h-5" />
                  DELETE ACCOUNT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black p-8 max-w-md w-full">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-50 border-2 border-black flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-black mb-4 uppercase tracking-tight">
              DELETE ACCOUNT?
            </h2>

            <p className="text-center text-gray-700 mb-6">
              This action cannot be undone. Your data will be stored for 30 days before being permanently deleted.
            </p>

            <div className="bg-yellow-50 border-l-4 border-black p-4 mb-6">
              <p className="text-black text-sm font-semibold">
                ⚠️ NOTE: After deletion, you cannot create a new account with the same details for 5 days.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full py-3 bg-red-600 text-white font-semibold uppercase tracking-wide text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-red-600"
              >
                {isDeleting ? 'DELETING...' : 'DELETE PERMANENTLY'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full py-3 bg-white text-black font-semibold uppercase tracking-wide text-sm hover:bg-black hover:text-white disabled:opacity-50 transition-colors border-2 border-black"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-50 border-2 border-black flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>

            <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">
              ACCOUNT DELETED
            </h2>

            <p className="text-gray-700 mb-4 text-sm">
              Your account has been deleted. Your data will be stored for 30 days for security purposes.
            </p>

            <p className="text-sm text-gray-600 mb-4">
              A confirmation email has been sent to your email address.
            </p>

            <p className="text-xs text-gray-500">
              Redirecting to homepage...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
