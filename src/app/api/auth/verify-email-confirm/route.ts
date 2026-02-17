import { NextRequest, NextResponse } from 'next/server'
import { getToken, deleteToken } from '@/lib/tokenStore'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // For development, we'll also check localStorage from the client if needed
    // Get the token data (in a real app, from database)
    const tokenData = getToken(token)

    if (!tokenData) {
      return NextResponse.json(
        { error: 'Verification link expired or invalid' },
        { status: 400 }
      )
    }

    // Check if token expired
    if (new Date(tokenData.expiresAt) < new Date()) {
      deleteToken(token)
      return NextResponse.json(
        { error: 'Verification link has expired' },
        { status: 400 }
      )
    }

    // Return token data for client to use
    // Delete token after successful verification
    deleteToken(token)
    
    return NextResponse.json({
      success: true,
      data: {
        newEmail: tokenData.newEmail,
        oldEmail: tokenData.oldEmail,
      },
    })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    )
  }
}
