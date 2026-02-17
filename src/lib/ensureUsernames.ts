import { prisma } from '@/lib/prisma'
import { generateUsername } from '@/lib/mockUsers'

/**
 * Utility to ensure all users have a unique username
 * Assigns random usernames to users who don't have one yet
 */
export async function assignUsernamesToExistingUsers() {
  try {
    // Find all users without usernames
    const usersWithoutUsernames = await prisma.user.findMany({
      where: {
        username: null
      }
    })

    console.log(`Found ${usersWithoutUsernames.length} users without usernames`)

    if (usersWithoutUsernames.length === 0) {
      console.log('All users already have usernames')
      return
    }

    // Assign usernames to each user
    for (const user of usersWithoutUsernames) {
      let username: string | null = null
      let isUnique = false
      let attempts = 0
      const maxAttempts = 100

      // Generate unique username
      while (!isUnique && attempts < maxAttempts) {
        username = generateUsername()
        
        // Check if username is unique
        const existing = await prisma.user.findFirst({
          where: { username }
        })
        
        if (!existing) {
          isUnique = true
        }
        attempts++
      }

      if (isUnique && username) {
        await prisma.user.update({
          where: { id: user.id },
          data: { username }
        })
        console.log(`Assigned username "${username}" to user ${user.email}`)
      } else {
        console.error(`Failed to generate unique username for user ${user.email}`)
      }
    }

    console.log('Username assignment complete')
  } catch (error) {
    console.error('Error assigning usernames:', error)
    throw error
  }
}

// Export function to run on server startup
export async function ensureAllUsersHaveUsernames() {
  try {
    const usersWithoutUsernames = await prisma.user.findMany({
      where: { username: null },
      select: { id: true }
    })

    if (usersWithoutUsernames.length > 0) {
      console.log(`[STARTUP] Found ${usersWithoutUsernames.length} users without usernames, assigning...`)
      await assignUsernamesToExistingUsers()
    }
  } catch (error) {
    console.error('[STARTUP] Error ensuring usernames:', error)
  }
}
