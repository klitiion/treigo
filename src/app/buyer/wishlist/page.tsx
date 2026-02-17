'use client'

import { useWishlist } from '@/hooks/useWishlist'
import { BuyerLayout } from '@/components/layout/BuyerLayout'
import { useAuth } from '@/hooks/useAuth'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, mounted } = useWishlist()
  const { user, loading } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !mounted || loading) {
    return (
      <BuyerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-treigo-sage/20 animate-pulse mx-auto mb-4"></div>
          </div>
        </div>
      </BuyerLayout>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-black mb-4">You need to sign in to view your wishlist</p>
          <Link href="/auth/login" className="px-6 py-4 bg-black text-white font-bold uppercase text-sm tracking-wide border-2 border-black hover:bg-gray-900 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <BuyerLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-black mb-2 flex items-center gap-3 uppercase tracking-wider">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            Wishlist
          </h1>
          <p className="text-gray-700 text-sm uppercase tracking-wider font-semibold">
            {wishlist.length === 0 ? 'Your wishlist is currently empty' : `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 px-8 bg-white border-2 border-black">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-black mb-3 uppercase tracking-wider">NO ITEMS SAVED</h2>
            <p className="text-gray-700 mb-8 max-w-md mx-auto">Browse our collection and add items to your wishlist to save them for later</p>
            <Link 
              href="/search" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold uppercase tracking-wide border-2 border-black hover:bg-gray-900 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              BROWSE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div 
                key={product.id}
                className="stagger-item bg-white border-2 border-black overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden group">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-black mb-2 line-clamp-2 uppercase tracking-wider text-sm">
                    {product.name}
                  </h3>
                  
                  {product.seller && (
                    <p className="text-xs text-gray-700 mb-4 uppercase tracking-wide font-semibold">
                      {product.seller}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <p className="text-2xl font-bold text-black">
                      {isClient ? formatPrice(product.price) : product.price} L
                    </p>
                  </div>

                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white border-2 border-black text-black font-bold uppercase text-xs tracking-wide hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove from wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BuyerLayout>
  )
}
