import CryptoJS from 'crypto-js'

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

    // Set algorithm in header
    header.alg = algorithm
    header.typ = 'JWT'

    // Encode header and payload
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

    // Create signature
    const signatureInput = `${encodedHeader}.${encodedPayload}`
    
    let signature
    if (algorithm === 'HS256') {
      const hash = CryptoJS.HmacSHA256(signatureInput, secret)
      signature = hash.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    } else if (algorithm === 'HS512') {
      const hash = CryptoJS.HmacSHA512(signatureInput, secret)
      signature = hash.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    } else {
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
      header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')))
    } catch {
      return { success: false, error: 'Invalid header encoding' }
    }

    // Decode payload
    let payload
    try {
      payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))
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
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { success: false, error: 'Invalid JWT format' }
    }

    const [headerB64, payloadB64, providedSignature] = parts
    const signatureInput = `${headerB64}.${payloadB64}`

    // Calculate expected signature
    let expectedSignature
    if (algorithm === 'HS256') {
      const hash = CryptoJS.HmacSHA256(signatureInput, secret)
      expectedSignature = hash.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    } else if (algorithm === 'HS512') {
      const hash = CryptoJS.HmacSHA512(signatureInput, secret)
      expectedSignature = hash.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    }

    const isValid = providedSignature === expectedSignature

    return {
      success: true,
      valid: isValid,
      message: isValid ? '✅ Signature is valid' : '❌ Signature is invalid'
    }
  } catch (err) {
    return { success: false, error: `Verification error: ${err.message}` }
  }
}
