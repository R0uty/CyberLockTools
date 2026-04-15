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
    case 'ping': {
      if (line[1] === 'host' && line[2]) {
        return { type: 'PING', host: line[2] }
      }
      throw new Error('Invalid ping syntax: expected "ping host <value>"')
    }
    case 'connect': {
      if (line[1] === 'host' && line[2]) {
        const entry = { type: 'CONNECT', host: line[2] }
        if (line[3] === 'port' && line[4]) {
          entry.port = line[4]
        }
        return entry
      }
      throw new Error('Invalid connect syntax: expected "connect host <value> [port <value>]"')
    }
    case 'block': {
      if (line[1] === 'ip' && line[2]) {
        return { type: 'BLOCK', ip: line[2] }
      }
      throw new Error('Invalid block syntax: expected "block ip <value>"')
    }
    case 'auth': {
      if (line[1] === 'user' && line[2]) {
        return { type: 'AUTH', user: line[2] }
      }
      throw new Error('Invalid auth syntax: expected "auth user <value>"')
    }
    case 'fuzz': {
      if (line[1] === 'url' && line[2]) {
        return { type: 'FUZZ', url: line[2] }
      }
      throw new Error('Invalid fuzz syntax: expected "fuzz url <value>"')
    }
    default:
      throw new Error(`Unknown command: ${command}`)
  }
}
