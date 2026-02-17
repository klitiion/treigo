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
    <div className="min-h-screen bg-white py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-black mb-12 uppercase tracking-tight">YOUR CART</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <p className="text-lg text-gray-600 mb-8 uppercase text-sm tracking-wide font-semibold">Your cart is empty</p>
            <Link
              href="/search"
              className="inline-block px-8 py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors text-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map(item => (
                <div key={item.id} className="bg-white border-2 border-black p-6 flex gap-6">
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-black text-lg mb-2 uppercase tracking-wide">{item.name}</h3>
                    <p className="text-xs text-gray-600 mb-4 uppercase tracking-wide font-semibold">{item.seller}</p>
                    <p className="text-3xl font-bold text-black">
                      {(item.price * item.quantity).toLocaleString()} L
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-6">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-black hover:bg-black hover:text-white transition-colors border border-black"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 border border-black">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-3 text-black hover:bg-black hover:text-white transition-colors border-r border-black"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-6 font-bold text-black w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-3 text-black hover:bg-black hover:text-white transition-colors border-l border-black"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white border-2 border-black p-8 h-fit">
              <h2 className="font-bold text-black mb-8 text-lg uppercase tracking-wide">ORDER SUMMARY</h2>

              <div className="space-y-4 mb-8 pb-8 border-b-2 border-black">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 uppercase tracking-wide font-semibold">Subtotal</span>
                  <span className="font-bold text-black">{total.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 uppercase tracking-wide font-semibold">Shipping</span>
                  <span className="font-bold text-black">{shipping.toLocaleString()} L</span>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <span className="font-bold text-black uppercase tracking-wide text-sm">Total</span>
                <span className="text-3xl font-bold text-black">
                  {(total + shipping).toLocaleString()} L
                </span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full px-4 py-4 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors mb-3 text-sm"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/search"
                className="block text-center px-4 py-4 border-2 border-black text-black font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
