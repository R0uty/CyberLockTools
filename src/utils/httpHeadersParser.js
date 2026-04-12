const RESPONSE_SECURITY_HEADERS = [
  'content-security-policy',
  'strict-transport-security',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
  'cross-origin-embedder-policy'
]

function normalizeLineEndings(value) {
  return value.replace(/\r\n/g, '\n')
}

function detectStartLineKind(startLine) {
  if (!startLine) return 'headers'
  if (/^HTTP\/\d(?:\.\d)?\s+\d{3}/i.test(startLine)) return 'response'
  if (/^[A-Z]+\s+\S+\s+HTTP\/\d(?:\.\d)?$/i.test(startLine)) return 'request'
  return 'headers'
}

export function parseHttpHeaders(rawInput) {
  const normalizedInput = normalizeLineEndings(rawInput).trim()

  if (!normalizedInput) {
    throw new Error('Paste raw HTTP headers or a full request/response block first.')
  }

  const lines = normalizedInput.split('\n')
  const firstLine = lines[0]
  const hasStartLine = !firstLine.includes(':')
  const startLine = hasStartLine ? firstLine.trim() : ''
  const headerLines = hasStartLine ? lines.slice(1) : lines
  const invalidLines = []
  const headers = []

  headerLines.forEach((line) => {
    if (!line.trim()) return

    if (/^\s/.test(line) && headers.length > 0) {
      headers[headers.length - 1].value += ` ${line.trim()}`
      return
    }

    const separatorIndex = line.indexOf(':')

    if (separatorIndex === -1) {
      invalidLines.push(line)
      return
    }

    const name = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()

    if (!name) {
      invalidLines.push(line)
      return
    }

    headers.push({
      name,
      lowerName: name.toLowerCase(),
      value
    })
  })

  const groupedHeaders = headers.reduce((accumulator, header) => {
    accumulator[header.lowerName] ??= []
    accumulator[header.lowerName].push(header.value)
    return accumulator
  }, {})

  const duplicateHeaders = Object.entries(groupedHeaders)
    .filter(([, values]) => values.length > 1)
    .map(([name, values]) => ({ name, count: values.length, values }))

  const structuredHeaders = headers.map((header) => ({
    ...header,
    duplicate: groupedHeaders[header.lowerName].length > 1
  }))

  const kind = detectStartLineKind(startLine)
  const presentSecurityHeaders = RESPONSE_SECURITY_HEADERS.filter((headerName) => groupedHeaders[headerName])
  const missingSecurityHeaders = RESPONSE_SECURITY_HEADERS.filter((headerName) => !groupedHeaders[headerName])

  return {
    startLine,
    kind,
    headerCount: headers.length,
    uniqueHeaderCount: Object.keys(groupedHeaders).length,
    invalidLines,
    duplicateHeaders,
    structuredHeaders,
    groupedHeaders,
    securityReview: {
      present: presentSecurityHeaders,
      missing: missingSecurityHeaders
    }
  }
}

export function toHeadersJson(parsedHeaders) {
  return JSON.stringify({
    kind: parsedHeaders.kind,
    startLine: parsedHeaders.startLine || null,
    headerCount: parsedHeaders.headerCount,
    uniqueHeaderCount: parsedHeaders.uniqueHeaderCount,
    invalidLines: parsedHeaders.invalidLines,
    headers: parsedHeaders.structuredHeaders.map(({ name, value }) => ({ name, value })),
    duplicates: parsedHeaders.duplicateHeaders,
    securityReview: parsedHeaders.kind === 'response' ? parsedHeaders.securityReview : undefined
  }, null, 2)
}
