/**
 * Password validation utility
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 */

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'fair' | 'good' | 'strong'
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  let strengthScore = 0

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  } else {
    strengthScore++
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else {
    strengthScore++
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  } else {
    strengthScore++
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&* etc)')
  } else {
    strengthScore++
  }

  // Determine strength
  let strength: 'weak' | 'fair' | 'good' | 'strong'
  if (strengthScore <= 1) {
    strength = 'weak'
  } else if (strengthScore === 2) {
    strength = 'fair'
  } else if (strengthScore === 3) {
    strength = 'good'
  } else {
    strength = 'strong'
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  }
}

export function getPasswordStrengthColor(
  strength: 'weak' | 'fair' | 'good' | 'strong'
): string {
  switch (strength) {
    case 'weak':
      return 'bg-red-500'
    case 'fair':
      return 'bg-orange-500'
    case 'good':
      return 'bg-yellow-500'
    case 'strong':
      return 'bg-green-500'
  }
}

export function getPasswordStrengthLabel(
  strength: 'weak' | 'fair' | 'good' | 'strong'
): string {
  switch (strength) {
    case 'weak':
      return 'E dobët'
    case 'fair':
      return 'Mesatare'
    case 'good':
      return 'E mirë'
    case 'strong':
      return 'E fortë'
  }
}
