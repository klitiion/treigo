'use client'

import { Star } from 'lucide-react'

interface Review {
  id: string
  rating: number
  title: string
  comment: string
  qualityRating?: number
  communicationRating?: number
  shippingRating?: number
  author: {
    firstName: string
    lastName: string
    avatarUrl: string | null
  }
  createdAt: string
}

interface ReviewListProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  showDetailedBreakdown?: boolean
}

export function ReviewList({
  reviews,
  averageRating,
  totalReviews,
  showDetailedBreakdown = true
}: ReviewListProps) {
  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  )

  const getRatingBreakdown = (reviews: Review[]) => {
    const breakdown: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      breakdown[review.rating]++
    })
    return breakdown
  }

  const breakdown = getRatingBreakdown(reviews)
  const totalCount = reviews.length

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="border border-gray-200 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* left */}
          <div>
            <div className="mb-4">
              <p className="text-6xl font-bold text-black">{averageRating.toFixed(1)}</p>
              <div className="mt-2 mb-4">{renderStars(averageRating)}</div>
              <p className="text-gray-600">Based on {totalReviews} reviews</p>
            </div>
          </div>

          {/* Rating Distribution */}
          {showDetailedBreakdown && (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = breakdown[rating]
                const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-semibold w-8">{rating}</span>
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Individual Reviews */}
      <div>
        <h3 className="text-lg font-bold text-black mb-6 uppercase">Customer Reviews</h3>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  {review.author.avatarUrl ? (
                    <img
                      src={review.author.avatarUrl}
                      alt={review.author.firstName}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-black">
                          {review.author.firstName} {review.author.lastName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {review.title && (
                      <h5 className="font-semibold text-black mb-2">{review.title}</h5>
                    )}

                    <p className="text-gray-700 mb-4">{review.comment}</p>

                    {/* Detailed Ratings */}
                    {(review.qualityRating || review.communicationRating || review.shippingRating) && (
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        {review.qualityRating && (
                          <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">QUALITY</p>
                            <div className="flex">{renderStars(review.qualityRating)}</div>
                          </div>
                        )}
                        {review.communicationRating && (
                          <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">COMMUNICATION</p>
                            <div className="flex">{renderStars(review.communicationRating)}</div>
                          </div>
                        )}
                        {review.shippingRating && (
                          <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">SHIPPING</p>
                            <div className="flex">{renderStars(review.shippingRating)}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-12">No reviews yet</p>
        )}
      </div>
    </div>
  )
}
