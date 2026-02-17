import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { validatePassword } from '@/lib/passwordValidator'

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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
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

    console.log(`[INFO] User created: ${user.email} with role: ${user.role}`)

    // Send verification email with code
    try {
      const emailResult = await sendVerificationEmail(email, firstName, verifyToken)
      if (!emailResult.success) {
        console.error('Email send failed:', emailResult.error)
        // Log but don't fail - email service might be temporarily down
      } else {
        console.log(`[INFO] Verification email sent to ${email}`)
      }
    } catch (emailError) {
      console.error('Email service error:', emailError)
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
