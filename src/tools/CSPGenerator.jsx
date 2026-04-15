import { useMemo, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import {
  analyzeCspPolicy,
  buildCspPolicy,
  CSP_BOOLEAN_DIRECTIVES,
  CSP_DIRECTIVE_FIELDS,
  CSP_PRESETS,
  DEFAULT_REPORT_TO_MAX_AGE,
  EXAMPLE_CSP_POLICY,
  generateCspHeader,
  generateCspMetaTag,
  generateReportingEndpointsHeader,
  generateReportToJSON
} from '../utils/cspGenerator'
import '../styles/pages/CSPGenerator.css'

function getPresetState(presetKey) {
  const preset = CSP_PRESETS[presetKey]
  return {
    directives: { ...preset.directives },
    flags: [...preset.flags]
  }
}

export default function CSPGenerator() {
  useSEO({
    title: 'CSP Generator & Analyzer - Content Security Policy Builder',
    description: 'Build, analyze, and validate Content-Security-Policy headers in your browser. Generate CSP headers, meta tags, presets, and practical security warnings.',
    keywords: 'csp generator, content security policy, csp analyzer, security headers, web security, csp builder'
  })

  const [activeTab, setActiveTab] = useState('builder')
  const [selectedPreset, setSelectedPreset] = useState('strict')
  const [builderState, setBuilderState] = useState(() => getPresetState('strict'))
  const [analyzerInput, setAnalyzerInput] = useState('')
  const [copiedTarget, setCopiedTarget] = useState('')
  const [reportEndpoint, setReportEndpoint] = useState('')
  const [reportMaxAge, setReportMaxAge] = useState(String(DEFAULT_REPORT_TO_MAX_AGE))
  const [reportIncludeSubdomains, setReportIncludeSubdomains] = useState(false)

  const builtPolicy = useMemo(() => buildCspPolicy(builderState), [builderState])
  const headerOutput = useMemo(() => generateCspHeader(builtPolicy), [builtPolicy])
  const metaOutput = useMemo(() => generateCspMetaTag(builtPolicy), [builtPolicy])
  const reportToOutput = useMemo(() => generateReportToJSON({
    group: builderState.directives['report-to'] ?? '',
    endpoint: reportEndpoint || builderState.directives['report-uri'] || '',
    maxAge: reportMaxAge,
    includeSubdomains: reportIncludeSubdomains
  }), [builderState.directives, reportEndpoint, reportIncludeSubdomains, reportMaxAge])
  const reportingEndpointsOutput = useMemo(() => generateReportingEndpointsHeader({
    group: builderState.directives['report-to'] ?? '',
    endpoint: reportEndpoint || builderState.directives['report-uri'] || ''
  }), [builderState.directives, reportEndpoint])
  const builderAnalysis = useMemo(() => analyzeCspPolicy(builtPolicy), [builtPolicy])
  const analyzerAnalysis = useMemo(() => analyzeCspPolicy(analyzerInput), [analyzerInput])

  const setDirectiveValue = (directiveName, value) => {
    setBuilderState((current) => ({
      ...current,
      directives: {
        ...current.directives,
        [directiveName]: value
      }
    }))
  }

  const toggleFlag = (flagName) => {
    setBuilderState((current) => {
      const enabled = current.flags.includes(flagName)

      return {
        ...current,
        flags: enabled
          ? current.flags.filter((flag) => flag !== flagName)
          : [...current.flags, flagName]
      }
    })
  }

  const handlePresetLoad = (presetKey) => {
    setSelectedPreset(presetKey)
    setBuilderState(getPresetState(presetKey))
  }

  const handleCopy = async (value, target) => {
    if (!value.trim()) return

    await navigator.clipboard.writeText(value)
    setCopiedTarget(target)
    setTimeout(() => setCopiedTarget(''), 2000)
  }

  const handleUseGeneratedPolicy = () => {
    setActiveTab('analyzer')
    setAnalyzerInput(builtPolicy)
  }

  const handleLoadExample = () => {
    setActiveTab('analyzer')
    setAnalyzerInput(EXAMPLE_CSP_POLICY)
  }

  return (
    <div className="tool-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>

      <div className="tool-header">
        <h1>CSP Generator &amp; Analyzer</h1>
        <p>Build Content Security Policy headers from common directives, generate copy-ready header and meta tag output, and analyze pasted CSP strings for risky sources and missing protections.</p>
      </div>

      <div className="tool-container">
        <section className="tool-section">
          <div className="csp-tab-row">
            <button
              onClick={() => setActiveTab('builder')}
              className={activeTab === 'builder' ? 'csp-tab csp-tab--active' : 'csp-tab'}
            >
              Builder
            </button>
            <button
              onClick={() => setActiveTab('analyzer')}
              className={activeTab === 'analyzer' ? 'csp-tab csp-tab--active' : 'csp-tab'}
            >
              Analyzer
            </button>
          </div>
        </section>

        {activeTab === 'builder' && (
          <>
            <section className="tool-section">
              <h3 className="section-title">Preset Templates</h3>
              <div className="csp-preset-grid">
                {Object.entries(CSP_PRESETS).map(([presetKey, preset]) => (
                  <button
                    key={presetKey}
                    onClick={() => handlePresetLoad(presetKey)}
                    className={selectedPreset === presetKey ? 'csp-preset-btn csp-preset-btn--active' : 'csp-preset-btn'}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="tool-section">
              <div className="csp-field-grid">
                {CSP_DIRECTIVE_FIELDS.map((field) => (
                  <div key={field.name} className="csp-field-card">
                    <label className="field-label" htmlFor={field.name}>{field.label}</label>
                    <input
                      id={field.name}
                      type="text"
                      value={builderState.directives[field.name] ?? ''}
                      onChange={(event) => setDirectiveValue(field.name, event.target.value)}
                      placeholder={field.placeholder}
                      className="input"
                      spellCheck={false}
                    />
                    <p className="csp-field-help">{field.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="tool-section">
              <h3 className="section-title">Boolean Directives</h3>
              <div className="csp-flag-grid">
                {CSP_BOOLEAN_DIRECTIVES.map((flag) => (
                  <label key={flag.name} className="csp-checkbox-card">
                    <input
                      type="checkbox"
                      checked={builderState.flags.includes(flag.name)}
                      onChange={() => toggleFlag(flag.name)}
                    />
                    <span>
                      <strong>{flag.label}</strong>
                      <small>{flag.description}</small>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="tool-section">
              <div className="two-column-layout">
                <div className="column">
                  <label className="field-label">Generated Policy</label>
                  <textarea
                    value={builtPolicy}
                    readOnly
                    className="textarea output csp-textarea"
                    placeholder="Your generated policy will appear here..."
                    rows={7}
                    spellCheck={false}
                  />
                  <div className="csp-action-row">
                    <button onClick={() => handleCopy(builtPolicy, 'policy')} className="action-btn encode-btn" disabled={!builtPolicy}>
                      {copiedTarget === 'policy' ? '✓ Copied!' : 'Copy Policy'}
                    </button>
                    <button onClick={handleUseGeneratedPolicy} className="action-btn" disabled={!builtPolicy}>
                      Analyze This Policy
                    </button>
                  </div>
                </div>

                <div className="column">
                  <label className="field-label">Header Output</label>
                  <textarea
                    value={headerOutput}
                    readOnly
                    className="textarea output csp-textarea"
                    placeholder="Header output will appear here..."
                    rows={3}
                    spellCheck={false}
                  />

                  <label className="field-label csp-secondary-label">Meta Tag Output</label>
                  <textarea
                    value={metaOutput}
                    readOnly
                    className="textarea output csp-textarea"
                    placeholder="Meta tag output will appear here..."
                    rows={4}
                    spellCheck={false}
                  />

                  <div className="csp-action-row">
                    <button onClick={() => handleCopy(headerOutput, 'header')} className="action-btn" disabled={!headerOutput}>
                      {copiedTarget === 'header' ? '✓ Copied!' : 'Copy Header'}
                    </button>
                    <button onClick={() => handleCopy(metaOutput, 'meta')} className="action-btn" disabled={!metaOutput}>
                      {copiedTarget === 'meta' ? '✓ Copied!' : 'Copy Meta Tag'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="tool-section">
              <h3 className="section-title">Report-To JSON Generator</h3>
              <div className="csp-report-grid">
                <div className="csp-field-card">
                  <label className="field-label" htmlFor="report-endpoint">Reporting Endpoint URL</label>
                  <input
                    id="report-endpoint"
                    type="text"
                    value={reportEndpoint}
                    onChange={(event) => setReportEndpoint(event.target.value)}
                    placeholder={builderState.directives['report-uri'] || 'https://reports.example.com/reports'}
                    className="input"
                    spellCheck={false}
                  />
                  <p className="csp-field-help">If left blank, the generator will reuse your `report-uri` endpoint when possible.</p>
                </div>

                <div className="csp-field-card">
                  <label className="field-label" htmlFor="report-max-age">max_age (seconds)</label>
                  <input
                    id="report-max-age"
                    type="number"
                    min="0"
                    step="1"
                    value={reportMaxAge}
                    onChange={(event) => setReportMaxAge(event.target.value)}
                    className="input"
                  />
                  <p className="csp-field-help">Typical values are `86400` for one day or `10886400` for about 18 weeks.</p>
                </div>

                <label className="csp-checkbox-card">
                  <input
                    type="checkbox"
                    checked={reportIncludeSubdomains}
                    onChange={() => setReportIncludeSubdomains((current) => !current)}
                  />
                  <span>
                    <strong>include_subdomains</strong>
                    <small>Include subdomains in the generated Reporting API group configuration.</small>
                  </span>
                </label>
              </div>

              <label className="field-label csp-secondary-label">Report-To JSON</label>
              <textarea
                value={reportToOutput}
                readOnly
                className="textarea output csp-textarea"
                placeholder="Set `report-to` and an endpoint to generate a Report-To JSON body..."
                rows={8}
                spellCheck={false}
              />

              <div className="csp-action-row">
                <button onClick={() => handleCopy(reportToOutput, 'report-to')} className="action-btn" disabled={!reportToOutput}>
                  {copiedTarget === 'report-to' ? '✓ Copied!' : 'Copy Report-To JSON'}
                </button>
              </div>

              <label className="field-label csp-secondary-label">Reporting-Endpoints Header</label>
              <textarea
                value={reportingEndpointsOutput}
                readOnly
                className="textarea output csp-textarea"
                placeholder="Set `report-to` and an endpoint to generate a Reporting-Endpoints header..."
                rows={3}
                spellCheck={false}
              />

              <div className="csp-action-row">
                <button onClick={() => handleCopy(reportingEndpointsOutput, 'reporting-endpoints')} className="action-btn" disabled={!reportingEndpointsOutput}>
                  {copiedTarget === 'reporting-endpoints' ? '✓ Copied!' : 'Copy Reporting-Endpoints'}
                </button>
              </div>
            </section>

            <section className="tool-section">
              <div className="csp-summary-row">
                <div className="csp-summary-card">
                  <span className="csp-summary-label">Directives</span>
                  <strong>{builderAnalysis.directiveCount}</strong>
                </div>
                <div className="csp-summary-card">
                  <span className="csp-summary-label">Flags</span>
                  <strong>{builderAnalysis.flagsCount}</strong>
                </div>
                <div className="csp-summary-card">
                  <span className="csp-summary-label">Warnings</span>
                  <strong>{builderAnalysis.warnings.length}</strong>
                </div>
                <div className="csp-summary-card">
                  <span className="csp-summary-label">Good Signals</span>
                  <strong>{builderAnalysis.positives.length}</strong>
                </div>
              </div>

              <div className="csp-analysis-grid">
                <div className="info-box">
                  <h3>Warnings &amp; Hardening Suggestions</h3>
                  <ul className="about-list">
                    {builderAnalysis.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-box">
                  <h3>Good Signals</h3>
                  <ul className="about-list">
                    {builderAnalysis.positives.map((positive) => (
                      <li key={positive}>{positive}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'analyzer' && (
          <>
            <section className="tool-section">
              <label className="field-label">Paste Existing CSP</label>
              <textarea
                value={analyzerInput}
                onChange={(event) => setAnalyzerInput(event.target.value)}
                className="textarea csp-analyzer-input"
                placeholder="Paste a Content-Security-Policy header value here..."
                rows={8}
                spellCheck={false}
              />

              <div className="csp-action-row">
                <button onClick={handleLoadExample} className="action-btn">Load Example</button>
                <button onClick={handleUseGeneratedPolicy} className="action-btn" disabled={!builtPolicy}>Use Generated Policy</button>
                <button onClick={() => setAnalyzerInput('')} className="action-btn">Clear</button>
              </div>
            </section>

            <section className="tool-section">
              <div className="two-column-layout">
                <div className="column">
                  <label className="field-label">Normalized Policy</label>
                  <textarea
                    value={analyzerAnalysis.normalizedPolicy}
                    readOnly
                    className="textarea output csp-textarea"
                    placeholder="Normalized policy output will appear here..."
                    rows={7}
                    spellCheck={false}
                  />
                </div>

                <div className="column">
                  <div className="csp-summary-row csp-summary-row--compact">
                    <div className="csp-summary-card">
                      <span className="csp-summary-label">Directives</span>
                      <strong>{analyzerAnalysis.directiveCount}</strong>
                    </div>
                    <div className="csp-summary-card">
                      <span className="csp-summary-label">Flags</span>
                      <strong>{analyzerAnalysis.flagsCount}</strong>
                    </div>
                    <div className="csp-summary-card">
                      <span className="csp-summary-label">Warnings</span>
                      <strong>{analyzerAnalysis.warnings.length}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="tool-section">
              <div className="csp-analysis-grid">
                <div className="info-box">
                  <h3>Warnings &amp; Observations</h3>
                  <ul className="about-list">
                    {analyzerAnalysis.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-box">
                  <h3>Positive Signals</h3>
                  <ul className="about-list">
                    {analyzerAnalysis.positives.map((positive) => (
                      <li key={positive}>{positive}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="tool-section">
          <div className="info-box">
            <h3>How to Use This Tool</h3>
            <ul className="about-list">
              <li><strong>Builder:</strong> Start from a preset, adjust directive sources, then copy either the raw policy, the HTTP header, or the HTML meta tag.</li>
              <li><strong>Report Outputs:</strong> When you set <code>report-to</code>, the tool can generate both the `Report-To` JSON payload and the modern <code>Reporting-Endpoints</code> header for the same reporting group.</li>
              <li><strong>Analyzer:</strong> Paste an existing policy to normalize it and surface risky directives like <code>'unsafe-inline'</code>, <code>'unsafe-eval'</code>, or broad wildcards.</li>
              <li><strong>Production Tip:</strong> Prefer nonces or hashes for inline scripts, keep <code>object-src 'none'</code>, explicitly define <code>base-uri</code> and <code>frame-ancestors</code>, and add reporting with <code>report-uri</code> and/or <code>report-to</code>.</li>
              <li><strong>Development Tip:</strong> Dev servers often need relaxed values like localhost and WebSocket origins, but tighten them again before deployment.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
