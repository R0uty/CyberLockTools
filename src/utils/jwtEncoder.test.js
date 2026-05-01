import { describe, expect, it } from 'vitest'
import { createJWT, decodeJWT, verifyJWT } from './jwtEncoder'

describe('jwtEncoder utilities', () => {
  it('creates and verifies a valid HS256 token', () => {
    const created = createJWT({ kid: 'test-key' }, { sub: 'alice' }, 'secret-123', 'HS256')

    expect(created.success).toBe(true)
    expect(created.token).toBeTruthy()

    const verification = verifyJWT(created.token, 'secret-123', 'HS256')

    expect(verification.success).toBe(true)
    expect(verification.valid).toBe(true)
  })

  it('rejects verification when selected algorithm mismatches token header algorithm', () => {
    const created = createJWT({}, { role: 'admin' }, 'secret-123', 'HS512')
    expect(created.success).toBe(true)

    const verification = verifyJWT(created.token, 'secret-123', 'HS256')

    expect(verification.success).toBe(true)
    expect(verification.valid).toBe(false)
    expect(verification.message).toContain('Algorithm mismatch')
  })

  it('supports UTF-8 payload values during round-trip', () => {
    const created = createJWT({}, { name: 'Yan 💻', city: 'München' }, 'utf-secret', 'HS256')
    expect(created.success).toBe(true)

    const decoded = decodeJWT(created.token)

    expect(decoded.success).toBe(true)
    expect(decoded.payload).toMatchObject({
      name: 'Yan 💻',
      city: 'München',
    })
  })

  it('fails verification with an invalid secret', () => {
    const created = createJWT({}, { scope: 'read' }, 'right-secret', 'HS256')
    expect(created.success).toBe(true)

    const verification = verifyJWT(created.token, 'wrong-secret', 'HS256')

    expect(verification.success).toBe(true)
    expect(verification.valid).toBe(false)
  })
})
