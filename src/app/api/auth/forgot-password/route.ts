import { NextRequest, NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '@/lib/email'
import { verificationStore, generateVerificationCode, cleanupExpiredCodes } from '@/lib/verificationStore'

export async function POST(request: NextRequest) {
  try {
    // Clean up expired codes first
    cleanupExpiredCodes()

    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email-i është i detyrueshëm' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formati i emailit nuk është i vlefshëm' },
        { status: 400 }
      )
    }

    // Generate reset code
    const resetCode = generateVerificationCode()
    const expiresAt = Date.now() + 1000 * 60 * 10 // 10 minutes for security

    // Store reset code (normalize email to lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim()
    verificationStore.resetCodes[normalizedEmail] = {
      code: resetCode,
      expiresAt,
    }

    console.log(`[FORGOT-PASSWORD] Generated reset code for ${normalizedEmail}: ${resetCode}`)
    console.log(`[FORGOT-PASSWORD] Store now contains:`, Object.keys(verificationStore.resetCodes))
    console.log(`[FORGOT-PASSWORD] Full store:`, JSON.stringify(verificationStore.resetCodes))

    // Send reset email with code
    try {
      const firstName = email.split('@')[0]
      await sendPasswordResetEmail(email, firstName, resetCode)
    } catch (emailError) {
      console.error('Email send failed:', emailError)
      // Continue anyway for demo
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Kontrollo emailin tuaj për kodin e verifikimit.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Dicka shkoi keq. Provo përsëri.' },
      { status: 500 }
    )
  }
}


