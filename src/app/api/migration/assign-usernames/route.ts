import { NextRequest, NextResponse } from 'next/server'
import { assignUsernamesToExistingUsers } from '@/lib/ensureUsernames'

/**
 * Utility endpoint to assign usernames to existing users
 * This should be called once during deployment or manually
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication check for production
    // const token = request.headers.get('Authorization')
    // if (token !== `Bearer ${process.env.ADMIN_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    console.log('Starting username assignment for existing users...')
    await assignUsernamesToExistingUsers()

    return NextResponse.json({
      success: true,
      message: 'Usernames assigned to all users without one'
    })
  } catch (error) {
    console.error('Error in username assignment endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to assign usernames', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check username status
 */
export async function GET(request: NextRequest) {
  try {
    const { prisma } = require('@/lib/prisma')

    const totalUsers = await prisma.user.count()
    const usersWithoutUsernames = await prisma.user.count({
      where: { username: null }
    })

    return NextResponse.json({
      totalUsers,
      usersWithoutUsernames,
      usersWithUsernames: totalUsers - usersWithoutUsernames,
      percentageComplete: ((totalUsers - usersWithoutUsernames) / totalUsers * 100).toFixed(2) + '%'
    })
  } catch (error) {
    console.error('Error checking username status:', error)
    return NextResponse.json(
      { error: 'Failed to check status', details: String(error) },
      { status: 500 }
    )
  }
}
