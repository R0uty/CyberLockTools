/**
 * Generates a UUIDv4 (random)
 * @returns {string} UUIDv4 string
 */
export function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generates a UUIDv1 (timestamp-based)
 * @returns {string} UUIDv1 string
 */
export function generateUUIDv1() {
  const now = Date.now()
  const timestamp = ((now + 12219292800000) * 10000).toString(16)
  const clockSeq = Math.floor(Math.random() * 0x4000) + 0x8000
  const node = 'xxxxxxxxxxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16))

  return [
    timestamp.substring(-8),
    timestamp.substring(-12, -8),
    timestamp.substring(0, 4),
    clockSeq.toString(16),
    node
  ].join('-')
}

/**
 * Generates a UUIDv4 with braces
 * @returns {string} UUIDv4 with braces
 */
export function generateUUIDv4WithBraces() {
  return `{${generateUUIDv4()}}`
}

/**
 * Generates multiple UUIDs
 * @param {number} count - Number of UUIDs to generate
 * @param {string} version - 'v1' or 'v4'
 * @returns {string[]} Array of UUIDs
 */
export function generateMultipleUUIDs(count, version = 'v4') {
  const uuids = []
  const generator = version === 'v1' ? generateUUIDv1 : generateUUIDv4

  for (let i = 0; i < count; i++) {
    uuids.push(generator())
  }

  return uuids
}

/**
 * Validates if a string is a valid UUID
 * @param {string} uuid - UUID string to validate
 * @returns {boolean} True if valid UUID
 */
export function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Extracts UUID version from a UUID string
 * @param {string} uuid - UUID string
 * @returns {number} Version number (1, 3, 4, or 5) or 0 if invalid
 */
export function getUUIDVersion(uuid) {
  if (!isValidUUID(uuid)) return 0

  const version = parseInt(uuid.split('-')[2][0], 16)
  return version
}
