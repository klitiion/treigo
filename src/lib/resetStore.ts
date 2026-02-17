// Shared in-memory stores for password reset flow
// In production, these should be stored in a database with proper persistence

export const resetStore = {
  codes: {} as Record<string, { code: string; expiresAt: number }>,
  tokens: {} as Record<string, { email: string; expiresAt: number }>,
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
