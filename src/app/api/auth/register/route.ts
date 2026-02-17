import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { randomBytes } from 'crypto'
// import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { validatePassword } from '@/lib/passwordValidator'
import { createUser, findUserByEmail } from '@/lib/mockUsers'
import { verificationStore, generateVerificationCode } from '@/lib/verificationStore'

// Mock database for demo (in production, use real database)
// NOTE: Using mockUsersDatabase from @/lib/mockUsers instead

// Mock deleted users for 5-day blocking
const mockDeletedUsers: Array<{
  email: string
  firstName: string
  lastName: string
  phone: string
  deletedAt: Date
}> = []

// Check if user was deleted within last 5 days
const isUserBlockedFromRecreation = (
  firstName: string,
  lastName: string,
  email: string,
  phone: string
): boolean => {
  const now = new Date()
  const fiveDaysMs = 5 * 24 * 60 * 60 * 1000

  return mockDeletedUsers.some(u => {
    const timeSinceDelete = now.getTime() - u.deletedAt.getTime()
    
    // Check if deletion was within last 5 days
    if (timeSinceDelete < fiveDaysMs) {
      // Check if any of the data matches
      return (
        u.email.toLowerCase() === email.toLowerCase() ||
        u.phone === phone ||
        (u.firstName.toLowerCase() === firstName.toLowerCase() &&
          u.lastName.toLowerCase() === lastName.toLowerCase())
      )
    }
    return false
  })
}

// Check for existing users with same name, email, or phone
const checkDuplicateUser = (
  firstName: string,
  lastName: string,
  email: string,
  phone: string
): { isDuplicate: boolean; reason: string } => {
  const lowerEmail = email.toLowerCase()

  // Check if email already exists in mock database
  const existingUser = findUserByEmail(email)
  if (existingUser) {
    return {
      isDuplicate: true,
      reason: 'Ky email është tashmë i regjistruar. Kyçu ose rikthe fjalëkalimin.',
    }
  }

  // In a real app, we'd also check phone and name combination
  // For now, we'll keep this simple with the mock database

  return { isDuplicate: false, reason: '' }
}

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
      role,
      businessName,
      nipt,
      taxRegistration,
      acceptsMarketing = true,
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !country || !city || !address) {
      return NextResponse.json(
        { error: 'Të gjitha fushat janë të detyrueshme' },
        { status: 400 }
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formati i emailit nuk është i vlefshëm' },
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

    // Check for duplicate users
    const duplicateCheck = checkDuplicateUser(firstName, lastName, email, phone)
    if (duplicateCheck.isDuplicate) {
      return NextResponse.json(
        { error: duplicateCheck.reason },
        { status: 409 } // Conflict status code
      )
    }

    // Check if user was deleted within last 5 days (blocking period)
    if (isUserBlockedFromRecreation(firstName, lastName, email, phone)) {
      return NextResponse.json(
        { 
          error: 'Your account is temporarily deleted. You cannot create a new account for 5 days.' 
        },
        { status: 429 } // Too Many Requests status code
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate verification code (6 digits)
    const verifyToken = generateVerificationCode()
    
    // Set expiration to 10 minutes from now
    const verifyExpires = Date.now() + 10 * 60 * 1000

    // Store verification code in shared store
    verificationStore.registrationCodes[email] = {
      code: verifyToken,
      expiresAt: verifyExpires,
    }

    console.log(`[DEBUG] Generated registration code for ${email}: ${verifyToken}`)

    // Generate random username
    const generateUsername = () => {
      const adjectives = ['swift', 'bright', 'keen', 'vivid', 'prime', 'noble', 'bold', 'stark', 'pure', 'wild']
      const nouns = ['falcon', 'arrow', 'tiger', 'phoenix', 'storm', 'zephyr', 'volt', 'pulse', 'wave', 'fire']
      const numbers = Math.floor(Math.random() * 9000) + 1000
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
      const noun = nouns[Math.floor(Math.random() * nouns.length)]
      return `${adj}${noun}${numbers}`
    }

    // Create user in mock database
    const user = createUser({
      id: randomBytes(12).toString('hex'),
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
      verifyToken,
      verifyExpires: new Date(verifyExpires),
      isVerified: false,
      acceptsMarketing: acceptsMarketing === 'true' || acceptsMarketing === true,
      ...(role === 'SELLER' && {
        businessName,
        nipt,
        taxRegistration,
      }),
    })

    console.log(`[DEBUG] User created: ${user.email} with role: ${user.role}`)

    // Send verification email with code
    try {
      await sendVerificationEmail(email, firstName, verifyToken)
    } catch (emailError) {
      console.error('Email send failed:', emailError)
      // Continue anyway for demo
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Regjistrimi u krye me sukses. Kontrollo emailin për kodin e verifikimit.',
        userId: user.id,
        email: user.email,
        role: user.role
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Dicka shkoi keq. Provo përsëri.' },
      { status: 500 }
    )
  }
}
