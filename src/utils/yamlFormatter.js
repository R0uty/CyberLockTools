import YAML from 'js-yaml'

/**
 * Formats YAML with 2-space indentation
 * @param {string} yamlString - The YAML string to format
 * @returns {object} Object with formatted YAML or error
 */
export function formatYAML(yamlString) {
  if (!yamlString || typeof yamlString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: YAML must be a non-empty string'
    }
  }

  try {
    const trimmed = yamlString.trim()

    if (!trimmed) {
      return {
        success: false,
        error: 'Invalid input: YAML string is empty'
      }
    }

    // Parse the YAML to validate it
    const parsed = YAML.load(trimmed)

    // Format with 2-space indentation
    const formatted = YAML.dump(parsed, {
      indent: 2,
      lineWidth: -1,
      noRefs: false,
      flowLevel: -1
    })

    return {
      success: true,
      formatted: formatted.trimEnd(),
      type: getYAMLType(parsed)
    }
  } catch (err) {
    return {
      success: false,
      error: `YAML parsing error: ${err.message}`
    }
  }
}

/**
 * Determines the type of the YAML value
 * @param {any} obj - The parsed YAML object
 * @returns {string} Type name
 */
function getYAMLType(obj) {
  if (obj === null) return 'null'
  if (Array.isArray(obj)) return 'array'
  if (typeof obj === 'object') return 'object'
  if (typeof obj === 'boolean') return 'boolean'
  if (typeof obj === 'number') return 'number'
  if (typeof obj === 'string') return 'string'
  if (obj instanceof Date) return 'date'
  return 'unknown'
}

/**
 * Converts YAML to JSON string
 * @param {string} yamlString - The YAML string to convert
 * @returns {object} Object with JSON string or error
 */
export function yamlToJSON(yamlString) {
  if (!yamlString || typeof yamlString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: YAML must be a non-empty string'
    }
  }

  try {
    const trimmed = yamlString.trim()

    if (!trimmed) {
      return {
        success: false,
        error: 'YAML string is empty'
      }
    }

    const parsed = YAML.load(trimmed)
    const json = JSON.stringify(parsed, null, 2)

    return {
      success: true,
      json
    }
  } catch (err) {
    return {
      success: false,
      error: `Conversion error: ${err.message}`
    }
  }
}

/**
 * Gets YAML statistics
 * @param {string} yamlString - The YAML string to analyze
 * @returns {object} Statistics about the YAML
 */
export function getYAMLStats(yamlString) {
  if (!yamlString || typeof yamlString !== 'string') {
    return null
  }

  try {
    const parsed = YAML.load(yamlString.trim())
    const formatted = YAML.dump(parsed, { indent: 2 })

    return {
      originalSize: yamlString.length,
      formattedSize: formatted.length,
      type: getYAMLType(parsed),
      keyCount: getKeyCount(parsed),
      depth: getMaxDepth(parsed)
    }
  } catch {
    return null
  }
}

/**
 * Counts keys in a YAML object recursively
 * @param {any} obj - The parsed YAML object
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
 * @param {any} obj - The parsed YAML object
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
