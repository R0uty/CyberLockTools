import { describe, expect, it } from 'vitest'
import { formatCSV, jsonToCSV } from './csvFormatter'

describe('csvFormatter security hardening', () => {
  it('neutralizes spreadsheet formula payloads in JSON to CSV conversion', () => {
    const result = jsonToCSV(JSON.stringify([
      { name: 'Alice', note: '=HYPERLINK("http://evil.example","click")' },
      { name: 'Bob', note: '+SUM(1,2)' },
      { name: 'Cara', note: '@cmd' },
      { name: 'Dan', note: '-10+20' },
    ]))

    expect(result.success).toBe(true)
    expect(result.csv).toContain("'=HYPERLINK")
    expect(result.csv).toContain("'+SUM(1,2)")
    expect(result.csv).toContain("'@cmd")
    expect(result.csv).toContain("'-10+20")
  })

  it('neutralizes spreadsheet formula payloads during CSV formatting', () => {
    const result = formatCSV('name,note\nAlice,=2+3\nBob,+CMD\nCara,@SUM(A1:A2)')

    expect(result.success).toBe(true)
    expect(result.formatted).toContain("'=2+3")
    expect(result.formatted).toContain("'+CMD")
    expect(result.formatted).toContain("'@SUM(A1:A2)")
  })

  it('preserves already-escaped values that start with a single quote', () => {
    const result = jsonToCSV(JSON.stringify([
      { name: 'Safe', note: "'=-already-escaped" },
    ]))

    expect(result.success).toBe(true)
    expect(result.csv).toContain("'=-already-escaped")
    expect(result.csv).not.toContain("''=-already-escaped")
  })

  it('allows disabling formula neutralization when strict data fidelity is needed', () => {
    const result = jsonToCSV(
      JSON.stringify([{ name: 'Raw', note: '=1+1' }]),
      { sanitizeFormulas: false }
    )

    expect(result.success).toBe(true)
    expect(result.csv).toContain('=1+1')
    expect(result.csv).not.toContain("'=1+1")
  })
})
