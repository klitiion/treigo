import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get messages from a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const conversationId = params.id

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (conversation.userId1 !== userId && conversation.userId2 !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Mark messages as read for current user
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    // Reset unread count
    const isUser1 = conversation.userId1 === userId
    await prisma.conversation.update({
      where: { id: conversationId },
      data: isUser1 
        ? { user1UnreadCount: 0 }
        : { user2UnreadCount: 0 }
    })

    return NextResponse.json({
      messages
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    )
  }
}
