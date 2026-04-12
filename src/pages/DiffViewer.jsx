import { useMemo, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { buildDiffRows, getDiffStats, normalizeDiffInput } from '../utils/diffViewer'
import './DiffViewer.css'

const SAMPLE_TEXT_LEFT = `hello
this is the old value
keep this line
remove this line`

const SAMPLE_TEXT_RIGHT = `hello
this is the new value
keep this line
add this line`

const SAMPLE_JSON_LEFT = `{"name":"R0uty","tools":["base64","json"],"private":true}`

const SAMPLE_JSON_RIGHT = `{"name":"R0uty","tools":["base64","json","diff"],"private":true,"mode":"browser"}`

export default function DiffViewer() {
  useSEO({
    title: 'Text / JSON Diff Viewer',
    description: 'Compare two text or JSON inputs in your browser with a side-by-side diff view, JSON normalization, and change counts.',
    keywords: 'diff viewer, text diff, json diff, compare files, browser diff tool'
  })

  const [mode, setMode] = useState('text')
  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')
  const [error, setError] = useState('')
  const [hasCompared, setHasCompared] = useState(false)
  const [normalizedLeft, setNormalizedLeft] = useState('')
  const [normalizedRight, setNormalizedRight] = useState('')

  const rows = useMemo(() => buildDiffRows(normalizedLeft, normalizedRight), [normalizedLeft, normalizedRight])
  const stats = useMemo(() => getDiffStats(rows), [rows])

  const handleCompare = () => {
    setError('')

    if (!leftInput.trim() && !rightInput.trim()) {
      setError(`Paste ${mode === 'json' ? 'JSON' : 'text'} into at least one side to compare.`)
      setHasCompared(false)
      return
    }

    try {
      const nextLeft = normalizeDiffInput(leftInput, mode)
      const nextRight = normalizeDiffInput(rightInput, mode)

      setNormalizedLeft(nextLeft)
      setNormalizedRight(nextRight)
      setHasCompared(true)
    } catch (err) {
      setError(`Unable to compare ${mode.toUpperCase()}: ${err.message}`)
      setHasCompared(false)
      setNormalizedLeft('')
      setNormalizedRight('')
    }
  }

  const handleClear = () => {
    setLeftInput('')
    setRightInput('')
    setError('')
    setHasCompared(false)
    setNormalizedLeft('')
    setNormalizedRight('')
  }

  const handleLoadSample = () => {
    if (mode === 'json') {
      setLeftInput(SAMPLE_JSON_LEFT)
      setRightInput(SAMPLE_JSON_RIGHT)
    } else {
      setLeftInput(SAMPLE_TEXT_LEFT)
      setRightInput(SAMPLE_TEXT_RIGHT)
    }

    setError('')
    setHasCompared(false)
    setNormalizedLeft('')
    setNormalizedRight('')
  }

  return (
    <div className="tool-page diff-viewer-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>

      <div className="tool-header">
        <h1>Text / JSON Diff Viewer</h1>
        <p>Compare two versions of text or JSON side by side, normalize JSON before diffing, and quickly spot added, removed, and unchanged lines.</p>
      </div>

      <div className="tool-container">
        <section className="tool-section diff-control-panel">
          <div className="mode-toggle diff-mode-toggle">
            <button
              onClick={() => setMode('text')}
              className={mode === 'text' ? 'toggle-btn active' : 'toggle-btn'}
            >
              Text
            </button>
            <button
              onClick={() => setMode('json')}
              className={mode === 'json' ? 'toggle-btn active' : 'toggle-btn'}
            >
              JSON
            </button>
          </div>

          <div className="button-group diff-button-group">
            <button onClick={handleCompare} className="action-btn encode-btn">
              Compare Inputs
            </button>
            <button onClick={handleLoadSample} className="action-btn decode-btn">
              Load Sample
            </button>
            <button onClick={handleClear} className="action-btn clear-btn">
              Clear
            </button>
          </div>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="tool-row diff-input-row">
          <div className="textarea-group">
            <label htmlFor="diff-left-input">{mode === 'json' ? 'Original JSON' : 'Original Text'}</label>
            <textarea
              id="diff-left-input"
              value={leftInput}
              onChange={(event) => {
                setLeftInput(event.target.value)
                setError('')
                setHasCompared(false)
              }}
              placeholder={mode === 'json' ? 'Paste the original JSON here...' : 'Paste the original text here...'}
              className="textarea diff-textarea"
              rows={12}
              spellCheck={false}
            />
          </div>

          <div className="textarea-group">
            <label htmlFor="diff-right-input">{mode === 'json' ? 'Updated JSON' : 'Updated Text'}</label>
            <textarea
              id="diff-right-input"
              value={rightInput}
              onChange={(event) => {
                setRightInput(event.target.value)
                setError('')
                setHasCompared(false)
              }}
              placeholder={mode === 'json' ? 'Paste the updated JSON here...' : 'Paste the updated text here...'}
              className="textarea diff-textarea"
              rows={12}
              spellCheck={false}
            />
          </div>
        </section>

        {hasCompared && (
          <>
            <section className="info-box info-box--alt diff-stats-box">
              <h4>Diff Summary</h4>
              <div className="diff-stats-grid">
                <div><strong>Added</strong><span>{stats.added}</span></div>
                <div><strong>Removed</strong><span>{stats.removed}</span></div>
                <div><strong>Unchanged</strong><span>{stats.same}</span></div>
                <div><strong>Mode</strong><span>{mode.toUpperCase()}</span></div>
              </div>
            </section>

            <section className="tool-section diff-results-section">
              <div className="diff-results-header">
                <h3>Side-by-Side Diff</h3>
                <p>{mode === 'json' ? 'JSON is normalized before comparison.' : 'Lines are compared in the order they appear.'}</p>
              </div>

              <div className="diff-table">
                <div className="diff-table-head">
                  <span>Original</span>
                  <span>Updated</span>
                </div>

                <div className="diff-table-body">
                  {rows.map((row, index) => (
                    <div key={`${row.type}-${index}`} className={`diff-row diff-row--${row.type}`}>
                      <div className="diff-cell">
                        <span className="diff-line-number">{row.leftLineNumber ?? ''}</span>
                        <code className="diff-line-text">{row.leftText || ' '}</code>
                      </div>
                      <div className="diff-cell">
                        <span className="diff-line-number">{row.rightLineNumber ?? ''}</span>
                        <code className="diff-line-text">{row.rightText || ' '}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <div className="info-box">
          <h4>How to use it</h4>
          <p>
            Choose <strong>Text</strong> for plain content or <strong>JSON</strong> to normalize structure before comparing. Then paste both versions and run the diff.
          </p>
        </div>
      </div>
    </div>
  )
}
