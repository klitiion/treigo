'use client'

import { useState, useEffect } from 'react'
import { BuyerLayout } from '@/components/layout/BuyerLayout'
import { CouponCard } from '@/components/buyer/CouponCard'
import { ProtectedRoute } from '@/hooks/useAuth'
import { Ticket, AlertCircle, CheckCircle } from 'lucide-react'

interface Coupon {
  code: string
  discount: number
  description: string
  expiryDate: string
  isUsed: boolean
}

export default function CouponsPage() {
  return (
    <ProtectedRoute requiredRole="BUYER">
      <CouponsList />
    </ProtectedRoute>
  )
}

function CouponsList() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [tab, setTab] = useState<'active' | 'used'>('active')

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setCoupons([
        {
          code: 'MIRESEVJEN5',
          discount: 5,
          description: 'Welcome discount on first purchase',
          expiryDate: '2025-02-04',
          isUsed: false,
        },
        {
          code: 'SUMMER2024',
          discount: 15,
          description: 'Summer Discount - up to 15% off',
          expiryDate: '2024-08-31',
          isUsed: false,
        },
        {
          code: 'FREESHIP',
          discount: 100,
          description: 'Free shipping on orders over $50',
          expiryDate: '2024-03-15',
          isUsed: false,
        },
        {
          code: 'WELCOME10',
          discount: 10,
          description: 'Welcome - 10% discount',
          expiryDate: '2024-01-31',
          isUsed: true,
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setMessage({
      type: 'success',
      text: `"${code}" copied to clipboard!`,
    })
    setTimeout(() => setMessage(null), 3000)
  }

  const activeCoupons = coupons.filter((c) => !c.isUsed)
  const usedCoupons = coupons.filter((c) => c.isUsed)

  const displayCoupons = tab === 'active' ? activeCoupons : usedCoupons

  return (
    <BuyerLayout>
      <div className="py-12 lg:py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl lg:text-6xl font-900 text-black mb-3 uppercase tracking-tight">Coupons</h1>
          <p className="text-gray-600 text-lg">
            View and manage your discount coupons
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-8 p-4 border-2 flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-white border-black text-black'
                : 'bg-white border-black text-black'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-black" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-black" />
            )}
            <p className="font-bold uppercase tracking-wide">{message.text}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-12 flex gap-6 border-b-2 border-gray-300 pb-4">
          <button
            onClick={() => setTab('active')}
            className={`font-bold uppercase tracking-wide text-sm pb-2 border-b-2 transition-colors ${
              tab === 'active'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            Active ({activeCoupons.length})
          </button>
          <button
            onClick={() => setTab('used')}
            className={`font-bold uppercase tracking-wide text-sm pb-2 border-b-2 transition-colors ${
              tab === 'used'
                ? 'border-black text-black'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            Used ({usedCoupons.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        ) : displayCoupons.length === 0 ? (
          <div className="border-2 border-black p-16 text-center">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <p className="text-black font-bold uppercase tracking-wide mb-3">
              {tab === 'active' ? 'No Active Coupons' : 'No Used Coupons'}
            </p>
            <p className="text-gray-600 text-sm">
              {tab === 'active'
                ? 'When you earn new coupons, they will appear here'
                : 'Used coupons will appear here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayCoupons.map((coupon) => (
              <CouponCard
                key={coupon.code}
                code={coupon.code}
                discount={coupon.discount}
                description={coupon.description}
                expiryDate={coupon.expiryDate}
                isUsed={coupon.isUsed}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )}

        {/* Info Box */}
        {tab === 'active' && activeCoupons.length > 0 && (
          <div className="mt-12 p-8 border-2 border-black">
            <h3 className="font-bold uppercase tracking-wide text-black mb-4">How to use coupons</h3>
            <ol className="text-black text-sm space-y-3 list-decimal list-inside">
              <li>Copy the coupon code by clicking the copy icon</li>
              <li>Add products to your cart</li>
              <li>At checkout, paste the code in the "Coupon Code" field</li>
              <li>The discount will be applied automatically to your order total</li>
            </ol>
          </div>
        )}
      </div>
    </BuyerLayout>
  )
}
