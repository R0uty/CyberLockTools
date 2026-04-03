/**
 * Formats XML with proper indentation
 * @param {string} xmlString - The XML string to format
 * @returns {object} Object with formatted XML or error
 */
export function formatXML(xmlString) {
  if (!xmlString || typeof xmlString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: XML must be a non-empty string'
    }
  }

  try {
    const trimmed = xmlString.trim()

    if (!trimmed) {
      return {
        success: false,
        error: 'Invalid input: XML string is empty'
      }
    }

    // Basic XML validation by parsing with DOMParser
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(trimmed, 'application/xml')

    // Check for XML parsing errors
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      const errorMsg = xmlDoc.getElementsByTagName('parsererror')[0].textContent
      return {
        success: false,
        error: `XML parsing error: ${errorMsg}`
      }
    }

    // Format the XML by serializing and re-parsing
    const formatted = formatXMLNode(xmlDoc.documentElement, 0)

    return {
      success: true,
      formatted: formatted.trim()
    }
  } catch (err) {
    return {
      success: false,
      error: `XML processing error: ${err.message}`
    }
  }
}

/**
 * Recursively format an XML node with indentation
 * @param {Node} node - The XML node to format
 * @param {number} depth - Current indentation depth
 * @returns {string} Formatted XML string
 */
function formatXMLNode(node, depth = 0) {
  const indent = '  '.repeat(depth)
  let result = ''

  if (node.nodeType === 1) {
    // Element node
    result += indent + '<' + node.tagName

    // Add attributes
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i]
      result += ` ${attr.name}="${escapeXML(attr.value)}"`
    }

    // Check if element has children
    const hasElementChildren = Array.from(node.childNodes).some(child => child.nodeType === 1)
    const hasTextContent = Array.from(node.childNodes).some(
      child => child.nodeType === 3 && child.textContent.trim()
    )

    if (hasElementChildren) {
      result += '>\n'
      for (const child of node.childNodes) {
        if (child.nodeType === 1) {
          result += formatXMLNode(child, depth + 1)
        } else if (child.nodeType === 3) {
          const text = child.textContent.trim()
          if (text) {
            result += '  '.repeat(depth + 1) + escapeXML(text) + '\n'
          }
        }
      }
      result += indent + '</' + node.tagName + '>\n'
    } else if (hasTextContent) {
      const textContent = node.textContent.trim()
      result += '>' + escapeXML(textContent) + '</' + node.tagName + '>\n'
    } else {
      result += ' />\n'
    }
  }

  return result
}

/**
 * Escapes special XML characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXML(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Gets XML statistics
 * @param {string} xmlString - The XML string to analyze
 * @returns {object|null} Statistics about the XML
 */
export function getXMLStats(xmlString) {
  if (!xmlString || typeof xmlString !== 'string') {
    return null
  }

  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString.trim(), 'application/xml')

    // Check for parsing errors
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      return null
    }

    const formatted = formatXML(xmlString)
    if (!formatted.success) {
      return null
    }

    return {
      originalSize: xmlString.length,
      formattedSize: formatted.formatted.length,
      rootElement: xmlDoc.documentElement.tagName,
      elementCount: xmlDoc.getElementsByTagName('*').length,
      attributeCount: countAttributes(xmlDoc.documentElement),
      depth: getMaxDepth(xmlDoc.documentElement)
    }
  } catch {
    return null
  }
}

/**
 * Counts all attributes in an XML document
 * @param {Element} element - Root element
 * @returns {number} Total attribute count
 */
function countAttributes(element) {
  let count = element.attributes.length

  for (const child of element.children) {
    count += countAttributes(child)
  }

  return count
}

/**
 * Calculates maximum nesting depth
 * @param {Element} element - The element to analyze
 * @returns {number} Maximum depth
 */
function getMaxDepth(element) {
  let maxDepth = 1

  for (const child of element.children) {
    maxDepth = Math.max(maxDepth, 1 + getMaxDepth(child))
  }

  return maxDepth
}

/**
 * Minifies XML by removing whitespace
 * @param {string} xmlString - The XML string to minify
 * @returns {object} Object with minified XML or error
 */
export function minifyXML(xmlString) {
  if (!xmlString || typeof xmlString !== 'string') {
    return {
      success: false,
      error: 'Invalid input: XML must be a non-empty string'
    }
  }

  try {
    const trimmed = xmlString.trim()

    if (!trimmed) {
      return {
        success: false,
        error: 'Invalid input: XML string is empty'
      }
    }

    // Parse to validate
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(trimmed, 'application/xml')

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      const errorMsg = xmlDoc.getElementsByTagName('parsererror')[0].textContent
      return {
        success: false,
        error: `XML parsing error: ${errorMsg}`
      }
    }

    // Minify by removing extra whitespace
    const minified = minifyXMLNode(xmlDoc.documentElement)

    return {
      success: true,
      minified
    }
  } catch (err) {
    return {
      success: false,
      error: `XML minification error: ${err.message}`
    }
  }
}

/**
 * Recursively minify an XML node
 * @param {Node} node - The XML node to minify
 * @returns {string} Minified XML string
 */
function minifyXMLNode(node) {
  let result = ''

  if (node.nodeType === 1) {
    // Element node
    result += '<' + node.tagName

    // Add attributes
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i]
      result += ` ${attr.name}="${escapeXML(attr.value)}"`
    }

    // Check if element has children
    const hasElementChildren = Array.from(node.childNodes).some(child => child.nodeType === 1)
    const hasTextContent = Array.from(node.childNodes).some(
      child => child.nodeType === 3 && child.textContent.trim()
    )

    if (hasElementChildren) {
      result += '>'
      for (const child of node.childNodes) {
        if (child.nodeType === 1) {
          result += minifyXMLNode(child)
        } else if (child.nodeType === 3) {
          const text = child.textContent.trim()
          if (text) {
            result += escapeXML(text)
          }
        }
      }
      result += '</' + node.tagName + '>'
    } else if (hasTextContent) {
      const textContent = node.textContent.trim()
      result += '>' + escapeXML(textContent) + '</' + node.tagName + '>'
    } else {
      result += ' />'
    }
  }

  return result
}
