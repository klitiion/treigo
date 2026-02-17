import { NextRequest, NextResponse } from 'next/server'
import { mockUsersDatabase } from '@/lib/mockUsers'
import { validateUsername } from '@/lib/bannedWords'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username } = body

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Validate username format and content
    const validation = validateUsername(username)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          available: false,
          errors: validation.errors,
          message: validation.errors[0] || 'Invalid username'
        },
        { status: 400 }
      )
    }

    // Check if username is already taken
    const isUsernameTaken = mockUsersDatabase.some(
      u => u.username.toLowerCase() === username.toLowerCase()
    )

    if (isUsernameTaken) {
      return NextResponse.json(
        { 
          available: false,
          message: 'This username is already taken. Please choose another one.'
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { 
        available: true,
        message: 'Username is available!'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Check username error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
