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
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <Heart className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-6" />
          <p className="text-black mb-4 text-base sm:text-lg">Sign in to view your wishlist</p>
          <Link 
            href="/auth/login" 
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-bold uppercase text-xs sm:text-sm tracking-wide border-2 border-black hover:bg-gray-900 transition-colors active:scale-95 min-h-[48px] rounded-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <BuyerLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2 flex items-center gap-3 uppercase tracking-tight sm:tracking-wider">
            <Heart className="w-7 sm:w-8 h-7 sm:h-8 text-red-500 fill-red-500" />
            Wishlist
          </h1>
          <p className="text-gray-700 text-xs sm:text-sm uppercase tracking-wider font-semibold">
            {wishlist.length === 0 
              ? 'Your wishlist is currently empty' 
              : `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved`
            }
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 sm:py-20 px-4 sm:px-8 bg-white border-2 border-black rounded-lg animate-slideUp">
            <Heart className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 uppercase tracking-wider">NO ITEMS SAVED</h2>
            <p className="text-gray-700 mb-8 max-w-md mx-auto text-sm sm:text-base">Browse our collection and save items for later</p>
            <Link 
              href="/search" 
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-bold uppercase text-xs sm:text-sm tracking-wide rounded-lg hover:bg-gray-900 transition-all active:scale-95 min-h-[48px]"
            >
              <ShoppingBag className="w-5 h-5" />
              BROWSE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {wishlist.map((product) => (
              <div 
                key={product.id}
                className="stagger-item bg-white border-2 border-black overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-lg flex flex-col"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden group flex-shrink-0">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 sm:w-12 h-8 sm:h-12 text-gray-300" />
                    </div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-black mb-2 line-clamp-2 uppercase tracking-wide text-xs sm:text-sm">
                    {product.name}
                  </h3>
                  
                  {product.seller && (
                    <p className="text-xs text-gray-600 mb-3 sm:mb-4 uppercase tracking-wide font-semibold line-clamp-1">
                      {product.seller}
                    </p>
                  )}
                  
                  <p className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6 mt-auto">
                    {isClient ? formatPrice(product.price) : product.price} L
                  </p>

                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-black text-black font-bold uppercase text-xs tracking-wide hover:bg-black hover:text-white transition-all duration-200 active:scale-95 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
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
