function getLocalStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readLocalValue(key, fallback = '') {
  const storage = getLocalStorage()

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

export function writeLocalValue(key, value) {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  try {
    storage.setItem(key, String(value ?? ''))
  } catch {
    // Ignore storage write failures so the UI keeps working.
  }
}
