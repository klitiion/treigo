'use client'

import { useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  seller: string
  sellerId?: string
  image?: string
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsClient(true)
    const savedCart = localStorage.getItem('treigo-cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart:', e)
        setCart([])
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('treigo-cart', JSON.stringify(cart))
    }
  }, [cart, isClient])

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id)
      if (existingItem) {
        return prevCart.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        )
      }
      return [...prevCart, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(i => i.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prevCart =>
      prevCart.map(i => (i.id === itemId ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getCartCount,
    isClient,
  }
}
