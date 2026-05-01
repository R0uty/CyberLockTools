const DEFAULT_MAX_INPUT_LENGTH = 20000
const DEFAULT_MAX_MATCHES = 2000

function buildFlagString(flags) {
  return `${flags.g ? 'g' : ''}${flags.i ? 'i' : ''}${flags.m ? 'm' : ''}${flags.s ? 's' : ''}`
}

function toHighlightedSegments(testString, matches) {
  if (matches.length === 0) {
    return [{ text: testString, isMatch: false }]
  }

  let lastIndex = 0
  const highlightedSegments = []

  matches.forEach((match) => {
    const prefix = testString.substring(lastIndex, match.index)
    if (prefix) {
      highlightedSegments.push({ text: prefix, isMatch: false })
    }

    highlightedSegments.push({ text: match.full, isMatch: true })
    lastIndex = match.index + match.length
  })

  const suffix = testString.substring(lastIndex)
  if (suffix) {
    highlightedSegments.push({ text: suffix, isMatch: false })
  }

  return highlightedSegments
}

function analyzeRegexCore({ pattern, testString, flags, replacement, maxInputLength, maxMatches }) {
  const effectiveInputLimit = maxInputLength ?? DEFAULT_MAX_INPUT_LENGTH
  const effectiveMatchLimit = maxMatches ?? DEFAULT_MAX_MATCHES

  if (testString.length > effectiveInputLimit) {
    return {
      matches: [],
      highlightedSegments: [{ text: testString, isMatch: false }],
      error: `Input too large (${testString.length} chars). Limit is ${effectiveInputLimit}.`,
      replacedText: testString,
      limitReached: false,
    }
  }

  const flagStr = buildFlagString(flags)

  try {
    const compiled = new RegExp(pattern, flagStr)
    const matches = []
    let limitReached = false

    if (flags.g) {
      let match
      while ((match = compiled.exec(testString)) !== null) {
        matches.push({
          full: match[0],
          groups: match.slice(1),
          index: match.index,
          length: match[0].length,
        })

        if (matches.length >= effectiveMatchLimit) {
          limitReached = true
          break
        }

        if (match[0] === '') {
          compiled.lastIndex += 1
        }
      }
    } else {
      const match = testString.match(compiled)
      if (match) {
        matches.push({
          full: match[0],
          groups: match.slice(1),
          index: match.index,
          length: match[0].length,
        })
      }
    }

    const replaceRegex = new RegExp(pattern, flagStr)

    return {
      matches,
      highlightedSegments: toHighlightedSegments(testString, matches),
      error: '',
      replacedText: testString.replace(replaceRegex, replacement),
      limitReached,
    }
  } catch (err) {
    return {
      matches: [],
      highlightedSegments: [{ text: testString, isMatch: false }],
      error: err.message,
      replacedText: testString,
      limitReached: false,
    }
  }
}

export function analyzeRegexSync(payload) {
  return analyzeRegexCore(payload)
}

export function analyzeRegexInWorker(payload, { timeoutMs = 450 } = {}) {
  if (typeof Worker === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined') {
    return Promise.resolve(analyzeRegexSync(payload))
  }

  return new Promise((resolve) => {
    const workerSource = `
      ${buildFlagString.toString()}
      ${toHighlightedSegments.toString()}
      ${analyzeRegexCore.toString()}

      self.onmessage = (event) => {
        try {
          const result = analyzeRegexCore(event.data)
          self.postMessage({ ok: true, result })
        } catch (error) {
          self.postMessage({ ok: false, error: error?.message || 'Regex worker failed' })
        }
      }
    `

    const blobUrl = URL.createObjectURL(new Blob([workerSource], { type: 'application/javascript' }))
    const worker = new Worker(blobUrl)

    const cleanup = () => {
      worker.terminate()
      URL.revokeObjectURL(blobUrl)
    }

    const timer = setTimeout(() => {
      cleanup()
      resolve({
        matches: [],
        highlightedSegments: [{ text: payload.testString, isMatch: false }],
        error: `Regex timed out after ${timeoutMs}ms. Simplify the pattern or input.`,
        replacedText: payload.testString,
        limitReached: false,
      })
    }, timeoutMs)

    worker.onmessage = (event) => {
      clearTimeout(timer)
      cleanup()

      if (event.data?.ok) {
        resolve(event.data.result)
        return
      }

      resolve({
        matches: [],
        highlightedSegments: [{ text: payload.testString, isMatch: false }],
        error: event.data?.error || 'Regex worker failed',
        replacedText: payload.testString,
        limitReached: false,
      })
    }

    worker.onerror = () => {
      clearTimeout(timer)
      cleanup()
      resolve(analyzeRegexSync(payload))
    }

    worker.postMessage(payload)
  })
}
