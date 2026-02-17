import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Create a review
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let decoded: any
    try {
      decoded = verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const authorId = decoded.userId || decoded.id

    if (!authorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      targetId,
      shopId,
      orderId,
      rating,
      title,
      comment,
      reviewType = 'SELLER',
      qualityRating,
      communicationRating,
      shippingRating
    } = body

    // Validate fields
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!targetId && !shopId) {
      return NextResponse.json(
        { error: 'Either targetId or shopId is required' },
        { status: 400 }
      )
    }

    // Check if user already reviewed (prevent duplicate reviews for same order)
    if (orderId) {
      const existingReview = await prisma.review.findFirst({
        where: {
          authorId,
          orderId
        }
      })

      if (existingReview) {
        return NextResponse.json(
          { error: 'You have already reviewed this order' },
          { status: 409 }
        )
      }
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        authorId,
        targetId,
        shopId,
        orderId,
        rating,
        title,
        comment,
        reviewType,
        qualityRating,
        communicationRating,
        shippingRating,
        isVerifiedPurchase: !!orderId
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        }
      }
    })

    // Update target user or shop rating
    if (targetId) {
      const allReviews = await prisma.review.findMany({
        where: { targetId }
      })

      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      // Update user trust score if it's a seller
      const user = await prisma.user.findUnique({
        where: { id: targetId }
      })

      if (user?.role === 'SELLER') {
        const shop = await prisma.shop.findUnique({
          where: { userId: targetId }
        })

        if (shop) {
          await prisma.shop.update({
            where: { id: shop.id },
            data: {
              averageRating: avgRating,
              totalReviews: allReviews.length,
              trustScore: avgRating * 100 / 5 // Convert to percentage
            }
          })
        }
      }
    } else if (shopId) {
      const allReviews = await prisma.review.findMany({
        where: { shopId }
      })

      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      await prisma.shop.update({
        where: { id: shopId },
        data: {
          averageRating: avgRating,
          totalReviews: allReviews.length,
          trustScore: avgRating * 100 / 5
        }
      })
    }

    return NextResponse.json({
      message: 'Review created successfully',
      review
    }, { status: 201 })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

// Get all reviews
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const targetId = searchParams.get('targetId')
    const shopId = searchParams.get('shopId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!targetId && !shopId) {
      return NextResponse.json(
        { error: 'Either targetId or shopId is required' },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: {
        ...(targetId && { targetId }),
        ...(shopId && { shopId })
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.review.count({
      where: {
        ...(targetId && { targetId }),
        ...(shopId && { shopId })
      }
    })

    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0

    return NextResponse.json({
      reviews,
      total,
      averageRating: parseFloat(avgRating.toFixed(2)),
      limit,
      offset
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to get reviews' },
      { status: 500 }
    )
  }
}
