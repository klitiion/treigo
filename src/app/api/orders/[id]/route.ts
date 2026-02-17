import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split('Bearer ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let decoded: any
    try {
      decoded = verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = decoded.userId || decoded.id

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        buyer: {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            email: true 
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true
              }
            },
            seller: {
              select: {
                id: true,
                name: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user is the buyer
    if (order.buyerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Format seller names
    const formattedOrder = {
      ...order,
      items: order.items.map((item: any) => ({
        ...item,
        seller: {
          ...item.seller,
          name: item.seller.name || `${item.seller.user.firstName} ${item.seller.user.lastName}`,
          email: item.seller.user.email
        }
      }))
    }

    return NextResponse.json(formattedOrder)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
