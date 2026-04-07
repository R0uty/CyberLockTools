/**
 * Parses CSV string into array of objects
 * @param {string} csvString - The CSV string to parse
 * @returns {object} Object with parsed data or error
 */
export function parseCSV(csvString) {
  if (!csvString || typeof csvString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: CSV must be a non-empty string'
    }
  }

  try {
    const trimmed = csvString.trim()

    if (!trimmed) {
      return {
        success: false,
        error: 'Invalid input: CSV string is empty'
      }
    }

    const lines = trimmed.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) {
      return {
        success: false,
        error: 'CSV has no data rows'
      }
    }

    // Parse header
    const headers = parseCSVLine(lines[0])
    
    if (headers.length === 0) {
      return {
        success: false,
        error: 'CSV header is empty'
      }
    }

    // Parse data rows
    const data = []
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const row = {}
      
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = values[j] || ''
      }
      
      data.push(row)
    }

    return {
      success: true,
      headers,
      data,
      rows: data.length,
      columns: headers.length
    }
  } catch (err) {
    return {
      success: false,
      error: `CSV parsing error: ${err.message}`
    }
  }
}

/**
 * Parses a single CSV line, handling quoted fields
 * @param {string} line - The CSV line to parse
 * @returns {string[]} Array of values
 */
function parseCSVLine(line) {
  const result = []
  let current = ''
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Add last field
  result.push(current.trim())

  return result
}

/**
 * Formats CSV with proper spacing and consistency
 * @param {string} csvString - The CSV string to format
 * @returns {object} Object with formatted CSV or error
 */
export function formatCSV(csvString) {
  if (!csvString || typeof csvString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: CSV must be a non-empty string'
    }
  }

  try {
    const parsed = parseCSV(csvString)

    if (!parsed.success) {
      return parsed
    }

    const { headers, data } = parsed

    // Calculate column widths
    const widths = {}
    headers.forEach(header => {
      widths[header] = header.length
    })

    data.forEach(row => {
      headers.forEach(header => {
        const value = row[header] || ''
        widths[header] = Math.max(widths[header], value.toString().length)
      })
    })

    // Format header
    let formatted = headers.map(h => {
      const value = h.toString()
      return `"${value}"`
    }).join(',')

    formatted += '\n'

    // Format data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || ''
        const strValue = value.toString()
        // Quote if contains comma or quote
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`
        }
        return strValue
      })
      formatted += values.join(',') + '\n'
    })

    return {
      success: true,
      formatted: formatted.trim()
    }
  } catch (err) {
    return {
      success: false,
      error: `CSV formatting error: ${err.message}`
    }
  }
}

/**
 * Converts CSV to JSON
 * @param {string} csvString - The CSV string to convert
 * @returns {object} Object with JSON or error
 */
export function csvToJSON(csvString) {
  if (!csvString || typeof csvString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: CSV must be a non-empty string'
    }
  }

  try {
    const parsed = parseCSV(csvString)

    if (!parsed.success) {
      return parsed
    }

    const json = JSON.stringify(parsed.data, null, 2)

    return {
      success: true,
      json
    }
  } catch (err) {
    return {
      success: false,
      error: `CSV to JSON conversion error: ${err.message}`
    }
  }
}

/**
 * Converts JSON array to CSV
 * @param {string} jsonString - The JSON string to convert
 * @returns {object} Object with CSV or error
 */
export function jsonToCSV(jsonString) {
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

    const data = JSON.parse(trimmed)

    if (!Array.isArray(data)) {
      return {
        success: false,
        error: 'JSON must be an array of objects'
      }
    }

    if (data.length === 0) {
      return {
        success: false,
        error: 'JSON array is empty'
      }
    }

    // Get headers from first object
    const headers = Object.keys(data[0])

    // Build CSV
    let csv = headers.map(h => `"${h}"`).join(',') + '\n'

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] ?? ''
        const strValue = value.toString()
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`
        }
        return strValue
      })
      csv += values.join(',') + '\n'
    })

    return {
      success: true,
      csv: csv.trim()
    }
  } catch (err) {
    return {
      success: false,
      error: `JSON to CSV conversion error: ${err.message}`
    }
  }
}

/**
 * Gets CSV statistics
 * @param {string} csvString - The CSV string to analyze
 * @returns {object|null} Statistics about the CSV
 */
export function getCSVStats(csvString) {
  if (!csvString || typeof csvString !== 'string') {
    return null
  }

  try {
    const parsed = parseCSV(csvString)

    if (!parsed.success) {
      return null
    }

    const { headers, data } = parsed
    const stats = {
      rows: data.length,
      columns: headers.length,
      headers: headers.join(', '),
      originalSize: csvString.length,
      dataTypes: {}
    }

    // Analyze data types per column
    headers.forEach(header => {
      const values = data.map(row => row[header] || '')
      const types = new Set()

      values.forEach(value => {
        if (value === '') {
          types.add('empty')
        } else if (/^\d+$/.test(value)) {
          types.add('integer')
        } else if (/^\d+\.\d+$/.test(value)) {
          types.add('decimal')
        } else if (/^(true|false)$/i.test(value)) {
          types.add('boolean')
        } else if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
          types.add('date')
        } else {
          types.add('string')
        }
      })

      stats.dataTypes[header] = Array.from(types).join(', ')
    })

    return stats
  } catch {
    return null
  }
}

/**
 * Validates CSV structure
 * @param {string} csvString - The CSV string to validate
 * @returns {object} Validation result
 */
export function validateCSV(csvString) {
  if (!csvString || typeof csvString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: CSV must be a non-empty string'
    }
  }

  try {
    const trimmed = csvString.trim()

    if (!trimmed) {
      return { success: false, error: 'CSV is empty' }
    }

    const lines = trimmed.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return { success: false, error: 'CSV must have at least a header and one data row' }
    }

    const parsed = parseCSV(csvString)

    if (!parsed.success) {
      return parsed
    }

    // Check for consistent column count
    const headerCount = parsed.columns
    const { data } = parsed

    let inconsistentRows = 0
    data.forEach((row) => {
      const valueCount = Object.values(row).filter(v => v !== '').length
      if (valueCount > 0 && valueCount !== headerCount) {
        inconsistentRows++
      }
    })

    if (inconsistentRows > 0) {
      return { 
        success: false, 
        error: `Found ${inconsistentRows} rows with inconsistent column counts` 
      }
    }

    return { 
      success: true, 
      message: `✅ Valid CSV - ${parsed.rows} rows, ${parsed.columns} columns` 
    }
  } catch (err) {
    return {
      success: false,
      error: `CSV validation error: ${err.message}`
    }
  }
}
