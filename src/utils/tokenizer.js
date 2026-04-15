/**
 * Converts raw input text into tokens.
 * @param {string} input - The raw text to tokenize
 * @returns {string[][]} An array of lines, each containing an array of words
 */
export function tokenize(input) {
  return input
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.trim().split(/\s+/))
}
