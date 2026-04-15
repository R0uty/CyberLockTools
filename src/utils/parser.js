/**
 * Parses token arrays into structured DSL action objects.
 * @param {string[][]} tokens - Array of token lines, each containing an array of words
 * @returns {object[]} Array of structured DSL action objects
 */
export function parse(tokens) {
  return tokens.map(line => parseLine(line))
}

function parseLine(line) {
  if (!line || line.length === 0) {
    throw new Error('Empty token line')
  }

  const command = line[0].toLowerCase()

  switch (command) {
    case 'scan': {
      if (line[1] === 'target' && line[2]) {
        return { type: 'SCAN', target: line[2] }
      }
      throw new Error('Invalid scan syntax: expected "scan target <value>"')
    }
    default:
      throw new Error(`Unknown command: ${command}`)
  }
}
