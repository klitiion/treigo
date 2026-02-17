import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

/**
 * This endpoint creates test data for development/demo purposes.
 * Should only be accessible in development mode.
 */
export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Test data creation disabled in production' },
        { status: 403 }
      )
    }

    const sellerEmail = 'klitionleskaj04@gmail.com'
    const royalButikEmail = 'klitionleskaj06@gmail.com'
    const buyerEmail = 'buyer@example.com'
    const password = 'demo1234'
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create or get seller user
    let seller = await prisma.user.findUnique({
      where: { email: sellerEmail }
    })
    
    if (!seller) {
      seller = await prisma.user.create({
        data: {
          email: sellerEmail,
          password: hashedPassword,
          firstName: 'Demo',
          lastName: 'Seller',
          phone: '+355 69 123 4567',
          country: 'AL',
          city: 'Tirana',
          address: 'Demo Street 123',
          username: 'demo_seller',
          role: 'SELLER',
          isVerified: true,
        }
      })
    }

    // Create or get Royal Butik seller
    let royalButikSeller = await prisma.user.findUnique({
      where: { email: royalButikEmail }
    })
    
    if (!royalButikSeller) {
      royalButikSeller = await prisma.user.create({
        data: {
          email: royalButikEmail,
          password: hashedPassword,
          firstName: 'Royal',
          lastName: 'Butik',
          phone: '+355 69 555 6666',
          country: 'AL',
          city: 'Tirana',
          address: 'Myslym Shyr Street, Tirana',
          username: 'royal_butik',
          role: 'SELLER',
          isVerified: true,
        }
      })
    }

    // Create or get buyer user
    let buyer = await prisma.user.findUnique({
      where: { email: buyerEmail }
    })
    
    if (!buyer) {
      buyer = await prisma.user.create({
        data: {
          email: buyerEmail,
          password: hashedPassword,
          firstName: 'Demo',
          lastName: 'Buyer',
          phone: '+355 69 765 4321',
          country: 'AL',
          city: 'Durrës',
          address: 'Demo Avenue 456',
          username: 'demo_buyer',
          role: 'BUYER',
          isVerified: true,
        }
      })
    }

    // Create or get seller's shop
    let shop = await prisma.shop.findUnique({
      where: { userId: seller.id }
    })
    
    if (!shop) {
      shop = await prisma.shop.create({
        data: {
          userId: seller.id,
          name: 'Demo Premium Store',
          slug: 'demo-premium-store',
          description: 'A demonstration premium store showcasing high-quality products',
          isVerified: true,
          trustScore: 95,
          totalSales: 1,
        }
      })
    }

    // Create or get dummy product
    let product = await prisma.product.findFirst({
      where: {
        shopId: shop.id,
        slug: 'premium-vintage-watch-demo'
      }
    })
    
    if (!product) {
      product = await prisma.product.create({
        data: {
          shopId: shop.id,
          title: 'Premium Vintage Watch - Demo Product',
          slug: 'premium-vintage-watch-demo',
          description: 'A beautiful vintage watch in excellent condition. This is a demo product for testing the marketplace functionality.',
          price: 250.00,
          originalPrice: 400.00,
          category: 'WATCHES',
          brand: 'Rolex',
          model: 'Submariner',
          sku: 'DEMO-WATCH-001',
          condition: 'LIKE_NEW',
          status: 'ACTIVE',
          verificationLevel: 'LEVEL_2',
          trustBadge: true,
          city: 'Tirana',
          country: 'Albania',
          viewCount: 5,
        }
      })

      // Add image to product
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YwZjBmMCIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMTUwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMTAgZmlsbD0iIzAwMDAwMCIvPjxsaW5lIHgxPSIyMDAiIHkxPSIyMDAiIHgyPSIyMDAiIHkyPSIxMjAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+PGxpbmUgeDE9IjIwMCIgeTE9IjIwMCIgeDI9IjI2MCIgeTI9IjIwMCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjMiLz48L3N2Zz4=',
          type: 'GENERAL',
          order: 0
        }
      })
    }
    // Create or get Royal Butik's shop
    let royalButikShop = await prisma.shop.findUnique({
      where: { userId: royalButikSeller.id }
    })
    
    if (!royalButikShop) {
      royalButikShop = await prisma.shop.create({
        data: {
          userId: royalButikSeller.id,
          name: 'Royal Butik Myslym Shyr',
          slug: 'royal-butik-myslym-shyr',
          description: 'Premium fashion and accessories - trusted seller on Trèigo',
          isVerified: true,
          trustScore: 98,
          totalSales: 120,
        }
      })
    }

    // Create or get products for Royal Butik
    let royalProduct1 = await prisma.product.findFirst({
      where: {
        shopId: royalButikShop.id,
        slug: 'designer-dress-collection'
      }
    })
    
    if (!royalProduct1) {
      royalProduct1 = await prisma.product.create({
        data: {
          shopId: royalButikShop.id,
          title: 'Designer Dress Collection - Premium Fashion',
          slug: 'designer-dress-collection',
          description: 'Luxury designer dress in excellent condition. Perfect for special occasions.',
          price: 35000,
          originalPrice: 80000,
          category: 'CLOTHING',
          brand: 'Valentino',
          model: 'Haute Couture Dress',
          sku: 'RB-DRESS-001',
          condition: 'LIKE_NEW',
          status: 'ACTIVE',
          verificationLevel: 'LEVEL_2',
          trustBadge: false,
          city: 'Tirana',
          country: 'Albania',
          viewCount: 45,
        }
      })

      // Add image to royal product 1
      await prisma.productImage.create({
        data: {
          productId: royalProduct1.id,
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5EZXNpZ25lciBEcmVzcyBDb2xsZWN0aW9uPC90ZXh0Pjwvc3ZnPg==',
          type: 'GENERAL',
          order: 0
        }
      })
    }

    let royalProduct2 = await prisma.product.findFirst({
      where: {
        shopId: royalButikShop.id,
        slug: 'luxury-watch-premium'
      }
    })
    
    if (!royalProduct2) {
      royalProduct2 = await prisma.product.create({
        data: {
          shopId: royalButikShop.id,
          title: 'Luxury Watch - Premium Timepiece',
          slug: 'luxury-watch-premium',
          description: 'High-end luxury watch in perfect working condition.',
          price: 125000,
          originalPrice: 250000,
          category: 'WATCHES',
          brand: 'Rolex',
          model: 'Datejust',
          sku: 'RB-WATCH-001',
          condition: 'LIKE_NEW',
          status: 'ACTIVE',
          verificationLevel: 'LEVEL_3',
          trustBadge: false,
          city: 'Tirana',
          country: 'Albania',
          viewCount: 89,
        }
      })

      // Add image to royal product 2
      await prisma.productImage.create({
        data: {
          productId: royalProduct2.id,
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YwZmZkYyIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMTUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkYWEwNjMiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==',
          type: 'GENERAL',
          order: 0
        }
      })
    }
    // Create order from buyer
    const order = await prisma.order.create({
      data: {
        buyerId: buyer.id,
        orderNumber: `DEMO-${Date.now()}`,
        status: 'DELIVERED',
        paymentMethod: 'CASH_ON_DELIVERY',
        paymentStatus: 'PAID',
        subtotal: product.price,
        shippingCost: 5.00,
        total: product.price + 5.00,
        shippingFirstName: buyer.firstName,
        shippingLastName: buyer.lastName,
        shippingEmail: buyer.email,
        shippingPhone: buyer.phone,
        shippingAddress: buyer.address,
        shippingCity: buyer.city,
        shippingPostalCode: '2000',
        shippingCountry: buyer.country,
        notes: 'Demo order for testing',
        paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        shippedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      }
    })

    // Add order item
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        sellerId: shop.id,
        price: product.price,
        quantity: 1,
        itemStatus: 'DELIVERED'
      }
    })

    // Create review from buyer to seller
    const review = await prisma.review.create({
      data: {
        authorId: buyer.id,
        targetId: seller.id,
        shopId: shop.id,
        rating: 5,
        title: 'Excellent Product and Service!',
        comment: 'This is a demo review. The seller provided excellent service, the product arrived in perfect condition, and communication was great throughout the process.',
        isVerifiedPurchase: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Test data created successfully',
      data: {
        seller: {
          id: seller.id,
          email: seller.email,
          name: `${seller.firstName} ${seller.lastName}`,
          shop: {
            id: shop.id,
            name: shop.name,
            slug: shop.slug
          }
        },
        royalButik: {
          id: royalButikSeller.id,
          email: royalButikSeller.email,
          name: `${royalButikSeller.firstName} ${royalButikSeller.lastName}`,
          shop: {
            id: royalButikShop.id,
            name: royalButikShop.name,
            slug: royalButikShop.slug,
            url: `/shop/${royalButikShop.slug}`
          }
        },
        buyer: {
          id: buyer.id,
          email: buyer.email,
          name: `${buyer.firstName} ${buyer.lastName}`,
        },
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          url: `/product/${product.id}`
        },
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total
        },
        credentials: {
          seller_email: sellerEmail,
          royal_butik_email: royalButikEmail,
          buyer_email: buyerEmail,
          password: password
        }
      }
    })
  } catch (error) {
    console.error('Error creating test data:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create test data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
