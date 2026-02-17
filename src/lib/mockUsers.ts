// Mock user database for demo purposes
// In production, this would be a real database

export interface MockUser {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  country: string
  city: string
  address: string
  username: string
  usernameChangedAt?: Date  // Tracks when username was last changed (can only change once)
  avatarUrl?: string
  role: 'BUYER' | 'SELLER'
  isVerified: boolean
  acceptsMarketing?: boolean
  verifyToken?: string
  verifyExpires?: Date
  createdAt: Date
  // Seller-specific fields
  businessName?: string
  nipt?: string
  taxRegistration?: string
}

function generateUsername(): string {
  const adjectives = ['swift', 'bright', 'keen', 'vivid', 'prime', 'noble', 'bold', 'stark']
  const nouns = ['falcon', 'arrow', 'tiger', 'phoenix', 'storm', 'zephyr', 'volt', 'pulse']
  const numbers = Math.floor(Math.random() * 9000) + 1000
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj}${noun}${numbers}`
}

export { generateUsername }

export let mockUsersDatabase: MockUser[] = []

// Pre-populate with demo users
mockUsersDatabase.push({
  id: 'demo-user-1',
  email: 'john@example.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUmGEJiq', // hashed "demo123"
  firstName: 'John',
  lastName: 'Doe',
  phone: '+355 69 1234 5678',
  country: 'AL',
  city: 'Tirana',
  address: 'Test Address',
  username: 'boldphoenix1847',
  avatarUrl: undefined,
  role: 'BUYER',
  isVerified: true,
  acceptsMarketing: true,
  createdAt: new Date(),
})

mockUsersDatabase.push({
  id: 'demo-seller-1',
  email: 'seller@example.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUmGEJiq', // hashed "demo123"
  firstName: 'Jane',
  lastName: 'Seller',
  phone: '+355 69 9876 5432',
  country: 'AL',
  city: 'Durres',
  address: 'Seller Address',
  username: 'swiftfalcon5234',
  avatarUrl: undefined,
  role: 'SELLER',
  isVerified: true,
  acceptsMarketing: true,
  createdAt: new Date(),
})

export function findUserByEmail(email: string): MockUser | undefined {
  return mockUsersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function createUser(userData: Omit<MockUser, 'createdAt'>): MockUser {
  const user: MockUser = {
    ...userData,
    createdAt: new Date(),
    acceptsMarketing: userData.acceptsMarketing ?? true,
  }
  mockUsersDatabase.push(user)
  return user
}

export function updateUser(email: string, updates: Partial<MockUser>): MockUser | null {
  const user = findUserByEmail(email)
  if (!user) return null
  
  const updatedUser = { ...user, ...updates }
  const index = mockUsersDatabase.findIndex(u => u.email.toLowerCase() === email.toLowerCase())
  if (index !== -1) {
    mockUsersDatabase[index] = updatedUser
  }
  return updatedUser
}
