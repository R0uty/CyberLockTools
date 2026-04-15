import { describe, expect, it } from 'vitest'
import { tokenize } from './tokenizer'

describe('tokenize', () => {
  it('splits a single line into words', () => {
    expect(tokenize('scan target 192.168.1.1')).toEqual([['scan', 'target', '192.168.1.1']])
  })

  it('splits multiple lines into separate token arrays', () => {
    expect(tokenize('scan target 192.168.1.1\nping host 10.0.0.1')).toEqual([
      ['scan', 'target', '192.168.1.1'],
      ['ping', 'host', '10.0.0.1'],
    ])
  })

  it('removes empty lines', () => {
    expect(tokenize('scan target\n\nping host')).toEqual([
      ['scan', 'target'],
      ['ping', 'host'],
    ])
  })

  it('returns an empty array for blank input', () => {
    expect(tokenize('')).toEqual([])
    expect(tokenize('   \n  \n')).toEqual([])
  })

  it('handles extra whitespace between words', () => {
    expect(tokenize('scan   target   192.168.1.1')).toEqual([['scan', 'target', '192.168.1.1']])
  })
})
