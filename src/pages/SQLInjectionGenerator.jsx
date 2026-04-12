import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { showFeedback } from '../utils/feedback';
import { Copy01Icon } from 'hugeicons-react';
import {
  getAllCategories,
  getPayloadsByCategory,
  searchPayloads,
  COMMON_VULNERABLE_PARAMETERS,
  DATABASE_INFO,
  LEGAL_DISCLAIMER
} from '../utils/sqlInjectionGenerator';
import './SQLInjectionGenerator.css';

export default function SQLInjectionGenerator() {
  useSEO({
    title: 'SQL Injection Generator - R0uty\'s Cyber Lab',
    description: 'Educational SQL injection payload generator. Learn about database vulnerabilities with tutorials and examples.',
    keywords: 'sql injection, payload generator, sqli, database security, web security, cybersecurity education'
  });

  const [selectedCategory, setSelectedCategory] = useState('UNION_BASED');
  const [selectedPayload, setSelectedPayload] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [databaseType, setDatabaseType] = useState('MySQL');
  const [showLegalWarning, setShowLegalWarning] = useState(true);

  const categories = getAllCategories();
  const currentPayloads = searchQuery
    ? searchPayloads(searchQuery)
    : getPayloadsByCategory(selectedCategory);

  const currentPayload = currentPayloads[selectedPayload] || null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showFeedback('Copied to clipboard!');
  };

  if (showLegalWarning) {
    return (
      <div className="sqli-disclaimer-page">
        <h1>SQL Injection Generator</h1>
        <div className="sqli-legal-box">
          {LEGAL_DISCLAIMER}
        </div>
        <button
          onClick={() => setShowLegalWarning(false)}
          className="sqli-accept-btn"
        >
          I Understand & Accept
        </button>
        <button
          onClick={() => window.history.back()}
          className="sqli-back-btn"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="sqli-page">
      <h1>SQL Injection Generator</h1>
      <p className="sqli-page-desc">
        Learn SQL injection techniques for authorized security testing and educational purposes.
      </p>

      {/* Database Selection */}
      <div className="sqli-section-mb">
        <label className="sqli-field-label">
          Target Database Type:
        </label>
        <select
          value={databaseType}
          onChange={(e) => setDatabaseType(e.target.value)}
          className="sqli-select"
        >
          {Object.keys(DATABASE_INFO).map((db) => (
            <option key={db} value={db}>
              {db}
            </option>
          ))}
        </select>
      </div>

      {/* Database Info Card */}
      <div className="sqli-db-card">
        <h3 className="sqli-db-card-title">{databaseType} Commands:</h3>
        <div className="sqli-db-grid">
          {Object.entries(DATABASE_INFO[databaseType]).map(([key, value]) => (
            <div key={key}>
              <strong className="sqli-db-entry-label">{key.replace(/_/g, ' ')}:</strong>
              <div className="sqli-db-entry-value">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="sqli-two-col-grid">
        {/* Left: Category & Payload Selection */}
        <div>
          <h3 className="sqli-col-heading">Injection Type</h3>

          {/* Search */}
          <input
            type="text"
            placeholder="Search payloads..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedPayload(0);
            }}
            className="sqli-search-input"
          />

          {/* Category Buttons */}
          {!searchQuery && (
            <div className="sqli-category-btns">
              {categories.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setSelectedPayload(0);
                  }}
                  className={`sqli-category-btn${selectedCategory === key ? ' sqli-category-btn--active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Payload List */}
          <div className="sqli-payload-list">
            {currentPayloads.length === 0 ? (
              <div className="sqli-payload-empty">
                No payloads found
              </div>
            ) : (
              currentPayloads.map((payload, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPayload(index)}
                  className={`sqli-payload-item${selectedPayload === index ? ' sqli-payload-item--selected' : ''}`}
                >
                  <strong>{payload.name}</strong>
                  <div className="sqli-payload-item__desc">
                    {payload.description}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Payload Preview */}
        <div>
          <h3 className="sqli-col-heading">Payload Preview</h3>

          {currentPayload ? (
            <>
              {/* Payload Code */}
              <div className="sqli-code-box">
                <div className="sqli-code-display">
                  {currentPayload.payload}
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(currentPayload.payload)}
                className="sqli-copy-btn"
              >
                <Copy01Icon size={18} />
                Copy Payload
              </button>

              {/* Explanation */}
              <div className="sqli-explanation-box">
                <h4 className="sqli-explanation-title">Explanation:</h4>
                <p className="sqli-explanation-text">
                  {currentPayload.explanation}
                </p>
              </div>
            </>
          ) : (
            <div className="sqli-empty-preview">
              Select a payload to view details
            </div>
          )}
        </div>
      </div>

      {/* Common Vulnerable Parameters */}
      <div className="sqli-section-mb">
        <h3 className="sqli-section-title">Common Vulnerable Parameters</h3>
        <div className="sqli-params-grid">
          {COMMON_VULNERABLE_PARAMETERS.map((param, index) => (
            <div key={index} className="sqli-card">
              <strong className="sqli-card-title">{param.name}</strong>
              <p className="sqli-card-text">
                {param.example}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention Tips */}
      <div className="sqli-info-section">
        <h3 className="sqli-info-section-title">Prevention Best Practices</h3>
        <ul className="sqli-info-list">
          <li>✓ Use parameterized queries/prepared statements exclusively</li>
          <li>✓ Validate and sanitize all user input on both client and server</li>
          <li>✓ Implement whitelist validation for expected input types</li>
          <li>✓ Use least privilege database accounts (read-only when possible)</li>
          <li>✓ Enable SQL error suppression in production environments</li>
          <li>✓ Implement Web Application Firewall (WAF) rules</li>
          <li>✓ Perform regular security testing and code reviews</li>
          <li>✓ Keep database software updated with latest security patches</li>
          <li>✓ Log and monitor all database queries for anomalies</li>
          <li>✓ Use ORM frameworks that escape queries by default</li>
        </ul>
      </div>

      {/* Testing Tips */}
      <div className="sqli-info-section">
        <h3 className="sqli-info-section-title">Authorized Security Testing Tips</h3>
        <ol className="sqli-info-list">
          <li>Always start with least invasive techniques (error-based before blind)</li>
          <li>Document all discovered vulnerabilities with proof-of-concept</li>
          <li>Never modify or delete production data during testing</li>
          <li>Create a testing environment backup before running stacked query tests</li>
          <li>Use tools like SQLMap for automated vulnerability scanning</li>
          <li>Report findings through responsible disclosure process</li>
          <li>Provide remediation recommendations in your security report</li>
          <li>Follow your organization's security testing procedures</li>
        </ol>
      </div>
    </div>
  );
}
