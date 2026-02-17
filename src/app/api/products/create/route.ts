import { NextRequest, NextResponse } from 'next/server'

// Mock database for products
const products: any[] = []

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
    const category = formData.get('category') as string
    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const condition = formData.get('condition') as string
    const city = formData.get('city') as string
    const requestVerification = formData.get('requestVerification') === 'true'
    const serialCode = formData.get('serialCode') as string
    const batchCode = formData.get('batchCode') as string
    const purchaseYear = formData.get('purchaseYear') as string
    const purchasePlace = formData.get('purchasePlace') as string
    const saleReason = formData.get('saleReason') as string
    
    // Validate required fields
    if (!title || !description || !price || !category || !brand || !condition || !city) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create product object
    const product = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      price,
      originalPrice,
      category,
      brand,
      model,
      condition,
      city,
      createdAt: new Date(),
      status: requestVerification ? 'PENDING_VERIFICATION' : 'PUBLISHED',
      requestVerification,
      serialCode,
      batchCode,
      purchaseYear,
      purchasePlace,
      saleReason,
      photos: [],
      rating: 5,
      reviews: 0,
      seller: {
        name: 'Seller Name',
        verified: false,
        rating: 5,
      }
    }
    
    // In a real application, you would save to database and handle file uploads
    // For now, just store in memory array
    products.push(product)
    
    // Send verification email if requested
    if (requestVerification) {
      // TODO: Send email to support@treigo.com
      console.log('Verification request sent for product:', product.id)
    }
    
    return NextResponse.json(
      { 
        message: 'Product created successfully',
        product 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    )
  }
}
