import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateUsername } from '@/lib/bannedWords'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username } = body

    // Validate required fields
    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      )
    }

    console.log(`[DEBUG] Update username - Email: ${email}, Username: ${username}`)

    // Find user by email in Prisma
    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log(`[DEBUG] User found:`, user ? `${user.email}` : 'NOT FOUND')
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has already changed their username
    if (user.usernameChangedAt) {
      return NextResponse.json(
        { 
          error: 'You can only change your username once. Your username change has already been used.'
        },
        { status: 403 }
      )
    }

    // Validate username format and content
    const validation = validateUsername(username)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: validation.errors[0] || 'Invalid username',
          errors: validation.errors
        },
        { status: 400 }
      )
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'This username is already taken. Please choose another one.'
        },
        { status: 409 }
      )
    }

    // Update user's username and set usernameChangedAt timestamp
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: username.toLowerCase(),
        usernameChangedAt: new Date()
      }
    })

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update username' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Username updated successfully!',
        username: updatedUser.username
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update username error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
