import { describe, expect, it } from 'vitest'
import { parse } from './parser'

describe('parse', () => {
  it('parses a scan target command', () => {
    expect(parse([['scan', 'target', '192.168.1.1']])).toEqual([
      { type: 'SCAN', target: '192.168.1.1' },
    ])
  })

  it('parses multiple scan commands', () => {
    expect(
      parse([
        ['scan', 'target', '192.168.1.1'],
        ['scan', 'target', '10.0.0.1'],
      ])
    ).toEqual([
      { type: 'SCAN', target: '192.168.1.1' },
      { type: 'SCAN', target: '10.0.0.1' },
    ])
  })

  it('returns an empty array for no tokens', () => {
    expect(parse([])).toEqual([])
  })

  it('throws for an unknown command', () => {
    expect(() => parse([['unknown', 'foo']])).toThrow('Unknown command: unknown')
  })

  it('throws for invalid scan syntax missing target keyword', () => {
    expect(() => parse([['scan', 'foo']])).toThrow(
      'Invalid scan syntax: expected "scan target <value>"'
    )
  })

  it('throws for scan command missing value', () => {
    expect(() => parse([['scan', 'target']])).toThrow(
      'Invalid scan syntax: expected "scan target <value>"'
    )
  })

  it('throws for an empty token line', () => {
    expect(() => parse([[]])).toThrow('Empty token line')
  })
})
