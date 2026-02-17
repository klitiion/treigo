import { prisma } from './prisma'

export async function saveOrderToDatabase(orderData: {
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
}) {
  try {
    const order = await prisma.order.create({
      data: {
        buyerId: orderData.buyerId,
        shippingFirstName: orderData.shippingInfo.firstName,
        shippingLastName: orderData.shippingInfo.lastName,
        shippingEmail: orderData.shippingInfo.email,
        shippingPhone: orderData.shippingInfo.phone,
        shippingAddress: orderData.shippingInfo.address,
        shippingCity: orderData.shippingInfo.city,
        shippingPostalCode: orderData.shippingInfo.postalCode,
        shippingCountry: 'Albania',
        paymentMethod: 'CARD',
        paymentStatus: 'PAID',
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        total: orderData.total,
        status: 'CONFIRMED',
        paidAt: new Date(),
        items: {
          create: orderData.items.map(item => ({
            productId: item.productId,
            sellerId: item.sellerId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return order
  } catch (error) {
    console.error('Error saving order to database:', error)
    throw error
  }
}
