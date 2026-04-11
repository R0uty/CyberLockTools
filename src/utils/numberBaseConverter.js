// Number Base Converter Utility
// Converts numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16)

export const BASES = {
  binary: { label: 'Binary', base: 2, prefix: '0b', example: '1010' },
  octal: { label: 'Octal', base: 8, prefix: '0o', example: '12' },
  decimal: { label: 'Decimal', base: 10, prefix: '', example: '10' },
  hex: { label: 'Hexadecimal', base: 16, prefix: '0x', example: 'A' }
}

const VALID_CHARS = {
  binary: /^[01]+$/,
  octal: /^[0-7]+$/,
  decimal: /^[0-9]+$/,
  hex: /^[0-9a-fA-F]+$/
}

export function convertBase(value, fromBase, toBase) {
  const trimmed = value.trim()
  if (!trimmed) {
    return { success: false, error: 'Please enter a value' }
  }

  const fromKey = Object.keys(BASES).find(k => BASES[k].base === fromBase)
  if (!fromKey || !VALID_CHARS[fromKey].test(trimmed)) {
    return {
      success: false,
      error: `Invalid ${BASES[fromKey]?.label || 'input'} value: "${trimmed}". Only valid digits for base ${fromBase} are allowed.`
    }
  }

  const decimal = parseInt(trimmed, fromBase)
  if (isNaN(decimal) || decimal < 0) {
    return { success: false, error: 'Invalid number. Negative numbers are not supported.' }
  }

  const result = decimal.toString(toBase).toUpperCase()
  return { success: true, result, decimal }
}

export function convertToAllBases(value, fromBase) {
  const trimmed = value.trim()
  if (!trimmed) {
    return { success: false, error: 'Please enter a value' }
  }

  const fromKey = Object.keys(BASES).find(k => BASES[k].base === fromBase)
  if (!fromKey || !VALID_CHARS[fromKey].test(trimmed)) {
    return {
      success: false,
      error: `Invalid ${BASES[fromKey]?.label || 'input'} value. Only valid digits for base ${fromBase} are allowed.`
    }
  }

  const decimal = parseInt(trimmed, fromBase)
  if (isNaN(decimal) || decimal < 0) {
    return { success: false, error: 'Invalid number. Negative numbers are not supported.' }
  }

  return {
    success: true,
    decimal: decimal.toString(10),
    binary: decimal.toString(2),
    octal: decimal.toString(8),
    hex: decimal.toString(16).toUpperCase()
  }
}
