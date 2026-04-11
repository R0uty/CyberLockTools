export const CSP_DIRECTIVE_FIELDS = [
  {
    name: 'default-src',
    label: 'default-src',
    placeholder: "'self'",
    description: 'Fallback source list for resource types without a more specific directive.'
  },
  {
    name: 'script-src',
    label: 'script-src',
    placeholder: "'self' https://cdn.example.com 'nonce-r4nd0m'",
    description: 'Controls where JavaScript can load from and whether inline scripts are allowed.'
  },
  {
    name: 'style-src',
    label: 'style-src',
    placeholder: "'self' https://fonts.googleapis.com",
    description: 'Controls CSS sources, including inline styles and external stylesheets.'
  },
  {
    name: 'img-src',
    label: 'img-src',
    placeholder: "'self' data: https:",
    description: 'Controls image sources such as `<img>` and CSS background images.'
  },
  {
    name: 'connect-src',
    label: 'connect-src',
    placeholder: "'self' https://api.example.com wss://ws.example.com",
    description: 'Controls fetch, XHR, EventSource, WebSocket, and sendBeacon destinations.'
  },
  {
    name: 'font-src',
    label: 'font-src',
    placeholder: "'self' https://fonts.gstatic.com",
    description: 'Controls web font origins.'
  },
  {
    name: 'frame-src',
    label: 'frame-src',
    placeholder: "'self' https://www.youtube.com",
    description: 'Controls which URLs can be embedded as child frames.'
  },
  {
    name: 'object-src',
    label: 'object-src',
    placeholder: "'none'",
    description: 'Controls legacy plugins like `<object>`, `<embed>`, and `<applet>`.'
  },
  {
    name: 'base-uri',
    label: 'base-uri',
    placeholder: "'self'",
    description: 'Restricts which URLs can be used in the document `<base>` element.'
  },
  {
    name: 'form-action',
    label: 'form-action',
    placeholder: "'self'",
    description: 'Restricts where forms can submit to.'
  },
  {
    name: 'frame-ancestors',
    label: 'frame-ancestors',
    placeholder: "'none'",
    description: 'Controls which sites can embed your page in a frame.'
  },
  {
    name: 'report-uri',
    label: 'report-uri',
    placeholder: 'https://reports.example.com/csp',
    description: 'Legacy violation reporting endpoint. Still widely supported, but newer setups often pair it with `report-to`.'
  },
  {
    name: 'report-to',
    label: 'report-to',
    placeholder: 'csp-endpoint',
    description: 'Names the Reporting API group that should receive CSP violation reports.'
  }
]

export const CSP_BOOLEAN_DIRECTIVES = [
  {
    name: 'upgrade-insecure-requests',
    label: 'upgrade-insecure-requests',
    description: 'Automatically upgrades `http:` subresource requests to HTTPS.'
  },
  {
    name: 'block-all-mixed-content',
    label: 'block-all-mixed-content',
    description: 'Blocks mixed HTTP content inside an HTTPS page.'
  }
]

export const CSP_PRESETS = {
  strict: {
    label: 'Strict',
    directives: {
      'default-src': "'self'",
      'script-src': "'self'",
      'style-src': "'self'",
      'img-src': "'self' data:",
      'connect-src': "'self'",
      'font-src': "'self'",
      'frame-src': "'none'",
      'object-src': "'none'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'frame-ancestors': "'none'"
    },
    flags: ['upgrade-insecure-requests']
  },
  spa: {
    label: 'SPA / CDN',
    directives: {
      'default-src': "'self'",
      'script-src': "'self' https://cdn.jsdelivr.net",
      'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
      'img-src': "'self' data: https:",
      'connect-src': "'self' https://api.example.com wss://api.example.com",
      'font-src': "'self' https://fonts.gstatic.com",
      'frame-src': "'self'",
      'object-src': "'none'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'frame-ancestors': "'self'"
    },
    flags: ['upgrade-insecure-requests']
  },
  development: {
    label: 'Development',
    directives: {
      'default-src': "'self'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:*",
      'style-src': "'self' 'unsafe-inline' http://localhost:*",
      'img-src': "'self' data: blob: http://localhost:*",
      'connect-src': "'self' http://localhost:* ws://localhost:*",
      'font-src': "'self' data:",
      'frame-src': "'self'",
      'object-src': "'none'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'frame-ancestors': "'self'"
    },
    flags: []
  }
}

export const EXAMPLE_CSP_POLICY = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.example.com; object-src 'none'; base-uri 'self'"
export const DEFAULT_REPORT_TO_MAX_AGE = 10886400

function normalizeWhitespace(value) {
  return value.trim().replace(/\s+/g, ' ')
}

function escapeHtmlAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function buildCspPolicy({ directives = {}, flags = [] }) {
  const directiveParts = CSP_DIRECTIVE_FIELDS
    .map(({ name }) => {
      const rawValue = directives[name]
      if (!rawValue || !rawValue.trim()) return null
      return `${name} ${normalizeWhitespace(rawValue)}`
    })
    .filter(Boolean)

  const enabledFlags = CSP_BOOLEAN_DIRECTIVES
    .map(({ name }) => name)
    .filter((name) => flags.includes(name))

  return [...directiveParts, ...enabledFlags].join('; ').trim()
}

export function parseCspPolicy(policy) {
  const directives = {}
  const flags = []

  if (!policy || !policy.trim()) {
    return { directives, flags }
  }

  const parts = policy
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)

  for (const part of parts) {
    const [directiveName, ...values] = part.split(/\s+/)
    if (!directiveName) continue

    const normalizedName = directiveName.toLowerCase()

    if (values.length === 0) {
      flags.push(normalizedName)
      continue
    }

    directives[normalizedName] = values.join(' ')
  }

  return { directives, flags }
}

export function generateCspHeader(policy) {
  if (!policy.trim()) return ''
  return `Content-Security-Policy: ${policy}`
}

export function generateCspMetaTag(policy) {
  if (!policy.trim()) return ''
  return `<meta http-equiv="Content-Security-Policy" content="${escapeHtmlAttribute(policy)}">`
}

function normalizeReportGroup(value) {
  return value.trim().replace(/^['"]|['"]$/g, '')
}

export function generateReportToJSON({ group, endpoint, maxAge = DEFAULT_REPORT_TO_MAX_AGE, includeSubdomains = false }) {
  const normalizedGroup = normalizeReportGroup(group || '')
  const normalizedEndpoint = (endpoint || '').trim()
  const normalizedMaxAge = Number.isFinite(Number(maxAge)) ? Math.max(0, Math.floor(Number(maxAge))) : DEFAULT_REPORT_TO_MAX_AGE

  if (!normalizedGroup || !normalizedEndpoint) {
    return ''
  }

  return JSON.stringify({
    group: normalizedGroup,
    max_age: normalizedMaxAge,
    ...(includeSubdomains ? { include_subdomains: true } : {}),
    endpoints: [
      {
        url: normalizedEndpoint
      }
    ]
  }, null, 2)
}

export function generateReportingEndpointsHeader({ group, endpoint }) {
  const normalizedGroup = normalizeReportGroup(group || '')
  const normalizedEndpoint = (endpoint || '').trim()

  if (!normalizedGroup || !normalizedEndpoint) {
    return ''
  }

  return `Reporting-Endpoints: ${normalizedGroup}="${normalizedEndpoint}"`
}

function directiveValues(analysis, name) {
  const value = analysis.directives[name]
  return value ? value.split(/\s+/).filter(Boolean) : []
}

function hasNonceOrHash(values) {
  return values.some((value) => value.startsWith("'nonce-") || value.startsWith("'sha"))
}

export function analyzeCspPolicy(policy) {
  const normalized = buildCspPolicy(parseCspPolicy(policy))
  const parsed = parseCspPolicy(normalized)
  const warnings = []
  const positives = []

  if (!normalized) {
    return {
      normalizedPolicy: '',
      directiveCount: 0,
      flagsCount: 0,
      warnings: ['No CSP policy provided yet.'],
      positives
    }
  }

  const defaultSrc = directiveValues(parsed, 'default-src')
  const scriptSrc = directiveValues(parsed, 'script-src')
  const styleSrc = directiveValues(parsed, 'style-src')
  const objectSrc = directiveValues(parsed, 'object-src')
  const baseUri = directiveValues(parsed, 'base-uri')
  const frameAncestors = directiveValues(parsed, 'frame-ancestors')
  const reportUri = directiveValues(parsed, 'report-uri')
  const reportTo = directiveValues(parsed, 'report-to')

  if (defaultSrc.length === 0) {
    warnings.push("Missing `default-src`. Add a fallback policy so unspecified resource types are not left open.")
  } else {
    positives.push("`default-src` is set, so you have a baseline fallback for unspecified fetch directives.")
  }

  if (scriptSrc.includes("'unsafe-inline'")) {
    warnings.push("`script-src` allows `'unsafe-inline'`, which weakens XSS protection. Prefer nonces or hashes instead.")
  }

  if (styleSrc.includes("'unsafe-inline'")) {
    warnings.push("`style-src` allows `'unsafe-inline'`. This is common during migration, but removing it improves hardening.")
  }

  if (scriptSrc.includes("'unsafe-eval'")) {
    warnings.push("`script-src` allows `'unsafe-eval'`, which is risky for production and should be avoided when possible.")
  }

  if ([...defaultSrc, ...scriptSrc].includes('*')) {
    warnings.push("Wildcard `*` appears in a high-impact directive. Consider narrowing sources to trusted origins.")
  }

  if ([...defaultSrc, ...scriptSrc, ...styleSrc].some((value) => value.startsWith('http:'))) {
    warnings.push("Plain `http:` sources are allowed. Prefer HTTPS-only origins to avoid mixed-content and downgrade risks.")
  }

  if (scriptSrc.includes('data:')) {
    warnings.push("`script-src` includes `data:`. This is rarely needed and significantly expands script injection risk.")
  }

  if (objectSrc.length === 0) {
    warnings.push("Missing `object-src`. Set it to `'none'` unless you intentionally rely on legacy plugin content.")
  } else if (objectSrc.includes("'none'")) {
    positives.push("`object-src 'none'` blocks legacy plugin content, which is a strong modern default.")
  }

  if (baseUri.length === 0) {
    warnings.push("Missing `base-uri`. Setting `base-uri 'self'` helps prevent base-tag injection.")
  } else {
    positives.push("`base-uri` is set, which helps protect against malicious `<base>` tag injection.")
  }

  if (frameAncestors.length === 0) {
    warnings.push("Missing `frame-ancestors`. Add `'none'` or trusted origins to reduce clickjacking risk.")
  } else {
    positives.push("`frame-ancestors` is present, so embedding restrictions are explicitly defined.")
  }

  if (reportUri.length === 0 && reportTo.length === 0) {
    warnings.push("No CSP reporting endpoint is configured. Add `report-uri`, `report-to`, or both if you want browser violation reports.")
  }

  if (reportUri.length > 0) {
    positives.push("`report-uri` is configured, so compatible browsers can send CSP violation reports to your endpoint.")
  }

  if (reportTo.length > 0) {
    positives.push("`report-to` is configured, which enables Reporting API-based CSP violation delivery where supported.")
  }

  if (reportTo.length > 0 && reportUri.length === 0) {
    warnings.push("`report-to` is set without `report-uri`. That can be fine, but many teams keep both for broader browser coverage.")
  }

  if (scriptSrc.length > 0 && hasNonceOrHash(scriptSrc)) {
    positives.push("`script-src` uses a nonce or hash, which is the recommended way to allow specific inline scripts.")
  }

  if (parsed.flags.includes('upgrade-insecure-requests')) {
    positives.push("`upgrade-insecure-requests` is enabled, so insecure subresource requests will be upgraded automatically.")
  }

  return {
    normalizedPolicy: normalized,
    directiveCount: Object.keys(parsed.directives).length,
    flagsCount: parsed.flags.length,
    warnings,
    positives
  }
}
