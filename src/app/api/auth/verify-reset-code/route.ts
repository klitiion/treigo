import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { verificationStore, cleanupExpiredCodes } from '@/lib/verificationStore'

export async function POST(request: NextRequest) {
  try {
    // Clean up expired codes first
    cleanupExpiredCodes()

    const body = await request.json()
    const { email, code } = body

    // Normalize email to lowercase and trim
    const normalizedEmail = (email || '').toLowerCase().trim()

    console.log(`[VERIFY-RESET] Attempting to verify code`)
    console.log(`[VERIFY-RESET] Received email: "${email}"`)
    console.log(`[VERIFY-RESET] Normalized email: "${normalizedEmail}"`)
    console.log(`[VERIFY-RESET] Received code: "${code}"`)
    console.log(`[VERIFY-RESET] Available emails in store:`, Object.keys(verificationStore.resetCodes))
    console.log(`[VERIFY-RESET] Full store:`, JSON.stringify(verificationStore.resetCodes, null, 2))

    // Validate inputs
    if (!email || !code) {
      console.log(`[VERIFY-RESET] Missing email or code`)
      return NextResponse.json(
        { error: 'Email-i dhe kodi janë të detyrueshëm' },
        { status: 400 }
      )
    }

    // Check if email has a reset code
    const storedCode = verificationStore.resetCodes[normalizedEmail]
    if (!storedCode) {
      console.log(`[VERIFY-RESET] No code found for "${normalizedEmail}" in store`)
      console.log(`[VERIFY-RESET] Available emails:`, Object.keys(verificationStore.resetCodes))
      return NextResponse.json(
        { error: 'Code not found. Try requesting a password reset again.' },
        { status: 400 }
      )
    }

    // Check if code has expired (10 minutes)
    const now = Date.now()
    if (now > storedCode.expiresAt) {
      console.log(`[VERIFY-RESET] Code expired for ${normalizedEmail}`)
      delete verificationStore.resetCodes[normalizedEmail]
      return NextResponse.json(
        { error: 'Kodi ka skaduar. Kërkoji një kod të ri.' },
        { status: 400 }
      )
    }

    // Check if code matches
    if (code !== storedCode.code) {
      console.log(`[VERIFY-RESET] Code mismatch for ${normalizedEmail}. Expected "${storedCode.code}", got "${code}"`)
      return NextResponse.json(
        { error: 'Kodi nuk është i saktë' },
        { status: 400 }
      )
    }

    console.log(`[VERIFY-RESET] Code verified successfully for ${normalizedEmail}`)

    // Code is valid - generate reset token
    const resetToken = randomBytes(32).toString('hex')
    verificationStore.resetTokens[resetToken] = {
      email: normalizedEmail,
      expiresAt: Date.now() + 1000 * 60 * 15, // 15 minutes
    }

    // Clean up used code
    delete verificationStore.resetCodes[normalizedEmail]

    console.log(`[VERIFY-RESET] Reset token generated: ${resetToken}`)

    return NextResponse.json(
      {
        success: true,
        resetToken,
        message: 'Code verified. Now set your new password.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[VERIFY-RESET] Error:', error)
    return NextResponse.json(
      { error: 'Dicka shkoi keq. Provo përsëri.' },
      { status: 500 }
    )
  }
}


