function getSessionStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function hasSessionValue(key) {
  const storage = getSessionStorage()

  if (!storage) {
    return false
  }

  try {
    return storage.getItem(key) !== null
  } catch {
    return false
  }
}

export function readSessionValue(key, fallback = '') {
  const storage = getSessionStorage()

  if (!storage) {
    return fallback
  }

  try {
    const value = storage.getItem(key)
    return typeof value === 'string' ? value : fallback
  } catch {
    return fallback
  }
}

export function readSessionNumber(key, fallback = 0, options = {}) {
  const value = Number(readSessionValue(key, fallback))

  if (!Number.isFinite(value)) {
    return fallback
  }

  const min = options.min ?? Number.NEGATIVE_INFINITY
  const max = options.max ?? Number.POSITIVE_INFINITY
  return Math.min(Math.max(value, min), max)
}

export function writeSessionValue(key, value) {
  const storage = getSessionStorage()

  if (!storage) {
    return
  }

  try {
    storage.setItem(key, String(value ?? ''))
  } catch {
    // Ignore storage write failures so the UI keeps working.
  }
}
