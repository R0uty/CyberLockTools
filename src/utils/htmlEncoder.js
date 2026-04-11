/**
 * HTML Encoder & Decoder Utilities
 * Encode text to HTML entities and decode HTML entities back to plain text
 */

// Map of common named HTML entities
const NAMED_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#47;',
  '=': '&#61;',
  '`': '&#96;'
}

const DECODE_MAP = {
  '&amp;':  '&',
  '&lt;':   '<',
  '&gt;':   '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;':  "'",
  '&#47;':  '/',
  '&#61;':  '=',
  '&#96;':  '`',
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;':  '®',
  '&trade;': '™',
  '&mdash;': '—',
  '&ndash;': '–',
  '&laquo;': '«',
  '&raquo;': '»',
  '&hellip;': '…',
  '&euro;': '€',
  '&pound;': '£',
  '&yen;': '¥',
  '&cent;': '¢',
  '&deg;': '°',
  '&plusmn;': '±',
  '&times;': '×',
  '&divide;': '÷',
  '&frac12;': '½',
  '&frac14;': '¼',
  '&frac34;': '¾',
  '&sup2;': '²',
  '&sup3;': '³',
  '&micro;': 'µ',
  '&para;': '¶',
  '&middot;': '·',
  '&bull;': '•',
  '&dagger;': '†',
  '&Dagger;': '‡',
  '&permil;': '‰',
  '&prime;': '′',
  '&Prime;': '″',
  '&lsquo;': '\u2018',
  '&rsquo;': '\u2019',
  '&ldquo;': '\u201C',
  '&rdquo;': '\u201D',
  '&sbquo;': '\u201A',
  '&bdquo;': '\u201E',
  '&lsaquo;': '\u2039',
  '&rsaquo;': '\u203A',
  '&spades;': '♠',
  '&clubs;': '♣',
  '&hearts;': '♥',
  '&diams;': '♦',
  '&larr;': '←',
  '&uarr;': '↑',
  '&rarr;': '→',
  '&darr;': '↓',
  '&harr;': '↔',
  '&forall;': '∀',
  '&exist;': '∃',
  '&empty;': '∅',
  '&nabla;': '∇',
  '&isin;': '∈',
  '&notin;': '∉',
  '&sum;': '∑',
  '&prod;': '∏',
  '&radic;': '√',
  '&infin;': '∞',
  '&and;': '∧',
  '&or;': '∨',
  '&cap;': '∩',
  '&cup;': '∪',
  '&int;': '∫',
  '&asymp;': '≈',
  '&ne;': '≠',
  '&equiv;': '≡',
  '&le;': '≤',
  '&ge;': '≥',
  '&sub;': '⊂',
  '&sup;': '⊃',
  '&sube;': '⊆',
  '&supe;': '⊇',
  '&oplus;': '⊕',
  '&otimes;': '⊗',
  '&perp;': '⊥',
  '&sdot;': '⋅',
  '&Alpha;': 'Α',
  '&Beta;': 'Β',
  '&Gamma;': 'Γ',
  '&Delta;': 'Δ',
  '&Epsilon;': 'Ε',
  '&Zeta;': 'Ζ',
  '&Eta;': 'Η',
  '&Theta;': 'Θ',
  '&Iota;': 'Ι',
  '&Kappa;': 'Κ',
  '&Lambda;': 'Λ',
  '&Mu;': 'Μ',
  '&Nu;': 'Ν',
  '&Xi;': 'Ξ',
  '&Omicron;': 'Ο',
  '&Pi;': 'Π',
  '&Rho;': 'Ρ',
  '&Sigma;': 'Σ',
  '&Tau;': 'Τ',
  '&Upsilon;': 'Υ',
  '&Phi;': 'Φ',
  '&Chi;': 'Χ',
  '&Psi;': 'Ψ',
  '&Omega;': 'Ω',
  '&alpha;': 'α',
  '&beta;': 'β',
  '&gamma;': 'γ',
  '&delta;': 'δ',
  '&epsilon;': 'ε',
  '&zeta;': 'ζ',
  '&eta;': 'η',
  '&theta;': 'θ',
  '&iota;': 'ι',
  '&kappa;': 'κ',
  '&lambda;': 'λ',
  '&mu;': 'μ',
  '&nu;': 'ν',
  '&xi;': 'ξ',
  '&omicron;': 'ο',
  '&pi;': 'π',
  '&rho;': 'ρ',
  '&sigmaf;': 'ς',
  '&sigma;': 'σ',
  '&tau;': 'τ',
  '&upsilon;': 'υ',
  '&phi;': 'φ',
  '&chi;': 'χ',
  '&psi;': 'ψ',
  '&omega;': 'ω'
}

/**
 * Encode text to HTML entities (standard mode: encode critical chars only)
 * @param {string} text - Plain text to encode
 * @returns {string} HTML-encoded string
 */
export function encodeHTMLStandard(text) {
  if (!text) return ''
  return text.replace(/[&<>"'/`=]/g, (char) => NAMED_ENTITIES[char] || char)
}

/**
 * Encode text to HTML entities (full mode: encode all non-ASCII as &#NNN;)
 * @param {string} text - Plain text to encode
 * @returns {string} HTML-encoded string
 */
export function encodeHTMLFull(text) {
  if (!text) return ''
  return Array.from(text).map((char) => {
    const code = char.codePointAt(0)
    if (NAMED_ENTITIES[char]) return NAMED_ENTITIES[char]
    if (code > 127) return `&#${code};`
    return char
  }).join('')
}

/**
 * Decode HTML entities (named, decimal &#NNN;, and hex &#xNN;) back to plain text
 * @param {string} text - HTML-encoded string
 * @returns {string} Plain text
 */
export function decodeHTML(text) {
  if (!text) return ''

  // First handle numeric entities (decimal and hex)
  let result = text.replace(/&#([0-9]+);/g, (_, num) =>
    String.fromCodePoint(parseInt(num, 10))
  )
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  )

  // Then handle named entities (longest match first to avoid partial matches)
  const sortedKeys = Object.keys(DECODE_MAP).sort((a, b) => b.length - a.length)
  const pattern = new RegExp(sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g')
  result = result.replace(pattern, (match) => DECODE_MAP[match] || match)

  return result
}

/**
 * Get statistics about encoded/decoded text
 * @param {string} original - Original text
 * @param {string} encoded  - Encoded text
 * @returns {object} Statistics
 */
export function getEncodingStats(original, encoded) {
  return {
    originalLength: original.length,
    encodedLength: encoded.length,
    expansionRatio: original.length ? (encoded.length / original.length).toFixed(2) : '0',
    entitiesCount: (encoded.match(/&[^;]+;/g) || []).length
  }
}
