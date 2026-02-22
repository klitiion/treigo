'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, User, ShoppingBag, Heart, Store, LogOut, ChevronDown, Plus, Gift, Settings, MessageSquare, Globe } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { useCurrency } from '@/context/CurrencyContext'
import { ProductRequestModal } from '@/components/buyer/ProductRequestModal'

const womensCategories = [
  { name: 'Clothing', slug: 'womens-clothing' },
  { name: 'Footwear', slug: 'womens-footwear' },
  { name: 'Bags', slug: 'womens-bags' },
  { name: 'Accessories', slug: 'womens-accessories' },
  { name: 'Activewear', slug: 'womens-activewear' },
]

const mensCategories = [
  { name: 'Clothing', slug: 'mens-clothing' },
  { name: 'Footwear', slug: 'mens-footwear' },
  { name: 'Bags', slug: 'mens-bags' },
  { name: 'Accessories', slug: 'mens-accessories' },
  { name: 'Activewear', slug: 'mens-activewear' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isWomenMenuOpen, setIsWomenMenuOpen] = useState(false)
  const [isMenMenuOpen, setIsMenMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isProductRequestOpen, setIsProductRequestOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false)
  const [language, setLanguage] = useState<'en' | 'it' | 'fr'>('en')
  const { wishlist } = useWishlist()
  const { getCartCount, isClient } = useCart()
  
  // Only call useCurrency after mounting
  const currencyContext = mounted ? useCurrency() : null
  const currency = currencyContext?.currency || 'EUR'
  const setCurrency = currencyContext?.setCurrency || (() => {})
  
  const [user, setUser] = useState<{ name: string; role: 'BUYER' | 'SELLER'; shop?: { slug: string } } | null>(null)

  useEffect(() => {
    setMounted(true)
    // Load recent searches
    const saved = JSON.parse(localStorage.getItem('recent_searches') || '[]')
    setRecentSearches(saved)
    
    // Load language preference
    const savedLanguage = (localStorage.getItem('site_language') || 'en') as 'en' | 'it' | 'fr'
    setLanguage(savedLanguage)
    
    // Initialize Google Translate after a short delay
    const initTranslate = () => {
      if ((window as any).google?.translate?.TranslateElement) {
        try {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,it,fr',
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            'google_translate_element'
          )
          console.log('Google Translate initialized successfully')
          
          // If a language was saved, apply it
          if (savedLanguage !== 'en') {
            setTimeout(() => {
              const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement
              if (selectElement) {
                selectElement.value = savedLanguage
                selectElement.dispatchEvent(new Event('change', { bubbles: true }))
              }
            }, 500)
          }
        } catch (error) {
          console.error('Error initializing Google Translate:', error)
        }
      } else {
        // Google Translate not ready yet, try again
        if (!(window as any).googleTranslateInitAttempts) {
          (window as any).googleTranslateInitAttempts = 0
        }
        if ((window as any).googleTranslateInitAttempts < 10) {
          (window as any).googleTranslateInitAttempts++
          setTimeout(initTranslate, 500)
        }
      }
    }
    
    // Load the Google Translate script
    if (!(window as any).google?.translate) {
      const script = document.createElement('script')
      script.src = 'https://translate.google.com/translate_a/element.js?cb=initGoogleTranslate'
      script.async = true
      document.head.appendChild(script)
      
      // Set up global callback
      ;(window as any).initGoogleTranslate = initTranslate
    } else {
      initTranslate()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('treigo_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('treigo_user')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('treigo_user')
    localStorage.removeItem('treigo_token')
    setUser(null)
    window.location.href = '/'
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Store recent search
      const filtered = recentSearches.filter((s: string) => s !== query)
      const updated = [query, ...filtered].slice(0, 10)
      setRecentSearches(updated)
      localStorage.setItem('recent_searches', JSON.stringify(updated))
      
      // Navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }

  const handleClearRecent = () => {
    setRecentSearches([])
    localStorage.setItem('recent_searches', '[]')
  }

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white border-b border-gray-100' 
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 ml-6">
            <span className="text-xl lg:text-2xl font-900 tracking-tighter text-black">TRÈIGO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              href="/search" 
              className="text-sm font-500 text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
            >
              New In
            </Link>
            
            {/* Women Menu */}
            <div className="relative group">
              <button 
                className="text-sm font-500 text-gray-700 hover:text-black transition-colors uppercase tracking-wide flex items-center gap-1"
                onMouseEnter={() => setIsWomenMenuOpen(true)}
                onMouseLeave={() => setIsWomenMenuOpen(false)}
              >
                Women
                <ChevronDown className="w-4 h-4" />
              </button>
              {isWomenMenuOpen && (
                <div 
                  className="absolute left-0 top-full mt-0 bg-white border border-gray-200 min-w-max py-2 shadow-lg"
                  onMouseEnter={() => setIsWomenMenuOpen(true)}
                  onMouseLeave={() => setIsWomenMenuOpen(false)}
                >
                  {womensCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/search?category=${cat.slug}`}
                      className="block px-6 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Men Menu */}
            <div className="relative group">
              <button 
                className="text-sm font-500 text-gray-700 hover:text-black transition-colors uppercase tracking-wide flex items-center gap-1"
                onMouseEnter={() => setIsMenMenuOpen(true)}
                onMouseLeave={() => setIsMenMenuOpen(false)}
              >
                Men
                <ChevronDown className="w-4 h-4" />
              </button>
              {isMenMenuOpen && (
                <div 
                  className="absolute left-0 top-full mt-0 bg-white border border-gray-200 min-w-max py-2 shadow-lg"
                  onMouseEnter={() => setIsMenMenuOpen(true)}
                  onMouseLeave={() => setIsMenMenuOpen(false)}
                >
                  {mensCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/search?category=${cat.slug}`}
                      className="block px-6 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/search?category=accessories" 
              className="text-sm font-500 text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
            >
              Accessories
            </Link>
            <Link
              href="/search?category=sale" 
              className="text-sm font-500 text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
            >
              Sale
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4 mr-6">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-600 text-black hover:bg-gray-100 transition-colors rounded border border-gray-300"
              >
                <Globe className="w-4 h-4" />
                {language.toUpperCase()}
                <ChevronDown className="w-3 h-3" />
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 shadow-lg rounded z-50 min-w-max">
                  <button
                    onClick={() => {
                      setLanguage('en')
                      localStorage.setItem('site_language', 'en')
                      setIsLanguageDropdownOpen(false)
                      // Trigger Google Translate
                      setTimeout(() => {
                        try {
                          const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement
                          if (selectElement) {
                            selectElement.value = 'en'
                            selectElement.dispatchEvent(new Event('change', { bubbles: true }))
                            selectElement.dispatchEvent(new Event('click', { bubbles: true }))
                          } else {
                            console.warn('Google Translate combo not found')
                          }
                        } catch (error) {
                          console.error('Error changing language:', error)
                        }
                      }, 100)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('it')
                      localStorage.setItem('site_language', 'it')
                      setIsLanguageDropdownOpen(false)
                      // Trigger Google Translate
                      setTimeout(() => {
                        try {
                          const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement
                          if (selectElement) {
                            selectElement.value = 'it'
                            selectElement.dispatchEvent(new Event('change', { bubbles: true }))
                            selectElement.dispatchEvent(new Event('click', { bubbles: true }))
                          } else {
                            console.warn('Google Translate combo not found')
                          }
                        } catch (error) {
                          console.error('Error changing language:', error)
                        }
                      }, 100)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    Italiano
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('fr')
                      localStorage.setItem('site_language', 'fr')
                      setIsLanguageDropdownOpen(false)
                      // Trigger Google Translate
                      setTimeout(() => {
                        try {
                          const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement
                          if (selectElement) {
                            selectElement.value = 'fr'
                            selectElement.dispatchEvent(new Event('change', { bubbles: true }))
                            selectElement.dispatchEvent(new Event('click', { bubbles: true }))
                          } else {
                            console.warn('Google Translate combo not found')
                          }
                        } catch (error) {
                          console.error('Error changing language:', error)
                        }
                      }, 100)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    Français
                  </button>
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-600 text-black hover:bg-gray-100 transition-colors rounded border border-gray-300"
              >
                {currency}
                <ChevronDown className="w-3 h-3" />
              </button>
              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 shadow-lg rounded z-50 min-w-max">
                  <button
                    onClick={() => {
                      setCurrency('EUR')
                      setIsCurrencyDropdownOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    EUR (€)
                  </button>
                  <button
                    onClick={() => {
                      setCurrency('ALL')
                      setIsCurrencyDropdownOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    ALL (L)
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-700 hover:text-black transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Favorites */}
            <Link 
              href="/buyer/wishlist" 
              className="relative p-2 text-gray-700 hover:text-black transition-colors"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-black text-black' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              href="/buyer/cart" 
              className="relative p-2 text-gray-700 hover:text-black transition-colors"
              title="Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {isClient && getCartCount() > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Seller Dashboard - Only for sellers */}
            {user && user.role === 'SELLER' && (
              <Link 
                href="/seller/dashboard" 
                className="p-2 text-gray-700 hover:text-black transition-colors"
                title="Seller Dashboard"
              >
                <Store className="w-5 h-5" />
              </Link>
            )}

            {/* Settings - Only for sellers */}
            {user && user.role === 'SELLER' && (
              <Link 
                href="/seller/settings" 
                className="p-2 text-gray-700 hover:text-black transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}

            {/* Add Product - Only for sellers */}
            {user && user.role === 'SELLER' && (
              <Link 
                href="/seller/products/new" 
                className="p-2 text-gray-700 hover:text-black transition-colors"
                title="Add Product"
              >
                <Plus className="w-5 h-5" />
              </Link>
            )}

            {/* Product Request - Only for buyers */}
            {user && user.role !== 'SELLER' && (
              <button 
                onClick={() => setIsProductRequestOpen(true)}
                className="p-2 text-gray-700 hover:text-black transition-colors"
                title="Request Product"
              >
                <Gift className="w-5 h-5" />
              </button>
            )}

            {/* Chats - Only for sellers */}
            {user && user.role === 'SELLER' && (
              <Link 
                href="/seller/chats" 
                className="p-2 text-gray-700 hover:text-black transition-colors"
                title="Messages"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>
            )}
            
            {user ? (
              <>
                {/* Profile Link */}
                <Link 
                  href={user.role === 'SELLER' ? '/seller/profile' : '/buyer/profile'}
                  className="p-2 text-gray-700 hover:text-black transition-colors"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="px-4 py-2 text-sm font-500 text-gray-700 hover:text-black transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-4 py-2 bg-black text-white text-sm font-600 rounded-none hover:bg-gray-900 transition-colors"
                >
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-gray-700 hover:text-black transition-colors mr-6"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-down">
            <nav className="flex flex-col gap-0">
              <Link 
                href="/search" 
                className="px-4 py-3 text-sm font-500 text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                New In
              </Link>
              <Link 
                href="/search?category=clothing" 
                className="px-4 py-3 text-sm font-500 text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Women
              </Link>
              <Link 
                href="/search?category=shoes" 
                className="px-4 py-3 text-sm font-500 text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Men
              </Link>
              <Link 
                href="/search?category=bags" 
                className="px-4 py-3 text-sm font-500 text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accessories
              </Link>
              <Link 
                href="/search?category=perfume" 
                className="px-4 py-3 text-sm font-500 text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sale
              </Link>

              {!user && (
                <>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link 
                      href="/auth/login" 
                      className="block px-4 py-3 text-sm font-500 text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="block px-4 py-3 text-sm font-500 text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Join
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/50">
            <div className="w-full bg-white shadow-2xl animate-slide-down overflow-y-auto flex flex-col max-h-[calc(100vh-80px)]">
              {/* Search Header */}
              <div className="bg-white border-b border-gray-200 p-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch(searchQuery)
                          setIsSearchOpen(false)
                        }
                      }}
                      placeholder="What are you looking for today?"
                      autoFocus
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 focus:border-black focus:outline-none text-black placeholder:text-gray-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false)
                      setSearchQuery('')
                    }}
                    className="p-2 text-gray-600 hover:text-black transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* Trending Searches */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-900 text-black uppercase text-xs tracking-wider">TRENDING</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['Nike Jordan', 'Chanel No. 5', 'Gucci Belt', 'Rolex Watch'].map((trend) => (
                      <button 
                        key={trend}
                        onClick={() => handleSearch(trend)}
                        className="px-3 py-1.5 border border-black text-black hover:bg-black hover:text-white transition-colors text-xs font-bold uppercase tracking-wide"
                      >
                        {trend}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-900 text-black uppercase text-xs tracking-wider">RECENT</h3>
                      <button 
                        onClick={handleClearRecent}
                        className="text-xs font-bold text-gray-600 hover:text-black uppercase tracking-wide"
                      >
                        CLEAR
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search: string) => (
                        <button 
                          key={search}
                          onClick={() => handleSearch(search)}
                          className="flex items-center gap-2 text-xs text-gray-600 hover:text-black transition-colors w-full py-1"
                        >
                          <Search className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Request Modal */}
      {isProductRequestOpen && (
        <ProductRequestModal 
          isOpen={isProductRequestOpen}
          onClose={() => setIsProductRequestOpen(false)}
        />
      )}
      
      {/* Google Translate Widget - Hidden but functional */}
      <div 
        id="google_translate_element" 
        style={{ 
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          visibility: 'hidden'
        }}
      ></div>
    </header>
  )
}
