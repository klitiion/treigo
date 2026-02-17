'use client'

import { useState } from 'react'
import { Star, Loader2 } from 'lucide-react'

interface ReviewRatingProps {
  targetId: string
  shopId?: string
  orderId?: string
  targetName: string
  reviewType: 'SELLER' | 'BUYER'
  onSubmit: (review: ReviewData) => Promise<void>
  onCancel: () => void
}

interface ReviewData {
  rating: number
  title: string
  comment: string
  qualityRating?: number
  communicationRating?: number
  shippingRating?: number
}

export function ReviewRatingComponent({
  targetId,
  shopId,
  orderId,
  targetName,
  reviewType,
  onSubmit,
  onCancel
}: ReviewRatingProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [qualityRating, setQualityRating] = useState(5)
  const [communicationRating, setCommunicationRating] = useState(5)
  const [shippingRating, setShippingRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !comment.trim()) {
      setError('Please fill in all fields')
      return
    }

    setSubmitting(true)
    try {
      const reviewData: ReviewData = {
        rating,
        title,
        comment,
        ...(reviewType === 'SELLER' && {
          qualityRating,
          communicationRating,
          shippingRating
        })
      }

      await onSubmit(reviewData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStarInput = (currentRating: number, setRating: (r: number) => void, hoverValue: number) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={32}
            className={
              (hoverValue || currentRating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className="bg-white border-2 border-black p-8 max-w-2xl w-full rounded-lg">
      <h2 className="text-2xl font-bold text-black mb-8 uppercase">RATE {targetName.toUpperCase()}</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-semibold text-black mb-4 uppercase">OVERALL RATING</label>
          {renderStarInput(rating, setRating, hoverRating)}
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-sm font-semibold text-black mb-3 uppercase">TITLE</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief summary of your experience"
            maxLength={100}
            className="w-full px-4 py-3 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-gray-600 mt-1">{title.length}/100</p>
        </div>

        {/* Review Comment */}
        <div>
          <label className="block text-sm font-semibold text-black mb-3 uppercase">YOUR REVIEW</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What was your experience? Would you recommend this seller/buyer?"
            rows={5}
            maxLength={1000}
            className="w-full px-4 py-3 border-2 border-black rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
          <p className="text-xs text-gray-600 mt-1">{comment.length}/1000</p>
        </div>

        {/* Detailed Ratings (for seller reviews only) */}
        {reviewType === 'SELLER' && (
          <div className="bg-gray-50 p-6 border border-gray-200 rounded space-y-6">
            <h3 className="font-semibold text-black uppercase">DETAILED FEEDBACK</h3>

            {/* Quality Rating */}
            <div>
              <label className="block text-sm font-semibold text-black mb-3 uppercase">PRODUCT QUALITY</label>
              {renderStarInput(qualityRating, setQualityRating, 0)}
            </div>

            {/* Communication Rating */}
            <div>
              <label className="block text-sm font-semibold text-black mb-3 uppercase">COMMUNICATION</label>
              {renderStarInput(communicationRating, setCommunicationRating, 0)}
            </div>

            {/* Shipping Rating */}
            <div>
              <label className="block text-sm font-semibold text-black mb-3 uppercase">SHIPPING & DELIVERY</label>
              {renderStarInput(shippingRating, setShippingRating, 0)}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                SUBMITTING...
              </>
            ) : (
              'SUBMIT REVIEW'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border-2 border-black text-black font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors rounded"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  )
}
