import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/emails'

interface CheckoutRequest {
  buyerId: string
  items: Array<{
    productId: string
    sellerId: string
    quantity: number
    price: number
  }>
  shippingInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  subtotal: number
  shippingCost: number
  total: number
  paymentStatus: 'COMPLETED' | 'PENDING' | 'FAILED'
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json()

    // Validate required fields
    if (!body.buyerId || !body.items || !body.shippingInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        buyerId: body.buyerId,
        shippingFirstName: body.shippingInfo.firstName,
        shippingLastName: body.shippingInfo.lastName,
        shippingEmail: body.shippingInfo.email,
        shippingPhone: body.shippingInfo.phone,
        shippingAddress: body.shippingInfo.address,
        shippingCity: body.shippingInfo.city,
        shippingPostalCode: body.shippingInfo.postalCode,
        shippingCountry: 'Albania',
        paymentMethod: 'CARD',
        paymentStatus: body.paymentStatus === 'COMPLETED' ? 'PAID' : 'PENDING',
        subtotal: body.subtotal,
        shippingCost: body.shippingCost,
        total: body.total,
        status: body.paymentStatus === 'COMPLETED' ? 'CONFIRMED' : 'PENDING',
        paidAt: body.paymentStatus === 'COMPLETED' ? new Date() : null,
        items: {
          create: body.items.map(item => ({
            productId: item.productId,
            sellerId: item.sellerId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      } as any,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      } as any,
    })

    // Generate order code
    const orderCode = `TRG-${order.createdAt.getFullYear()}-${order.id.substring(0, 8).toUpperCase()}`

    // Send confirmation email for both COMPLETED and PENDING payments
    try {
      await sendOrderConfirmationEmail(body.shippingInfo.email, orderCode, {
        firstName: body.shippingInfo.firstName,
        lastName: body.shippingInfo.lastName,
        total: body.total,
        items: body.items.map(item => ({
          name: `Product ${item.productId}`, // In real app, fetch product name
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: body.shippingInfo.address,
        shippingCity: body.shippingInfo.city,
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        orderCode,
        total: order.total,
        status: order.status,
      },
    })
  } catch (error) {
    console.error('Error completing checkout:', error)
    return NextResponse.json(
      { error: 'Failed to complete checkout' },
      { status: 500 }
    )
  }
}
