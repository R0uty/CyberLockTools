/**
 * Converts plain text input into a DSL representation.
 * @param {string} input - The plain text to convert
 * @returns {string} The DSL output string
 */
export function convertTextToDSL(input) {
  // Stub: parsing logic not yet implemented
  return `// Input received (${input.length} chars) — parsing not yet implemented
rule "example-rule" {
  match: input contains "keyword"
  action: flag(severity=HIGH)
}`
}
