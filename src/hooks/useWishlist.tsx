'use client'

import { useState, useEffect } from 'react'

export interface WishlistProduct {
  id: string
  name: string
  price: number
  image?: string
  seller?: string
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([])
  const [mounted, setMounted] = useState(false)

  // Initialize wishlist from localStorage
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('treigo_wishlist')
    if (stored) {
      try {
        setWishlist(JSON.parse(stored))
      } catch {
        localStorage.removeItem('treigo_wishlist')
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('treigo_wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist, mounted])

  const addToWishlist = (product: WishlistProduct) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) return prev
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId))
  }

  const toggleWishlist = (product: WishlistProduct) => {
    const exists = wishlist.find(item => item.id === product.id)
    if (exists) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.id === productId)
  }

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    mounted,
  }
}
