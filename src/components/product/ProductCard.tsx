'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { useCurrency } from '@/context/CurrencyContext'

interface ProductCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number
  condition: string
  brand: string
  verified: boolean
  shop: { name: string; slug: string }
  city: string
  viewMode?: 'grid' | 'list'
  conditionLabel: string
}

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  condition,
  brand,
  verified,
  shop,
  city,
  viewMode = 'grid',
  conditionLabel,
}: ProductCardProps) {
  const { wishlist, toggleWishlist, mounted } = useWishlist()
  const { formatPrice: formatCurrencyPrice, convertPrice } = useCurrency()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const isWishlisted = mounted && isClient ? wishlist.some(item => item.id === id) : false

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    toggleWishlist({
      id,
      name: title,
      price,
      seller: shop.name,
    })
  }

  return (
    <Link 
      href={`/product/${id}`}
      className={`product-card block bg-white border-2 border-black overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative group rounded-lg ${
        viewMode === 'list' ? 'flex' : 'flex flex-col'
      }`}
    >
      {/* Image */}
      <div className={`relative bg-gray-100 flex-shrink-0 overflow-hidden group ${
        viewMode === 'list' ? 'w-32 sm:w-40 h-32 sm:h-40' : 'aspect-square'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl opacity-30 group-hover:opacity-40 transition-opacity">
          📦
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 p-2 bg-white/95 hover:bg-white rounded-lg transition-all opacity-0 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-md z-10"
          title={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            className={`w-5 h-5 transition-all ${
              isWishlisted 
                ? 'fill-red-500 text-red-500 animate-scalePop' 
                : 'text-black hover:text-red-500'
            }`}
          />
        </button>
        
        {/* Condition Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 sm:px-3 sm:py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm">
            {conditionLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-3 sm:p-4 flex-1 flex flex-col justify-between ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div>
          <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1 sm:mb-2 line-clamp-1">{brand}</p>
          <h3 className="font-bold text-black line-clamp-2 mb-2 sm:mb-3 uppercase tracking-wide text-xs sm:text-sm">{title}</h3>
        </div>

        {isClient && (
          <div className="mb-2 sm:mb-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-black tabular-nums">{formatPrice(price)} L</span>
              {originalPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">{formatPrice(originalPrice)} L</span>
              )}
            </div>
            {isClient && (
              <p className="text-xs text-gray-500 mt-1">{formatCurrencyPrice(convertPrice(price))}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs gap-2">
          <Link 
            href={`/shop/${shop.slug}`}
            className="text-gray-600 uppercase tracking-wide font-semibold hover:text-black transition-colors line-clamp-1"
            onClick={(e) => e.stopPropagation()}
          >
            {shop.name}
          </Link>
          <p className="text-gray-600 uppercase tracking-wide font-semibold whitespace-nowrap">{city}</p>
        </div>
      </div>
    </Link>
  )
}
