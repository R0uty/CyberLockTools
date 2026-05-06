import { parseHttpHeaders } from './httpHeadersParser'

const FINDING_PRIORITY = {
  high: 3,
  medium: 2,
  low: 1,
  info: 0
}

function splitHeaderList(value = '') {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function getFirstHeaderValue(groupedHeaders, name) {
  return groupedHeaders[name]?.[0]?.trim() ?? ''
}

function normalizeToken(value = '') {
  return value.trim().toLowerCase()
}

function buildPolicyType(allowOrigin, allowCredentials) {
  if (!allowOrigin) {
    return 'no-cors-read'
  }

  if (allowOrigin === '*' && allowCredentials) {
    return 'broken-wildcard-credentials'
  }

  if (allowOrigin === '*') {
    return 'public-wildcard'
  }

  if (allowOrigin === 'null') {
    return 'null-origin'
  }

  if (allowCredentials) {
    return 'credentialed-specific-origin'
  }

  return 'specific-origin'
}

function getHighestRisk(findings) {
  return findings.reduce((highest, finding) => (
    FINDING_PRIORITY[finding.level] > FINDING_PRIORITY[highest]
      ? finding.level
      : highest
  ), 'info')
}

function buildBrowserOutcome({
  allowOrigin,
  allowCredentials,
  requestOrigin,
  credentialsRequested,
  originAllowed
}) {
  if (!allowOrigin) {
    return {
      verdict: 'Blocked: response does not grant cross-origin read access.',
      allowed: false
    }
  }

  if (allowOrigin === '*' && allowCredentials && credentialsRequested) {
    return {
      verdict: 'Blocked: wildcard origin cannot be combined with credentialed browser reads.',
      allowed: false
    }
  }

  if (requestOrigin && originAllowed === false) {
    return {
      verdict: `Blocked: the supplied Origin (${requestOrigin}) does not match Access-Control-Allow-Origin.`,
      allowed: false
    }
  }

  if (requestOrigin && credentialsRequested && originAllowed && !allowCredentials) {
    return {
      verdict: 'Blocked for credentialed reads: the response does not allow credentials.',
      allowed: false
    }
  }

  if (requestOrigin && originAllowed && credentialsRequested && allowCredentials) {
    return {
      verdict: 'Allowed: the tested origin can read credentialed responses in the browser.',
      allowed: true
    }
  }

  if (requestOrigin && originAllowed) {
    return {
      verdict: 'Allowed: the tested origin can read non-credentialed responses in the browser.',
      allowed: true
    }
  }

  if (allowOrigin === '*') {
    return {
      verdict: 'Allowed for non-credentialed reads from any origin.',
      allowed: true
    }
  }

  return {
    verdict: 'CORS headers are present; supply a test Origin to evaluate browser behavior more precisely.',
    allowed: null
  }
}

export function analyzeCorsResponse({
  rawHeaders,
  requestOrigin = '',
  credentialsRequested = false,
  requestMethod = 'GET',
  requestHeaders = ''
}) {
  if (!rawHeaders?.trim()) {
    throw new Error('Paste response headers first.')
  }

  const parsedHeaders = parseHttpHeaders(rawHeaders)
  const groupedHeaders = parsedHeaders.groupedHeaders
  const allowOrigin = getFirstHeaderValue(groupedHeaders, 'access-control-allow-origin')
  const allowCredentials = normalizeToken(getFirstHeaderValue(groupedHeaders, 'access-control-allow-credentials')) === 'true'
  const allowMethods = splitHeaderList(getFirstHeaderValue(groupedHeaders, 'access-control-allow-methods'))
  const allowHeaders = splitHeaderList(getFirstHeaderValue(groupedHeaders, 'access-control-allow-headers'))
  const exposeHeaders = splitHeaderList(getFirstHeaderValue(groupedHeaders, 'access-control-expose-headers'))
  const varyTokens = splitHeaderList((groupedHeaders.vary ?? []).join(','))
  const varyIncludesOrigin = varyTokens.some((token) => normalizeToken(token) === 'origin')

  const normalizedOrigin = requestOrigin.trim()
  const normalizedMethod = requestMethod.trim().toUpperCase() || 'GET'
  const requestedHeadersList = splitHeaderList(requestHeaders).map((entry) => normalizeToken(entry))
  const normalizedAllowHeaders = allowHeaders.map((entry) => normalizeToken(entry))
  const normalizedAllowMethods = allowMethods.map((entry) => entry.toUpperCase())
  const originAllowed = normalizedOrigin
    ? (
      allowOrigin === '*'
        ? !credentialsRequested
        : allowOrigin === 'null'
          ? normalizedOrigin === 'null'
          : allowOrigin === normalizedOrigin
    )
    : null
  const requestedMethodAllowed = allowMethods.length > 0
    ? normalizedAllowMethods.includes('*') || normalizedAllowMethods.includes(normalizedMethod)
    : null
  const requestedHeadersAllowed = requestedHeadersList.length > 0 && allowHeaders.length > 0
    ? requestedHeadersList.every((header) => normalizedAllowHeaders.includes('*') || normalizedAllowHeaders.includes(header))
    : null

  const findings = []

  if (!allowOrigin) {
    findings.push({
      level: 'low',
      title: 'No Access-Control-Allow-Origin header',
      detail: 'Browsers will block cross-origin reads unless a valid Access-Control-Allow-Origin value is returned.'
    })
  }

  if (allowOrigin === '*') {
    findings.push({
      level: 'medium',
      title: 'Wildcard origin is enabled',
      detail: 'Any origin can read non-credentialed responses. This is only safe when the response is intentionally public.'
    })
  }

  if (allowOrigin === '*' && allowCredentials) {
    findings.push({
      level: 'medium',
      title: 'Wildcard origin combined with credentials',
      detail: 'Browsers reject Access-Control-Allow-Origin: * when Access-Control-Allow-Credentials: true is also present, which usually signals a broken CORS policy.'
    })
  }

  if (allowOrigin === 'null') {
    findings.push({
      level: 'high',
      title: 'Null origin is allowed',
      detail: 'Allowlisting the null origin is risky because sandboxed iframes and local-file contexts can generate Origin: null requests.'
    })
  }

  if (normalizedOrigin && allowOrigin === normalizedOrigin && allowCredentials) {
    findings.push({
      level: 'high',
      title: 'Credentialed cross-origin access allowed for tested origin',
      detail: 'The supplied origin matches Access-Control-Allow-Origin and credentials are enabled, so authenticated browser responses can be exposed to that origin.'
    })
  } else if (normalizedOrigin && allowOrigin === normalizedOrigin) {
    findings.push({
      level: 'medium',
      title: 'Specific origin is allowed',
      detail: 'The supplied origin can read non-credentialed responses. Confirm whether this origin is intentionally allowlisted or reflected dynamically.'
    })
  }

  if (normalizedOrigin && allowOrigin && !['*', 'null'].includes(allowOrigin) && allowOrigin === normalizedOrigin && !varyIncludesOrigin) {
    findings.push({
      level: 'medium',
      title: 'Missing Vary: Origin',
      detail: 'If the server sets Access-Control-Allow-Origin dynamically, missing Vary: Origin can cause cache confusion and cross-tenant data exposure.'
    })
  }

  if (normalizedOrigin && allowOrigin && !['*', 'null'].includes(allowOrigin) && allowOrigin !== normalizedOrigin) {
    findings.push({
      level: 'low',
      title: 'Tested origin is not allowed',
      detail: `The supplied origin (${normalizedOrigin}) does not match the response policy (${allowOrigin}).`
    })
  }

  if (allowCredentials && !allowOrigin) {
    findings.push({
      level: 'low',
      title: 'Credentials header has no effect without ACAO',
      detail: 'Access-Control-Allow-Credentials is ignored when Access-Control-Allow-Origin is missing.'
    })
  }

  if (requestedMethodAllowed === false) {
    findings.push({
      level: 'low',
      title: 'Requested method is not allowlisted',
      detail: `${normalizedMethod} is not present in Access-Control-Allow-Methods. A preflight request should fail for this method.`
    })
  }

  if (requestedHeadersAllowed === false) {
    findings.push({
      level: 'low',
      title: 'Requested headers are not allowlisted',
      detail: 'One or more supplied request headers are not present in Access-Control-Allow-Headers, so a browser preflight should reject them.'
    })
  }

  if (findings.length === 0) {
    findings.push({
      level: 'info',
      title: 'No obvious risky combination detected',
      detail: 'The supplied headers do not show a common CORS misconfiguration by themselves. Continue testing with different Origin values and credential modes.'
    })
  }

  const policyType = buildPolicyType(allowOrigin, allowCredentials)
  const browserOutcome = buildBrowserOutcome({
    allowOrigin,
    allowCredentials,
    requestOrigin: normalizedOrigin,
    credentialsRequested,
    originAllowed
  })

  return {
    parsedHeaders,
    policyType,
    riskLevel: getHighestRisk(findings),
    browserOutcome,
    requestContext: {
      origin: normalizedOrigin,
      credentialsRequested,
      method: normalizedMethod,
      headers: requestedHeadersList
    },
    responsePolicy: {
      allowOrigin,
      allowCredentials,
      allowMethods,
      allowHeaders,
      exposeHeaders,
      vary: varyTokens,
      varyIncludesOrigin
    },
    evaluation: {
      originAllowed,
      requestedMethodAllowed,
      requestedHeadersAllowed
    },
    findings
  }
}

export function toCorsAnalysisJson(result) {
  return JSON.stringify({
    policyType: result.policyType,
    riskLevel: result.riskLevel,
    browserOutcome: result.browserOutcome,
    requestContext: result.requestContext,
    responsePolicy: result.responsePolicy,
    evaluation: result.evaluation,
    findings: result.findings,
    parsedHeaders: {
      kind: result.parsedHeaders.kind,
      startLine: result.parsedHeaders.startLine || null,
      headerCount: result.parsedHeaders.headerCount,
      uniqueHeaderCount: result.parsedHeaders.uniqueHeaderCount
    }
  }, null, 2)
}
