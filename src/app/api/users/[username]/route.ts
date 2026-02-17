import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username.toLowerCase()

    // Find user by username (case-insensitive)
    const user = await prisma.user.findFirst({
      where: { 
        username: {
          equals: username,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        city: true,
        country: true,
        role: true,
        isVerified: true,
        createdAt: true,
        avatarUrl: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If user is a seller, fetch shop information
    let shopData = null
    if (user.role === 'SELLER') {
      const shop = await prisma.shop.findFirst({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          bio: true,
          isVerified: true
        }
      })

      if (shop) {
        // Get shop stats - count through OrderItem
        const totalSales = await prisma.orderItem.count({
          where: { sellerId: shop.id }
        })

        const reviews = await prisma.review.findMany({
          where: { shop: { id: shop.id } },
          select: { rating: true }
        })

        const averageRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0

        shopData = {
          ...shop,
          trustScore: Math.floor(averageRating * 20),
          averageRating,
          totalReviews: reviews.length,
          totalSales
        }
      }
    }

    // Fetch reviews for the user
    const reviews = await prisma.review.findMany({
      where: {
        shop: { userId: user.id }
      },
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    // Fetch products if seller
    let products: any[] = []
    if (user.role === 'SELLER') {
      products = await prisma.product.findMany({
        where: {
          shop: { userId: user.id }
        },
        select: {
          id: true,
          title: true,
          price: true,
          images: true
        },
        take: 4,
        orderBy: { createdAt: 'desc' }
      })
    }

    return NextResponse.json({
      ...user,
      shop: shopData,
      reviews,
      products
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
