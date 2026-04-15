import { useState, useMemo } from 'react';
import { useSEO } from '../hooks/useSEO';
import '../styles/pages/RegexTester.css'

export default function RegexTester() {
  useSEO({
    title: 'Online Regex Tester Tool - Test Patterns',
    description: 'Free online regex tester and pattern matcher. Test regular expressions with live highlighting, extract matches, analyze capture groups, and test replacements. Perfect for developers learning or debugging regex.',
    keywords: 'regex tester, regular expression, pattern matching, regex test tool, regex online',
  });

  const [pattern, setPattern] = useState('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  const [testString, setTestString] = useState('test@example.com\ninvalid.email@\njohn.doe@company.co.uk');
  const [flags, setFlags] = useState({ g: true, i: false, m: true, s: false });
  const [replacement, setReplacement] = useState('[MATCH]');
  const [copied, setCopied] = useState('');

  // Compute regex results memoized
  const { regex, matches, highlightedString, error } = useMemo(() => {
    let computedRegex = null;
    let computedMatches = [];
    let computedHighlightedString = testString;
    let computedError = '';

    try {
      const flagStr = (flags.g ? 'g' : '') + (flags.i ? 'i' : '') + (flags.m ? 'm' : '') + (flags.s ? 's' : '');
      computedRegex = new RegExp(pattern, flagStr);

      if (flags.g) {
        let match;
        while ((match = computedRegex.exec(testString)) !== null) {
          computedMatches.push({
            full: match[0],
            groups: match.slice(1),
            index: match.index,
            length: match[0].length,
          });
        }
      } else {
        const match = testString.match(computedRegex);
        if (match) {
          computedMatches.push({
            full: match[0],
            groups: match.slice(1),
            index: match.index,
            length: match[0].length,
          });
        }
      }

      // Create highlighted string
      if (computedMatches.length > 0) {
        let lastIndex = 0;
        computedHighlightedString = '';
        computedMatches.forEach((match) => {
          computedHighlightedString += testString.substring(lastIndex, match.index);
          computedHighlightedString += `<mark>${match.full}</mark>`;
          lastIndex = match.index + match.length;
        });
        computedHighlightedString += testString.substring(lastIndex);
      }
    } catch (err) {
      computedError = err.message;
    }

    return {
      regex: computedRegex,
      matches: computedMatches,
      highlightedString: computedHighlightedString,
      error: computedError,
    };
  }, [pattern, testString, flags]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const getReplacedString = () => {
    if (!regex) return testString;
    const flagStr = (flags.g ? 'g' : '') + (flags.i ? 'i' : '') + (flags.m ? 'm' : '') + (flags.s ? 's' : '');
    const tempRegex = new RegExp(pattern, flagStr);
    return testString.replace(tempRegex, replacement);
  };

  const downloadResults = () => {
    const results = `REGEX TESTER RESULTS
======================

Pattern: ${pattern}
Flags: ${(flags.g ? 'g' : '') + (flags.i ? 'i' : '') + (flags.m ? 'm' : '') + (flags.s ? 's' : '') || 'none'}

Test String:
${testString}

Total Matches: ${matches.length}

Matches:
${matches.map((m, i) => `${i + 1}. "${m.full}" at index ${m.index}${m.groups.length > 0 ? ` - Groups: ${m.groups.join(', ')}` : ''}`).join('\n')}

Replaced String (using: "${replacement}"):
${getReplacedString()}`;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `regex-results-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-page regex-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>

      <div className="tool-header">
        <span className="regex-kicker">Pattern analysis</span>
        <h1>Online Regex Tester Tool</h1>
        <p>
          Test regular expressions in real time with live highlighting, capture-group inspection, and replace previews. Built for quick debugging without leaving the browser.
        </p>
      </div>

      <div className="tool-container">
        <div className="regex-tester-container">
          <div className="regex-input-panel">
            <div className="regex-section">
              <label htmlFor="pattern">Regex Pattern</label>
              <textarea
                id="pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter your regex pattern..."
                className="regex-textarea pattern-input"
              />
            </div>

            <div className="regex-section">
              <label htmlFor="flags">Flags</label>
              <div className="flags-group">
                <label className="flag-checkbox">
                  <input
                    type="checkbox"
                    checked={flags.g}
                    onChange={(e) => setFlags({ ...flags, g: e.target.checked })}
                  />
                  <span>Global (g) - Find all matches</span>
                </label>
                <label className="flag-checkbox">
                  <input
                    type="checkbox"
                    checked={flags.i}
                    onChange={(e) => setFlags({ ...flags, i: e.target.checked })}
                  />
                  <span>Case-insensitive (i)</span>
                </label>
                <label className="flag-checkbox">
                  <input
                    type="checkbox"
                    checked={flags.m}
                    onChange={(e) => setFlags({ ...flags, m: e.target.checked })}
                  />
                  <span>Multiline (m)</span>
                </label>
                <label className="flag-checkbox">
                  <input
                    type="checkbox"
                    checked={flags.s}
                    onChange={(e) => setFlags({ ...flags, s: e.target.checked })}
                  />
                  <span>Dotall (s) - . matches newlines</span>
                </label>
              </div>
            </div>

            <div className="regex-section">
              <label htmlFor="testString">Test String</label>
              <textarea
                id="testString"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test against..."
                className="regex-textarea test-input"
              />
            </div>

            <div className="regex-section">
              <label htmlFor="replacement">Replacement String</label>
              <input
                id="replacement"
                type="text"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder="e.g., $&, $1, [MATCH]"
                className="regex-input"
              />
              <small>Use $&amp; for the full match, or $1, $2 and so on for capture groups.</small>
            </div>
          </div>

          <div className="regex-results-panel">
            {error && (
              <div className="error-message">
                <strong>Regex Error:</strong> {error}
              </div>
            )}

            {!error && (
              <>
                <div className="regex-section">
                  <h3>Match Results ({matches.length})</h3>
                  {matches.length === 0 ? (
                    <p className="no-matches">No matches found</p>
                  ) : (
                    <div className="matches-list">
                      {matches.map((match, i) => (
                        <div key={i} className="match-item">
                          <div className="match-number">#{i + 1}</div>
                          <div className="match-details">
                            <div className="match-text">"{match.full}"</div>
                            <div className="match-meta">
                              Index: {match.index} | Length: {match.length}
                              {match.groups.length > 0 && (
                                <div className="match-groups">
                                  Groups: {match.groups.map((g, j) => `$${j + 1}="${g}"`).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="regex-section">
                  <h3>Highlighted Text</h3>
                  <div
                    className="highlighted-text"
                    dangerouslySetInnerHTML={{ __html: highlightedString.replace(/\n/g, '<br />') }}
                  />
                </div>

                <div className="regex-section">
                  <h3>Replace Demo</h3>
                  <div className="replace-box">
                    <div className="replace-label">Replace with: <code>{replacement}</code></div>
                    <div className="replaced-text">{getReplacedString()}</div>
                  </div>
                </div>

                <div className="button-group">
                  <button
                    onClick={() => copyToClipboard(pattern, 'pattern')}
                    className="action-btn clear-btn"
                  >
                    {copied === 'pattern' ? '✓ Copied Pattern' : 'Copy Pattern'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(matches, null, 2), 'matches')}
                    className="action-btn clear-btn"
                    disabled={matches.length === 0}
                  >
                    {copied === 'matches' ? '✓ Copied Matches' : 'Copy Matches (JSON)'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(getReplacedString(), 'replaced')}
                    className="action-btn decode-btn"
                  >
                    {copied === 'replaced' ? '✓ Copied' : 'Copy Replaced Text'}
                  </button>
                  <button
                    onClick={downloadResults}
                    className="action-btn encode-btn"
                  >
                    Download Results
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="info-section regex-info-grid">
          <div className="info-box regex-info-box">
            <h4>Common Regex Patterns</h4>
            <ul>
              <li><code>^\w+@[\w.-]+\.\w+$</code> - Email validation</li>
              <li><code>^\d{3}-\d{3}-\d{4}$</code> (as text) - Phone number XXX-XXX-XXXX</li>
              <li><code>^https?://[^\s]+$</code> - URL matching</li>
              <li><code>Strong password with uppercase, lowercase, digit, 8+ chars</code> - Pattern reference</li>
              <li><code>^\d{4}-\d{2}-\d{2}$</code> (as text) - Date YYYY-MM-DD format</li>
              <li><code>^[0-9a-fA-F]{6}$</code> (as text) - Hex color code</li>
            </ul>
          </div>

          <div className="info-box regex-info-box">
            <h4>Regex Syntax Quick Reference</h4>
            <ul>
              <li><code>.</code> - Any character (or newline with s flag)</li>
              <li><code>*</code> - Zero or more of previous</li>
              <li><code>+</code> - One or more of previous</li>
              <li><code>?</code> - Zero or one of previous</li>
              <li><code>[abc]</code> - Any of a, b, c</li>
              <li><code>[^abc]</code> - Any character except a, b, c</li>
              <li><code>\d</code> - Any digit (0-9)</li>
              <li><code>\w</code> - Word character [a-zA-Z0-9_]</li>
              <li><code>\s</code> - Whitespace character</li>
              <li><code>^</code> - Start of string (or line with m flag)</li>
              <li><code>$</code> - End of string (or line with m flag)</li>
              <li><code>(abc)</code> - Capture group</li>
              <li><code>(?:abc)</code> - Non-capturing group</li>
              <li><code>|</code> - Alternation (or)</li>
            </ul>
          </div>

          <div className="info-box regex-info-box">
            <h4>Features</h4>
            <ul>
              <li>Real-time regex matching with live results</li>
              <li>Visual highlighting of all matches in text</li>
              <li>Support for 4 major flags (g, i, m, s)</li>
              <li>Capture group display and analysis</li>
              <li>Replace demo with replacement string</li>
              <li>Copy pattern, matches (JSON), or replaced text</li>
              <li>Download complete results as text file</li>
              <li>Error messages for invalid patterns</li>
            </ul>
          </div>

          <div className="info-box regex-info-box">
            <h4>Use Cases</h4>
            <ul>
              <li>Validating email addresses, URLs, phone numbers</li>
              <li>Extracting data from text with capture groups</li>
              <li>Finding and replacing patterns in large text</li>
              <li>Learning regex with instant visual feedback</li>
              <li>Testing patterns before using in code</li>
              <li>Debugging complex regular expressions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
