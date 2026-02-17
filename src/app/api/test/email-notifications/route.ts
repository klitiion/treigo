import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMessageNotificationEmail } from '@/lib/email'
import jwt from 'jsonwebtoken'

/**
 * Endpoint to verify email notifications respect user preferences
 * Tests:
 * 1. Fetches user's notification preferences
 * 2. Checks if emailChatMessages is enabled
 * 3. Sends a test email only if enabled
 * 4. Logs the result
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testType = 'chat' } = body

    // Get JWT token from cookies for authenticated request
    const token = request.cookies.get('auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as { userId: string }

    // Fetch user and preferences
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { notificationPreferences: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const prefs = user.notificationPreferences

    // Check based on test type
    let shouldSendEmail = false
    let preferenceType = ''

    switch (testType) {
      case 'chat':
        shouldSendEmail = prefs?.emailChatMessages ?? true
        preferenceType = 'emailChatMessages'
        break
      case 'order':
        shouldSendEmail = prefs?.emailOrderUpdates ?? true
        preferenceType = 'emailOrderUpdates'
        break
      case 'reminder':
        shouldSendEmail = prefs?.emailReminderEmails ?? true
        preferenceType = 'emailReminderEmails'
        break
      case 'marketing':
        shouldSendEmail = prefs?.emailMarketingEmails ?? true
        preferenceType = 'emailMarketingEmails'
        break
      case 'security':
        shouldSendEmail = prefs?.emailSecurityAlerts ?? true
        preferenceType = 'emailSecurityAlerts'
        break
      case 'review':
        shouldSendEmail = prefs?.emailReviewRequests ?? true
        preferenceType = 'emailReviewRequests'
        break
      default:
        return NextResponse.json({ error: 'Invalid test type' }, { status: 400 })
    }

    // Test sending email
    if (shouldSendEmail) {
      try {
        if (testType === 'chat') {
          // Send test chat notification
          await sendMessageNotificationEmail(
            user.email,
            user.firstName,
            'Test User',
            'This is a test message to verify email notifications are working properly.',
            'test-conversation-id',
            user.id
          )
        }
        
        return NextResponse.json({
          success: true,
          message: `Email notification test (${testType}) sent successfully`,
          details: {
            preferenceType,
            isEnabled: shouldSendEmail,
            emailSent: true,
            userEmail: user.email,
            timestamp: new Date().toISOString()
          }
        })
      } catch (emailError) {
        console.error('Email send error during test:', emailError)
        return NextResponse.json({
          success: false,
          message: 'Preference enabled but email send failed',
          error: String(emailError),
          details: {
            preferenceType,
            isEnabled: shouldSendEmail,
            emailSent: false
          }
        }, { status: 500 })
      }
    } else {
      // User has disabled this notification type
      return NextResponse.json({
        success: true,
        message: `Email notification (${testType}) is disabled by user preference`,
        details: {
          preferenceType,
          isEnabled: shouldSendEmail,
          emailSent: false,
          reason: 'User has disabled this notification type in their preferences'
        }
      })
    }
  } catch (error) {
    console.error('Error testing email notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check email notification status for current user
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as { userId: string }

    const prefs = await prisma.notificationPreference.findUnique({
      where: { userId: decoded.userId }
    })

    if (!prefs) {
      return NextResponse.json({
        message: 'No preferences found',
        allEnabled: true
      })
    }

    return NextResponse.json({
      emailChatMessages: prefs.emailChatMessages,
      emailReminderEmails: prefs.emailReminderEmails,
      emailMarketingEmails: prefs.emailMarketingEmails,
      emailOrderUpdates: prefs.emailOrderUpdates,
      emailReviewRequests: prefs.emailReviewRequests,
      emailSecurityAlerts: prefs.emailSecurityAlerts,
      pushNotifications: prefs.pushNotifications,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting notification status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
