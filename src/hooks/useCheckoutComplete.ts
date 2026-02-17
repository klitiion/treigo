'use client'

import { useEffect, useState } from 'react'
import { useCart } from './useCart'
import { useAuth } from './useAuth'

export function useCheckoutComplete() {
  const [orderCode, setOrderCode] = useState<string | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const { cart } = useCart()
  const { user } = useAuth()

  const completeCheckout = async () => {
    try {
      setIsCompleting(true)

      // Get shipping info from localStorage
      const shippingInfo = localStorage.getItem('shipping_info')
      if (!shippingInfo) {
        throw new Error('Shipping info not found')
      }

      const shipping = JSON.parse(shippingInfo)

      // Get user or guest buyer ID
      const buyerId = user?.id || `guest-${Date.now()}`

      // Get cart total
      let subtotal = 0
      const items = cart.map(item => {
        subtotal += item.price * item.quantity
        return {
          productId: item.id,
          sellerId: item.sellerId || 'unknown',
          quantity: item.quantity,
          price: item.price,
        }
      })

      if (items.length === 0) {
        throw new Error('Cart is empty')
      }

      const shippingCost = 500
      const total = subtotal + shippingCost

      // Call checkout completion endpoint
      const response = await fetch('/api/checkout/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId,
          items,
          shippingInfo: shipping,
          subtotal,
          shippingCost,
          total,
          paymentStatus: 'COMPLETED',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOrderCode(data.order.orderCode)
        // Clear cart and shipping info
        localStorage.removeItem('treigo-cart')
        localStorage.removeItem('shipping_info')
        return data.order
      } else {
        throw new Error(data.error || 'Failed to complete checkout')
      }
    } catch (error) {
      console.error('Error completing checkout:', error)
      throw error
    } finally {
      setIsCompleting(false)
    }
  }

  return {
    completeCheckout,
    orderCode,
    isCompleting,
  }
}
