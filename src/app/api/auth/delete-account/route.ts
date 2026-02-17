import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
import { sendDeleteAccountEmail } from '@/lib/email'

// Mock database
let deletedUsers: Array<{
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  deletedAt: Date
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, firstName, lastName, phone } = body

    // Validate required fields
    if (!userId || !email || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'Të gjitha fushat janë të detyrueshme' },
        { status: 400 }
      )
    }

    // Mark user as deleted (soft delete)
    const deletedAt = new Date()
    const user = {
      id: userId,
      email,
      firstName,
      lastName,
      phone,
      deletedAt,
    }

    // Add to mock deleted users list
    deletedUsers.push(user)

    // Send deletion confirmation email
    try {
      await sendDeleteAccountEmail(email, firstName)
    } catch (emailError) {
      console.error('Email send failed:', emailError)
      // Continue anyway for demo
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your account has been successfully deleted. Your data will be retained for 30 days.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: 'Dicka shkoi keq gjatë fshirjes së llogaris' },
      { status: 500 }
    )
  }
}
