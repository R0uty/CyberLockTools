import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Copy01Icon } from 'hugeicons-react';
import {
  getAllCategories,
  getPayloadsByCategory,
  searchPayloads,
  GRAPHQL_ENDPOINTS,
  GRAPHQL_DEFENSE_BYPASS,
  LEGAL_DISCLAIMER
} from '../utils/graphqlInjectionGenerator';
import './GraphQLInjectionGenerator.css';

export default function GraphQLInjectionGenerator() {
  useSEO(
    'GraphQL Injection Generator - R0uty\'s Cyber Lab',
    'Educational GraphQL injection and introspection payload generator. Learn about GraphQL API vulnerabilities with tutorials and examples.'
  );

  const [selectedCategory, setSelectedCategory] = useState('INTROSPECTION');
  const [selectedPayload, setSelectedPayload] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [targetEndpoint, setTargetEndpoint] = useState('/graphql');
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
      <div className="graphql-disclaimer-page">
        <h1>GraphQL Injection Generator</h1>
        <div className="graphql-legal-box">
          {LEGAL_DISCLAIMER}
        </div>
        <button
          onClick={() => setShowLegalWarning(false)}
          className="graphql-accept-btn"
        >
          I Understand & Accept
        </button>
        <button
          onClick={() => window.history.back()}
          className="graphql-back-btn"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="graphql-page">
      <h1>GraphQL Injection Generator</h1>
      <p className="graphql-page-desc">
        Learn GraphQL security vulnerabilities for authorized penetration testing and educational research.
      </p>

      {/* Target Endpoint Selection */}
      <div className="graphql-section-mb">
        <label className="graphql-field-label">
          Common GraphQL Endpoints:
        </label>
        <select
          value={targetEndpoint}
          onChange={(e) => setTargetEndpoint(e.target.value)}
          className="graphql-select"
        >
          {GRAPHQL_ENDPOINTS.map((endpoint) => (
            <option key={endpoint.path} value={endpoint.path}>
              {endpoint.name} ({endpoint.path})
            </option>
          ))}
        </select>
      </div>

      {/* Two Column Layout */}
      <div className="graphql-two-col-grid">
        {/* Left: Category & Payload Selection */}
        <div>
          <h3 className="graphql-col-heading">Attack Type</h3>

          {/* Search */}
          <input
            type="text"
            placeholder="Search payloads..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedPayload(0);
            }}
            className="graphql-search-input"
          />

          {/* Category Buttons */}
          {!searchQuery && (
            <div className="graphql-category-btns">
              {categories.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setSelectedPayload(0);
                  }}
                  className={`graphql-category-btn${selectedCategory === key ? ' graphql-category-btn--active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Payload List */}
          <div className="graphql-payload-list">
            {currentPayloads.length === 0 ? (
              <div className="graphql-payload-empty">
                No payloads found
              </div>
            ) : (
              currentPayloads.map((payload, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPayload(index)}
                  className={`graphql-payload-item${selectedPayload === index ? ' graphql-payload-item--selected' : ''}`}
                >
                  <strong>{payload.name}</strong>
                  <div className="graphql-payload-item__desc">
                    {payload.description}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Payload Preview */}
        <div>
          <h3 className="graphql-col-heading">Payload Preview</h3>

          {currentPayload ? (
            <>
              {/* Payload Code */}
              <div className="graphql-code-box">
                <div className="graphql-code-display">
                  {currentPayload.payload}
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(currentPayload.payload)}
                className="graphql-copy-btn"
              >
                <Copy01Icon size={18} />
                Copy Payload
              </button>

              {/* Explanation */}
              <div className="graphql-explanation-box">
                <h4 className="graphql-explanation-title">Explanation:</h4>
                <p className="graphql-explanation-text">
                  {currentPayload.explanation}
                </p>
              </div>
            </>
          ) : (
            <div className="graphql-empty-preview">
              Select a payload to view details
            </div>
          )}
        </div>
      </div>

      {/* Defense Bypass Techniques */}
      <div className="graphql-section-mb">
        <h3 className="graphql-section-title">Common Defense Bypass Techniques</h3>
        <div className="graphql-bypass-grid">
          {GRAPHQL_DEFENSE_BYPASS.map((defense, index) => (
            <div key={index} className="graphql-card">
              <strong className="graphql-card-title">Defense: {defense.technique}</strong>
              <p className="graphql-card-text">
                <em>Bypass:</em> {defense.bypass}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="graphql-info-section">
        <h3 className="graphql-info-section-title">Security Best Practices</h3>
        <ul className="graphql-info-list">
          <li>✓ Disable introspection queries in production environments</li>
          <li>✓ Implement proper authentication and authorization checks on all resolvers</li>
          <li>✓ Set query complexity limits and enforce depth restrictions</li>
          <li>✓ Implement rate limiting per user, IP, and endpoint</li>
          <li>✓ Validate and sanitize all input arguments and variables</li>
          <li>✓ Use field-level permissions for sensitive data access</li>
          <li>✓ Implement query timeout to prevent DoS attacks</li>
          <li>✓ Log all query attempts, especially introspection and failed auth</li>
          <li>✓ Use WhiteList for allowed queries in high-security environments</li>
          <li>✓ Monitor for unusual query patterns and resource consumption</li>
          <li>✓ Keep GraphQL libraries and dependencies updated</li>
          <li>✓ Conduct regular security audits and penetration testing</li>
        </ul>
      </div>

      {/* Testing Methodology */}
      <div className="graphql-info-section">
        <h3 className="graphql-info-section-title">Authorized GraphQL Security Testing Methodology</h3>
        <ol className="graphql-info-list">
          <li><strong>Reconnaissance:</strong> Identify GraphQL endpoints and enable introspection if possible</li>
          <li><strong>Schema Enumeration:</strong> Map all types, queries, mutations, and subscriptions</li>
          <li><strong>Authentication Analysis:</strong> Test for auth bypass in queries and mutations</li>
          <li><strong>Authorization Testing:</strong> Attempt accessing resources you shouldn't have access to</li>
          <li><strong>Input Validation:</strong> Test fuzzing on all input fields and arguments</li>
          <li><strong>DoS Testing:</strong> Test query complexity, batching, and recursion limits</li>
          <li><strong>Business Logic:</strong> Test mutations for improper privilege escalation</li>
          <li><strong>Data Exposure:</strong> Look for sensitive data in query results or error messages</li>
          <li><strong>Documentation:</strong> Record all findings with proof of concept</li>
          <li><strong>Disclosure:</strong> Report through responsible disclosure channel</li>
        </ol>
      </div>
    </div>
  );
}
