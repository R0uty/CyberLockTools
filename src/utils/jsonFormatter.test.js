import { describe, expect, it } from 'vitest'
import { formatJSON, validateJSON, minifyJSON, getJSONStats } from './jsonFormatter'

describe('jsonFormatter utilities', () => {
  it('formats valid JSON with 2-space indentation', () => {
    const result = formatJSON('{"name":"Alice","roles":["admin","user"]}')

    expect(result.success).toBe(true)
    expect(result.type).toBe('object')
    expect(result.formatted).toBe(`{\n  "name": "Alice",\n  "roles": [\n    "admin",\n    "user"\n  ]\n}`)
  })

  it('returns validation details for invalid JSON', () => {
    const result = validateJSON('{"a": 1,}')

    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/Invalid JSON|Syntax error|Parsing error/)
  })

  it('minifies JSON payloads', () => {
    const result = minifyJSON('{\n  "a": 1,\n  "b": true\n}')

    expect(result).toEqual({ success: true, minified: '{"a":1,"b":true}' })
  })

  it('returns deterministic JSON stats for nested structures', () => {
    const stats = getJSONStats('{"a":1,"b":{"c":[1,{"d":2}]}}')

    expect(stats).not.toBeNull()
    expect(stats.type).toBe('object')
    expect(stats.keyCount).toBe(4)
    expect(stats.depth).toBe(4)
    expect(stats.originalSize).toBe(29)
  })
})
