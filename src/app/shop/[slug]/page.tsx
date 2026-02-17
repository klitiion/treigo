'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Share2,
  MessageCircle,
  MapPin,
  Star,
  ShoppingBag,
  Award,
  Check,
  ArrowLeft,
  Edit2,
  Save,
  X,
  Upload,
} from 'lucide-react'

// Mock shop data
const mockShops = {
  luxuryfinds: {
    id: 'shop1',
    name: 'LuxuryFinds',
    username: 'luxuryfinds_shop',
    slug: 'luxuryfinds',
    bio: 'Premium second-hand luxury goods. Curating the finest authenticated designer pieces for discerning customers worldwide.',
    logo: '✨',
    address: 'Tirana, Albania',
    totalSales: 47,
    rating: 4.9,
    reviewCount: 38,
    isVerified: true,
    verifiedSales: 30, // For trusted seller badge
    city: 'Tirana',
    joinedDate: 'January 2023',
    products: [
      {
        id: '1',
        title: 'Louis Vuitton Neverfull MM',
        price: 85000,
      },
      {
        id: '2',
        title: 'Gucci GG Marmont Small',
        price: 42000,
      },
      {
        id: '3',
        title: 'Prada Saffiano Wallet',
        price: 18000,
      },
      {
        id: '4',
        title: 'Hermès Evelyne PM',
        price: 55000,
      },
      {
        id: '5',
        title: 'Balenciaga City Bag',
        price: 38000,
      },
      {
        id: '6',
        title: 'Cartier Love Bracelet',
        price: 75000,
      },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Sarah M.',
        rating: 5,
        comment: 'Excellent quality, very authentic. Highly recommended!',
        date: '2024-01-20',
      },
      {
        id: 'r2',
        author: 'Emma K.',
        rating: 5,
        comment: 'Perfect condition, arrived quickly.',
        date: '2024-01-15',
      },
      {
        id: 'r3',
        author: 'Nina D.',
        rating: 4,
        comment: 'Great service, very responsive seller.',
        date: '2024-01-10',
      },
    ],
  },
  'royal-butik-myslym-shyr': {
    id: 'shop2',
    name: 'Royal Butik Myslym Shyr',
    username: 'royal_butik',
    slug: 'royal-butik-myslym-shyr',
    bio: 'Premium and second-hand fashion collection. Specializing in high-end designer pieces and vintage finds. Quality assured.',
    logo: '👑',
    address: 'Tirana, Albania',
    totalSales: 120,
    rating: 4.8,
    reviewCount: 78,
    isVerified: true,
    verifiedSales: 95, // For trusted seller badge
    city: 'Tirana',
    joinedDate: 'March 2022',
    products: [
      {
        id: '10',
        title: 'Designer Dress Collection',
        price: 35000,
      },
      {
        id: '11',
        title: 'Luxury Watch Collection',
        price: 125000,
      },
      {
        id: '12',
        title: 'Premium Handbags',
        price: 65000,
      },
    ],
    reviews: [
      {
        id: 're1',
        author: 'John D.',
        rating: 5,
        comment: 'Trusted seller, always delivers authentic items!',
        date: '2024-01-22',
      },
      {
        id: 're2',
        author: 'Maria L.',
        rating: 5,
        comment: 'Excellent customer service and quality products.',
        date: '2024-01-18',
      },
    ],
  },
}

export default function ShopPage() {
  const params = useParams()
  const shopSlug = params.slug as string
  const [shop, setShop] = useState(mockShops[shopSlug as keyof typeof mockShops] || null)
  const [user, setUser] = useState<any>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [sharedMessage, setSharedMessage] = useState('')
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [editingBio, setEditingBio] = useState('')
  const [editingLogo, setEditingLogo] = useState('')
  const [editingAddress, setEditingAddress] = useState('')
  const [saving, setSaving] = useState(false)
  const [isOwnShop, setIsOwnShop] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('treigo_user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      
      // Check if this is the user's own shop
      if (shop && userData.role === 'SELLER') {
        // In a real app, you'd compare shop ownership; here we use username for demo
        setIsOwnShop(userData.username === shop.username)
      }
    }

    // Initialize edit fields
    if (shop) {
      setEditingBio(shop.bio)
      setEditingLogo(shop.logo)
      setEditingAddress(shop.address)
    }
  }, [shop])

  const handleSaveBio = async () => {
    if (!shop) return
    
    setSaving(true)
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedShop = {
        ...shop,
        bio: editingBio,
        logo: editingLogo,
        address: editingAddress,
      }
      setShop(updatedShop)
      
      // In a real app, save to database
      localStorage.setItem(`shop_${shop.id}`, JSON.stringify(updatedShop))
      
      setIsEditingBio(false)
    } catch (error) {
      console.error('Error saving bio:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 text-black mb-8">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Shop Not Found</h1>
            <p className="text-gray-600">The shop you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const isTrustedSeller = shop.verifiedSales >= 15

  const handleShare = async () => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.href : ''}`
    const text = `Check out ${shop.name} on Trèigo - Premium & Second-Hand Marketplace!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shop.name,
          text: text,
          url: shareUrl,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`)
        setSharedMessage('Link copied to clipboard!')
        setTimeout(() => setSharedMessage(''), 3000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleContactSeller = () => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }
    // Redirect to messaging
    window.location.href = '/buyer/inbox'
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 text-black mb-8 hover:opacity-70">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        {/* Seller Profile Header */}
        <div className="mb-12">
          {isEditingBio ? (
            // Edit Mode
            <div className="border-2 border-black p-8 bg-gray-50">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Profile Logo (Emoji)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={editingLogo}
                      onChange={(e) => setEditingLogo(e.target.value)}
                      className="w-full border-2 border-black p-3 text-4xl text-center"
                      placeholder="😀"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editingAddress}
                      onChange={(e) => setEditingAddress(e.target.value)}
                      className="w-full border-2 border-black p-3"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                      Bio
                    </label>
                    <textarea
                      value={editingBio}
                      onChange={(e) => setEditingBio(e.target.value)}
                      className="w-full border-2 border-black p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      rows={4}
                      placeholder="Tell customers about your shop..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveBio}
                      disabled={saving}
                      className="px-6 py-3 bg-black text-white font-bold uppercase text-sm tracking-wide hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingBio(false)
                        setEditingBio(shop.bio)
                        setEditingLogo(shop.logo)
                        setEditingAddress(shop.address)
                      }}
                      className="px-6 py-3 border-2 border-black text-black font-bold uppercase text-sm tracking-wide hover:bg-black hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div className="flex items-start gap-8 mb-8">
                {/* Logo */}
                <div className="w-32 h-32 bg-black border-2 border-black flex items-center justify-center flex-shrink-0 sticky top-8">
                  <span className="text-7xl">{shop.logo}</span>
                </div>

                {/* Shop Info */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h1 className="text-5xl font-bold text-black uppercase tracking-wider mb-2">
                      {shop.name}
                    </h1>
                    <p className="text-lg text-gray-600 font-semibold">@{shop.username}</p>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-2xl">
                    {shop.bio}
                  </p>

                  {shop.address && (
                    <div className="flex items-center gap-2 text-gray-700 mb-6">
                      <MapPin className="w-5 h-5 text-black" />
                      <span className="font-semibold">{shop.address}</span>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="border-2 border-black p-4">
                      <p className="text-3xl font-bold text-black">{shop.totalSales}</p>
                      <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Products Sold</p>
                    </div>
                    <div className="border-2 border-black p-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-black fill-black" />
                      <div>
                        <p className="text-3xl font-bold text-black">{shop.rating}</p>
                        <p className="text-xs text-gray-600 font-semibold uppercase">({shop.reviewCount})</p>
                      </div>
                    </div>
                    <div className="border-2 border-black p-4">
                      <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Joined</p>
                      <p className="text-lg font-bold text-black">{shop.joinedDate}</p>
                    </div>
                  </div>

                  {isTrustedSeller && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black w-fit">
                      <Award className="w-4 h-4" />
                      <span className="font-bold uppercase tracking-wide text-sm">Trusted Seller</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {isOwnShop && (
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="p-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                      title="Edit shop profile"
                    >
                      <Edit2 className="w-5 h-5" />
                      <span className="font-bold text-sm uppercase">Edit</span>
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    className="p-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                    title="Share shop"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  {!isOwnShop && (
                    <button
                      onClick={handleContactSeller}
                      className="px-4 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors flex items-center gap-2 font-semibold uppercase text-xs tracking-wide"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                  )}
                </div>
              </div>

              {/* Share Message */}
              {sharedMessage && (
                <div className="p-3 bg-black text-white text-sm font-semibold uppercase tracking-wide flex items-center gap-2 w-fit">
                  <Check className="w-4 h-4" />
                  {sharedMessage}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Products Section - Instagram Style Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8 uppercase tracking-wider">
            Shop ({shop.products.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shop.products.map(product => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group relative overflow-hidden border-2 border-black hover:shadow-2xl transition-all"
              >
                {/* Product Image Area */}
                <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl opacity-60 group-hover:opacity-80 transition-opacity relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                  📦
                </div>

                {/* Product Info Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-colors duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                  <h3 className="font-bold text-white line-clamp-2 mb-2 uppercase tracking-wider text-sm">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-bold text-white">{product.price.toLocaleString()} L</p>
                </div>

                {/* Product Info (visible on non-hover) */}
                <div className="p-4 bg-white group-hover:bg-gray-50 transition-colors">
                  <h3 className="font-bold text-black line-clamp-2 mb-2 uppercase tracking-wider text-sm group-hover:opacity-0">
                    {product.title}
                  </h3>
                  <p className="text-xl font-bold text-black group-hover:opacity-0">{product.price.toLocaleString()} L</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8 uppercase tracking-wider">
            Reviews ({shop.reviewCount})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shop.reviews.map(review => (
              <div key={review.id} className="border-2 border-black p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-black text-lg">{review.author}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-black fill-black'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold">{review.date}</p>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        {!isOwnShop && (
          <div className="border-4 border-black p-8 text-center bg-black text-white">
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider">
              Interested in these products?
            </h3>
            <p className="text-gray-200 mb-8 text-lg">
              Contact the seller directly to inquire or make a purchase
            </p>
            {user ? (
              <button
                onClick={handleContactSeller}
                className="px-8 py-4 bg-white text-black font-bold uppercase text-sm tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <MessageCircle className="w-5 h-5" />
                Send Message
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-300">
                  Sign in to contact sellers and place orders
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link
                    href="/auth/login"
                    className="px-8 py-4 border-2 border-white text-white font-bold uppercase text-sm tracking-wide hover:bg-white hover:text-black transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-8 py-4 bg-white text-black font-bold uppercase text-sm tracking-wide hover:bg-gray-200 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
