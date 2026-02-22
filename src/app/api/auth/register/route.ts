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
      username,
      phone, 
      country, 
      city, 
      address,
      shopName,
      taxId,
      createShop = false,
      acceptsMarketing = true,
    } = body

    console.log('[REGISTER] Request received for email:', email)

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !username || !phone || !country || !city || !address) {
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

    // Validate username format
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      )
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, hyphens, and underscores' },
        { status: 400 }
      )
    }

    // Convert username to lowercase for consistency
    const usernameLower = username.toLowerCase()

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

    // Check if username already exists
    if (usernameLower) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: usernameLower }
      })
      if (existingUsername) {
        return NextResponse.json(
          { error: 'This username is already taken' },
          { status: 409 }
        )
      }
    }

    // Validate shop-specific fields if creating a shop
    if (createShop) {
      if (!shopName || !taxId) {
        return NextResponse.json(
          { error: 'Shop name and Tax ID are required to create a shop' },
          { status: 400 }
        )
      }
      
      // Validate Tax ID format (10 digits)
      if (!/^\d{10}$/.test(taxId.replace(/\s/g, ''))) {
        return NextResponse.json(
          { error: 'Tax ID must be exactly 10 digits' },
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

    // Generate shop slug
    const generateShopSlug = (name: string) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 50)
    }

    // Create user in database
    console.log('[REGISTER] Creating user in database with data:', {
      email: email.toLowerCase(),
      firstName,
      lastName,
      phone,
      country,
      city,
      address,
      username: usernameLower,
      role: createShop ? 'SELLER' : 'BUYER',
      isVerified: false,
      acceptsMarketing,
    })
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
        username: usernameLower,
        role: createShop ? 'SELLER' : 'BUYER',
        isVerified: false,
        verifyToken,
        verifyExpires,
        acceptsMarketing,
      }
    })

    console.log('[REGISTER] User created successfully:', user.id, user.email, user.role)

    // Create shop if requested
    if (createShop) {
      console.log('[REGISTER] Creating shop for user:', user.id)
      const slug = generateShopSlug(shopName!)
      
      // Check if slug already exists
      let finalSlug = slug
      let counter = 1
      while (true) {
        const existingShop = await prisma.shop.findUnique({
          where: { slug: finalSlug }
        })
        if (!existingShop) break
        finalSlug = `${slug}-${counter}`
        counter++
      }

      await prisma.shop.create({
        data: {
          userId: user.id,
          name: shopName!,
          slug: finalSlug,
          description: '',
          isVerified: false,
          taxId: taxId,
        }
      })
      console.log('[REGISTER] Shop created successfully for user:', user.id)
    }

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
      
      // P2002 is unique constraint violation
      if (prismaError.code === 'P2002') {
        const field = prismaError.meta?.target?.[0] || 'field'
        if (field === 'email') {
          errorMessage = 'This email is already registered'
        } else if (field === 'username') {
          errorMessage = 'This username is already taken'
        } else {
          errorMessage = `This ${field} is already in use`
        }
      }
    }
    
    // Return detailed error in development, generic in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    console.error('[REGISTER] Final error message:', errorMessage)
    console.error('[REGISTER] Detailed error:', detailedError)
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(isDevelopment && { details: detailedError })
      },
      { status: 500 }
    )
  }
}
