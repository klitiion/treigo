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
      className={`product-card block bg-white border-2 border-black overflow-hidden hover:shadow-lg transition-all duration-300 relative group ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative bg-gray-100 ${
        viewMode === 'list' ? 'w-40 h-40 flex-shrink-0' : 'aspect-square'
      } overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30 group-hover:opacity-40 transition-opacity">
          📦
        </div>
        
        {/* Badges - Verified badge removed */}
        <div className="absolute top-3 left-3 flex flex-col gap-2"></div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
          title={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isWishlisted 
                ? 'fill-red-500 text-red-500' 
                : 'text-black hover:text-red-500'
            }`}
          />
        </button>
        
        <div className="absolute top-3 right-3 mt-10">
          <span className="px-3 py-2 bg-white border border-gray-300 text-black text-xs font-bold uppercase tracking-wider">
            {conditionLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
        <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">{brand}</p>
        <h3 className="font-bold text-black line-clamp-2 mb-3 uppercase tracking-wider text-sm">{title}</h3>
        {isClient && (
          <div className="flex items-baseline gap-2 flex-wrap mb-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-2xl font-bold text-black">{formatPrice(price)} L</span>
              <span className="text-sm font-semibold text-black">{formatCurrencyPrice(convertPrice(price))}</span>
            </div>
            {originalPrice && (
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-gray-500 line-through">{formatPrice(originalPrice)} L</span>
                <span className="text-xs text-gray-500 line-through">{formatCurrencyPrice(convertPrice(originalPrice))}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <Link 
            href={`/shop/${shop.slug}`}
            className="text-gray-600 uppercase tracking-wide font-semibold hover:text-black transition-colors"
          >
            by {shop.name}
          </Link>
          <p className="text-gray-600 uppercase tracking-wide font-semibold">{city}</p>
        </div>
      </div>
    </Link>
  )
}
