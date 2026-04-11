// Number Base Converter utility

/**
 * Convert a number from one base to another.
 * @param {string} input - The input value as a string
 * @param {number} fromBase - Source base (2, 8, 10, or 16)
 * @param {number} toBase - Target base (2, 8, 10, or 16)
 * @returns {{ result: string, error: string|null }}
 */
export function convertBase(input, fromBase, toBase) {
  if (!input || input.trim() === '') {
    return { result: '', error: null }
  }

  const trimmed = input.trim()

  // Validate that input characters are valid for the source base
  const validChars = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/,
  }

  if (!validChars[fromBase] || !validChars[fromBase].test(trimmed)) {
    return { result: '', error: `Invalid characters for base ${fromBase} input.` }
  }

  try {
    const decimal = parseInt(trimmed, fromBase)
    if (isNaN(decimal)) {
      return { result: '', error: 'Could not parse the input value.' }
    }
    if (decimal < 0) {
      return { result: '', error: 'Negative numbers are not supported.' }
    }
    const result = decimal.toString(toBase).toUpperCase()
    return { result, error: null }
  } catch {
    return { result: '', error: 'Conversion failed.' }
  }
}

/**
 * Convert a value to all bases at once.
 * @param {string} input - The input value
 * @param {number} fromBase - Source base
 * @returns {{ binary: string, octal: string, decimal: string, hex: string, error: string|null }}
 */
export function convertToAllBases(input, fromBase) {
  if (!input || input.trim() === '') {
    return { binary: '', octal: '', decimal: '', hex: '', error: null }
  }

  const trimmed = input.trim()

  const validChars = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/,
  }

  if (!validChars[fromBase] || !validChars[fromBase].test(trimmed)) {
    return { binary: '', octal: '', decimal: '', hex: '', error: `Invalid characters for base ${fromBase} input.` }
  }

  try {
    const decimal = parseInt(trimmed, fromBase)
    if (isNaN(decimal)) {
      return { binary: '', octal: '', decimal: '', hex: '', error: 'Could not parse input.' }
    }
    return {
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hex: decimal.toString(16).toUpperCase(),
      error: null,
    }
  } catch {
    return { binary: '', octal: '', decimal: '', hex: '', error: 'Conversion failed.' }
  }
}

export const BASE_LABELS = {
  2: 'Binary (Base 2)',
  8: 'Octal (Base 8)',
  10: 'Decimal (Base 10)',
  16: 'Hexadecimal (Base 16)',
}

export const BASE_PREFIXES = {
  2: '0b',
  8: '0o',
  10: '',
  16: '0x',
}

export const EXAMPLES = [
  { label: 'Byte max', decimal: '255', binary: '11111111', octal: '377', hex: 'FF' },
  { label: 'Port 80', decimal: '80', binary: '1010000', octal: '120', hex: '50' },
  { label: 'Port 443', decimal: '443', binary: '110111011', octal: '673', hex: '1BB' },
  { label: 'ASCII "A"', decimal: '65', binary: '1000001', octal: '101', hex: '41' },
  { label: 'IPv4 octet max', decimal: '192', binary: '11000000', octal: '300', hex: 'C0' },
]
