import { describe, expect, it } from 'vitest'
import { parseHttpHeaders, toHeadersJson } from './httpHeadersParser'

describe('httpHeadersParser utilities', () => {
  it('parses response headers, duplicates, and folded values', () => {
    const parsed = parseHttpHeaders(`HTTP/1.1 200 OK\nContent-Security-Policy: default-src 'self'\nSet-Cookie: a=1\nSet-Cookie: b=2\nX-Custom: value\n  continued\nInvalidLine`)

    expect(parsed.kind).toBe('response')
    expect(parsed.startLine).toBe('HTTP/1.1 200 OK')
    expect(parsed.headerCount).toBe(4)
    expect(parsed.invalidLines).toEqual(['InvalidLine'])

    expect(parsed.duplicateHeaders).toEqual([
      {
        name: 'set-cookie',
        count: 2,
        values: ['a=1', 'b=2'],
      },
    ])

    expect(parsed.groupedHeaders['x-custom']).toEqual(['value continued'])
    expect(parsed.securityReview.present).toContain('content-security-policy')
  })

  it('serializes parsed headers to JSON for export', () => {
    const parsed = parseHttpHeaders('Host: example.com\nUser-Agent: TestAgent')
    const json = toHeadersJson(parsed)
    const exportObj = JSON.parse(json)

    expect(exportObj.kind).toBe('headers')
    expect(exportObj.headerCount).toBe(2)
    expect(exportObj.headers).toEqual([
      { name: 'Host', value: 'example.com' },
      { name: 'User-Agent', value: 'TestAgent' },
    ])
    expect(exportObj.securityReview).toBeUndefined()
  })

  it('throws on empty input', () => {
    expect(() => parseHttpHeaders('   ')).toThrow(/Paste raw HTTP headers/)
  })
})
