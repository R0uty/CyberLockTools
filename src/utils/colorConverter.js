/**
 * Color Converter Utilities
 * Convert between HEX, RGB, HSL, HSV color formats
 */

/**
 * Converts HEX to RGB
 * @param {string} hex - Hex color code (#RRGGBB or RRGGBB)
 * @returns {object} RGB object {r, g, b}
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

/**
 * Converts RGB to HEX
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color code
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('').toUpperCase()
}

/**
 * Converts RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {object} HSL object {h, s, l}
 */
export function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Converts HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {object} RGB object {r, g, b}
 */
export function hslToRgb(h, s, l) {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

/**
 * Converts RGB to HSV
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {object} HSV object {h, s, v}
 */
export function rgbToHsv(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  }
}

/**
 * Converts HSV to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} v - Value (0-100)
 * @returns {object} RGB object {r, g, b}
 */
export function hsvToRgb(h, s, v) {
  h /= 60
  s /= 100
  v /= 100

  const c = v * s
  const x = c * (1 - Math.abs((h % 2) - 1))
  const m = v - c

  let r = 0, g = 0, b = 0

  if (h >= 0 && h < 1) {
    r = c
    g = x
    b = 0
  } else if (h >= 1 && h < 2) {
    r = x
    g = c
    b = 0
  } else if (h >= 2 && h < 3) {
    r = 0
    g = c
    b = x
  } else if (h >= 3 && h < 4) {
    r = 0
    g = x
    b = c
  } else if (h >= 4 && h < 5) {
    r = x
    g = 0
    b = c
  } else if (h >= 5 && h < 6) {
    r = c
    g = 0
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  }
}

/**
 * Parses RGB string format
 * @param {string} str - RGB string (e.g., "rgb(255, 0, 0)" or "255, 0, 0")
 * @returns {object} RGB object {r, g, b} or null
 */
export function parseRgb(str) {
  const match = str.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (match) {
    return {
      r: Math.min(255, Math.max(0, parseInt(match[1]))),
      g: Math.min(255, Math.max(0, parseInt(match[2]))),
      b: Math.min(255, Math.max(0, parseInt(match[3])))
    }
  }
  return null
}

/**
 * Parses HSL string format
 * @param {string} str - HSL string (e.g., "hsl(0, 100%, 50%)" or "0, 100, 50")
 * @returns {object} HSL object {h, s, l} or null
 */
export function parseHsl(str) {
  const match = str.match(/(\d+)[,\s%]+(\d+)[,\s%]+(\d+)/)
  if (match) {
    return {
      h: Math.min(360, Math.max(0, parseInt(match[1]))),
      s: Math.min(100, Math.max(0, parseInt(match[2]))),
      l: Math.min(100, Math.max(0, parseInt(match[3])))
    }
  }
  return null
}

/**
 * Format RGB to string
 * @param {object} rgb - RGB object {r, g, b}
 * @returns {string} RGB formatted string
 */
export function formatRgb(rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

/**
 * Format HSL to string
 * @param {object} hsl - HSL object {h, s, l}
 * @returns {string} HSL formatted string
 */
export function formatHsl(hsl) {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}

/**
 * Format HSV to string
 * @param {object} hsv - HSV object {h, s, v}
 * @returns {string} HSV formatted string
 */
export function formatHsv(hsv) {
  return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`
}

/**
 * Get color info (name, brightness, complementary, etc.)
 * @param {object} rgb - RGB object
 * @returns {object} Color info
 */
export function getColorInfo(rgb) {
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)

  // Calculate brightness (perceived)
  const brightness = Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000)

  // Calculate complementary color (opposite on color wheel)
  const complementary = rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b)

  return {
    hex,
    rgb: formatRgb(rgb),
    hsl: formatHsl(hsl),
    hsv: formatHsv(hsv),
    brightness,
    isDark: brightness < 128,
    complementary,
    luminance: brightness
  }
}
