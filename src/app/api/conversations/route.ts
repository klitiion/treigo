import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get('auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as { userId: string }
    
    // Fetch conversations for the user
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userId1: decoded.userId },
          { userId2: decoded.userId }
        ]
      },
      select: {
        id: true,
        user1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        },
        user2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        },
        lastMessage: true,
        lastMessageAt: true,
        lastMessageBy: true,
        product: {
          select: {
            id: true,
            title: true
          }
        },
        shop: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' },
      take: 50
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
