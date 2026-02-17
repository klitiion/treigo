import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get('auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as { userId: string }
    
    // Fetch notification preferences
    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId: decoded.userId }
    })

    if (!preferences) {
      // Create default preferences if they don't exist
      const newPreferences = await prisma.notificationPreference.create({
        data: {
          userId: decoded.userId,
          emailChatMessages: true,
          emailReminderEmails: true,
          emailMarketingEmails: true,
          emailOrderUpdates: true,
          emailReviewRequests: true,
          emailSecurityAlerts: true,
          pushNotifications: true
        }
      })
      return NextResponse.json(newPreferences)
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get('auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as { userId: string }
    
    const body = await request.json()

    // Update notification preferences
    const updated = await prisma.notificationPreference.upsert({
      where: { userId: decoded.userId },
      update: body,
      create: {
        userId: decoded.userId,
        ...body
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
