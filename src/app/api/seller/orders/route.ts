import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sellerId = searchParams.get('sellerId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    // Build query filter
    const where: any = {
      items: {
        some: {
          sellerId: sellerId,
        },
      },
    }

    if (status) {
      where.items.some.itemStatus = status
    }

    // Get total count
    const total = await prisma.orderItem.count({
      where: {
        sellerId: sellerId,
        ...(status && { itemStatus: status as any }),
      } as any,
    })

    // Get paginated orders
    const orderItems = await prisma.orderItem.findMany({
      where: {
        sellerId: sellerId,
        ...(status && { itemStatus: status as any }),
      } as any,
      include: {
        order: {
          include: {
            buyer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        product: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        order: {
          createdAt: 'desc',
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: orderItems,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching seller orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderItemId, status } = body

    if (!orderItemId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updatedItem = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        itemStatus: status as any,
        ...(status === 'SHIPPED' && {
          order: {
            update: {
              shippedAt: new Date(),
            },
          },
        }),
        ...(status === 'DELIVERED' && {
          order: {
            update: {
              deliveredAt: new Date(),
            },
          },
        }),
      } as any,
      include: {
        order: true,
        product: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedItem,
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
