import CryptoJS from 'crypto-js'

const SUPPORTED_ALGORITHMS = new Set(['HS256', 'HS512'])

function toBase64Url(base64) {
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function fromBase64Url(base64Url) {
  const normalized = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const remainder = normalized.length % 4

  if (remainder === 0) {
    return normalized
  }

  return normalized + '='.repeat(4 - remainder)
}

function encodeBase64UrlUtf8(value) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return toBase64Url(btoa(binary))
}

function decodeBase64UrlUtf8(value) {
  const binary = atob(fromBase64Url(value))
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function createSignature(payload, secret, algorithm) {
  if (algorithm === 'HS256') {
    return toBase64Url(CryptoJS.HmacSHA256(payload, secret).toString(CryptoJS.enc.Base64))
  }

  if (algorithm === 'HS512') {
    return toBase64Url(CryptoJS.HmacSHA512(payload, secret).toString(CryptoJS.enc.Base64))
  }

  return null
}

function timingSafeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') {
    return false
  }

  const leftLength = left.length
  const rightLength = right.length
  const maxLength = Math.max(leftLength, rightLength)

  let mismatch = leftLength ^ rightLength
  for (let i = 0; i < maxLength; i++) {
    const leftCode = i < leftLength ? left.charCodeAt(i) : 0
    const rightCode = i < rightLength ? right.charCodeAt(i) : 0
    mismatch |= leftCode ^ rightCode
  }

  return mismatch === 0
}

/**
 * Creates a JWT token
 * @param {object} header - JWT header
 * @param {object} payload - JWT payload
 * @param {string} secret - Secret key for signing
 * @param {string} algorithm - Signing algorithm (default: HS256)
 * @returns {object} JWT token or error
 */
export function createJWT(header, payload, secret, algorithm = 'HS256') {
  try {
    if (!header || typeof header !== 'object') {
      return { success: false, error: 'Header must be a valid object' }
    }

    if (!payload || typeof payload !== 'object') {
      return { success: false, error: 'Payload must be a valid object' }
    }

    if (!secret || typeof secret !== 'string') {
      return { success: false, error: 'Secret must be a non-empty string' }
    }

    if (!SUPPORTED_ALGORITHMS.has(algorithm)) {
      return { success: false, error: 'Unsupported algorithm' }
    }

    // Keep inputs immutable to avoid side effects in callers.
    const jwtHeader = {
      ...header,
      alg: algorithm,
      typ: 'JWT',
    }

    // Encode header and payload
    const encodedHeader = encodeBase64UrlUtf8(JSON.stringify(jwtHeader))
    const encodedPayload = encodeBase64UrlUtf8(JSON.stringify(payload))

    // Create signature
    const signatureInput = `${encodedHeader}.${encodedPayload}`
    const signature = createSignature(signatureInput, secret, algorithm)

    if (!signature) {
      return { success: false, error: 'Unsupported algorithm' }
    }

    const token = `${signatureInput}.${signature}`

    return {
      success: true,
      token,
      parts: {
        header: encodedHeader,
        payload: encodedPayload,
        signature
      }
    }
  } catch (err) {
    return { success: false, error: `JWT creation error: ${err.message}` }
  }
}

/**
 * Decodes a JWT token (without verification)
 * @param {string} token - JWT token
 * @returns {object} Decoded JWT or error
 */
export function decodeJWT(token) {
  try {
    if (!token || typeof token !== 'string') {
      return { success: false, error: 'Invalid token format' }
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
      return { success: false, error: 'Invalid JWT: must have 3 parts' }
    }

    const [headerB64, payloadB64, signature] = parts

    // Decode header
    let header
    try {
      header = JSON.parse(decodeBase64UrlUtf8(headerB64))
    } catch {
      return { success: false, error: 'Invalid header encoding' }
    }

    // Decode payload
    let payload
    try {
      payload = JSON.parse(decodeBase64UrlUtf8(payloadB64))
    } catch {
      return { success: false, error: 'Invalid payload encoding' }
    }

    return {
      success: true,
      header,
      payload,
      signature,
      expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
      isExpired: payload.exp ? Date.now() > payload.exp * 1000 : false
    }
  } catch (err) {
    return { success: false, error: `JWT decoding error: ${err.message}` }
  }
}

/**
 * Verifies JWT signature
 * @param {string} token - JWT token
 * @param {string} secret - Secret key
 * @param {string} algorithm - Algorithm used
 * @returns {object} Verification result
 */
export function verifyJWT(token, secret, algorithm = 'HS256') {
  try {
    if (!secret || typeof secret !== 'string') {
      return { success: false, error: 'Secret must be a non-empty string' }
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
      return { success: false, error: 'Invalid JWT format' }
    }

    const decoded = decodeJWT(token)
    if (!decoded.success) {
      return { success: false, error: decoded.error }
    }

    const tokenAlgorithm = decoded.header?.alg
    if (!SUPPORTED_ALGORITHMS.has(tokenAlgorithm)) {
      return {
        success: true,
        valid: false,
        message: `❌ Unsupported token algorithm: ${tokenAlgorithm || 'missing'}`
      }
    }

    if (algorithm && algorithm !== tokenAlgorithm) {
      return {
        success: true,
        valid: false,
        message: `❌ Algorithm mismatch: token uses ${tokenAlgorithm}, verifier selected ${algorithm}`
      }
    }

    const [headerB64, payloadB64, providedSignature] = parts
    const signatureInput = `${headerB64}.${payloadB64}`

    // Calculate expected signature
    const expectedSignature = createSignature(signatureInput, secret, tokenAlgorithm)

    const isValid = Boolean(expectedSignature) && timingSafeEqual(providedSignature, expectedSignature)

    return {
      success: true,
      valid: isValid,
      message: isValid ? '✅ Signature is valid' : '❌ Signature is invalid'
    }
  } catch (err) {
    return { success: false, error: `Verification error: ${err.message}` }
  }
}
