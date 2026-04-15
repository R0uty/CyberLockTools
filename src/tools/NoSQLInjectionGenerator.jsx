import { useMemo, useState } from 'react'
import { Copy01Icon } from 'hugeicons-react'
import { useSEO } from '../hooks/useSEO'
import {
  BACKEND_INFO,
  COMMON_ATTACK_SURFACES,
  LEGAL_DISCLAIMER,
  PREVENTION_GUIDANCE,
  TESTING_WORKFLOW,
  fillPayloadTemplate,
  getAllCategories,
  getPayloadsByCategory,
  searchPayloads
} from '../utils/nosqlInjectionGenerator'
import '../styles/pages/NoSQLInjectionGenerator.css'

export default function NoSQLInjectionGenerator() {
  useSEO({
    title: 'NoSQL Injection Generator',
    description: 'Generate NoSQL injection payloads for authorized testing across MongoDB, CouchDB, Elasticsearch, and generic JSON-filter endpoints.',
    keywords: 'NoSQL injection generator, MongoDB injection, CouchDB injection, Elasticsearch query abuse, authorized security testing'
  })

  const [selectedCategory, setSelectedCategory] = useState('AUTH_BYPASS')
  const [selectedPayloadIndex, setSelectedPayloadIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [backend, setBackend] = useState('MongoDB')
  const [userField, setUserField] = useState('username')
  const [passField, setPassField] = useState('password')
  const [filterField, setFilterField] = useState('email')
  const [sampleValue, setSampleValue] = useState('admin')
  const [collection, setCollection] = useState('users')
  const [regexPrefix, setRegexPrefix] = useState('adm')
  const [iterations] = useState('5000000')
  const [copied, setCopied] = useState(false)

  const categories = getAllCategories()
  const backendDetails = BACKEND_INFO[backend]
  const currentPayloads = useMemo(
    () => searchQuery ? searchPayloads(searchQuery, backend) : getPayloadsByCategory(selectedCategory, backend),
    [searchQuery, backend, selectedCategory]
  )

  const currentPayload = useMemo(
    () => currentPayloads[selectedPayloadIndex] ?? null,
    [currentPayloads, selectedPayloadIndex]
  )

  const renderedPayload = useMemo(() => {
    if (!currentPayload) return ''

    return fillPayloadTemplate(currentPayload.template, {
      USER_FIELD: userField,
      PASS_FIELD: passField,
      FILTER_FIELD: filterField,
      VALUE: sampleValue,
      COLLECTION: collection,
      REGEX_PREFIX: regexPrefix,
      ITERATIONS: iterations
    })
  }, [collection, currentPayload, filterField, iterations, passField, regexPrefix, sampleValue, userField])

  const handleCopy = async () => {
    if (!renderedPayload.trim()) return

    await navigator.clipboard.writeText(renderedPayload)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="tool-page nosql-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>

      <div className="tool-header">
        <span className="nosql-kicker">Document & search backends</span>
        <h1>NoSQL Injection Generator</h1>
        <p>Generate NoSQL injection probes for authorized security testing across MongoDB, CouchDB, Elasticsearch, and generic object-based filter flows.</p>
      </div>

      <div className="tool-container">
        <section className="tool-section nosql-panel">
          <div className="nosql-disclaimer">
            <h3>Authorized use only</h3>
            <p>{LEGAL_DISCLAIMER}</p>
          </div>

          <div className="nosql-target-grid">
            <div className="textarea-group">
              <label htmlFor="nosql-backend">Target backend</label>
              <select
                id="nosql-backend"
                value={backend}
                onChange={(event) => {
                  setBackend(event.target.value)
                  setSelectedPayloadIndex(0)
                }}
                className="nosql-select"
              >
                {Object.keys(BACKEND_INFO).filter((key) => key !== 'Generic').concat('Generic').map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>

            <div className="nosql-backend-card">
              <span className="nosql-card-label">Query style</span>
              <strong>{backendDetails.queryStyle}</strong>
              <p>{backendDetails.notes}</p>
            </div>

            <div className="nosql-backend-card">
              <span className="nosql-card-label">Risky operators</span>
              <strong>{backendDetails.riskyOperators}</strong>
              <p>{backendDetails.commonTargets}</p>
            </div>
          </div>
        </section>

        <section className="tool-section nosql-panel">
          <div className="nosql-custom-grid">
            <div className="textarea-group">
              <label htmlFor="nosql-user-field">User field</label>
              <input id="nosql-user-field" value={userField} onChange={(event) => setUserField(event.target.value)} />
            </div>
            <div className="textarea-group">
              <label htmlFor="nosql-pass-field">Password field</label>
              <input id="nosql-pass-field" value={passField} onChange={(event) => setPassField(event.target.value)} />
            </div>
            <div className="textarea-group">
              <label htmlFor="nosql-filter-field">Filter field</label>
              <input id="nosql-filter-field" value={filterField} onChange={(event) => setFilterField(event.target.value)} />
            </div>
            <div className="textarea-group">
              <label htmlFor="nosql-value">Sample value</label>
              <input id="nosql-value" value={sampleValue} onChange={(event) => setSampleValue(event.target.value)} />
            </div>
            <div className="textarea-group">
              <label htmlFor="nosql-collection">Collection / index</label>
              <input id="nosql-collection" value={collection} onChange={(event) => setCollection(event.target.value)} />
            </div>
            <div className="textarea-group">
              <label htmlFor="nosql-regex-prefix">Regex prefix</label>
              <input id="nosql-regex-prefix" value={regexPrefix} onChange={(event) => setRegexPrefix(event.target.value)} />
            </div>
          </div>
        </section>

        <section className="tool-section nosql-panel">
          <div className="nosql-two-col-grid">
            <div>
              <h3 className="nosql-section-title">Payload library</h3>

              <div className="textarea-group nosql-search-group">
                <label htmlFor="nosql-search">Search payloads</label>
                <input
                  id="nosql-search"
                  type="text"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setSelectedPayloadIndex(0)
                  }}
                  placeholder="Search by payload name, operator, or technique..."
                />
              </div>

              {!searchQuery && (
                <div className="nosql-category-btns">
                  {categories.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedCategory(key)
                        setSelectedPayloadIndex(0)
                      }}
                      className={selectedCategory === key ? 'nosql-category-btn nosql-category-btn--active' : 'nosql-category-btn'}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              <div className="nosql-payload-list">
                {currentPayloads.length > 0 ? (
                  currentPayloads.map((payload, index) => (
                    <button
                      key={`${payload.name}-${index}`}
                      onClick={() => setSelectedPayloadIndex(index)}
                      className={selectedPayloadIndex === index ? 'nosql-payload-item nosql-payload-item--selected' : 'nosql-payload-item'}
                    >
                      <strong>{payload.name}</strong>
                      <div className="nosql-payload-item__desc">{payload.description}</div>
                      <div className="nosql-payload-tags">
                        {payload.targets.map((target) => (
                          <span key={target}>{target}</span>
                        ))}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="nosql-empty-state">
                    No payloads match the selected backend and search.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="nosql-section-title">Generated payload</h3>

              {currentPayload ? (
                <>
                  <div className="nosql-code-box">
                    <div className="nosql-code-display">{renderedPayload}</div>
                  </div>

                  <button onClick={handleCopy} className="action-btn encode-btn nosql-copy-btn">
                    <Copy01Icon size={18} />
                    {copied ? 'Copied Payload' : 'Copy Payload'}
                  </button>

                  <div className="nosql-explanation-box">
                    <h4>Explanation</h4>
                    <p>{currentPayload.explanation}</p>
                  </div>
                </>
              ) : (
                <div className="nosql-empty-state">
                  Select a payload to view details.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="tool-section nosql-panel">
          <h3 className="nosql-section-title">Common attack surfaces</h3>
          <div className="nosql-card-grid">
            {COMMON_ATTACK_SURFACES.map((surface) => (
              <div key={surface.name} className="nosql-card">
                <strong>{surface.name}</strong>
                <p>{surface.example}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="nosql-info-grid">
          <div className="info-box nosql-info-box">
            <h4>Prevention best practices</h4>
            <ul>
              {PREVENTION_GUIDANCE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="info-box nosql-info-box">
            <h4>Authorized testing workflow</h4>
            <ol>
              {TESTING_WORKFLOW.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
