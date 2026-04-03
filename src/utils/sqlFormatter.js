/**
 * Formats SQL with proper indentation
 * @param {string} sqlString - The SQL string to format
 * @returns {object} Object with formatted SQL or error
 */
export function formatSQL(sqlString) {
  if (!sqlString || typeof sqlString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: SQL must be a non-empty string'
    }
  }

  try {
    const trimmed = sqlString.trim()

    if (!trimmed) {
      return {
        success: false,
        error: 'Invalid input: SQL string is empty'
      }
    }

    // Basic SQL validation
    const upperSQL = trimmed.toUpperCase()
    const keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'WITH', 'UNION']
    const isValidSQL = keywords.some(kw => upperSQL.includes(kw))

    if (!isValidSQL) {
      return {
        success: false,
        error: 'Invalid SQL: must contain a valid SQL keyword (SELECT, INSERT, UPDATE, DELETE, CREATE, etc.)'
      }
    }

    const formatted = formatSQLString(trimmed)

    return {
      success: true,
      formatted
    }
  } catch (err) {
    return {
      success: false,
      error: `SQL formatting error: ${err.message}`
    }
  }
}

/**
 * Formats SQL string with indentation
 * @param {string} sql - The SQL string
 * @returns {string} Formatted SQL
 */
function formatSQLString(sql) {
  let formatted = sql
  let indentLevel = 0
  const indent = '  '

  // Add newlines before major keywords
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
    'ON', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE TABLE', 'ALTER TABLE',
    'DROP TABLE', 'ADD COLUMN', 'MODIFY COLUMN', 'WITH', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
  ]

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    formatted = formatted.replace(regex, `\n${keyword}`)
  })

  // Clean up multiple spaces
  formatted = formatted.replace(/\s+/g, ' ')

  // Split by newlines and indent
  const lines = formatted.split('\n').filter(line => line.trim())
  
  const indentedLines = lines.map(line => {
    const trimmedLine = line.trim()
    
    // Increase indent for UNION, CASE
    if (/(UNION|CASE)/i.test(trimmedLine)) {
      indentLevel++
    }
    
    // Reset indent for major keywords at start
    if (/(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|LIMIT)/i.test(trimmedLine)) {
      if (indentLevel > 0) {
        indentLevel = 0
      }
    }
    
    // Decrease indent for ELSE, END
    if (/(ELSE|END)/i.test(trimmedLine) && indentLevel > 0) {
      indentLevel--
    }
    
    // Indent sub-keywords
    if (/(AND|OR|JOIN|ON|GROUP BY|ORDER BY|HAVING|OFFSET|VALUES|SET)/i.test(trimmedLine)) {
      return indent + trimmedLine
    }
    
    return trimmedLine
  })

  return indentedLines.join('\n')
}

/**
 * Gets SQL statistics
 * @param {string} sqlString - The SQL string to analyze
 * @returns {object|null} Statistics about the SQL
 */
export function getSQLStats(sqlString) {
  if (!sqlString || typeof sqlString !== 'string') {
    return null
  }

  try {
    const upperSQL = sqlString.toUpperCase()
    
    // Detect query type
    let queryType = 'Unknown'
    if (upperSQL.includes('SELECT')) queryType = 'SELECT'
    else if (upperSQL.includes('INSERT')) queryType = 'INSERT'
    else if (upperSQL.includes('UPDATE')) queryType = 'UPDATE'
    else if (upperSQL.includes('DELETE')) queryType = 'DELETE'
    else if (upperSQL.includes('CREATE')) queryType = 'CREATE'
    else if (upperSQL.includes('ALTER')) queryType = 'ALTER'
    else if (upperSQL.includes('DROP')) queryType = 'DROP'
    else if (upperSQL.includes('WITH')) queryType = 'CTE (Common Table Expression)'

    // Extract table names
    const tableMatches = sqlString.match(/\b(?:FROM|INTO|UPDATE|TABLE)\s+(\w+)/gi)
    const tableCount = tableMatches ? new Set(tableMatches.map(m => m.split(/\s+/)[1].toLowerCase())).size : 0

    // Count columns (rough estimate)
    const selectMatch = sqlString.match(/SELECT\s+(.*?)\s+FROM/i)
    const columnCount = selectMatch ? (selectMatch[1].match(/,/g) || []).length + 1 : 0

    // Count joins
    const joinCount = (sqlString.match(/JOIN/gi) || []).length

    // Count conditions
    const whereCount = (sqlString.match(/\bWHERE\b/gi) || []).length
    const andCount = (sqlString.match(/\bAND\b/gi) || []).length
    const orCount = (sqlString.match(/\bOR\b/gi) || []).length

    return {
      queryType,
      originalSize: sqlString.length,
      tableCount,
      columnCount: columnCount > 0 ? columnCount : 0,
      joinCount,
      conditionCount: andCount + orCount,
      whereClause: whereCount > 0
    }
  } catch {
    return null
  }
}

/**
 * Minifies SQL by removing unnecessary whitespace
 * @param {string} sqlString - The SQL string to minify
 * @returns {object} Object with minified SQL or error
 */
export function minifySQL(sqlString) {
  if (!sqlString || typeof sqlString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: SQL must be a non-empty string'
    }
  }

  try {
    const trimmed = sqlString.trim()

    if (!trimmed) {
      return {
        success: false,
        error: 'Invalid input: SQL string is empty'
      }
    }

    // Remove comments
    let minified = trimmed
      .replace(/--[^\n]*/g, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments

    // Remove extra whitespace
    minified = minified.replace(/\s+/g, ' ').trim()

    // Remove spaces around operators (carefully)
    minified = minified
      .replace(/\s*([(),=<>+\-*/])\s*/g, '$1')
      .replace(/\)\s+ON\s+/g, ') ON ')
      .replace(/\)\s+WHERE\s+/g, ') WHERE ')
      .replace(/\)\s+AND\s+/g, ') AND ')

    return {
      success: true,
      minified
    }
  } catch (err) {
    return {
      success: false,
      error: `SQL minification error: ${err.message}`
    }
  }
}

/**
 * Validates SQL syntax
 * @param {string} sqlString - The SQL string to validate
 * @returns {object} Validation result
 */
export function validateSQL(sqlString) {
  if (!sqlString || typeof sqlString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: SQL must be a non-empty string'
    }
  }

  try {
    const upperSQL = sqlString.toUpperCase().trim()

    // Check for basic syntax issues
    if (!upperSQL) {
      return { success: false, error: 'SQL string is empty' }
    }

    // Check for matching parentheses
    let parenCount = 0
    for (const char of sqlString) {
      if (char === '(') parenCount++
      if (char === ')') parenCount--
      if (parenCount < 0) {
        return { success: false, error: 'Mismatched parentheses: closing ) without opening (' }
      }
    }
    if (parenCount !== 0) {
      return { success: false, error: `Mismatched parentheses: ${parenCount} opening parentheses without closing` }
    }

    // Check for quotes
    const singleQuotes = (sqlString.match(/'/g) || []).length
    const doubleQuotes = (sqlString.match(/"/g) || []).length
    
    if (singleQuotes % 2 !== 0) {
      return { success: false, error: 'Mismatched single quotes (\'): odd number found' }
    }
    if (doubleQuotes % 2 !== 0) {
      return { success: false, error: 'Mismatched double quotes ("): odd number found' }
    }

    // Check for SQL keywords
    const keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'WITH', 'UNION']
    const hasKeyword = keywords.some(kw => upperSQL.includes(kw))

    if (!hasKeyword) {
      return { success: false, error: 'No valid SQL keywords found' }
    }

    return { success: true, message: '✅ Valid SQL syntax' }
  } catch (err) {
    return {
      success: false,
      error: `SQL validation error: ${err.message}`
    }
  }
}
