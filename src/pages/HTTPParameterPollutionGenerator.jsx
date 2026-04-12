import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Copy01Icon } from 'hugeicons-react';
import {
  getAllCategories,
  getPayloadsByCategory,
  searchPayloads,
  BACKEND_PARSING_BEHAVIORS,
  LEGAL_DISCLAIMER
} from '../utils/httpParameterPollutionGenerator';
import './HTTPParameterPollutionGenerator.css';

export default function HTTPParameterPollutionGenerator() {
  useSEO(
    'HTTP Parameter Pollution Generator - R0uty\'s Cyber Lab',
    'Educational HTTP parameter pollution payload generator. Learn about web server security vulnerabilities with tutorials and examples.'
  );

  const [selectedCategory, setSelectedCategory] = useState('GET_POLLUTION');
  const [selectedPayload, setSelectedPayload] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [backendType, setBackendType] = useState('PHP/Apache');
  const [showLegalWarning, setShowLegalWarning] = useState(true);

  const categories = getAllCategories();
  const currentPayloads = searchQuery
    ? searchPayloads(searchQuery)
    : getPayloadsByCategory(selectedCategory);

  const currentPayload = currentPayloads[selectedPayload] || null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (showLegalWarning) {
    return (
      <div className="tool-page hpp-page hpp-disclaimer-page">
        <div className="privacy-badge">
          Authorized testing only • Review the notice before continuing
        </div>
        <div className="tool-header">
          <span className="hpp-kicker">Request pollution</span>
          <h1>HTTP Parameter Pollution Generator</h1>
          <p>Review the legal and ethical notice before using this payload library for authorized security testing and educational work.</p>
        </div>
        <div className="hpp-legal-box">
          {LEGAL_DISCLAIMER}
        </div>
        <div className="button-group hpp-disclaimer-actions">
          <button
            onClick={() => setShowLegalWarning(false)}
            className="action-btn encode-btn"
          >
            I Understand & Accept
          </button>
          <button
            onClick={() => window.history.back()}
            className="action-btn clear-btn"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-page hpp-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <span className="hpp-kicker">Request pollution</span>
        <h1>HTTP Parameter Pollution Generator</h1>
        <p className="hpp-page-desc">
          Learn HTTP Parameter Pollution (HPP) techniques for authorized security testing and educational purposes.
        </p>
      </div>

      {/* Backend Selection */}
      <div className="hpp-section-mb hpp-toolbar-card">
        <label className="hpp-field-label">
          Target Backend Type:
        </label>
        <select
          value={backendType}
          onChange={(e) => setBackendType(e.target.value)}
          className="hpp-select"
        >
          {BACKEND_PARSING_BEHAVIORS.map((backend) => (
            <option key={backend.backend} value={backend.backend}>
              {backend.backend}
            </option>
          ))}
        </select>
      </div>

      {/* Backend Info Card */}
      <div className="hpp-backend-card">
        <h3 className="hpp-backend-card-title">{backendType} Behavior:</h3>
        <div>
          {BACKEND_PARSING_BEHAVIORS.filter(b => b.backend === backendType).map((b, idx) => (
            <div key={idx}>
              <p className="hpp-backend-behavior">
                <strong>Behavior:</strong> {b.behavior}
              </p>
              <div className="hpp-backend-example">
                Example: {b.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="hpp-two-col-grid">
        {/* Left: Category & Payload Selection */}
        <div>
          <h3 className="hpp-col-heading">Attack Type</h3>

          {/* Search */}
          <input
            type="text"
            placeholder="Search payloads..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedPayload(0);
            }}
            className="hpp-search-input"
          />

          {/* Category Buttons */}
          {!searchQuery && (
            <div className="hpp-category-btns">
              {categories.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setSelectedPayload(0);
                  }}
                  className={`hpp-category-btn${selectedCategory === key ? ' hpp-category-btn--active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Payload List */}
          <div className="hpp-payload-list">
            {currentPayloads.length === 0 ? (
              <div className="hpp-payload-empty">
                No payloads found
              </div>
            ) : (
              currentPayloads.map((payload, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPayload(index)}
                  className={`hpp-payload-item${selectedPayload === index ? ' hpp-payload-item--selected' : ''}`}
                >
                  <strong>{payload.name}</strong>
                  <div className="hpp-payload-item__desc">
                    {payload.description}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Payload Preview */}
        <div>
          <h3 className="hpp-col-heading">Payload Preview</h3>

          {currentPayload ? (
            <>
              {/* Payload Code */}
              <div className="hpp-code-box">
                <div className="hpp-code-display">
                  {currentPayload.payload}
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(currentPayload.payload)}
                className="hpp-copy-btn action-btn encode-btn"
              >
                <Copy01Icon size={18} />
                Copy Payload
              </button>

              {/* Explanation */}
              <div className="hpp-explanation-box">
                <h4 className="hpp-explanation-title">Explanation:</h4>
                <p className="hpp-explanation-text">
                  {currentPayload.explanation}
                </p>
              </div>
            </>
          ) : (
            <div className="hpp-empty-preview">
              Select a payload to view details
            </div>
          )}
        </div>
      </div>

      {/* Backend Parsing Reference */}
      <div className="hpp-section-mb">
        <h3 className="hpp-section-title">Backend Parsing Differences Reference</h3>
        <div className="hpp-backend-grid">
          {BACKEND_PARSING_BEHAVIORS.map((backend, index) => (
            <div key={index} className="hpp-card">
              <strong className="hpp-card-title">{backend.backend}</strong>
              <p className="hpp-card-text">
                {backend.behavior}
              </p>
              <div className="hpp-card-code">
                {backend.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HPP Impact Matrix */}
      <div className="hpp-info-section">
        <h3 className="hpp-info-section-title">HTTP Parameter Pollution Impact</h3>
        <ul className="hpp-info-list">
          <li>✓ <strong>WAF Bypass:</strong> Fragment payloads across parameters to evade detection</li>
          <li>✓ <strong>Authentication Bypass:</strong> Override authentication parameters with duplicates</li>
          <li>✓ <strong>XSS via HPP:</strong> Bypass XSS filters by splitting payload across parameters</li>
          <li>✓ <strong>SQL Injection:</strong> Inject SQL fragments that reassemble in backend queries</li>
          <li>✓ <strong>Cache Poisoning:</strong> Exploit different cache key generation from parameters</li>
          <li>✓ <strong>Privilege Escalation:</strong> Duplicate role/permission parameters to elevate privileges</li>
          <li>✓ <strong>Rate Limiting Bypass:</strong> Distribute requests across duplicate parameters</li>
          <li>✓ <strong>Logic Bypass:</strong> Override business logic through parameter duplication</li>
        </ul>
      </div>

      {/* Security Recommendations */}
      <div className="hpp-info-section">
        <h3 className="hpp-info-section-title">Security Best Practices</h3>
        <ul className="hpp-info-list">
          <li>✓ Implement consistent parameter parsing across all components (frontend, WAF, backend)</li>
          <li>✓ Reject requests with duplicate parameter names instead of processing them</li>
          <li>✓ Validate and normalize parameter values on server-side before any processing</li>
          <li>✓ Use parameterized queries to prevent HPP-based SQL injection</li>
          <li>✓ Implement strict input validation for all parameters</li>
          <li>✓ Use security headers to prevent cache poisoning attacks</li>
          <li>✓ Log and monitor for suspicious parameter patterns</li>
          <li>✓ Conduct regular security testing for HPP vulnerabilities</li>
          <li>✓ Keep web application firewall rules up-to-date with HPP bypass techniques</li>
          <li>✓ Educate developers on secure parameter handling across different frameworks</li>
        </ul>
      </div>

      {/* Testing Methodology */}
      <div className="hpp-info-section">
        <h3 className="hpp-info-section-title">Authorized HPP Security Testing Methodology</h3>
        <ol className="hpp-info-list">
          <li><strong>Identify Critical Parameters:</strong> Map all input parameters and their security sensitivity</li>
          <li><strong>Test Duplication:</strong> Send duplicate parameters with different values systematically</li>
          <li><strong>Analyze Behavior:</strong> Document which parameter value is processed by each component</li>
          <li><strong>Identify Inconsistencies:</strong> Find mismatches between WAF, proxy, and backend processing</li>
          <li><strong>Craft Payloads:</strong> Create HPP payloads that bypass validation by fragmenting across parameters</li>
          <li><strong>Test Combinations:</strong> Combine HPP with other techniques (XSS, SQLi, cache poisoning)</li>
          <li><strong>Verify Impact:</strong> Confirm actual impact on security mechanisms</li>
          <li><strong>Document Findings:</strong> Record all vulnerabilities with clear proof-of-concept</li>
          <li><strong>Report Responsibly:</strong> Disclose through proper channels with remediation guidance</li>
        </ol>
      </div>
    </div>
  );
}
