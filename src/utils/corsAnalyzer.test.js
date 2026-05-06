import { describe, expect, it } from 'vitest'
import { analyzeCorsResponse, toCorsAnalysisJson } from './corsAnalyzer'

describe('corsAnalyzer utilities', () => {
  it('flags credentialed access for a reflected origin and missing vary header', () => {
    const result = analyzeCorsResponse({
      rawHeaders: `HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Authorization, Content-Type`,
      requestOrigin: 'https://evil.example',
      credentialsRequested: true,
      requestMethod: 'POST',
      requestHeaders: 'Authorization, Content-Type'
    })

    expect(result.policyType).toBe('credentialed-specific-origin')
    expect(result.riskLevel).toBe('high')
    expect(result.browserOutcome.allowed).toBe(true)
    expect(result.findings.some((finding) => finding.title === 'Missing Vary: Origin')).toBe(true)
  })

  it('treats wildcard plus credentials as a broken configuration', () => {
    const result = analyzeCorsResponse({
      rawHeaders: `HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true`,
      requestOrigin: 'https://evil.example',
      credentialsRequested: true
    })

    expect(result.policyType).toBe('broken-wildcard-credentials')
    expect(result.browserOutcome.allowed).toBe(false)
    expect(result.findings.some((finding) => finding.title === 'Wildcard origin combined with credentials')).toBe(true)
  })

  it('reports blocked reads when ACAO is missing', () => {
    const result = analyzeCorsResponse({
      rawHeaders: 'HTTP/1.1 200 OK\nContent-Type: application/json',
      requestOrigin: 'https://evil.example'
    })

    expect(result.policyType).toBe('no-cors-read')
    expect(result.browserOutcome.allowed).toBe(false)
    expect(result.findings[0].title).toBe('No Access-Control-Allow-Origin header')
  })

  it('exports analysis data to JSON', () => {
    const result = analyzeCorsResponse({
      rawHeaders: 'HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: *'
    })

    const json = toCorsAnalysisJson(result)
    const parsed = JSON.parse(json)

    expect(parsed.policyType).toBe('public-wildcard')
    expect(parsed.responsePolicy.allowOrigin).toBe('*')
    expect(parsed.findings.length).toBeGreaterThan(0)
  })
})
