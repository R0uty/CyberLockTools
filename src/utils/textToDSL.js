import { tokenize } from './tokenizer'
import { parse } from './parser'
import { toDSL } from './dslFormatter'

/**
 * Converts plain text input into a DSL representation.
 * @param {string} input - The plain text to convert
 * @returns {string} The DSL output string
 */
export function convertTextToDSL(input) {
  const tokens = tokenize(input)
  const parsed = parse(tokens)
  return toDSL(parsed)
}
