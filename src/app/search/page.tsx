'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, SlidersHorizontal, X, BadgeCheck, Grid3X3, List, ChevronDown } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { useCurrency } from '@/context/CurrencyContext'

const categories = [
  { value: '', label: 'All' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'bags', label: 'Bags' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'perfume', label: 'Perfume' },
  { value: 'watches', label: 'Watches' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'collectibles', label: 'Collectibles' },
]

const conditions = [
  { value: '', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

// Mock products data
const mockProducts = [
  {
    id: '1',
    title: 'Louis Vuitton Neverfull MM',
    price: 85000,
    originalPrice: 120000,
    condition: 'LIKE_NEW',
    category: 'bags',
    brand: 'Louis Vuitton',
    verified: true,
    shop: { name: 'LuxuryFinds', slug: 'luxuryfinds' },
    city: 'Tiranë',
  },
  {
    id: '2',
    title: 'Nike Air Jordan 1 Retro High OG',
    price: 18500,
    condition: 'NEW',
    category: 'shoes',
    brand: 'Nike',
    verified: true,
    shop: { name: 'SneakerHead', slug: 'sneakerhead' },
    city: 'Durrës',
  },
  {
    id: '3',
    title: 'Chanel No. 5 EDP 100ml',
    price: 12000,
    originalPrice: 15000,
    condition: 'NEW',
    category: 'perfume',
    brand: 'Chanel',
    verified: false,
    shop: { name: 'ParfumeStore', slug: 'parfumestore' },
    city: 'Tiranë',
  },
  {
    id: '4',
    title: 'Gucci GG Marmont Belt',
    price: 25000,
    condition: 'GOOD',
    category: 'accessories',
    brand: 'Gucci',
    verified: true,
    shop: { name: 'DesignerDeals', slug: 'designerdeals' },
    city: 'Vlorë',
  },
  {
    id: '5',
    title: 'Rolex Submariner Date',
    price: 850000,
    condition: 'LIKE_NEW',
    category: 'watches',
    brand: 'Rolex',
    verified: true,
    shop: { name: 'WatchCollector', slug: 'watchcollector' },
    city: 'Tiranë',
  },
  {
    id: '6',
    title: 'Adidas Yeezy Boost 350 V2',
    price: 22000,
    condition: 'NEW',
    category: 'shoes',
    brand: 'Adidas',
    verified: false,
    shop: { name: 'StreetStyle', slug: 'streetstyle' },
    city: 'Shkodër',
  },
  {
    id: '7',
    title: 'Prada Saffiano Leather Bag',
    price: 95000,
    originalPrice: 130000,
    condition: 'GOOD',
    category: 'bags',
    brand: 'Prada',
    verified: true,
    shop: { name: 'LuxuryFinds', slug: 'luxuryfinds' },
    city: 'Tiranë',
  },
  {
    id: '8',
    title: 'Dior Sauvage EDP 100ml',
    price: 9500,
    condition: 'NEW',
    category: 'perfume',
    brand: 'Dior',
    verified: true,
    shop: { name: 'ParfumeStore', slug: 'parfumestore' },
    city: 'Tiranë',
  },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { formatPrice, convertPrice } = useCurrency()
  
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(false)
  
  // Filter states
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [condition, setCondition] = useState(searchParams.get('condition') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance')
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '')
  
  // Filtered products
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    // Fetch products from API
    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (category) params.set('category', category)
        if (condition) params.set('condition', condition)
        if (sort) params.set('sort', sort)
        if (priceMin) params.set('priceMin', priceMin)
        if (priceMax) params.set('priceMax', priceMax)

        const response = await fetch(`/api/search?${params.toString()}`)
        const data = await response.json()
        
        if (data.success) {
          setProducts(data.results)
        }
      } catch (error) {
        console.error('Search error:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query, category, condition, sort, priceMin, priceMax])

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    // Update URL params
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('category', category)
    if (condition) params.set('condition', condition)
    if (sort) params.set('sort', sort)
    if (priceMin) params.set('priceMin', priceMin)
    if (priceMax) params.set('priceMax', priceMax)
    
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setQuery('')
    setCategory('')
    setCondition('')
    setSort('relevance')
    setPriceMin('')
    setPriceMax('')
    router.push('/search')
  }

  const getConditionLabel = (cond: string) => {
    const c = conditions.find(c => c.value === cond)
    return c?.label || cond
  }

  return (
    <div className="min-h-screen bg-white py-12 lg:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-12 max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="w-full pl-12 pr-4 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none placeholder:text-gray-600 transition-colors text-black"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-6 py-3 border-2 border-black text-black font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
            >
              <span className="hidden sm:inline">FILTERS</span>
              <SlidersHorizontal className="w-5 h-5 sm:hidden" />
            </button>
          </form>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="border-2 border-black p-8 mb-12 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-black mb-3">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black focus:border-black focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-black mb-3">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black focus:border-black focus:outline-none"
                >
                  {conditions.map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-black mb-3">Price</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-3 bg-white border border-black focus:border-black focus:outline-none"
                  />
                  <span className="text-black">-</span>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-3 bg-white border border-black focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-black mb-3">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black focus:border-black focus:outline-none"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t-2 border-black pt-6">
              <button
                onClick={clearFilters}
                className="text-black text-sm font-bold uppercase tracking-wide hover:underline transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b-2 border-gray-300 max-w-5xl mx-auto">
          <div>
            <p className="text-black text-sm">
              <span className="font-bold">{products.length}</span> RESULTS
              {query && <span className="text-gray-600"> FOR "{query.toUpperCase()}"</span>}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-white border border-black text-sm font-bold uppercase tracking-wide focus:outline-none cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="hidden sm:flex items-center gap-2 border-2 border-black p-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-4">Searching products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-900 text-black mb-4 uppercase tracking-tight">No Results Found</h2>
            <p className="text-gray-600 mb-8">Try adjusting your filters or search for something else</p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  condition={product.condition}
                  brand={product.brand}
                  verified={product.trustBadge}
                  shop={product.shop}
                  city={product.city}
                  viewMode={viewMode}
                  conditionLabel={getConditionLabel(product.condition)}
                />              </div>            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
