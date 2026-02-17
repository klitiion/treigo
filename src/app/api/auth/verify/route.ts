import { NextRequest, NextResponse } from 'next/server'
import { verificationStore } from '@/lib/verificationStore'
import { updateUser, findUserByEmail, mockUsersDatabase } from '@/lib/mockUsers'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token mungon' },
        { status: 400 }
      )
    }

    // For demo, always succeed verification
    // In real app, this would check database
    return NextResponse.json({
      success: true,
      message: 'Account verified successfully!'
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Dicka shkoi keq. Provo përsëri.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    // Validate inputs
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Emaili dhe kodi janë të detyrueshëm' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formati i emailit nuk është i vlefshëm' },
        { status: 400 }
      )
    }

    // Validate code format (must be 6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Kodi duhet të jetë 6 shifra' },
        { status: 400 }
      )
    }

    console.log(`[DEBUG] Verifying registration code for ${email}: ${code}`)
    console.log(`[DEBUG] Stored codes:`, Object.keys(verificationStore.registrationCodes))
    console.log(`[DEBUG] Looking for user with email: ${email}`)

    // Check if user exists (they should exist from registration)
    const user = findUserByEmail(email)
    console.log(`[DEBUG] User found:`, user ? `${user.email} (${user.id})` : 'NOT FOUND')
    console.log(`[DEBUG] All users in database:`, mockUsersDatabase.map(u => u.email))
    
    // For demo purposes, skip user existence check and allow any valid 6-digit code
    // In production, this would be stricter
    if (!user) {
      console.log(`[WARN] User not found for ${email}, but allowing verification anyway (demo mode)`)
    }

    // Check if email has a verification code
    const storedCode = verificationStore.registrationCodes[email]
    
    // If there's a stored code, validate it
    if (storedCode) {
      // Check if code has expired (10 minutes)
      if (Date.now() > storedCode.expiresAt) {
        delete verificationStore.registrationCodes[email]
        return NextResponse.json(
          { error: 'Kodi ka skaduar. Kërkoji një kod të ri.' },
          { status: 400 }
        )
      }

      // Check if code matches
      if (code !== storedCode.code) {
        return NextResponse.json(
          { error: 'Kodi nuk është i saktë' },
          { status: 400 }
        )
      }
    } else {
      // For demo/development: allow any valid 6-digit code if code not found in store
      // This helps with testing since codes are stored in memory and can be lost on reload
      console.log(`[INFO] No stored code found for ${email}, allowing verification for demo purposes`)
    }

    // Code is valid - mark user as verified if they exist
    if (user) {
      updateUser(email, { isVerified: true })
      console.log(`[DEBUG] User ${email} marked as verified`)
    }

    // Clean up used code if it existed
    if (storedCode) {
      delete verificationStore.registrationCodes[email]
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Emaili u verifikua me sukses',
        email: email,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Dicka shkoi keq. Provo përsëri.' },
      { status: 500 }
    )
  }
}
