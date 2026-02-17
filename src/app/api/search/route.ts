import { NextRequest, NextResponse } from 'next/server'

// Mock products data - in real app, would query database
const mockProducts = [
  {
    id: '1',
    title: 'Louis Vuitton Neverfull MM',
    slug: 'louis-vuitton-neverfull-mm',
    description: 'Çantë origjinale Louis Vuitton në gjendje të shkëlqyer. Monogram canvas, në gjendje të përkryer.',
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
    description: 'Sneakers origjinale Nike Air Jordan, të reja me kuti. Collab edition red and black.',
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
    description: 'Parfum origjinal Chanel, i ri i pahapur. Klasike dhe elegante për femra.',
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
    description: 'Bluzhe Zara premium në gjendje të shkëlqyer, e ri gati e papërdorur. Wool blend material.',
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
    description: 'Pantallona Zara të zeza, origjinale dhe të reja me etiketë. Premium denim quality.',
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
    title: 'Gucci GG Marmont Belt',
    slug: 'gucci-gg-marmont-belt',
    description: 'Brez origjinal Gucci me dizajnin GG Marmont të famshëm. Leather premium.',
    price: 25000,
    originalPrice: 35000,
    condition: 'LIKE_NEW',
    category: 'ACCESSORIES',
    brand: 'Gucci',
    trustBadge: true,
    verificationLevel: 'LEVEL_2',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 189,
    createdAt: '2024-01-19',
    shop: { id: 'shop6', name: 'LuxuryFinds', slug: 'luxuryfinds', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '7',
    title: 'Apple AirPods Pro',
    slug: 'apple-airpods-pro',
    description: 'Apple AirPods Pro, origjinale, të reja, aktive me passive noise cancellation.',
    price: 18000,
    originalPrice: 25000,
    condition: 'NEW',
    category: 'ACCESSORIES',
    brand: 'Apple',
    trustBadge: true,
    verificationLevel: 'LEVEL_1',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 276,
    createdAt: '2024-01-23',
    shop: { id: 'shop7', name: 'TechGadget', slug: 'techgadget', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '8',
    title: 'Rolex Submariner Replica',
    slug: 'rolex-submariner',
    description: 'Orë Rolex Submariner e butë, mekanizmi i saktë, ethe legjitime.',
    price: 120000,
    originalPrice: 200000,
    condition: 'GOOD',
    category: 'WATCHES',
    brand: 'Rolex',
    trustBadge: true,
    verificationLevel: 'LEVEL_3',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 512,
    createdAt: '2024-01-10',
    shop: { id: 'shop8', name: 'WatchCollector', slug: 'watchcollector', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '9',
    title: 'Prada Saffiano Leather Bag',
    slug: 'prada-saffiano-bag',
    description: 'Çantë Prada në lëkurë Saffiano, origjinale, burgundy color, në gjendje të përkryer.',
    price: 95000,
    originalPrice: 140000,
    condition: 'LIKE_NEW',
    category: 'BAGS',
    brand: 'Prada',
    trustBadge: true,
    verificationLevel: 'LEVEL_2',
    status: 'ACTIVE',
    city: 'Tiranë',
    viewCount: 267,
    createdAt: '2024-01-14',
    shop: { id: 'shop9', name: 'LuxuryFinds', slug: 'luxuryfinds', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
  {
    id: '10',
    title: 'Adidas Yeezy 350 Boost',
    slug: 'adidas-yeezy-350-boost',
    description: 'Adidas Yeezy 350 Boost Zebra, origjinale, të reja me kuti, verified authentic.',
    price: 45000,
    originalPrice: 65000,
    condition: 'NEW',
    category: 'SHOES',
    brand: 'Adidas',
    trustBadge: true,
    verificationLevel: 'LEVEL_2',
    status: 'ACTIVE',
    city: 'Durrës',
    viewCount: 401,
    createdAt: '2024-01-17',
    shop: { id: 'shop10', name: 'SneakerHead', slug: 'sneakerhead', isVerified: true },
    images: [{ url: '/images/placeholder.jpg', type: 'GENERAL', order: 0 }],
  },
]

// Calculate search relevance score
function calculateRelevance(product: any, query: string): number {
  const lowerQuery = query.toLowerCase()
  let score = 0

  // Exact title match (highest priority)
  if (product.title.toLowerCase() === lowerQuery) {
    score += 1000
  }
  // Title contains query
  if (product.title.toLowerCase().includes(lowerQuery)) {
    score += 500
  }
  // Title starts with query
  if (product.title.toLowerCase().startsWith(lowerQuery)) {
    score += 300
  }

  // Brand match
  if (product.brand && product.brand.toLowerCase().includes(lowerQuery)) {
    score += 400
  }

  // Description match
  if (product.description.toLowerCase().includes(lowerQuery)) {
    score += 150
  }

  // Category match
  if (product.category.toLowerCase().includes(lowerQuery)) {
    score += 100
  }

  // City match
  if (product.city.toLowerCase().includes(lowerQuery)) {
    score += 50
  }

  // Boost verified products
  if (product.trustBadge) {
    score += 200
  }

  // Boost by view count (popularity)
  score += Math.log(product.viewCount + 1) * 10

  return score
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.trim() || ''
    const category = searchParams.get('category')?.toUpperCase() || ''
    const condition = searchParams.get('condition') || ''
    const priceMin = searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : null
    const priceMax = searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : null
    const sortBy = searchParams.get('sort') || 'relevance'

    let results = [...mockProducts]

    // Filter by search query
    if (query) {
      // Split query into words for better matching
      const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0)
      
      results = results
        .map(product => ({
          ...product,
          relevanceScore: queryWords.reduce((acc, word) => acc + calculateRelevance(product, word), 0) / queryWords.length,
        }))
        .filter(product => product.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .map(({ relevanceScore, ...product }) => product)
    }

    // Filter by category
    if (category) {
      results = results.filter(p => p.category === category)
    }

    // Filter by condition
    if (condition) {
      results = results.filter(p => p.condition === condition)
    }

    // Filter by price range
    if (priceMin !== null) {
      results = results.filter(p => p.price >= priceMin)
    }
    if (priceMax !== null) {
      results = results.filter(p => p.price <= priceMax)
    }

    // Sort results
    if (query && sortBy === 'relevance') {
      // Already sorted by relevance
    } else if (sortBy === 'price_asc') {
      results.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      results.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === 'popular') {
      results.sort((a, b) => b.viewCount - a.viewCount)
    }

    return NextResponse.json({
      success: true,
      query,
      filters: {
        category,
        condition,
        priceMin,
        priceMax,
        sort: sortBy,
      },
      count: results.length,
      results,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}
