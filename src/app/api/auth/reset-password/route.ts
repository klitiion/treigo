import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { validatePassword } from '@/lib/passwordValidator'
import { updateUser, findUserByEmail } from '@/lib/mockUsers'
import { verificationStore } from '@/lib/verificationStore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password, confirmPassword } = body

    // Validate inputs
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Të gjitha fushat janë të detyrueshme' },
        { status: 400 }
      )
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      )
    }

    // Verify token
    const resetData = verificationStore.resetTokens[token]
    if (!resetData) {
      return NextResponse.json(
        { error: 'Tokeni nuk është i vlefshëm' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (Date.now() > resetData.expiresAt) {
      delete verificationStore.resetTokens[token]
      return NextResponse.json(
        { error: 'Tokeni ka skaduar. Kërkoji një kod të ri.' },
        { status: 400 }
      )
    }

    // Get user by email
    const user = findUserByEmail(resetData.email)
    if (!user) {
      return NextResponse.json(
        { error: 'Përdoruesi nuk u gjet' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hash(password, 12)

    // Update user password in mock database
    updateUser(user.id, {
      password: hashedPassword,
    })

    // Clean up reset token
    delete verificationStore.resetTokens[token]

    return NextResponse.json(
      {
        success: true,
        message: 'Password changed successfully. You can now sign in with your new password.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Dicka shkoi keq. Provo përsëri.' },
      { status: 500 }
    )
  }
}


