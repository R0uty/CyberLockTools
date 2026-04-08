/**
 * CSS Formatter & Minifier Utilities
 * Format CSS with proper indentation and minify CSS
 */

/**
 * Formats CSS with proper indentation
 * @param {string} css - CSS code to format
 * @returns {object} Result with formatted CSS and stats
 */
export function formatCSS(css) {
  if (!css.trim()) {
    return { success: false, error: 'CSS is empty', formatted: '' }
  }

  try {
    let formatted = css
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      // Add newline before opening brace
      .replace(/\s*\{/g, ' {\n')
      // Add newline after opening brace
      .replace(/\{([^\n])/g, '{\n$1')
      // Add newline before closing brace
      .replace(/\s*\}/g, '\n}')
      // Add newline after closing brace
      .replace(/\}([^\n])/g, '}\n$1')
      // Add newline after semicolon (but not inside strings)
      .replace(/;(?!["'])/g, ';\n')
      // Remove extra blank lines
      .replace(/\n\n+/g, '\n')

    // Now indent properly
    const lines = formatted.split('\n')
    let indentLevel = 0
    const indented = lines
      .map((line) => {
        const trimmed = line.trim()
        if (!trimmed) return ''

        // Decrease indent for closing brace
        if (trimmed.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - 1)
        }

        const indent = '  '.repeat(indentLevel)
        const result = indent + trimmed

        // Increase indent for opening brace
        if (trimmed.endsWith('{')) {
          indentLevel++
        }

        return result
      })
      .filter((line) => line.trim() !== '')
      .join('\n')

    return {
      success: true,
      formatted: indented + '\n',
      lineCount: indented.split('\n').length,
      rules: (indented.match(/\{/g) || []).length
    }
  } catch (err) {
    return { success: false, error: `Formatting error: ${err.message}`, formatted: '' }
  }
}

/**
 * Minifies CSS (removes whitespace and comments)
 * @param {string} css - CSS code to minify
 * @returns {object} Result with minified CSS and stats
 */
export function minifyCSS(css) {
  if (!css.trim()) {
    return { success: false, error: 'CSS is empty', minified: '' }
  }

  try {
    let minified = css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove leading/trailing whitespace
      .trim()
      // Collapse multiple spaces
      .replace(/\s+/g, ' ')
      // Remove space before {
      .replace(/\s*\{\s*/g, '{')
      // Remove space before }
      .replace(/\s*\}\s*/g, '}')
      // Remove space before ;
      .replace(/\s*;\s*/g, ';')
      // Remove space before ,
      .replace(/\s*,\s*/g, ',')
      // Remove space before :
      .replace(/\s*:\s*/g, ':')
      // Remove space before (
      .replace(/\s*\(\s*/g, '(')
      // Remove space before )
      .replace(/\s*\)\s*/g, ')')
      // Remove trailing semicolon before }
      .replace(/;(?=})/g, '')
      // Clean up multiple semicolons
      .replace(/;;+/g, ';')

    return {
      success: true,
      minified,
      rules: (minified.match(/\{/g) || []).length
    }
  } catch (err) {
    return { success: false, error: `Minification error: ${err.message}`, minified: '' }
  }
}

/**
 * Validates CSS syntax (basic validation)
 * @param {string} css - CSS code to validate
 * @returns {object} Validation result
 */
export function validateCSS(css) {
  if (!css.trim()) {
    return { valid: false, errors: ['CSS is empty'] }
  }

  const errors = []

  // Check matching braces
  const openBraces = (css.match(/\{/g) || []).length
  const closeBraces = (css.match(/\}/g) || []).length
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces: ${openBraces} opening, ${closeBraces} closing`)
  }

  // Check for unclosed comments
  const commentOpen = (css.match(/\/\*/g) || []).length
  const commentClose = (css.match(/\*\//g) || []).length
  if (commentOpen !== commentClose) {
    errors.push(`Unclosed comments: ${commentOpen} opening, ${commentClose} closing`)
  }

  // Check for basic property syntax errors
  const lines = css.split('\n')
  let inSelector = false
  let ruleCount = 0

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (trimmed.includes('{')) inSelector = true
    if (trimmed.includes('}')) {
      inSelector = false
      ruleCount++
    }

    // Check for properties without values
    if (inSelector && trimmed.includes(':') && !trimmed.includes('{')) {
      const colonParts = trimmed.split(':')
      if (colonParts.length >= 2) {
        const value = colonParts[1].trim()
        if (!value || value === ';') {
          errors.push(`Line ${idx + 1}: Property has no value`)
        }
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    rules: ruleCount,
    warnings: ruleCount === 0 ? ['No CSS rules found'] : []
  }
}

/**
 * Get CSS statistics
 * @param {string} css - CSS code
 * @returns {object} CSS statistics
 */
export function getCSSStats(css) {
  const selectors = (css.match(/[^{]*\{/g) || []).length
  const properties = (css.match(/[^:]*:[^;]*;/g) || []).length
  const rules = (css.match(/\{[\s\S]*?\}/g) || []).length
  const colors = (css.match(/#[0-9A-Fa-f]{3,6}|rgba?\([^)]*\)|hsla?\([^)]*\)/g) || []).length
  const imports = (css.match(/@import/g) || []).length
  const mediaQueries = (css.match(/@media/g) || []).length
  const keyframes = (css.match(/@keyframes/g) || []).length
  const fonts = (css.match(/@font-face/g) || []).length

  return {
    characters: css.length,
    lines: css.split('\n').length,
    selectors,
    properties,
    rules,
    colors,
    imports,
    mediaQueries,
    keyframes,
    fonts,
    complexity: selectors > 100 ? 'High' : selectors > 50 ? 'Medium' : 'Low'
  }
}

/**
 * Compress ratio calculation
 * @param {string} original - Original CSS
 * @param {string} minified - Minified CSS
 * @returns {object} Compression stats
 */
export function getCompressionRatio(original, minified) {
  const originalSize = original.length
  const minifiedSize = minified.length
  const ratio = ((1 - minifiedSize / originalSize) * 100).toFixed(2)

  return {
    originalSize,
    minifiedSize,
    reduction: originalSize - minifiedSize,
    ratio: parseFloat(ratio),
    originalSizeKB: (originalSize / 1024).toFixed(2),
    minifiedSizeKB: (minifiedSize / 1024).toFixed(2)
  }
}
