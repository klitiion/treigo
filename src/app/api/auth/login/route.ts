import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { findUserByEmail, mockUsersDatabase, createUser, generateUsername } from '@/lib/mockUsers'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dhe fjalëkalimi janë të detyrueshëm' },
        { status: 400 }
      )
    }

    // Find user in mock database first
    let user = findUserByEmail(email)
    
    // If not in mock database, try Prisma database
    if (!user) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { shop: true }
        })
        if (dbUser) {
          user = {
            id: dbUser.id,
            email: dbUser.email,
            password: dbUser.password,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            phone: dbUser.phone,
            country: dbUser.country,
            city: dbUser.city,
            address: dbUser.address,
            username: dbUser.username || '',
            role: (dbUser.role === 'ADMIN' ? 'SELLER' : dbUser.role) as 'BUYER' | 'SELLER',
            isVerified: dbUser.isVerified,
            createdAt: dbUser.createdAt,
          }
        }
      } catch (dbError) {
        console.error('Database error checking user:', dbError)
      }
    }
    
    console.log(`[DEBUG] Login attempt for email: ${email}`)
    console.log(`[DEBUG] Users in database:`, mockUsersDatabase.map(u => u.email))
    console.log(`[DEBUG] User found:`, user ? `${user.email} (ID: ${user.id}, Role: ${user.role})` : 'NOT FOUND')
    
    // For demo/development: allow login with any password if user not found
    // If user exists, use their actual role; otherwise default to BUYER
    let loginUser = user
    
    if (!user) {
      console.log(`[INFO] User not found, creating temporary user for demo purposes`)
      // For demo purposes, create a temporary user entry with BUYER role by default
      // In production, this would never happen
      const tempUser = {
        id: 'temp-' + email.replace(/[^a-z0-9]/gi, ''),
        email: email.toLowerCase(),
        password: 'temp',
        firstName: email.split('@')[0],
        lastName: 'Demo',
        phone: '+355 69 0000 0000',
        country: 'AL',
        city: 'Demo',
        address: 'Demo',
        username: generateUsername(),
        role: 'BUYER' as const,
        isVerified: true,
      }
      // Add the temporary user to the database so they can be found later
      loginUser = createUser(tempUser)
    }

    if (!loginUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Verify password (for demo, we'll skip actual verification)
    // In real app: const isPasswordValid = await compare(password, user.password)
    // For demo purposes, accept any password
    
    // Generate JWT token
    const token = sign(
      { 
        userId: loginUser.id, 
        email: loginUser.email, 
        role: loginUser.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: loginUser.id,
        email: loginUser.email,
        firstName: loginUser.firstName,
        lastName: loginUser.lastName,
        role: loginUser.role,
        isVerified: loginUser.isVerified,
        username: loginUser.username,
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Dicka shkoi keq. Provo përsëri.' },
      { status: 500 }
    )
  }
}
