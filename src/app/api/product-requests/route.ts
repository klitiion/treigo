import { NextRequest, NextResponse } from 'next/server'

// Mock product requests storage - in a real app, would use database
let mockProductRequests: any[] = []
let mockConversations: any[] = []

// Mock sellers list
const mockSellers = [
  {
    id: 'demo-seller-1',
    firstName: 'Jane',
    lastName: 'Seller',
    username: 'swiftfalcon5234',
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const buyerId = searchParams.get('buyerId')
    const status = searchParams.get('status')

    let results = [...mockProductRequests]

    if (buyerId) {
      results = results.filter(r => r.buyerId === buyerId)
    }

    if (status) {
      results = results.filter(r => r.status === status)
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    })
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { buyerId, productName, productLink, productImage, description } = body

    // Validate required fields
    if (!buyerId || !productName || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new request
    const newRequest = {
      id: Math.random().toString(36).substr(2, 9),
      buyerId,
      productName,
      productLink: productLink || null,
      productImage: productImage || null,
      description,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to mock storage
    mockProductRequests.push(newRequest)

    // Send notification to all sellers - create conversations
    try {
      // Create conversations between buyer and each seller
      for (const seller of mockSellers) {
        // Ensure consistent ordering of userIds
        const userId1 = buyerId < seller.id ? buyerId : seller.id
        const userId2 = buyerId < seller.id ? seller.id : buyerId

        // Check if conversation already exists
        const existingConversation = mockConversations.find(
          c => c.userId1 === userId1 && c.userId2 === userId2
        )

        if (existingConversation) {
          // Update existing conversation
          existingConversation.requestId = newRequest.id
          existingConversation.lastMessage = `New product request: ${productName}`
          existingConversation.lastMessageAt = new Date().toISOString()
          existingConversation.lastMessageBy = buyerId
        } else {
          // Create new conversation
          const conversation = {
            id: Math.random().toString(36).substr(2, 9),
            userId1,
            userId2,
            requestId: newRequest.id,
            lastMessage: `New product request: ${productName}`,
            lastMessageAt: new Date().toISOString(),
            lastMessageBy: buyerId,
            createdAt: new Date().toISOString(),
          }
          mockConversations.push(conversation)
        }
      }
    } catch (notificationError) {
      console.error('Error sending notifications to sellers:', notificationError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Product request created successfully and notifications sent to all sellers',
      request: newRequest,
    })
  } catch (error) {
    console.error('Error creating request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create request' },
      { status: 500 }
    )
  }
}
