// Unified verification store for all verification flows (registration, password reset, etc.)
// In production, these should be stored in a database with proper persistence

// Global store that persists across requests
let globalVerificationStore = {
  // Registration verification codes: email -> { code, expiresAt }
  registrationCodes: {} as Record<string, { code: string; expiresAt: number }>,
  
  // Password reset codes: email -> { code, expiresAt }
  resetCodes: {} as Record<string, { code: string; expiresAt: number }>,
  
  // Password reset tokens: token -> { email, expiresAt }
  resetTokens: {} as Record<string, { email: string; expiresAt: number }>,
}

// Export the store - always return the same instance
export const verificationStore = globalVerificationStore

// Function to manually clear expired codes (should be called periodically)
export function cleanupExpiredCodes() {
  const now = Date.now()
  
  // Clean registration codes
  for (const email in globalVerificationStore.registrationCodes) {
    if (now > globalVerificationStore.registrationCodes[email].expiresAt) {
      delete globalVerificationStore.registrationCodes[email]
    }
  }
  
  // Clean reset codes
  for (const email in globalVerificationStore.resetCodes) {
    if (now > globalVerificationStore.resetCodes[email].expiresAt) {
      delete globalVerificationStore.resetCodes[email]
    }
  }
  
  // Clean reset tokens
  for (const token in globalVerificationStore.resetTokens) {
    if (now > globalVerificationStore.resetTokens[token].expiresAt) {
      delete globalVerificationStore.resetTokens[token]
    }
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

