/**
 * Number Base Converter Utilities
 * Convert numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16)
 */

export const BASE_OPTIONS = [
  { value: 2,  label: 'Binary (Base 2)',      prefix: '0b' },
  { value: 8,  label: 'Octal (Base 8)',        prefix: '0o' },
  { value: 10, label: 'Decimal (Base 10)',     prefix: ''   },
  { value: 16, label: 'Hexadecimal (Base 16)', prefix: '0x' }
]

/**
 * Convert a number string from one base to all other bases.
 * @param {string} input - The number string to convert
 * @param {number} fromBase - The source base (2, 8, 10, or 16)
 * @returns {object} Results object with keys bin, oct, dec, hex and optional error
 */
export function convertBase(input, fromBase) {
  const clean = input.trim()
  if (!clean) {
    return { bin: '', oct: '', dec: '', hex: '', error: '' }
  }

  // Validate the input against the chosen base
  const validChars = {
    2:  /^[01]+$/,
    8:  /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/
  }

  if (!validChars[fromBase].test(clean)) {
    return { bin: '', oct: '', dec: '', hex: '', error: `Invalid characters for base ${fromBase}` }
  }

  // JavaScript BigInt to handle large numbers without loss of precision
  let decimal
  try {
    decimal = BigInt(parseInt(clean, fromBase))
    // Recompute using BigInt-aware parsing for bases 2, 8, 16
    if (fromBase === 2) {
      decimal = BigInt('0b' + clean)
    } else if (fromBase === 8) {
      decimal = BigInt('0o' + clean)
    } else if (fromBase === 10) {
      decimal = BigInt(clean)
    } else if (fromBase === 16) {
      decimal = BigInt('0x' + clean)
    }
  } catch {
    return { bin: '', oct: '', dec: '', hex: '', error: 'Number is too large or invalid' }
  }

  const bin = decimal.toString(2)
  const oct = decimal.toString(8)
  const dec = decimal.toString(10)
  const hex = decimal.toString(16).toUpperCase()

  // Calculate bit length (next power of 2, min 8)
  const bitLen = Math.max(8, Math.pow(2, Math.ceil(Math.log2(bin.length || 1))))

  return {
    bin,
    oct,
    dec,
    hex,
    bitLength: bitLen,
    error: ''
  }
}

/**
 * Returns the prefixed representation for a given base value.
 * @param {string} value - The numeric string in the given base
 * @param {number} base  - The base (2, 8, 10, 16)
 * @returns {string}
 */
export function withPrefix(value, base) {
  const opt = BASE_OPTIONS.find(b => b.value === base)
  if (!opt || !value) return value
  return opt.prefix + value
}
