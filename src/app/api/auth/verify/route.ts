import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, code, verifyToken } = await request.json()
    
    // Accept both 'code' and 'verifyToken' parameter names
    const verificationCode = code || verifyToken

    console.log('[VERIFY] Request received for email:', email)
    console.log('[VERIFY] Verification code received:', verificationCode ? 'yes' : 'no')

    // Validate inputs
    if (!email || !verificationCode) {
      console.error('[VERIFY] Missing email or code')
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Account is already verified' },
        { status: 400 }
      )
    }

    // Check if verification code matches
    if (user.verifyToken !== verificationCode) {
      console.error('[VERIFY] Code mismatch for user:', user.id)
      console.error('[VERIFY] Expected:', user.verifyToken)
      console.error('[VERIFY] Got:', verificationCode)
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Check if code has expired
    if (!user.verifyExpires) {
      console.error('[VERIFY] No expiry date set for user:', user.id)
      return NextResponse.json(
        { error: 'Verification code is invalid' },
        { status: 400 }
      )
    }
    
    const now = new Date()
    if (now > user.verifyExpires) {
      console.error('[VERIFY] Code expired. Current time:', now, 'Expires at:', user.verifyExpires)
      return NextResponse.json(
        { error: 'Verification code has expired. Please register again.' },
        { status: 400 }
      )
    }
    
    console.log('[VERIFY] Code is valid and not expired')

    // Mark user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
        verifyExpires: null
      }
    })

    console.log('[VERIFY] User verified successfully:', updatedUser.id)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully!'
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
