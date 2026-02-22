'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, Shield, BadgeCheck, Package, Star, ArrowRight, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useCountUp } from '@/hooks/useCountUp'

const categories = [
  { name: 'CLOTHING', slug: 'clothing', count: 234 },
  { name: 'FOOTWEAR', slug: 'shoes', count: 156 },
  { name: 'BAGS', slug: 'bags', count: 89 },
  { name: 'ACCESSORIES', slug: 'accessories', count: 178 },
  { name: 'FRAGRANCE', slug: 'perfume', count: 112 },
  { name: 'WATCHES', slug: 'watches', count: 67 },
  { name: 'JEWELRY', slug: 'jewelry', count: 45 },
  { name: 'COLLECTIBLES', slug: 'collectibles', count: 34 },
]

const featuredProducts = [
  {
    id: '1',
    title: 'Louis Vuitton Neverfull MM',
    price: 85000,
    originalPrice: 120000,
    condition: 'Like New',
    brand: 'Louis Vuitton',
    verified: true,
    shop: 'LuxuryFinds',
  },
  {
    id: '2',
    title: 'Nike Air Jordan 1 Retro High',
    price: 18500,
    condition: 'New',
    brand: 'Nike',
    verified: true,
    shop: 'SneakerHead',
  },
  {
    id: '3',
    title: 'Chanel No. 5 EDP 100ml',
    price: 12000,
    originalPrice: 15000,
    condition: 'New',
    brand: 'Chanel',
    verified: false,
    shop: 'ParfumeStore',
  },
  {
    id: '4',
    title: 'Gucci Marmont Belt',
    price: 25000,
    condition: 'Good',
    brand: 'Gucci',
    verified: true,
    shop: 'DesignerDeals',
  },
  {
    id: '5',
    title: 'Oversized Wool Blazer',
    price: 8500,
    originalPrice: 12000,
    condition: 'Like New',
    brand: 'Premium Brand',
    verified: true,
    shop: 'StyleVintage',
  },
  {
    id: '6',
    title: 'Straight Leg Jeans',
    price: 4200,
    originalPrice: 6000,
    condition: 'New',
    brand: 'Denim Co.',
    verified: true,
    shop: 'DenimDeals',
  },
  {
    id: '7',
    title: 'Satin Slip Dress',
    price: 5800,
    originalPrice: 8500,
    condition: 'Like New',
    brand: 'Fashion Brand',
    verified: true,
    shop: 'FashionHub',
  },
  {
    id: '8',
    title: 'Leather Crossbody Bag',
    price: 12500,
    originalPrice: 18000,
    condition: 'Good',
    brand: 'Leather Co.',
    verified: true,
    shop: 'BagCollector',
  },
  {
    id: '9',
    title: 'Knit Sweater',
    price: 6200,
    originalPrice: 9000,
    condition: 'Like New',
    brand: 'Knitwear Co.',
    verified: false,
    shop: 'CozyCloset',
  },
  {
    id: '10',
    title: 'Structured Midi Skirt',
    price: 5500,
    originalPrice: 7900,
    condition: 'New',
    brand: 'Skirt Design',
    verified: true,
    shop: 'SkirtStyle',
  },
  {
    id: '11',
    title: 'Printed Shirt',
    price: 4800,
    originalPrice: 7200,
    condition: 'Good',
    brand: 'Casual Wear',
    verified: true,
    shop: 'CasualWear',
  },
  {
    id: '12',
    title: 'Leather Ankle Boots',
    price: 9500,
    originalPrice: 14000,
    condition: 'Like New',
    brand: 'Boot Co.',
    verified: true,
    shop: 'BootsGalore',
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const productsCount = useCountUp({ end: 2500, duration: 2000 })
  const sellersCount = useCountUp({ end: 450, duration: 2000 })
  const satisfactionCount = useCountUp({ end: 98, duration: 2000 })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Image Background */}
      <section className="relative h-screen min-h-[600px] lg:min-h-screen overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/image.avif"
          alt="Featured collection"
          fill
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
        
        {/* Dark Gradient Overlay - Left Side */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-between py-24 lg:py-32">
          <div className="w-full">
            <div className="max-w-2xl ml-6 lg:ml-8">
              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-900 tracking-tighter mb-6 leading-tight text-white">
                AUTHENTIC MARKETPLACE
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed">
                Buy and sell with confidence. Every product verified. Every seller rated. Every transaction protected.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands..."
                    className="w-full pl-16 pr-6 py-4 bg-white rounded-none border-2 border-white focus:border-black focus:outline-none text-black placeholder:text-gray-500 transition-all"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Stats at Bottom */}
          <div className="w-full">
            <div className="max-w-2xl ml-6 lg:ml-8">
              <div className="grid grid-cols-3 gap-12 pt-8 border-t border-gray-700">
                <div>
                  <p className="text-3xl sm:text-4xl font-900 mb-2 text-white">{productsCount.toLocaleString()}+</p>
                  <p className="text-gray-300 uppercase text-sm tracking-wide">Products</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-900 mb-2 text-white">{sellersCount.toLocaleString()}+</p>
                  <p className="text-gray-300 uppercase text-sm tracking-wide">Sellers</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-900 mb-2 text-white">{satisfactionCount}%</p>
                  <p className="text-gray-300 uppercase text-sm tracking-wide">Satisfied</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-b border-gray-200 py-16 lg:py-20">
        <div className="w-full pl-6 lg:pl-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <BadgeCheck className="w-8 h-8 text-black mb-4" />
              <h3 className="font-900 text-black mb-2 uppercase tracking-tight text-sm">VERIFIED</h3>
              <p className="text-gray-600 text-sm">Every product authenticated</p>
            </div>
            <div>
              <Shield className="w-8 h-8 text-black mb-4" />
              <h3 className="font-900 text-black mb-2 uppercase tracking-tight text-sm">SECURE</h3>
              <p className="text-gray-600 text-sm">Buyer protection guarantee</p>
            </div>
            <div>
              <Star className="w-8 h-8 text-black mb-4" />
              <h3 className="font-900 text-black mb-2 uppercase tracking-tight text-sm">RATED</h3>
              <p className="text-gray-600 text-sm">Transparent seller reviews</p>
            </div>
            <div>
              <Package className="w-8 h-8 text-black mb-4" />
              <h3 className="font-900 text-black mb-2 uppercase tracking-tight text-sm">SHIPPED</h3>
              <p className="text-gray-600 text-sm">Fast nationwide delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-20 border-b border-gray-200">
        <div className="w-full pl-6 lg:pl-8">
          <h2 className="text-4xl lg:text-5xl font-900 tracking-tighter mb-12">CATEGORIES</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/search?category=${category.slug}`}
                className="p-4 border border-gray-200 hover:border-black transition-all group"
              >
                <h3 className="font-900 text-black text-xs uppercase tracking-wider group-hover:opacity-70 transition-opacity">{category.name}</h3>
                <p className="text-xs text-gray-500 mt-2">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-20">
        <div className="w-full pl-6 lg:pl-8">
          <h2 className="text-4xl lg:text-5xl font-900 tracking-tighter mb-4">TRENDING NOW</h2>
          <p className="text-gray-600 mb-12 uppercase text-sm tracking-wide">This week's most wanted</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`} 
                className="group border border-gray-200 hover:border-black transition-all"
              >
                {/* Product Image Area */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl opacity-20">
                    □
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-600">{product.brand}</p>
                      <h3 className="font-900 text-black text-sm mt-1 line-clamp-2 group-hover:opacity-70 transition-opacity">{product.title}</h3>
                    </div>
                    {product.verified && (
                      <BadgeCheck className="w-4 h-4 text-black flex-shrink-0 mt-1" />
                    )}
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-900 text-black text-sm">{product.price.toLocaleString()} L</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">{product.originalPrice.toLocaleString()} L</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{product.condition}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{product.shop}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-gray-50 border-y border-gray-200">
        <div className="w-full pl-6 lg:pl-8">
          <h2 className="text-4xl lg:text-5xl font-900 tracking-tighter mb-16">HOW IT WORKS</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-4xl font-900 mb-6 text-gray-400">01</div>
              <h3 className="font-900 text-black text-lg mb-3 uppercase tracking-tight">SIGN UP</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Create your account as a buyer or seller in seconds</p>
            </div>

            <div>
              <div className="text-4xl font-900 mb-6 text-gray-400">02</div>
              <h3 className="font-900 text-black text-lg mb-3 uppercase tracking-tight">BROWSE OR LIST</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Discover verified products or list items for sale</p>
            </div>

            <div>
              <div className="text-4xl font-900 mb-6 text-gray-400">03</div>
              <h3 className="font-900 text-black text-lg mb-3 uppercase tracking-tight">TRANSACT SAFELY</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Complete transactions with full buyer protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Sellers */}
      <section className="py-20 lg:py-24 bg-black text-white">
        <div className="w-full pl-6 lg:pl-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-900 tracking-tighter mb-6 leading-tight">
              START SELLING
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Open your store, list your products, and start reaching interested buyers across the country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/register?role=seller"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-900 uppercase tracking-wide text-sm hover:opacity-80 transition-opacity"
              >
                Become a seller <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about/sellers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-900 uppercase tracking-wide text-sm hover:bg-white hover:text-black transition-colors"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Certification */}
      <section className="py-12 border-t border-gray-200">
        <div className="w-full pl-6 lg:pl-8">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-600">SECURITY</p>
              <p className="text-black font-900 mt-1">SSL Encrypted</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-600">PAYMENT</p>
              <p className="text-black font-900 mt-1">3D Secure</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-600">VERIFICATION</p>
              <p className="text-black font-900 mt-1">All Products Checked</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-600">LOCAL</p>
              <p className="text-black font-900 mt-1">Albania Based</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
