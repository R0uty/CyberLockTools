/**
 * Generates a random password
 * @param {object} options - Password options
 * @returns {string} Generated password
 */
export function generatePassword(options = {}) {
  const {
    length = 16,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeAmbiguous = false
  } = options

  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  let chars = ''

  if (includeLowercase) {
    chars += excludeAmbiguous ? lowercase.replace(/[il]/g, '') : lowercase
  }
  if (includeUppercase) {
    chars += excludeAmbiguous ? uppercase.replace(/[IO]/g, '') : uppercase
  }
  if (includeNumbers) {
    chars += excludeAmbiguous ? numbers.replace(/[01]/g, '') : numbers
  }
  if (includeSymbols) {
    chars += symbols
  }

  if (chars.length === 0) {
    throw new Error('At least one character type must be selected')
  }

  // Use rejection sampling to eliminate modulo bias: discard any random value
  // that falls in the incomplete tail of the distribution so every character
  // in `chars` has an exactly equal probability of being chosen.
  const charsLen = chars.length
  const limit = Math.floor(0x100000000 / charsLen) * charsLen
  const buf = new Uint32Array(1)

  let password = ''
  while (password.length < length) {
    crypto.getRandomValues(buf)
    if (buf[0] < limit) {
      password += chars[buf[0] % charsLen]
    }
  }

  return password
}

/**
 * Calculates password strength
 * @param {string} password - Password to analyze
 * @returns {object} Strength analysis
 */
export function calculatePasswordStrength(password) {
  if (!password) {
    return { score: 0, strength: 'None', feedback: 'Password is empty' }
  }

  let score = 0
  const feedback = []

  // Length checks
  if (password.length >= 8) score += 10
  if (password.length >= 12) score += 10
  if (password.length >= 16) score += 10
  if (password.length >= 20) score += 10

  if (password.length < 8) {
    feedback.push('Password too short (min 8 characters)')
  }

  // Character type checks
  if (/[a-z]/.test(password)) {
    score += 10
  } else {
    feedback.push('Add lowercase letters')
  }

  if (/[A-Z]/.test(password)) {
    score += 10
  } else {
    feedback.push('Add uppercase letters')
  }

  if (/[0-9]/.test(password)) {
    score += 10
  } else {
    feedback.push('Add numbers')
  }

  if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
    score += 20
  } else {
    feedback.push('Add special characters')
  }

  // Variety checks
  const uniqueChars = new Set(password).size
  if (uniqueChars >= password.length * 0.7) {
    score += 10
  }

  // Check for common patterns (negative scoring)
  if (/(.)\1{2,}/.test(password)) {
    score -= 10
    feedback.push('Avoid repeating characters')
  }

  if (/^[a-zA-Z]+$/.test(password) || /^[0-9]+$/.test(password)) {
    score -= 20
    feedback.push('Avoid only letters or only numbers')
  }

  // Determine strength
  let strength = 'Weak'
  if (score >= 80) strength = 'Very Strong'
  else if (score >= 60) strength = 'Strong'
  else if (score >= 40) strength = 'Fair'
  else if (score >= 20) strength = 'Weak'

  return {
    score: Math.min(100, Math.max(0, score)),
    strength,
    feedback: feedback.length > 0 ? feedback : ['Good password!'],
    length: password.length,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSymbols: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password),
    uniqueChars: new Set(password).size
  }
}

/**
 * Generates multiple passwords
 * @param {number} count - Number of passwords to generate
 * @param {object} options - Password options
 * @returns {string[]} Array of passwords
 */
export function generateMultiplePasswords(count, options = {}) {
  const passwords = []
  for (let i = 0; i < count; i++) {
    passwords.push(generatePassword(options))
  }
  return passwords
}
