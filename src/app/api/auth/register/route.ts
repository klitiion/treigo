import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { validatePassword } from '@/lib/passwordValidator'

import { generateSlug } from '@/lib/utils'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      country, 
      city, 
      address,
      role = 'BUYER',
      businessName,
      nipt,
      taxRegistration,
      acceptsMarketing = true,
    } = body

    console.log('[REGISTER] Request received for email:', email)

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !country || !city || !address) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      )
    }

    console.log('[REGISTER] Checking for existing user:', email)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      console.log('[REGISTER] User already exists:', email)
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      )
    }

    // Validate seller-specific fields
    if (role === 'SELLER') {
      if (!businessName || !nipt || !taxRegistration) {
        return NextResponse.json(
          { error: 'Business name, NIPT, and tax registration are required for sellers' },
          { status: 400 }
        )
      }
      
      // Validate NIPT format (10 digits)
      if (!/^\d{10}$/.test(nipt.replace(/\s/g, ''))) {
        return NextResponse.json(
          { error: 'NIPT must be exactly 10 digits' },
          { status: 400 }
        )
      }
    }

    // Hash password
    console.log('[REGISTER] Hashing password')
    const hashedPassword = await hash(password, 12)

    // Generate random verification token (6 digit code)
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString()
    const verifyExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Generate random username
    const generateUsername = () => {
      const adjectives = ['swift', 'bright', 'keen', 'vivid', 'prime', 'noble', 'bold', 'stark', 'pure', 'wild']
      const nouns = ['falcon', 'arrow', 'tiger', 'phoenix', 'storm', 'zephyr', 'volt', 'pulse', 'wave', 'fire']
      const numbers = Math.floor(Math.random() * 9000) + 1000
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
      const noun = nouns[Math.floor(Math.random() * nouns.length)]
      return `${adj}${noun}${numbers}`
    }

    // Create user in database
    console.log('[REGISTER] Creating user in database')
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        country,
        city,
        address,
        username: generateUsername(),
        role: role === 'SELLER' ? 'SELLER' : 'BUYER',
        isVerified: false,
        verifyToken,
        verifyExpires,
      }
    })

    console.log('[REGISTER] User created successfully:', user.id, user.email, user.role)

    // Send verification email with code
    try {
      console.log('[REGISTER] Sending verification email to:', email)
      const emailResult = await sendVerificationEmail(email, firstName, verifyToken)
      if (!emailResult.success) {
        console.error('[REGISTER] Email send failed:', emailResult.error)
        // Log but don't fail - email service might be temporarily down
      } else {
        console.log('[REGISTER] Verification email sent successfully to', email)
      }
    } catch (emailError) {
      console.error('[REGISTER] Email service error:', emailError)
      // Log but don't fail - allow registration to complete
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful. Please check your email for the verification code.',
        userId: user.id,
        email: user.email,
        role: user.role
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('[REGISTER] Error caught:', error)
    
    // Detailed error logging for debugging
    let errorMessage = 'Registration failed. Please try again.'
    let detailedError = ''
    
    if (error instanceof Error) {
      console.error('[REGISTER] Error type:', error.name)
      console.error('[REGISTER] Error message:', error.message)
      console.error('[REGISTER] Error stack:', error.stack)
      detailedError = error.message
    }
    
    // Check if it's a Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any
      console.error('[REGISTER] Prisma error code:', prismaError.code)
      console.error('[REGISTER] Prisma error meta:', prismaError.meta)
      console.error('[REGISTER] Prisma error message:', prismaError.message)
      detailedError = `Prisma error ${prismaError.code}: ${prismaError.message}`
    }
    
    // Return detailed error in development, generic in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(isDevelopment && { details: detailedError })
      },
      { status: 500 }
    )
  }
}
