'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, Share2, Check, Save, X } from 'lucide-react'
import { ProtectedRoute } from '@/hooks/useAuth'

interface ShopProfile {
  name: string
  username: string
  bio: string
  logo: string
  address: string
  totalSales: number
  rating: number
  reviewCount: number
  joinedDate: string
}

interface Product {
  id: string
  title: string
  price: number
}

export default function SellerProfilePage() {
  return (
    <ProtectedRoute requiredRole="SELLER">
      <SellerProfile />
    </ProtectedRoute>
  )
}

function SellerProfile() {
  const [user, setUser] = useState<any>(null)
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sharedMessage, setSharedMessage] = useState('')

  const [editingBio, setEditingBio] = useState('')
  const [editingLogo, setEditingLogo] = useState('')
  const [editingAddress, setEditingAddress] = useState('')

  const [products] = useState<Product[]>([
    { id: '1', title: 'Louis Vuitton Neverfull MM', price: 85000 },
    { id: '2', title: 'Gucci GG Marmont Small', price: 42000 },
    { id: '3', title: 'Prada Saffiano Wallet', price: 18000 },
    { id: '4', title: 'Hermès Evelyne PM', price: 55000 },
    { id: '5', title: 'Balenciaga City Bag', price: 38000 },
    { id: '6', title: 'Cartier Love Bracelet', price: 75000 },
  ])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('treigo_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)

          const shopData: ShopProfile = {
            name: userData.firstName + ' ' + userData.lastName,
            username: userData.username || 'shop_' + userData.id.slice(0, 8),
            bio: userData.bio || 'Welcome to my shop! I offer premium and second-hand items.',
            logo: userData.logo || '✨',
            address: userData.address || 'Albania',
            totalSales: 47,
            rating: 4.9,
            reviewCount: 38,
            joinedDate: 'January 2023',
          }
          setShopProfile(shopData)
          setEditingBio(shopData.bio)
          setEditingLogo(shopData.logo)
          setEditingAddress(shopData.address)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSave = async () => {
    if (!shopProfile) return
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const updatedShop = {
        ...shopProfile,
        bio: editingBio,
        logo: editingLogo,
        address: editingAddress,
      }
      setShopProfile(updatedShop)

      if (user) {
        const updatedUser = {
          ...user,
          bio: editingBio,
          logo: editingLogo,
          address: editingAddress,
        }
        setUser(updatedUser)
        localStorage.setItem('treigo_user', JSON.stringify(updatedUser))
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleShare = async () => {
    if (!shopProfile) return

    const shareUrl = `${typeof window !== 'undefined' ? window.location.href : ''}`
    const text = `Check out ${shopProfile.name} on Trèigo!`

    if (navigator.share) {
      try {
        await navigator.share({ title: shopProfile.name, text: text, url: shareUrl })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`)
        setSharedMessage('Link copied to clipboard!')
        setTimeout(() => setSharedMessage(''), 3000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  if (loading || !user || !shopProfile) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-black border-t-gray-300 rounded-full animate-spin"></div></div>
  }

  const isTrustedSeller = shopProfile.totalSales >= 15

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 text-black font-bold uppercase text-xs tracking-wide hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
          <h1 className="text-3xl font-bold text-black uppercase tracking-wide">SHOP PROFILE</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          // Edit Mode
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-black uppercase tracking-wide mb-8">EDIT SHOP PROFILE</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wide mb-3">LOGO (EMOJI)</label>
                <input type="text" maxLength={2} value={editingLogo} onChange={(e) => setEditingLogo(e.target.value)} className="w-full border border-gray-200 p-3 text-4xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wide mb-3">ADDRESS</label>
                <input type="text" value={editingAddress} onChange={(e) => setEditingAddress(e.target.value)} className="w-full border border-gray-200 p-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" placeholder="City, Country" />
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wide mb-3">BIO</label>
                <textarea value={editingBio} onChange={(e) => setEditingBio(e.target.value)} className="w-full border border-gray-200 p-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" rows={4} placeholder="Tell customers about your shop..." />
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-black text-white font-bold uppercase text-xs tracking-wide hover:bg-gray-900 disabled:opacity-50 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'SAVING...' : 'SAVE'}
                </button>
                <button onClick={() => {setIsEditing(false); setEditingBio(shopProfile.bio); setEditingLogo(shopProfile.logo); setEditingAddress(shopProfile.address);}} className="px-8 py-3 border border-gray-200 text-black font-bold uppercase text-xs tracking-wide hover:border-black transition-colors flex items-center gap-2">
                  <X className="w-4 h-4" />
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white border border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo */}
                <div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex items-center justify-center aspect-square">
                    <span className="text-7xl">{shopProfile.logo}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="md:col-span-2 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-black mb-2">{shopProfile.name}</h2>
                  <p className="text-base font-bold text-gray-700 mb-6">@{shopProfile.username}</p>
                  
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{shopProfile.bio}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-700 font-bold mb-8">
                    📍 {shopProfile.address}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                      <p className="text-3xl font-bold text-black">{shopProfile.totalSales}</p>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-2">ITEMS SOLD</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-black">{shopProfile.rating}⭐</p>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-2">RATING</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">{shopProfile.joinedDate}</p>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mt-2">JOINED</p>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {isTrustedSeller && (
                      <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider">✓ TRUSTED SELLER</span>
                    )}
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-gray-200 text-black text-xs font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors flex items-center gap-2">
                      <Edit2 className="w-3 h-3" />
                      EDIT
                    </button>
                    <button onClick={handleShare} className="px-4 py-2 border border-gray-200 text-black text-xs font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors flex items-center gap-2">
                      <Share2 className="w-3 h-3" />
                      SHARE
                    </button>
                  </div>

                  {/* Share Message */}
                  {sharedMessage && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider">
                      <Check className="w-3 h-3" />
                      {sharedMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-black uppercase tracking-wide mb-6">SHOP COLLECTION</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <Link key={product.id} href={`/product/${product.id}`} className="group border border-gray-200 overflow-hidden hover:border-black transition-all">
                    <div className="bg-gray-50 aspect-square flex items-center justify-center text-5xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center">
                          <p className="text-xs font-bold uppercase tracking-wider mb-2 px-2">{product.title}</p>
                          <p className="text-lg font-bold">{product.price.toLocaleString()} L</p>
                        </div>
                      </div>
                      <span className="group-hover:scale-110 transition-transform">📦</span>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-xs font-bold text-black uppercase tracking-wider line-clamp-2">{product.title}</p>
                      <p className="text-base font-bold text-black mt-2">{product.price.toLocaleString()} L</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
