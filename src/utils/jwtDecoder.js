/**
 * Decodes a JWT token into its three components: header, payload, and signature
 * @param {string} token - The JWT token to decode
 * @returns {object} Object with header, payload, signature, and rawParts
 * @throws {Error} If the token is invalid
 */
export function decodeJWT(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token: Token must be a non-empty string')
  }

  const parts = token.trim().split('.')

  if (parts.length !== 3) {
    throw new Error(`Invalid JWT format: Expected 3 parts, got ${parts.length}. Format should be: header.payload.signature`)
  }

  try {
    // Decode header
    const headerDecoded = decodeBase64(parts[0])
    const header = JSON.parse(headerDecoded)

    // Decode payload
    const payloadDecoded = decodeBase64(parts[1])
    const payload = JSON.parse(payloadDecoded)

    // Signature is kept as-is (not decoded)
    const signature = parts[2]

    return {
      header,
      payload,
      signature,
      rawParts: {
        headerRaw: parts[0],
        payloadRaw: parts[1],
        signatureRaw: parts[2]
      },
      valid: true
    }
  } catch (err) {
    throw new Error(`Failed to decode JWT: ${err.message}`)
  }
}

/**
 * Decodes a Base64 string (handles URL-safe Base64)
 * @param {string} str - The Base64 string to decode
 * @returns {string} The decoded string
 */
function decodeBase64(str) {
  // Add padding if needed
  let paddedStr = str
  const padding = 4 - (str.length % 4)
  if (padding && padding !== 4) {
    paddedStr = str + '='.repeat(padding)
  }

  try {
    // Replace URL-safe characters with standard Base64 characters
    const base64Str = paddedStr.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(base64Str)
    return decoded
  } catch {
    throw new Error('Invalid Base64 encoding in token part')
  }
}

/**
 * Validates if a token looks like a valid JWT structure (without verification)
 * @param {string} token - The token to validate
 * @returns {boolean} True if the token appears to be a valid JWT
 */
export function isValidJWTFormat(token) {
  if (!token || typeof token !== 'string') {
    return false
  }

  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    return false
  }

  try {
    decodeJWT(token)
    return true
  } catch {
    return false
  }
}

/**
 * Formats JSON for display
 * @param {object} obj - The object to format
 * @returns {string} Formatted JSON string
 */
export function formatJSON(obj) {
  return JSON.stringify(obj, null, 2)
}
