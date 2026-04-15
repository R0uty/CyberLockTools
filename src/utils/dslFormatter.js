/**
 * Converts an array of parsed DSL objects into a formatted DSL string.
 * @param {object[]} parsedData - Array of structured DSL action objects
 * @returns {string} The formatted DSL output string
 */
export function toDSL(parsedData) {
  return parsedData
    .map(entry => formatEntry(entry))
    .join('\n\n')
}

/**
 * Formats a single parsed DSL entry into a DSL block string.
 * @param {object} entry - A structured DSL action object
 * @returns {string} The formatted DSL block
 */
function formatEntry(entry) {
  const { type, ...fields } = entry
  const lines = Object.entries(fields).map(
    ([key, value]) => `  ${key}: ${typeof value === 'string' ? `"${value}"` : value}`
  )
  return lines.length > 0
    ? `${type} {\n${lines.join('\n')}\n}`
    : `${type} {}`
}
