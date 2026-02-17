// Global token store for email verification
// In production, use a database like PostgreSQL or Redis
export const emailVerificationTokens: Record<string, {
  oldEmail: string
  newEmail: string
  expiresAt: string
}> = {}

export function storeToken(token: string, data: { oldEmail: string; newEmail: string; expiresAt: string }) {
  emailVerificationTokens[token] = data
}

export function getToken(token: string) {
  return emailVerificationTokens[token]
}

export function deleteToken(token: string) {
  delete emailVerificationTokens[token]
}
