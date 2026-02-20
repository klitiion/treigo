'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, Heart, Share2, MapPin, 
  MessageCircle, ShoppingBag, CreditCard, Truck,
  Shield, Clock, ChevronLeft, ChevronRight, Star, Check, CheckCircle
} from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { useCurrency } from '@/context/CurrencyContext'

// Mock product data
const mockProduct = {
  id: '1',
  title: 'Louis Vuitton Neverfull MM Damier Ebene',
  description: `Used bag in very good condition. Purchased from the official Louis Vuitton boutique in Milan in 2022.

Includes:
- Original bag
- Dust bag
- Receipt (original invoice)

Details:
- Material: Damier Ebene canvas with natural leather
- Dimensions: 31 x 28 x 14 cm
- Large capacity, perfect for everyday use

Used rarely, no scratches or damage. Only a small stain inside (see photo).`,
  price: 85000,
  originalPrice: 120000,
  condition: 'LIKE_NEW',
  conditionLabel: 'Like New',
  category: 'bags',
  brand: 'Louis Vuitton',
  model: 'Neverfull MM',
  sku: 'M40995',
  verified: true,
  verificationLevel: 'LEVEL_2',
  defects: 'Small stain inside',
  purchaseYear: '2022',
  purchasePlace: 'Louis Vuitton Milano',
  images: [
    '/images/product-1.jpg',
    '/images/product-2.jpg',
    '/images/product-3.jpg',
    '/images/product-4.jpg',
    '/images/product-5.jpg',
  ],
  shop: {
    id: 'shop1',
    name: 'LuxuryFinds',
    slug: 'luxuryfinds',
    isVerified: true,
    totalSales: 47,
    rating: 4.9,
    reviewCount: 38,
  },
  seller: {
    firstName: 'Ana',
    city: 'Tirana',
    memberSince: 'January 2023',
  },
  createdAt: '2024-01-15',
  viewCount: 234,
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { formatPrice, convertPrice } = useCurrency()
  const [isFavorite, setIsFavorite] = useState(false)
  
  const product = mockProduct

  useEffect(() => {
    setIsClient(true)
    setIsFavorite(isInWishlist(product.id))
  }, [])

  const handleFavoriteClick = () => {
    toggleWishlist({
      id: product.id,
      name: product.title,
      price: product.price,
      seller: product.shop.name,
    })
    setIsFavorite(!isFavorite)
  }

  const handleCardPayment = () => {
    router.push(`/checkout?product=${product.id}&price=${product.price}`)
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      seller: product.shop.name,
      sellerId: product.shop.id,
      quantity: 1,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)
  }

  const handleWhatsAppContact = () => {
    const price = product.price.toLocaleString()
    const title = product.title
    const link = window.location.href
    const msg = `Hello! I'm interested in: ${title} (${price} L)\n\nLink: ${link}`
    const message = encodeURIComponent(msg)
    window.open(`https://wa.me/355692084763?text=${message}`, '_blank')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        text: `${product.brand} - ${product.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied!')
    }
  }

  const handleContactSeller = () => {
    router.push(`/buyer/inbox?sellerId=${product.shop.id}&sellerName=${encodeURIComponent(product.shop.name)}`)
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-8 sm:mb-12 uppercase tracking-wide font-semibold overflow-x-auto pb-2">
          <Link href="/" className="text-gray-700 hover:underline whitespace-nowrap">
            HOME
          </Link>
          <span className="text-gray-400 flex-shrink-0">/</span>
          <Link href={`/search?category=${product.category}`} className="text-gray-700 hover:underline whitespace-nowrap">
            {product.category === 'bags' ? 'BAGS' : product.category.toUpperCase()}
          </Link>
          <span className="text-gray-400 flex-shrink-0">/</span>
          <span className="text-gray-600 truncate max-w-[200px] sm:max-w-[300px]">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="space-y-4 order-2 lg:order-1">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 border-2 border-black overflow-hidden rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-8xl opacity-10">
                📦
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black text-white hover:bg-gray-900 transition-all active:scale-95 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black text-white hover:bg-gray-900 transition-all active:scale-95 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Badges */}
              {product.verified && (
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white text-xs font-semibold uppercase tracking-wide rounded-lg">
                    <CheckCircle className="w-4 h-4" /> 
                    <span className="hidden sm:inline">VERIFIED</span>
                  </span>
                </div>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-2 bg-black/90 text-white text-xs font-semibold uppercase tracking-wide rounded-lg">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 border-2 overflow-hidden transition-all rounded-lg ${
                    currentImageIndex === index
                      ? 'border-black'
                      : 'border-gray-300 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-lg opacity-30">📦</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="order-1 lg:order-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-gray-200">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">{product.brand}</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-1 uppercase tracking-tight line-clamp-3">{product.title}</h1>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8 border-b-2 border-black pb-8 flex-wrap">
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-bold text-black">{product.price.toLocaleString()} L</span>
                <span className="text-2xl font-semibold text-gray-700">{formatPrice(convertPrice(product.price))}</span>
              </div>
              {product.originalPrice && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-xl text-gray-600 line-through">{product.originalPrice.toLocaleString()} L</span>
                    <span className="text-lg text-gray-500 line-through">{formatPrice(convertPrice(product.originalPrice))}</span>
                  </div>
                  <span className="px-3 py-1.5 bg-black text-white text-xs font-semibold uppercase tracking-wide h-fit">
                    SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Condition & Verification */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-4 py-2 border-2 border-black text-black text-xs font-semibold uppercase tracking-wide">
                {product.conditionLabel}
              </span>
              {product.verified && (
                <span className="px-4 py-2 border-2 border-black text-black text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> VERIFIED
                </span>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 pb-4 border-b border-gray-300">
                <MapPin className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">LOCATION</p>
                  <p className="font-semibold text-black">{product.seller.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b border-gray-300">
                <Clock className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">PURCHASED</p>
                  <p className="font-semibold text-black">{product.purchaseYear}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleContactSeller}
                className="w-full py-4 border-2 border-black text-black font-semibold uppercase text-sm tracking-wide hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                MESSAGE SELLER
              </button>

              <button
                onClick={handleWhatsAppContact}
                className="w-full py-4 bg-black text-white font-semibold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                CONTACT VIA WHATSAPP
              </button>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 font-semibold uppercase text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                  addedToCart
                    ? 'bg-black text-white'
                    : 'bg-white border-2 border-black text-black hover:bg-black hover:text-white'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    ADDED TO BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    ADD TO BAG
                  </>
                )}
              </button>
              
              <button
                onClick={handleCardPayment}
                className="w-full py-4 bg-black text-white font-semibold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                BUY NOW
              </button>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-2 gap-3 p-6 bg-white border-2 border-black">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-black font-bold uppercase text-xs tracking-wider">BUYER</p>
                  <p className="text-black font-bold uppercase text-xs tracking-wider">PROTECTION</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-black font-bold uppercase text-xs tracking-wider">SECURE</p>
                  <p className="text-black font-bold uppercase text-xs tracking-wider">SHIPPING</p>
                </div>
              </div>
            </div>

            {/* Secure Payment Section */}
            <div className="grid grid-cols-2 gap-0 mt-3 border-2 border-black bg-white">
              <div className="flex items-center gap-3 p-6 border-r border-black">
                <CreditCard className="w-5 h-5 text-black" />
                <span className="text-black font-bold uppercase text-xs tracking-wider">CARD PAYMENT</span>
              </div>
              <div className="flex items-center gap-3 p-6">
                <Shield className="w-5 h-5 text-black" />
                <span className="text-black font-bold uppercase text-xs tracking-wider">3D SECURE</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="mt-8 p-6 bg-white border-2 border-black">
              <div className="flex items-center gap-4 mb-6">
                <Link href={`/shop/${product.shop.slug}`} className="flex items-center gap-4 group flex-1">
                  <div className="w-16 h-16 bg-black flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {product.shop.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-black uppercase tracking-wider text-sm">
                      {product.shop.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-black fill-black" />
                        <span className="font-bold text-xs uppercase tracking-wide text-black">{product.shop.rating}</span>
                      </div>
                      <span className="text-xs text-gray-600 uppercase tracking-wide">({product.shop.reviewCount} reviews)</span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs text-gray-600 uppercase tracking-wide">{product.shop.totalSales} sales</span>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="bg-white border-t-2 border-black pt-4">
                <p className="text-xs text-black uppercase tracking-wider font-bold mb-2">CONTACT SELLER</p>
                <p className="text-sm text-gray-700">For more information, contact the seller through the platform.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-wider">DESCRIPTION</h2>
          <div className="p-6 bg-white border-2 border-black mb-8">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wider">PRODUCT DETAILS</h3>
            <div className="bg-white border-2 border-black">
              <div className="grid grid-cols-2 gap-0">
                <div className="flex justify-between items-center py-4 px-6 border-b border-r border-black">
                  <span className="text-xs text-gray-700 uppercase tracking-wider font-bold">Brand</span>
                  <span className="font-bold text-black">{product.brand}</span>
                </div>
                <div className="flex justify-between items-center py-4 px-6 border-b border-black">
                  <span className="text-xs text-gray-700 uppercase tracking-wider font-bold">Model</span>
                  <span className="font-bold text-black">{product.model}</span>
                </div>
                <div className="flex justify-between items-center py-4 px-6 border-b border-r border-black">
                  <span className="text-xs text-gray-700 uppercase tracking-wider font-bold">SKU</span>
                  <span className="font-mono font-bold text-black text-sm">{product.sku}</span>
                </div>
                <div className="flex justify-between items-center py-4 px-6 border-b border-black">
                  <span className="text-xs text-gray-700 uppercase tracking-wider font-bold">Condition</span>
                  <span className="font-bold text-black">{product.conditionLabel}</span>
                </div>
                <div className="flex justify-between items-center py-4 px-6 border-b border-r border-black">
                  <span className="text-xs text-gray-700 uppercase tracking-wider font-bold">Purchased</span>
                  <span className="font-bold text-black">{product.purchasePlace}</span>
                </div>
                <div className="flex justify-between items-center py-4 px-6 border-b border-black">
                  <span className="text-xs text-gray-700 uppercase tracking-wider font-bold">Year</span>
                  <span className="font-bold text-black">{product.purchaseYear}</span>
                </div>
                {product.defects && (
                  <div className="col-span-2 flex justify-between items-center py-4 px-6 border-t border-black">
                    <span className="text-xs text-gray-700 uppercase tracking-wider font-bold">Defects</span>
                    <span className="font-bold text-red-600">{product.defects}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-black mb-8 uppercase tracking-wider">REVIEWS (0)</h2>
            
            {/* Reviews List */}
            <div className="bg-white border-2 border-black p-12 text-center mb-8">
              <p className="text-gray-700 mb-2 text-sm">No reviews posted for this product yet.</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Be the first to share your thoughts!</p>
            </div>

            {/* Review Form */}
            <div className="bg-white border-2 border-black p-8">
              <h3 className="font-bold text-black mb-6 uppercase tracking-wider text-sm">POST A REVIEW</h3>
              
              <div className="bg-gray-50 border-2 border-black p-6 mb-6">
                <p className="text-xs text-gray-700 uppercase tracking-wider font-bold">Sign in required</p>
                <p className="text-sm text-gray-700 mt-1">You must be logged in to post a review.</p>
              </div>

              <button
                onClick={() => router.push('/auth/login')}
                className="w-full px-6 py-4 bg-black text-white font-bold uppercase text-sm tracking-wide hover:bg-gray-900 transition-colors"
              >
                Sign In to Review
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
