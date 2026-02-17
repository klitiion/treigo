import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const dynamic = 'force-dynamic'

// Get seller's store details
export async function GET(request: NextRequest) {
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
    const userId = decoded.userId || decoded.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user to check if seller
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (user?.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Only sellers can access store' },
        { status: 403 }
      )
    }

    // Get store details
    const store = await prisma.shop.findUnique({
      where: { userId },
      include: {
        reviews: true,
        _count: {
          select: { products: true }
        }
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      store: {
        ...store,
        productsCount: store._count.products,
        _count: undefined
      }
    })
  } catch (error) {
    console.error('Get store error:', error)
    return NextResponse.json(
      { error: 'Failed to get store' },
      { status: 500 }
    )
  }
}

// Update seller's store details
export async function PUT(request: NextRequest) {
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
    const userId = decoded.userId || decoded.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      bio,
      website,
      storePhotoUrl
    } = body

    // Get user to check if seller
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (user?.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Only sellers can update store' },
        { status: 403 }
      )
    }

    // Update store
    const store = await prisma.shop.update({
      where: { userId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(bio && { bio }),
        ...(website && { website }),
        ...(storePhotoUrl && { 
          storePhotoUrl,
          storePhotoUploadedAt: new Date()
        })
      }
    })

    return NextResponse.json({
      message: 'Store updated successfully',
      store
    })
  } catch (error) {
    console.error('Update store error:', error)
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    )
  }
}
