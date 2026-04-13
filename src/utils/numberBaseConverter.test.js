import { describe, expect, it } from 'vitest'
import { convertBase, convertToAllBases } from './numberBaseConverter'

describe('numberBaseConverter utilities', () => {
  it('converts between bases for valid input', () => {
    expect(convertBase('FF', 16, 10)).toEqual({ result: '255', error: null })
    expect(convertBase('1010', 2, 16)).toEqual({ result: 'A', error: null })
  })

  it('returns an error for invalid source characters', () => {
    const result = convertBase('2', 2, 10)
    expect(result.error).toBe('Invalid characters for base 2 input.')
    expect(result.result).toBe('')
  })

  it('converts one input to all supported bases', () => {
    expect(convertToAllBases('10', 10)).toEqual({
      binary: '1010',
      octal: '12',
      decimal: '10',
      hex: 'A',
      error: null,
    })
  })

  it('returns empty values for empty input', () => {
    expect(convertToAllBases('   ', 10)).toEqual({
      binary: '',
      octal: '',
      decimal: '',
      hex: '',
      error: null,
    })
  })
})
