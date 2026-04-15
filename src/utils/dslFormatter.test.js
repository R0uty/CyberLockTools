import { describe, expect, it } from 'vitest'
import { toDSL } from './dslFormatter'

describe('toDSL', () => {
  it('formats a single SCAN entry', () => {
    expect(toDSL([{ type: 'SCAN', target: '192.168.1.1' }])).toBe(
      'SCAN {\n  target: "192.168.1.1"\n}'
    )
  })

  it('formats multiple SCAN entries separated by a blank line', () => {
    expect(
      toDSL([
        { type: 'SCAN', target: '192.168.1.1' },
        { type: 'SCAN', target: '10.0.0.1' },
      ])
    ).toBe(
      'SCAN {\n  target: "192.168.1.1"\n}\n\nSCAN {\n  target: "10.0.0.1"\n}'
    )
  })

  it('returns an empty string for an empty array', () => {
    expect(toDSL([])).toBe('')
  })

  it('formats an entry with multiple fields', () => {
    expect(toDSL([{ type: 'SCAN', target: '192.168.1.1', port: '443' }])).toBe(
      'SCAN {\n  target: "192.168.1.1"\n  port: "443"\n}'
    )
  })

  it('does not quote non-string values', () => {
    expect(toDSL([{ type: 'SCAN', target: '192.168.1.1', port: 443 }])).toBe(
      'SCAN {\n  target: "192.168.1.1"\n  port: 443\n}'
    )
  })

  it('formats an entry with no fields as an empty block', () => {
    expect(toDSL([{ type: 'PING' }])).toBe('PING {}')
  })
})
