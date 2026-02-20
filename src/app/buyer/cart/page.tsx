'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, getTotalPrice, isClient } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isClient) {
    return <div className="min-h-screen bg-treigo-cream" />
  }

  const total = getTotalPrice()
  const shipping = total > 0 ? 500 : 0

  return (
    <div className="min-h-screen bg-white pb-24 sm:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-8 sm:mb-12 uppercase tracking-tight">YOUR CART</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 sm:py-20 px-4 animate-slideUp">
            <ShoppingBag className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-6" />
            <p className="text-base sm:text-lg text-gray-600 mb-8 uppercase text-xs sm:text-sm tracking-wide font-semibold">Your cart is empty</p>
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors text-xs sm:text-sm active:scale-95 min-h-[48px] rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white border-2 border-black p-4 sm:p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 animate-slideUp"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-black text-base sm:text-lg mb-2 uppercase tracking-wide line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-600 mb-3 sm:mb-4 uppercase tracking-wide font-semibold">{item.seller}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-black">
                        {(item.price * item.quantity).toLocaleString()} L
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-6 flex-shrink-0">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 sm:p-3 text-black hover:bg-black hover:text-white transition-all border-2 border-black rounded-lg active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-2 border-2 border-black rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 sm:p-3 text-black hover:bg-black hover:text-white transition-all border-r-2 border-black active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 sm:px-6 font-bold text-black w-12 text-center text-sm sm:text-base tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 sm:p-3 text-black hover:bg-black hover:text-white transition-all border-l-2 border-black active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Sticky on Mobile */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-black p-6 sm:p-8 rounded-lg sticky bottom-0 lg:relative lg:bottom-auto animate-slideUp">
                <h2 className="font-bold text-black mb-6 sm:mb-8 text-base sm:text-lg uppercase tracking-wide">ORDER SUMMARY</h2>

                <div className="space-y-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-black">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 uppercase tracking-wide font-semibold">Subtotal</span>
                    <span className="font-bold text-black">{total.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 uppercase tracking-wide font-semibold">Shipping</span>
                    <span className="font-bold text-black">{shipping.toLocaleString()} L</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6 sm:mb-8">
                  <span className="font-bold text-black uppercase tracking-wide text-xs sm:text-sm">Total</span>
                  <span className="text-2xl sm:text-3xl font-bold text-black tabular-nums">
                    {(total + shipping).toLocaleString()} L
                  </span>
                </div>

                <button
                  onClick={() => router.push('/shipping')}
                  className="w-full px-4 py-3 sm:py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-900 transition-all active:scale-95 mb-3 text-xs sm:text-sm rounded-lg min-h-[48px]"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/search"
                  className="block text-center px-4 py-3 sm:py-4 border-2 border-black text-black font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-all active:scale-95 text-xs sm:text-sm rounded-lg min-h-[48px] flex items-center justify-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
