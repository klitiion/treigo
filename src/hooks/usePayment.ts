'use client'

import { useState } from 'react'

interface PaymentOrder {
  id: string
  amount: number
  currencyCode: string
  confirmUrl: string
  confirmDeeplink?: string
}

interface CreateOrderParams {
  amount: number
  description?: string
  products?: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingCost?: number
  verificationFee?: number
  verifyProduct?: boolean
  redirectUrl?: string
  failRedirectUrl?: string
}

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (params: CreateOrderParams): Promise<PaymentOrder | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment order')
      }

      const order = data.order
      return {
        id: order.id,
        amount: order.finalAmount || order.amount,
        currencyCode: order.currencyCode,
        confirmUrl: order._self?.confirmUrl || '',
        confirmDeeplink: order._self?.confirmDeeplink,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Payment error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const redirectToPayment = (confirmUrl: string) => {
    if (confirmUrl) {
      window.location.href = confirmUrl
    }
  }

  return {
    createOrder,
    redirectToPayment,
    isLoading,
    error,
  }
}
