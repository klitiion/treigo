import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { sendMessageNotificationEmail } from '@/lib/email'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Send a message
export async function POST(request: NextRequest) {
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

    const senderId = decoded.userId || decoded.id

    if (!senderId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { receiverId, content, conversationId, productId } = body

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (senderId === receiverId) {
      return NextResponse.json(
        { error: 'Cannot send message to yourself' },
        { status: 400 }
      )
    }

    // Get sender info
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { firstName: true, lastName: true }
    })

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, email: true, firstName: true, lastName: true }
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      )
    }

    let conversation

    if (conversationId) {
      // Use existing conversation
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
      })

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        )
      }

      // Verify sender is part of conversation
      if (conversation.userId1 !== senderId && conversation.userId2 !== senderId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }
    } else {
      // Create or get conversation
      const userId1 = senderId < receiverId ? senderId : receiverId
      const userId2 = senderId < receiverId ? receiverId : senderId

      conversation = await prisma.conversation.upsert({
        where: {
          userId1_userId2: {
            userId1,
            userId2
          }
        },
        create: {
          userId1,
          userId2,
          ...(productId && { productId })
        },
        update: {}
      })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        receiverId,
        content,
        emailNotificationSent: false
      }
    })

    // Update conversation metadata
    const otherUserId = conversation.userId1 === senderId ? conversation.userId2 : conversation.userId1
    const isUser1 = conversation.userId1 === senderId
    
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
        lastMessageBy: senderId,
        ...(isUser1 
          ? { user2UnreadCount: { increment: 1 } }
          : { user1UnreadCount: { increment: 1 } }
        )
      }
    })

    // Send email notification
    if (sender && receiver) {
      const senderName = `${sender.firstName} ${sender.lastName}`
      const result = await sendMessageNotificationEmail(
        receiver.email,
        receiver.firstName,
        senderName,
        content,
        conversation.id,
        receiver.id
      )

      if (result.success) {
        // Mark email as sent
        await prisma.message.update({
          where: { id: message.id },
          data: { emailNotificationSent: true }
        })
      }
    }

    return NextResponse.json({
      message: 'Message sent successfully',
      data: {
        id: message.id,
        conversationId: conversation.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        createdAt: message.createdAt
      }
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
