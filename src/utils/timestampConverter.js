/**
 * Converts Unix timestamp to Date
 * @param {number} timestamp - Unix timestamp (seconds or milliseconds)
 * @returns {object} Date object and formatted string
 */
export function timestampToDate(timestamp) {
  if (!timestamp && timestamp !== 0) {
    return { success: false, error: 'Invalid timestamp' }
  }

  try {
    const num = parseFloat(timestamp)

    if (isNaN(num)) {
      return { success: false, error: 'Timestamp must be a number' }
    }

    // Detect if milliseconds or seconds
    // Timestamps in milliseconds are typically > 10^10
    const ts = num > 10000000000 ? num : num * 1000
    const date = new Date(ts)

    if (isNaN(date.getTime())) {
      return { success: false, error: 'Invalid timestamp value' }
    }

    return {
      success: true,
      date,
      iso: date.toISOString(),
      locale: date.toString(),
      utc: date.toUTCString(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    }
  } catch (err) {
    return { success: false, error: `Conversion error: ${err.message}` }
  }
}

/**
 * Converts Date to Unix timestamp
 * @param {string} dateStr - Date string (ISO format or readable format)
 * @param {boolean} milliseconds - Return milliseconds instead of seconds
 * @returns {object} Timestamp and metadata
 */
export function dateToTimestamp(dateStr, milliseconds = false) {
  if (!dateStr || typeof dateStr !== 'string') {
    return { success: false, error: 'Invalid date string' }
  }

  try {
    const date = new Date(dateStr.trim())

    if (isNaN(date.getTime())) {
      return { success: false, error: 'Invalid date format. Try: 2024-01-15 or 2024-01-15 10:30:00' }
    }

    const timeMs = date.getTime()
    const timeS = Math.floor(timeMs / 1000)

    return {
      success: true,
      timestamp: milliseconds ? timeMs : timeS,
      timestampMs: timeMs,
      timestampS: timeS,
      iso: date.toISOString(),
      locale: date.toString()
    }
  } catch (err) {
    return { success: false, error: `Conversion error: ${err.message}` }
  }
}

/**
 * Gets current Unix timestamp
 * @param {boolean} milliseconds - Return milliseconds instead of seconds
 * @returns {object} Current timestamp
 */
export function getCurrentTimestamp(milliseconds = false) {
  const now = Date.now()
  return {
    timestamp: milliseconds ? now : Math.floor(now / 1000),
    timestampMs: now,
    timestampS: Math.floor(now / 1000),
    iso: new Date(now).toISOString(),
    readable: new Date(now).toString()
  }
}

/**
 * Calculates difference between two dates
 * @param {string|number} date1 - First date (string or timestamp)
 * @param {string|number} date2 - Second date (string or timestamp)
 * @returns {object} Time difference
 */
export function dateDifference(date1, date2) {
  try {
    let d1, d2

    // Parse first date
    if (typeof date1 === 'number') {
      d1 = new Date(date1 > 10000000000 ? date1 : date1 * 1000)
    } else {
      d1 = new Date(date1)
    }

    // Parse second date
    if (typeof date2 === 'number') {
      d2 = new Date(date2 > 10000000000 ? date2 : date2 * 1000)
    } else {
      d2 = new Date(date2)
    }

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return { success: false, error: 'Invalid date format' }
    }

    const diffMs = Math.abs(d2.getTime() - d1.getTime())
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    return {
      success: true,
      milliseconds: diffMs,
      seconds: diffSeconds,
      minutes: diffMinutes,
      hours: diffHours,
      days: diffDays,
      formatted: `${diffDays} days, ${diffHours % 24} hours, ${diffMinutes % 60} minutes, ${diffSeconds % 60} seconds`
    }
  } catch (err) {
    return { success: false, error: `Calculation error: ${err.message}` }
  }
}

/**
 * Formats a timestamp with custom format
 * @param {number} timestamp - Unix timestamp
 * @param {string} format - Format string (YYYY-MM-DD HH:mm:ss)
 * @returns {string} Formatted date string
 */
export function formatTimestamp(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  try {
    const ts = timestamp > 10000000000 ? timestamp : timestamp * 1000
    const date = new Date(ts)

    if (isNaN(date.getTime())) {
      return 'Invalid timestamp'
    }

    let result = format
    const pad = (n) => String(n).padStart(2, '0')

    result = result.replace('YYYY', date.getFullYear())
    result = result.replace('MM', pad(date.getMonth() + 1))
    result = result.replace('DD', pad(date.getDate()))
    result = result.replace('HH', pad(date.getHours()))
    result = result.replace('mm', pad(date.getMinutes()))
    result = result.replace('ss', pad(date.getSeconds()))

    return result
  } catch {
    return 'Error formatting'
  }
}
