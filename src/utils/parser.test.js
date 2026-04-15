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

  it('parses a ping host command', () => {
    expect(parse([['ping', 'host', '10.0.0.1']])).toEqual([
      { type: 'PING', host: '10.0.0.1' },
    ])
  })

  it('throws for invalid ping syntax', () => {
    expect(() => parse([['ping', 'foo']])).toThrow(
      'Invalid ping syntax: expected "ping host <value>"'
    )
  })

  it('parses a connect host command', () => {
    expect(parse([['connect', 'host', 'example.com']])).toEqual([
      { type: 'CONNECT', host: 'example.com' },
    ])
  })

  it('parses a connect host command with port', () => {
    expect(parse([['connect', 'host', 'example.com', 'port', '443']])).toEqual([
      { type: 'CONNECT', host: 'example.com', port: '443' },
    ])
  })

  it('throws for invalid connect syntax', () => {
    expect(() => parse([['connect', 'foo']])).toThrow(
      'Invalid connect syntax: expected "connect host <value> [port <value>]"'
    )
  })

  it('parses a block ip command', () => {
    expect(parse([['block', 'ip', '1.2.3.4']])).toEqual([
      { type: 'BLOCK', ip: '1.2.3.4' },
    ])
  })

  it('throws for invalid block syntax', () => {
    expect(() => parse([['block', 'foo']])).toThrow(
      'Invalid block syntax: expected "block ip <value>"'
    )
  })

  it('parses an auth user command', () => {
    expect(parse([['auth', 'user', 'admin']])).toEqual([
      { type: 'AUTH', user: 'admin' },
    ])
  })

  it('throws for invalid auth syntax', () => {
    expect(() => parse([['auth', 'foo']])).toThrow(
      'Invalid auth syntax: expected "auth user <value>"'
    )
  })

  it('parses a fuzz url command', () => {
    expect(parse([['fuzz', 'url', 'https://example.com']])).toEqual([
      { type: 'FUZZ', url: 'https://example.com' },
    ])
  })

  it('throws for invalid fuzz syntax', () => {
    expect(() => parse([['fuzz', 'foo']])).toThrow(
      'Invalid fuzz syntax: expected "fuzz url <value>"'
    )
  })

  it('parses mixed commands across multiple lines', () => {
    expect(
      parse([
        ['scan', 'target', '192.168.1.1'],
        ['ping', 'host', '10.0.0.1'],
        ['block', 'ip', '1.2.3.4'],
      ])
    ).toEqual([
      { type: 'SCAN', target: '192.168.1.1' },
      { type: 'PING', host: '10.0.0.1' },
      { type: 'BLOCK', ip: '1.2.3.4' },
    ])
  })
})
