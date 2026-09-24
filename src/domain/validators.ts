/** Each validator returns an error message, or null when the value is fine. */
export type Validation = string | null

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function validateEmail(value: string): Validation {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? null : 'Enter a valid email address.'
}

export function validateName(value: string): Validation {
  const name = value.trim()
  if (name.length < 2) return 'Enter your name (at least 2 characters).'
  if (name.length > 60) return 'Keep your name under 60 characters.'
  return null
}

export function validatePassword(value: string): Validation {
  if (value.length < 8) return 'Use at least 8 characters.'
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Use letters and at least one number.'
  return null
}

/** 0 (empty) to 4 (strong). A hint for the meter only. validatePassword is the real rule. */
export function passwordStrength(value: string): 0 | 1 | 2 | 3 | 4 {
  if (!value) return 0
  let score = 0
  if (value.length >= 8) score++
  if (value.length >= 12) score++
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++
  return Math.max(1, score) as 1 | 2 | 3 | 4
}
