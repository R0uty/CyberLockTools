/**
 * Formats JSON with 2-space indentation
 * @param {string} jsonString - The JSON string to format
 * @returns {object} Object with formatted JSON or error
 */
export function formatJSON(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: JSON must be a non-empty string'
    }
  }

  try {
    const trimmed = jsonString.trim()

    if (!trimmed) {
      return {
        success: false,
        error: 'Invalid input: JSON string is empty'
      }
    }

    // Parse the JSON to validate it
    const parsed = JSON.parse(trimmed)

    // Format with 2-space indentation
    const formatted = JSON.stringify(parsed, null, 2)

    return {
      success: true,
      formatted,
      type: getJSONType(parsed)
    }
  } catch (err) {
    return {
      success: false,
      error: parseJSONError(err, jsonString)
    }
  }
}

/**
 * Validates JSON without formatting
 * @param {string} jsonString - The JSON string to validate
 * @returns {object} Validation result
 */
export function validateJSON(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') {
    return {
      valid: false,
      error: 'Invalid input: JSON must be a non-empty string'
    }
  }

  try {
    const trimmed = jsonString.trim()

    if (!trimmed) {
      return {
        valid: false,
        error: 'JSON string is empty'
      }
    }

    JSON.parse(trimmed)
    return {
      valid: true,
      type: getJSONType(JSON.parse(trimmed))
    }
  } catch (err) {
    return {
      valid: false,
      error: parseJSONError(err, jsonString)
    }
  }
}

/**
 * Determines the type of the JSON value
 * @param {any} obj - The parsed JSON object
 * @returns {string} Type name
 */
function getJSONType(obj) {
  if (obj === null) return 'null'
  if (Array.isArray(obj)) return 'array'
  if (typeof obj === 'object') return 'object'
  if (typeof obj === 'boolean') return 'boolean'
  if (typeof obj === 'number') return 'number'
  if (typeof obj === 'string') return 'string'
  return 'unknown'
}

/**
 * Parses JSON error to provide helpful message
 * @param {Error} err - The JSON parse error
 * @param {string} jsonString - The original JSON string
 * @returns {string} Human-readable error message
 */
function parseJSONError(err, jsonString) {
  const errorMsg = err.message

  // Try to extract position from error message
  const match = errorMsg.match(/position (\d+)/)
  if (match) {
    const pos = parseInt(match[1], 10)
    const line = jsonString.substring(0, pos).split('\n').length
    const col = pos - jsonString.substring(0, pos).lastIndexOf('\n')
    return `Invalid JSON at line ${line}, column ${col}: ${errorMsg}`
  }

  // Handle specific error patterns
  if (errorMsg.includes('Unexpected token')) {
    return `Syntax error: ${errorMsg}. Check for unclosed brackets, quotes, or commas.`
  }

  if (errorMsg.includes('JSON.parse')) {
    return `Invalid JSON format: ${errorMsg}`
  }

  return `Parsing error: ${errorMsg}`
}

/**
 * Minifies JSON by removing whitespace
 * @param {string} jsonString - The JSON string to minify
 * @returns {object} Object with minified JSON or error
 */
export function minifyJSON(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: JSON must be a non-empty string'
    }
  }

  try {
    const trimmed = jsonString.trim()

    if (!trimmed) {
      return {
        success: false,
        error: 'JSON string is empty'
      }
    }

    const parsed = JSON.parse(trimmed)
    const minified = JSON.stringify(parsed)

    return {
      success: true,
      minified
    }
  } catch (err) {
    return {
      success: false,
      error: parseJSONError(err, jsonString)
    }
  }
}

/**
 * Gets JSON statistics
 * @param {string} jsonString - The JSON string to analyze
 * @returns {object} Statistics about the JSON
 */
export function getJSONStats(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') {
    return null
  }

  try {
    const parsed = JSON.parse(jsonString.trim())
    const formatted = JSON.stringify(parsed, null, 2)

    return {
      originalSize: jsonString.length,
      formattedSize: formatted.length,
      type: getJSONType(parsed),
      keyCount: getKeyCount(parsed),
      depth: getMaxDepth(parsed)
    }
  } catch {
    return null
  }
}

/**
 * Counts keys in a JSON object recursively
 * @param {any} obj - The parsed JSON object
 * @returns {number} Total key count
 */
function getKeyCount(obj) {
  if (obj === null || typeof obj !== 'object') return 0

  let count = 0
  if (Array.isArray(obj)) {
    obj.forEach(item => {
      count += getKeyCount(item)
    })
  } else {
    Object.keys(obj).forEach(key => {
      count += 1
      count += getKeyCount(obj[key])
    })
  }

  return count
}

/**
 * Calculates maximum nesting depth
 * @param {any} obj - The parsed JSON object
 * @returns {number} Maximum depth
 */
function getMaxDepth(obj) {
  if (obj === null || typeof obj !== 'object') return 0

  let maxDepth = 1

  if (Array.isArray(obj)) {
    for (const item of obj) {
      maxDepth = Math.max(maxDepth, 1 + getMaxDepth(item))
    }
  } else {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        maxDepth = Math.max(maxDepth, 1 + getMaxDepth(obj[key]))
      }
    }
  }

  return maxDepth
}
