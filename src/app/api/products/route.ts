import { NextRequest, NextResponse } from 'next/server'
import { sendProductVerificationRequest } from '@/lib/email'

// Mock products data
const mockProducts = [
  {
    id: '1',
    title: 'Louis Vuitton Neverfull MM',
    slug: 'louis-vuitton-neverfull-mm',
    description: 'Çantë origjinale Louis Vuitton në gjendje të shkëlqyer.',
    price: 85000,
    originalPrice: 120000,
    condition: 'LIKE_NEW',
    category: 'BAGS',
    brand: 'Louis Vuitton',
    trustBadge: true,
    verificationLevel: 'LEVEL_2',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 234,
    createdAt: '2024-01-15',
    shop: { id: 'shop1', name: 'LuxuryFinds', slug: 'luxuryfinds', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '2',
    title: 'Nike Air Jordan 1 Retro High OG',
    slug: 'nike-air-jordan-1-retro',
    description: 'Sneakers origjinale Nike Air Jordan, të reja me kuti.',
    price: 18500,
    condition: 'NEW',
    category: 'SHOES',
    brand: 'Nike',
    trustBadge: true,
    verificationLevel: 'LEVEL_2',
    status: 'ACTIVE',
    city: 'Durrës',
    viewCount: 156,
    createdAt: '2024-01-18',
    shop: { id: 'shop2', name: 'SneakerHead', slug: 'sneakerhead', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '3',
    title: 'Chanel No. 5 EDP 100ml',
    slug: 'chanel-no-5-edp',
    description: 'Parfum origjinal Chanel, i ri i pahapur.',
    price: 12000,
    originalPrice: 15000,
    condition: 'NEW',
    category: 'PERFUME',
    brand: 'Chanel',
    trustBadge: false,
    verificationLevel: 'PENDING',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 89,
    createdAt: '2024-01-20',
    shop: { id: 'shop3', name: 'ParfumeStore', slug: 'parfumestore', isVerified: false },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '4',
    title: 'Zara Oversized Wool Blazer',
    slug: 'zara-oversized-wool-blazer',
    description: 'Bluzhe Zara premium në gjendje të shkëlqyer, e ri gati e papërdorur.',
    price: 8500,
    originalPrice: 12000,
    condition: 'LIKE_NEW',
    category: 'CLOTHING',
    brand: 'Zara',
    trustBadge: true,
    verificationLevel: 'LEVEL_1',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 145,
    createdAt: '2024-01-22',
    shop: { id: 'shop4', name: 'ZaraVintage', slug: 'zaravintage', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '5',
    title: 'Zara Straight Leg Jeans',
    slug: 'zara-straight-leg-jeans',
    description: 'Pantallona Zara të zeza, origjinale dhe të reja me etiketë.',
    price: 4200,
    originalPrice: 6000,
    condition: 'NEW',
    category: 'CLOTHING',
    brand: 'Zara',
    trustBadge: true,
    verificationLevel: 'LEVEL_1',
    status: 'ACTIVE',
    city: 'Durrës',
    viewCount: 98,
    createdAt: '2024-01-21',
    shop: { id: 'shop5', name: 'DenimDeals', slug: 'denimdeals', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '6',
    title: 'Zara Satin Slip Dress',
    slug: 'zara-satin-slip-dress',
    description: 'Fustan Zara në material satinë, i ri dhe shumë elegant.',
    price: 5800,
    originalPrice: 8500,
    condition: 'LIKE_NEW',
    category: 'CLOTHING',
    brand: 'Zara',
    trustBadge: true,
    verificationLevel: 'LEVEL_1',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 112,
    createdAt: '2024-01-19',
    shop: { id: 'shop6', name: 'FashionHub', slug: 'fashionhub', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '7',
    title: 'Zara Leather Crossbody Bag',
    slug: 'zara-leather-crossbody',
    description: 'Çantë Zara në lëkurë origjinale, në gjendje shumë të mirë.',
    price: 12500,
    originalPrice: 18000,
    condition: 'GOOD',
    category: 'BAGS',
    brand: 'Zara',
    trustBadge: true,
    verificationLevel: 'LEVEL_1',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 134,
    createdAt: '2024-01-17',
    shop: { id: 'shop7', name: 'BagCollector', slug: 'bagcollector', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '8',
    title: 'Zara Knit Sweater - Cream',
    slug: 'zara-knit-sweater-cream',
    description: 'Triko Zara në nuancën bezhë, shumë i ngrohtë dhe komod.',
    price: 6200,
    originalPrice: 9000,
    condition: 'LIKE_NEW',
    category: 'CLOTHING',
    brand: 'Zara',
    trustBadge: false,
    verificationLevel: 'LEVEL_1',
    status: 'ACTIVE',
    city: 'Vlorë',
    viewCount: 76,
    createdAt: '2024-01-16',
    shop: { id: 'shop8', name: 'CozyCloset', slug: 'cozycloset', isVerified: false },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '9',
    title: 'Zara Structured Midi Skirt',
    slug: 'zara-structured-midi-skirt',
    description: 'Fundë Zara me struktur të mirë, i zi, i ri me etiketë.',
    price: 5500,
    originalPrice: 7900,
    condition: 'NEW',
    category: 'CLOTHING',
    brand: 'Zara',
    trustBadge: true,
    verificationLevel: 'LEVEL_1',
    status: 'ACTIVE',
    city: 'Durrës',
    viewCount: 88,
    createdAt: '2024-01-14',
    shop: { id: 'shop9', name: 'SkirtStyle', slug: 'skrtstyle', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '10',
    title: 'Zara Printed Shirt',
    slug: 'zara-printed-shirt',
    description: 'Këmishë Zara me dizajn të bukur, origjinale dhe në gjendje të mirë.',
    price: 4800,
    originalPrice: 7200,
    condition: 'GOOD',
    category: 'CLOTHING',
    brand: 'Zara',
    trustBadge: true,
    verificationLevel: 'LEVEL_1',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 102,
    createdAt: '2024-01-13',
    shop: { id: 'shop10', name: 'CasualWear', slug: 'casualwear', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '11',
    title: 'Zara Leather Ankle Boots',
    slug: 'zara-leather-ankle-boots',
    description: 'Çizme Zara në lëkurë të zezë, komode dhe stiloze.',
    price: 9500,
    originalPrice: 14000,
    condition: 'LIKE_NEW',
    category: 'SHOES',
    brand: 'Zara',
    trustBadge: true,
    verificationLevel: 'LEVEL_1',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 156,
    createdAt: '2024-01-12',
    shop: { id: 'shop11', name: 'BootsGalore', slug: 'bootsgalore', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
]

// GET /api/products - List products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const condition = searchParams.get('condition')
    const verified = searchParams.get('verified')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let products = [...mockProducts]

    // Filter
    if (category) {
      products = products.filter(p => p.category === category.toUpperCase())
    }

    if (condition) {
      products = products.filter(p => p.condition === condition.toUpperCase())
    }

    if (verified === 'true') {
      products = products.filter(p => p.trustBadge)
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice))
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice))
    }

    // Sort
    switch (sort) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        products.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        products.sort((a, b) => b.viewCount - a.viewCount)
        break
      default:
        products.reverse()
    }

    // Paginate
    const total = products.length
    const startIndex = (page - 1) * limit
    products = products.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Dicka shkoi keq' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      price,
      originalPrice,
      category,
      brand,
      model,
      sku,
      condition,
      defects,
      city,
      serialCode,
      batchCode,
      purchaseYear,
      purchasePlace,
      saleReason,
      requestVerification,
      photoCount,
      hasInvoice,
    } = body

    // Generate slug
    const baseSlug = `${brand}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const slug = `${baseSlug}-${Date.now().toString(36)}`

    // Create product
    const product = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      slug,
      description,
      price,
      originalPrice,
      category,
      brand,
      model,
      sku,
      condition,
      defects,
      city,
      status: requestVerification ? 'PENDING_REVIEW' : 'ACTIVE',
      verificationLevel: requestVerification ? 'PENDING' : 'PENDING',
      createdAt: new Date().toISOString(),
    }

    // If verification requested, send email
    if (requestVerification) {
      try {
        await sendProductVerificationRequest({
          productId: product.id,
          productTitle: title,
          brand,
          category,
          sellerName: 'Demo User',
          sellerEmail: 'demo@example.com',
          sellerPhone: '+355 69 xxx xxxx',
          shopName: 'Demo Shop',
          verificationLevel: 'LEVEL_2',
          proofDocuments: hasInvoice ? ['[Invoice URL]'] : [],
          photoUrls: Array(photoCount || 4).fill('[Photo URL]'),
          serialCode,
          batchCode,
          purchaseYear,
          purchasePlace,
          saleReason,
          condition,
          defects,
        })
      } catch (emailError) {
        console.error('Verification email failed:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      product,
      message: requestVerification 
        ? 'Produkti u shtua dhe dërgua për verifikim' 
        : 'Produkti u shtua me sukses',
    })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Dicka shkoi keq gjatë krijimit të produktit' },
      { status: 500 }
    )
  }
}
