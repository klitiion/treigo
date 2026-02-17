'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Upload, X, Camera, BadgeCheck,
  AlertCircle, Check, Loader2, Info, ChevronDown, ChevronUp
} from 'lucide-react'

const categories = [
  { value: 'CLOTHING', label: 'Clothing' },
  { value: 'SHOES', label: 'Shoes' },
  { value: 'BAGS', label: 'Bags' },
  { value: 'ACCESSORIES', label: 'Accessories' },
  { value: 'PERFUME', label: 'Perfume' },
  { value: 'WATCHES', label: 'Watches' },
  { value: 'JEWELRY', label: 'Jewelry' },
  { value: 'COLLECTIBLES', label: 'Collectibles' },
]

const conditions = [
  { value: 'NEW', label: 'New', description: 'With tags, never worn' },
  { value: 'LIKE_NEW', label: 'Like New', description: 'Worn 1-2 times, no signs of wear' },
  { value: 'GOOD', label: 'Good', description: 'Light wear, fully functional' },
  { value: 'FAIR', label: 'Fair', description: 'Visible wear, still functional' },
]

interface PhotoItem {
  id: string
  file?: File
  preview: string
  type: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPhotoGuide, setShowPhotoGuide] = useState(true)
  const [showVerificationInfo, setShowVerificationInfo] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    model: '',
    sku: '',
    condition: '',
    defects: '',
    isRepaired: false,
    repairDetails: '',
    hasReplacedParts: false,
    replacedPartsDetails: '',
    city: '',
    serialCode: '',
    batchCode: '',
    purchaseYear: '',
    purchasePlace: '',
    saleReason: '',
  })

  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [invoicePhoto, setInvoicePhoto] = useState<PhotoItem | null>(null)
  const [usernameProofPhoto, setUsernameProofPhoto] = useState<PhotoItem | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'invoice' | 'proof') => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const preview = ev.target?.result as string
        const newPhoto: PhotoItem = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview,
          type,
        }
        
        if (type === 'product') {
          setPhotos(prev => [...prev, newPhoto])
        } else if (type === 'invoice') {
          setInvoicePhoto(newPhoto)
        } else if (type === 'proof') {
          setUsernameProofPhoto(newPhoto)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (photos.length < 4) {
      setError('At least 4 product photos are required')
      return
    }

    if (!formData.title || !formData.price || !formData.category || !formData.condition || !formData.brand) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      // Create FormData for file uploads
      const submitData = new FormData()
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value))
      })
      
      // Add photos
      photos.forEach((photo) => {
        if (photo.file) {
          submitData.append('photos', photo.file)
        }
      })
      
      // Add proof/invoice photos
      if (usernameProofPhoto?.file) {
        submitData.append('usernameProof', usernameProofPhoto.file)
      }
      if (invoicePhoto?.file) {
        submitData.append('invoice', invoicePhoto.file)
      }
      
      const response = await fetch('/api/products/create', {
        method: 'POST',
        body: submitData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create product')
        setIsLoading(false)
        return
      }
      
      setSuccess(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Submit error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const photoRequirements = [
    'Front/back + side + bottom + top views',
    'Close-up of logo/embossing',
    'Inner tags (brand label) + care label',
    'Serial/date code/model code (if applicable)',
    'Stitching, seams, finishing (macro)',
    'Hardware: chains, buttons, engravings',
    'Material/texture',
    'Packaging: dustbag, box, tags (if available)',
  ]

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-white">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-white border-2 border-black flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-4 uppercase tracking-tight">PRODUCT ADDED!</h1>
          <p className="text-gray-700 mb-2">
            Your product is now live.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/seller/dashboard" 
              className="px-6 py-4 bg-black text-white font-semibold uppercase tracking-wide text-sm hover:bg-gray-800 transition-colors border-2 border-black"
            >
              DASHBOARD
            </Link>
            <button
              onClick={() => {
                setSuccess(false)
                setFormData({
                  title: '', description: '', price: '', originalPrice: '', category: '',
                  brand: '', model: '', sku: '', condition: '', defects: '',
                  isRepaired: false, repairDetails: '', hasReplacedParts: false,
                  replacedPartsDetails: '', city: '', serialCode: '', batchCode: '',
                  purchaseYear: '', purchasePlace: '', saleReason: '',
                })
                setPhotos([])
                setInvoicePhoto(null)
                setUsernameProofPhoto(null)
              }}
              className="px-6 py-4 border-2 border-black text-black font-semibold uppercase tracking-wide text-sm hover:bg-black hover:text-white transition-all"
            >
              ADD ANOTHER
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-white">
      <div className="container-treigo max-w-4xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/seller/dashboard" className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5 text-black" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-black uppercase tracking-tight">ADD NEW PRODUCT</h1>
            <p className="text-gray-600 text-sm">Complete all product details</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-6 bg-red-50 border-l-4 border-black text-black flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photos Section */}
          <div className="bg-white border-2 border-black p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-black flex items-center gap-2 uppercase tracking-wide">
                <Camera className="w-5 h-5 text-black" />
                PRODUCT PHOTOS *
              </h2>
              <button type="button" onClick={() => setShowPhotoGuide(!showPhotoGuide)} className="text-sm text-black hover:opacity-70 flex items-center gap-1 font-semibold uppercase tracking-wide">
                {showPhotoGuide ? 'HIDE' : 'SHOW'}
                {showPhotoGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showPhotoGuide && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-300">
                <p className="text-sm font-semibold text-black mb-3">📸 PHOTO GUIDELINES:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {photoRequirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-black flex-shrink-0 mt-0.5 font-bold" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square bg-gray-100 border-2 border-black overflow-hidden group">
                  <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePhoto(photo.id)} className="absolute top-1 right-1 p-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {photos.length < 12 && (
                <label className="aspect-square border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
                  <Upload className="w-6 h-6 text-black mb-1" />
                  <span className="text-xs text-black font-semibold uppercase tracking-wide">ADD PHOTO</span>
                  <input type="file" accept="image/*" multiple onChange={(e) => handlePhotoUpload(e, 'product')} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-4 uppercase tracking-wide font-semibold">{photos.length}/12 PHOTOS • MIN 4 REQUIRED</p>
          </div>

          {/* Basic Info */}
          <div className="bg-white border-2 border-black p-8">
            <h2 className="text-lg font-semibold text-black mb-6 uppercase tracking-wide">BASIC INFORMATION</h2>
            
            <div className="grid gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">TITLE *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Louis Vuitton Neverfull MM" className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed" required />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">BRAND *</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Louis Vuitton" className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">MODEL</label>
                  <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Neverfull MM" className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">CATEGORY *</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black appearance-none" required>
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">SKU / REFERENCE</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. M40995" className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">DESCRIPTION *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the product in detail..." rows={5} className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black resize-none placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed" required />
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="bg-white border-2 border-black p-8">
            <h2 className="text-lg font-semibold text-black mb-6 uppercase tracking-wide">PRODUCT CONDITION</h2>
            
            <div className="grid gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-4 uppercase tracking-wide">CONDITION *</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {conditions.map(cond => (
                    <label key={cond.value} className={`p-4 border-2 cursor-pointer transition-all ${formData.condition === cond.value ? 'border-black bg-white' : 'border-gray-300 hover:border-black bg-white'}`}>
                      <input type="radio" name="condition" value={cond.value} checked={formData.condition === cond.value} onChange={handleChange} className="hidden" />
                      <p className="font-semibold text-black uppercase text-sm tracking-wide">{cond.label}</p>
                      <p className="text-sm text-gray-600">{cond.description}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">DECLARED DEFECTS</label>
                <textarea name="defects" value={formData.defects} onChange={handleChange} placeholder="Describe any scratches, stains, odor, wear, etc." rows={2} className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black resize-none placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white border-2 border-black p-8">
            <h2 className="text-lg font-semibold text-black mb-6 uppercase tracking-wide">PRICE & LOCATION</h2>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">PRICE (L) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="85000" className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">ORIGINAL PRICE (L)</label>
                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="120000" className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">CITY *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Tirana" className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed" required />
              </div>
            </div>
          </div>

          {/* Verification Section */}
          <div className="bg-gradient-to-br from-treigo-sage/20 to-treigo-cream rounded-xl border border-treigo-olive/10 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-treigo-forest rounded-xl">
                <BadgeCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-treigo-dark">Trèigo Verified Badge</h2>
                <p className="text-treigo-dark/70 text-sm">Verified products sell faster and build buyer trust.</p>
              </div>
              <button type="button" onClick={() => setShowVerificationInfo(!showVerificationInfo)} className="p-2 hover:bg-treigo-sage/30 rounded-lg transition-colors">
                <Info className="w-5 h-5 text-treigo-forest" />
              </button>
            </div>

            {showVerificationInfo && (
              <div className="mb-6 p-4 bg-white/50 rounded-lg text-sm">
                <p className="font-medium text-treigo-dark mb-2">For verification, you need:</p>
                <ul className="text-treigo-dark/70 space-y-1">
                  <li>• 8-12 photos following the checklist</li>
                  <li>• Username proof photo (your username + date + product)</li>
                  <li>• Invoice/receipt (optional but recommended)</li>
                  <li>• Serial/batch/date code</li>
                </ul>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link href="/seller/dashboard" className="px-6 py-4 text-center border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-all uppercase tracking-wide text-sm">
              CANCEL
            </Link>
            <button type="submit" disabled={isLoading} className="px-8 py-4 bg-black text-white font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SAVING...
                </>
              ) : (
                'PUBLISH PRODUCT'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
