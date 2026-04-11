// HTML Encoder/Decoder Utility
// Encodes and decodes HTML entities

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}

const NAMED_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&#x27;': "'",
  '&#x2F;': '/',
  '&#47;': '/',
  '&#x60;': '`',
  '&#96;': '`',
  '&#x3D;': '=',
  '&#61;': '=',
  '&nbsp;': '\u00A0',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&euro;': '€',
  '&pound;': '£',
  '&yen;': '¥',
  '&cent;': '¢',
  '&mdash;': '—',
  '&ndash;': '–',
  '&laquo;': '«',
  '&raquo;': '»',
  '&hellip;': '…',
  '&bull;': '•',
  '&deg;': '°',
  '&plusmn;': '±',
  '&times;': '×',
  '&divide;': '÷',
  '&frac12;': '½',
  '&frac14;': '¼',
  '&frac34;': '¾'
}

export function encodeHTML(text) {
  if (!text) return { success: false, error: 'Please enter text to encode' }

  const encoded = text.replace(/[&<>"'`=/]/g, match => HTML_ENTITIES[match] || match)
  return {
    success: true,
    result: encoded,
    charCount: text.length,
    encodedCount: encoded.length
  }
}

export function encodeHTMLFull(text) {
  if (!text) return { success: false, error: 'Please enter text to encode' }

  let encoded = ''
  for (const char of text) {
    const code = char.charCodeAt(0)
    if (code > 127) {
      encoded += `&#${code};`
    } else if (HTML_ENTITIES[char]) {
      encoded += HTML_ENTITIES[char]
    } else {
      encoded += char
    }
  }
  return {
    success: true,
    result: encoded,
    charCount: text.length,
    encodedCount: encoded.length
  }
}

export function decodeHTML(text) {
  if (!text) return { success: false, error: 'Please enter text to decode' }

  let decoded = text

  // Replace named entities
  for (const [entity, char] of Object.entries(NAMED_ENTITIES)) {
    decoded = decoded.split(entity).join(char)
  }

  // Replace numeric decimal entities: &#NNN;
  decoded = decoded.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))

  // Replace numeric hex entities: &#xHHH;
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))

  return {
    success: true,
    result: decoded,
    charCount: text.length,
    decodedCount: decoded.length
  }
}

export const EXAMPLES = [
  { label: 'HTML Tags', input: '<h1>Hello & World</h1>' },
  { label: 'Script Tag', input: '<script>alert("XSS")</script>' },
  { label: 'SQL Injection', input: "' OR 1=1; DROP TABLE users; --" },
  { label: 'Special Chars', input: '© 2024 R0uty <admin@example.com> "Tools"' }
]
