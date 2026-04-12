function normalizeLineEndings(value) {
  return value.replace(/\r\n/g, '\n')
}

export function normalizeDiffInput(input, mode) {
  const normalized = normalizeLineEndings(input)

  if (mode === 'json') {
    const parsed = JSON.parse(normalized)
    return JSON.stringify(parsed, null, 2)
  }

  return normalized
}

function splitLines(value) {
  return value === '' ? [''] : value.split('\n')
}

function buildLcsMatrix(leftLines, rightLines) {
  const matrix = Array.from(
    { length: leftLines.length + 1 },
    () => Array(rightLines.length + 1).fill(0)
  )

  for (let leftIndex = leftLines.length - 1; leftIndex >= 0; leftIndex -= 1) {
    for (let rightIndex = rightLines.length - 1; rightIndex >= 0; rightIndex -= 1) {
      if (leftLines[leftIndex] === rightLines[rightIndex]) {
        matrix[leftIndex][rightIndex] = matrix[leftIndex + 1][rightIndex + 1] + 1
      } else {
        matrix[leftIndex][rightIndex] = Math.max(
          matrix[leftIndex + 1][rightIndex],
          matrix[leftIndex][rightIndex + 1]
        )
      }
    }
  }

  return matrix
}

export function buildDiffRows(leftInput, rightInput) {
  const leftLines = splitLines(leftInput)
  const rightLines = splitLines(rightInput)
  const lcsMatrix = buildLcsMatrix(leftLines, rightLines)

  const rows = []
  let leftIndex = 0
  let rightIndex = 0
  let leftLineNumber = 1
  let rightLineNumber = 1

  while (leftIndex < leftLines.length && rightIndex < rightLines.length) {
    if (leftLines[leftIndex] === rightLines[rightIndex]) {
      rows.push({
        type: 'same',
        leftLineNumber,
        rightLineNumber,
        leftText: leftLines[leftIndex],
        rightText: rightLines[rightIndex]
      })

      leftIndex += 1
      rightIndex += 1
      leftLineNumber += 1
      rightLineNumber += 1
      continue
    }

    const removeScore = lcsMatrix[leftIndex + 1][rightIndex]
    const addScore = lcsMatrix[leftIndex][rightIndex + 1]

    if (removeScore >= addScore) {
      rows.push({
        type: 'removed',
        leftLineNumber,
        rightLineNumber: null,
        leftText: leftLines[leftIndex],
        rightText: ''
      })

      leftIndex += 1
      leftLineNumber += 1
    } else {
      rows.push({
        type: 'added',
        leftLineNumber: null,
        rightLineNumber,
        leftText: '',
        rightText: rightLines[rightIndex]
      })

      rightIndex += 1
      rightLineNumber += 1
    }
  }

  while (leftIndex < leftLines.length) {
    rows.push({
      type: 'removed',
      leftLineNumber,
      rightLineNumber: null,
      leftText: leftLines[leftIndex],
      rightText: ''
    })

    leftIndex += 1
    leftLineNumber += 1
  }

  while (rightIndex < rightLines.length) {
    rows.push({
      type: 'added',
      leftLineNumber: null,
      rightLineNumber,
      leftText: '',
      rightText: rightLines[rightIndex]
    })

    rightIndex += 1
    rightLineNumber += 1
  }

  return rows
}

export function getDiffStats(rows) {
  return rows.reduce((stats, row) => {
    if (row.type === 'same') stats.same += 1
    if (row.type === 'added') stats.added += 1
    if (row.type === 'removed') stats.removed += 1
    return stats
  }, { same: 0, added: 0, removed: 0 })
}
