'use client'

import { useState } from 'react'
import { X, Upload, AlertCircle } from 'lucide-react'

interface ProductRequestModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
}

export function ProductRequestModal({ isOpen, onClose, userId }: ProductRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    productName: '',
    productLink: '',
    description: '',
    productImage: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        productImage: file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!userId) {
      setError('Please log in to make a product request')
      return
    }

    if (!formData.productName.trim() || !formData.description.trim()) {
      setError('Product name and description are required')
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      submitData.append('buyerId', userId)
      submitData.append('productName', formData.productName)
      submitData.append('description', formData.description)
      if (formData.productLink) {
        submitData.append('productLink', formData.productLink)
      }
      if (formData.productImage) {
        submitData.append('productImage', formData.productImage)
      }

      const response = await fetch('/api/product-requests', {
        method: 'POST',
        body: submitData,
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setFormData({
          productName: '',
          productLink: '',
          description: '',
          productImage: null,
        })
        setImagePreview(null)

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose()
          setSuccess(false)
        }, 2000)
      } else {
        setError(data.error || 'Failed to create request')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-black">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-black sticky top-0 bg-white">
          <h2 className="text-2xl font-bold uppercase tracking-wide">REQUEST A PRODUCT</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-black mb-2">REQUEST SUBMITTED!</h3>
              <p className="text-gray-700">
                Your product request has been sent to all sellers. We'll notify them to help you find what you're looking for.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-black mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g., Louis Vuitton Neverfull MM Monogram"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none"
                />
                <p className="text-xs text-gray-600 mt-1">Be specific about the product you're looking for</p>
              </div>

              {/* Product Link */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-black mb-2">
                  Product Link (Optional)
                </label>
                <input
                  type="url"
                  name="productLink"
                  value={formData.productLink}
                  onChange={handleChange}
                  placeholder="https://example.com/product"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none"
                />
                <p className="text-xs text-gray-600 mt-1">Link to the product page if you found it online</p>
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-black mb-2">
                  Product Image (Optional)
                </label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-64 object-cover border-2 border-black"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null)
                          setFormData(prev => ({ ...prev, productImage: null }))
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-400 rounded-lg p-8 cursor-pointer hover:border-black hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center">
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="font-semibold text-gray-700">Click to upload image</p>
                      <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB</p>
                      <input
                        type="file"
                        name="productImage"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-black mb-2">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product in detail - brand, model, condition, color, size, special features, etc."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-600 mt-1">Detailed description helps sellers find the exact product you want</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 font-bold uppercase tracking-wide transition-colors ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>

              <p className="text-xs text-gray-600 text-center">
                Your request will be visible to all sellers in our marketplace
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
