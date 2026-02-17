import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get all conversations for a user
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = decoded.userId || decoded.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all conversations for this user
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userId1: userId },
          { userId2: userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            shop: {
              select: {
                storePhotoUrl: true,
                name: true
              }
            }
          }
        },
        user2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            shop: {
              select: {
                storePhotoUrl: true,
                name: true
              }
            }
          }
        },
        product: {
          select: {
            id: true,
            title: true,
            images: {
              select: { url: true },
              take: 1
            }
          }
        },
        shop: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    })

    // Format response
    const formattedConversations = conversations.map(conv => ({
      id: conv.id,
      otherUser: conv.userId1 === userId ? conv.user2 : conv.user1,
      lastMessage: conv.lastMessage,
      lastMessageAt: conv.lastMessageAt,
      lastMessageBy: conv.lastMessageBy,
      unreadCount: conv.userId1 === userId ? conv.user1UnreadCount : conv.user2UnreadCount,
      product: conv.product,
      shop: conv.shop,
      messageCount: conv._count.messages
    }))

    return NextResponse.json({
      conversations: formattedConversations
    })
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversations' },
      { status: 500 }
    )
  }
}
