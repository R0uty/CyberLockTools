export const STORAGE_STAGE_KEY = 'flow-map-current-stage'
export const STORAGE_REVEALED_KEY = 'flow-map-revealed-stage'
export const STORAGE_TOOL_KEY = 'flow-map-selected-tool'
export const STORAGE_FEEDBACK_KEY = 'flow-map-feedback'
export const STORAGE_FLOW_KEY = 'flow-map-selected-flow'
export const STORAGE_ACTION_KEY = 'flow-map-selected-action'
export const STORAGE_OUTCOME_KEY = 'flow-map-selected-outcome'
export const STORAGE_OUTCOME_SIGNAL_KEY = 'flow-map-outcome-signal'
export const STORAGE_OUTCOME_PROFILE_KEY = 'flow-map-outcome-profile'
export const STORAGE_NOTES_KEY = 'flow-map-notes'
export const STORAGE_STAGE_EVIDENCE_KEY = 'flow-map-stage-evidence'
export const STORAGE_COMPLETED_KEY = 'flow-map-completed'
export const STORAGE_IN_PROGRESS_KEY = 'flow-map-in-progress'
export const STORAGE_STAGE_HISTORY_KEY = 'flow-map-stage-history'
export const STORAGE_DECISION_HISTORY_KEY = 'flow-map-decision-history'
export const STORAGE_TOOL_FLOW_ORIGIN_KEY = 'flow-map-tool-origin'

export const MIN_ZOOM = 0.8
export const MAX_ZOOM = 1.8
export const ZOOM_STEP = 0.15
export const DEFAULT_ZOOM = 1
export const BASE_SCENE_WIDTH = 2200
export const BASE_SCENE_HEIGHT = 1240

export const FLOW_GROUPS = [
  ['recon', 'Reconnaissance'],
  ['enumeration', 'Enumeration'],
  ['entry-point', 'Entry Points'],
  ['testing', 'Testing'],
  ['vulnerability', 'Vulnerability Validation'],
  ['exploitation', 'Exploitation & Reporting'],
  ['analysis', 'Analysis']
]

export const BACKGROUND_STARS = [
  { x: 8, y: 14, size: 2, opacity: 0.28 },
  { x: 18, y: 66, size: 2, opacity: 0.2 },
  { x: 27, y: 24, size: 3, opacity: 0.18 },
  { x: 39, y: 78, size: 2, opacity: 0.24 },
  { x: 48, y: 16, size: 2, opacity: 0.22 },
  { x: 57, y: 64, size: 3, opacity: 0.16 },
  { x: 69, y: 20, size: 2, opacity: 0.24 },
  { x: 78, y: 72, size: 2, opacity: 0.2 },
  { x: 86, y: 30, size: 3, opacity: 0.18 },
  { x: 93, y: 12, size: 2, opacity: 0.22 }
]

export const FLOWS = {
  decode: {
    label: 'Decode Flow',
    group: 'analysis',
    summary: 'Follow a suspicious value from first glance to readable output using lightweight decoders.',
    suggestedSkills: [
      { name: 'Encoding Identification', difficulty: 'beginner', reason: 'Quickly recognizing Base64, URL encoding, hex, and ROT patterns saves time during analysis.' },
      { name: 'Multi-Layer Decoding', difficulty: 'intermediate', reason: 'Some values are encoded multiple times; knowing when to chain decoders is key.' },
      { name: 'Hash vs Encoding Recognition', difficulty: 'beginner', reason: 'Avoids wasting time trying to decode values that are actually hashed and irreversible.' }
    ],
    tools: [
      { name: 'Browser DevTools', purpose: 'Inspect cookies, URL parameters, and hidden form values that may contain encoded data.' },
      { name: 'Burp Suite', purpose: 'Use the Decoder tab to try multiple encoding schemes on intercepted values quickly.' },
      { name: 'curl', purpose: 'Fetch raw responses to capture encoded values before the browser processes them.' }
    ],
    stages: ['start', 'encoded', 'decode', 'result', 'success'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'encoded', label: 'Encoded?', x: 34, y: 30 },
      { id: 'decode', label: 'Decode', x: 62, y: 30 },
      { id: 'result', label: 'Result', x: 76, y: 50 },
      { id: 'success', label: 'Success', x: 88, y: 50 }
    ],
    connections: [
      ['start', 'encoded'],
      ['encoded', 'decode'],
      ['decode', 'result'],
      ['result', 'success']
    ]
  },
  login: {
    label: 'Login Entry Flow',
    group: 'entry-point',
    summary: 'Assess a discovered login page as a possible entry point and keep the next branch obvious as responses change.',
    suggestedSkills: [
      { name: 'User Enumeration', difficulty: 'beginner', reason: 'Helps confirm whether login behavior leaks valid usernames.' },
      { name: 'Rate Limiting Bypass', difficulty: 'intermediate', reason: 'Useful when testing repeated auth attempts and lockout controls.' },
      { name: 'Business Logic Testing', difficulty: 'advanced', reason: 'Supports deeper checks around login workflow assumptions and bypass paths.' }
    ],
    tools: [
      { name: 'Browser DevTools', purpose: 'Inspect form behavior, requests, and front-end validation before deeper testing.' },
      { name: 'Burp Suite', purpose: 'Intercept and replay login requests so you can compare auth behavior carefully.' },
      { name: 'curl', purpose: 'Recreate simple auth requests outside the browser when you want cleaner response comparisons.' }
    ],
    stages: ['start', 'login-page', 'test-login', 'result', 'analyze-error', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'login-page', label: 'Login Page', x: 34, y: 30 },
      { id: 'test-login', label: 'Test Login', x: 58, y: 30 },
      { id: 'result', label: 'Result', x: 74, y: 50 },
      { id: 'analyze-error', label: 'Analyze Error', x: 84, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 58 }
    ],
    connections: [
      ['start', 'login-page'],
      ['login-page', 'test-login'],
      ['test-login', 'result'],
      ['result', 'analyze-error'],
      ['analyze-error', 'next-step']
    ]
  },
  discovery: {
    label: 'Discovery Flow',
    group: 'recon',
    summary: 'Start from a newly found page or endpoint, enumerate hidden content, and branch into follow-up investigation with common recon tooling.',
    suggestedSkills: [
      { name: 'Port Scanning', difficulty: 'beginner', reason: 'Establishes exposed services before path/content probing.' },
      { name: 'Subdomain Enumeration', difficulty: 'intermediate', reason: 'Expands reachable attack surface linked to the discovered target.' },
      { name: 'Directory Bruteforcing', difficulty: 'beginner', reason: 'Directly supports hidden route and file discovery during recon.' }
    ],
    tools: [
      { name: 'Nmap', purpose: 'Find open ports, services, and basic version details before you start guessing paths.' },
      { name: 'ffuf', purpose: 'Run fast wordlist-based discovery for directories, files, vhosts, and parameter fuzzing.' },
      { name: 'dirb', purpose: 'Quickly brute-force common directories and filenames when you want a simpler pass.' },
      { name: 'curl', purpose: 'Inspect status codes, headers, redirects, and raw responses from anything you discover.' }
    ],
    stages: ['start', 'web-page-found', 'discovery', 'enumerate', 'result', 'investigate', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'web-page-found', label: 'Web Page Found', x: 30, y: 30 },
      { id: 'discovery', label: 'Discovery', x: 50, y: 26 },
      { id: 'enumerate', label: 'Enumerate', x: 68, y: 32 },
      { id: 'result', label: 'Result', x: 78, y: 50 },
      { id: 'investigate', label: 'Investigate', x: 86, y: 26 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'web-page-found'],
      ['web-page-found', 'discovery'],
      ['discovery', 'enumerate'],
      ['enumerate', 'result'],
      ['result', 'investigate'],
      ['investigate', 'next-step']
    ]
  },
  enumeration: {
    label: 'Enumeration Flow',
    group: 'enumeration',
    summary: 'Identify exposed services, enumerate them with the right protocol-aware tools, and decide which finding becomes the next entry point.',
    suggestedSkills: [
      { name: 'Banner Grabbing', difficulty: 'beginner', reason: 'Improves service and version identification quality early.' },
      { name: 'JavaScript Endpoint Analysis', difficulty: 'intermediate', reason: 'Adds hidden endpoint and token discovery to enumeration output.' },
      { name: 'API Schema Discovery', difficulty: 'intermediate', reason: 'Useful when enumeration reveals API-capable services.' }
    ],
    tools: [
      { name: 'Nmap', purpose: 'Identify exposed ports, service versions, and useful NSE script output before deeper enumeration.' },
      { name: 'enum4linux-ng', purpose: 'Pull users, shares, and policy details from SMB-heavy targets.' },
      { name: 'smbclient', purpose: 'Browse accessible SMB shares and validate whether files or directories can be reached directly.' },
      { name: 'snmpwalk', purpose: 'Dump readable SNMP data when the target exposes community strings or weak SNMP access.' },
      { name: 'ldapsearch', purpose: 'Query LDAP-backed services for users, groups, and directory structure.' }
    ],
    stages: ['start', 'service-found', 'identify-service', 'enumerate-service', 'result', 'inspect-findings', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'service-found', label: 'Service Found', x: 28, y: 30 },
      { id: 'identify-service', label: 'Identify Service', x: 48, y: 26 },
      { id: 'enumerate-service', label: 'Enumerate Service', x: 68, y: 30 },
      { id: 'result', label: 'Result', x: 78, y: 50 },
      { id: 'inspect-findings', label: 'Inspect Findings', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'service-found'],
      ['service-found', 'identify-service'],
      ['identify-service', 'enumerate-service'],
      ['enumerate-service', 'result'],
      ['result', 'inspect-findings'],
      ['inspect-findings', 'next-step']
    ]
  },
  input: {
    label: 'Input Testing Flow',
    group: 'testing',
    summary: 'Test how a field handles normal and unusual values, compare responses, and decide which behavior is worth deeper follow-up.',
    suggestedSkills: [
      { name: 'XSS Detection', difficulty: 'beginner', reason: 'Natural follow-up when reflected input behavior changes.' },
      { name: 'SQL Injection Testing', difficulty: 'intermediate', reason: 'Applies when input handling indicates backend query interaction.' },
      { name: 'SSTI Detection', difficulty: 'intermediate', reason: 'Useful for templated render paths reacting to user input.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay parameter changes quickly and compare how the target handles each input.' },
      { name: 'Browser DevTools', purpose: 'Watch DOM, console, and network changes while the page processes your input.' },
      { name: 'curl', purpose: 'Send controlled requests with isolated values when you want cleaner server-side comparisons.' }
    ],
    stages: ['start', 'input-field-found', 'test-input', 'response-change', 'analyze-behavior', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'input-field-found', label: 'Input Field Found', x: 30, y: 30 },
      { id: 'test-input', label: 'Test Input', x: 54, y: 28 },
      { id: 'response-change', label: 'Response Change', x: 72, y: 46 },
      { id: 'analyze-behavior', label: 'Analyze Behavior', x: 84, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'input-field-found'],
      ['input-field-found', 'test-input'],
      ['test-input', 'response-change'],
      ['response-change', 'analyze-behavior'],
      ['analyze-behavior', 'next-step']
    ]
  },
  api: {
    label: 'API Testing Flow',
    group: 'testing',
    summary: 'Assess an API endpoint from first discovery to risk classification by validating auth, input handling, and response behavior.',
    suggestedSkills: [
      { name: 'IDOR Testing', difficulty: 'intermediate', reason: 'Core API object-level authorization check during endpoint validation.' },
      { name: 'Mass Assignment Testing', difficulty: 'intermediate', reason: 'Useful when request bodies contain mutable user-controlled fields.' },
      { name: 'Broken Function Level Auth', difficulty: 'intermediate', reason: 'Supports role-based endpoint authorization validation.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay API requests with controlled changes and compare status, body, and headers quickly.' },
      { name: 'Postman', purpose: 'Build repeatable request collections for endpoint, auth, and schema testing.' },
      { name: 'curl', purpose: 'Run minimal reproducible API requests from the terminal for clean before/after comparisons.' }
    ],
    stages: ['start', 'api-endpoint-found', 'inspect-spec', 'test-auth', 'response-review', 'classify-risk', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'api-endpoint-found', label: 'API Endpoint Found', x: 28, y: 30 },
      { id: 'inspect-spec', label: 'Inspect Spec', x: 48, y: 26 },
      { id: 'test-auth', label: 'Test Auth', x: 66, y: 30 },
      { id: 'response-review', label: 'Response Review', x: 78, y: 50 },
      { id: 'classify-risk', label: 'Classify Risk', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'api-endpoint-found'],
      ['api-endpoint-found', 'inspect-spec'],
      ['inspect-spec', 'test-auth'],
      ['test-auth', 'response-review'],
      ['response-review', 'classify-risk'],
      ['classify-risk', 'next-step']
    ]
  },
  response: {
    label: 'Response Analysis Flow',
    group: 'analysis',
    summary: 'Inspect response data, identify useful values, and decide what to investigate next.',
    suggestedSkills: [
      { name: 'Header Analysis', difficulty: 'beginner', reason: 'Reveals security headers, caching policy, and server fingerprints in every response.' },
      { name: 'Token Identification', difficulty: 'intermediate', reason: 'Helps classify embedded tokens, session IDs, and encoded values for follow-up testing.' },
      { name: 'Data Leakage Assessment', difficulty: 'intermediate', reason: 'Spots excessive data exposure, debug fields, and internal references in response bodies.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay requests and compare response differences field by field.' },
      { name: 'Browser DevTools', purpose: 'Inspect response headers, body, and timing in the Network tab.' },
      { name: 'curl', purpose: 'Fetch raw responses with full headers for clean comparison.' }
    ],
    stages: ['start', 'response-data-found', 'analyze-data', 'interesting-data', 'investigate-value', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'response-data-found', label: 'Response Data Found', x: 28, y: 30 },
      { id: 'analyze-data', label: 'Analyze Data', x: 50, y: 26 },
      { id: 'interesting-data', label: 'Interesting Data', x: 70, y: 42 },
      { id: 'investigate-value', label: 'Investigate Value', x: 84, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'response-data-found'],
      ['response-data-found', 'analyze-data'],
      ['analyze-data', 'interesting-data'],
      ['interesting-data', 'investigate-value'],
      ['investigate-value', 'next-step']
    ]
  },
  request: {
    label: 'Request Tampering Flow',
    group: 'vulnerability',
    summary: 'Modify observed requests, compare server reactions, and decide whether the behavior points to a real vulnerability path.',
    suggestedSkills: [
      { name: 'HTTP Request Smuggling', difficulty: 'advanced', reason: 'Advanced option when request parsing behavior looks inconsistent.' },
      { name: 'Open Redirect Testing', difficulty: 'beginner', reason: 'Fast follow-up for manipulated redirect-related parameters.' },
      { name: 'Parameter Discovery', difficulty: 'intermediate', reason: 'Finds hidden request inputs worth tampering with next.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Modify one request component at a time and compare responses with minimal noise.' },
      { name: 'curl', purpose: 'Reproduce and script request changes once you know which fields matter.' },
      { name: 'Browser DevTools', purpose: 'Inspect the original request shape, tokens, and front-end hints before tampering.' }
    ],
    stages: ['start', 'http-request-observed', 'tamper-request', 'response-changed', 'analyze-impact', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'http-request-observed', label: 'HTTP Request Observed', x: 28, y: 30 },
      { id: 'tamper-request', label: 'Tamper Request', x: 52, y: 28 },
      { id: 'response-changed', label: 'Response Changed?', x: 72, y: 46 },
      { id: 'analyze-impact', label: 'Analyze Impact', x: 84, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'http-request-observed'],
      ['http-request-observed', 'tamper-request'],
      ['tamper-request', 'response-changed'],
      ['response-changed', 'analyze-impact'],
      ['analyze-impact', 'next-step']
    ]
  },
  authz: {
    label: 'Authorization Testing Flow',
    group: 'vulnerability',
    summary: 'Validate whether role and ownership checks are enforced by replaying privileged actions with lower-privileged contexts.',
    suggestedSkills: [
      { name: 'IDOR Testing', difficulty: 'intermediate', reason: 'Primary ownership-boundary validation method for object access.' },
      { name: 'Privilege Escalation', difficulty: 'advanced', reason: 'Helps reason about role boundary failures and impact scope.' },
      { name: 'Broken Function Level Auth', difficulty: 'intermediate', reason: 'Maps directly to missing endpoint-level authorization checks.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Swap tokens, IDs, and role-linked fields while preserving request shape.' },
      { name: 'Browser DevTools', purpose: 'Track session state, role hints, and front-end restrictions that may not exist server-side.' },
      { name: 'curl', purpose: 'Reproduce authorization checks as minimal requests for clean documentation.' }
    ],
    stages: ['start', 'privileged-action-found', 'baseline-request', 'role-switch-test', 'access-result', 'confirm-impact', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'privileged-action-found', label: 'Privileged Action Found', x: 28, y: 30 },
      { id: 'baseline-request', label: 'Baseline Request', x: 48, y: 26 },
      { id: 'role-switch-test', label: 'Role Switch Test', x: 68, y: 30 },
      { id: 'access-result', label: 'Access Result', x: 78, y: 50 },
      { id: 'confirm-impact', label: 'Confirm Impact', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'privileged-action-found'],
      ['privileged-action-found', 'baseline-request'],
      ['baseline-request', 'role-switch-test'],
      ['role-switch-test', 'access-result'],
      ['access-result', 'confirm-impact'],
      ['confirm-impact', 'next-step']
    ]
  },
  exploitation: {
    label: 'Controlled Exploitation Flow',
    group: 'exploitation',
    summary: 'Move from a confirmed finding to a controlled proof-of-impact in an authorized environment without losing containment or evidence.',
    suggestedSkills: [
      { name: 'PoC Writing', difficulty: 'intermediate', reason: 'Critical for proving impact with clear, reproducible evidence.' },
      { name: 'Vulnerability Severity Rating', difficulty: 'beginner', reason: 'Helps classify impact accurately after controlled validation.' },
      { name: 'Remediation Advice', difficulty: 'beginner', reason: 'Connects confirmed impact to actionable developer fixes.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Replay the exact proof request in a controlled way and confirm only the intended impact.' },
      { name: 'curl', purpose: 'Capture a minimal reproducible request that demonstrates the issue cleanly for verification.' },
      { name: 'Browser DevTools', purpose: 'Observe application-side effects, responses, and state changes while you validate impact.' }
    ],
    stages: ['start', 'confirmed-finding', 'prepare-validation', 'execute-safely', 'impact-observed', 'document-impact', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'confirmed-finding', label: 'Confirmed Finding', x: 28, y: 30 },
      { id: 'prepare-validation', label: 'Prepare Validation', x: 48, y: 26 },
      { id: 'execute-safely', label: 'Execute Safely', x: 68, y: 30 },
      { id: 'impact-observed', label: 'Impact Observed', x: 78, y: 50 },
      { id: 'document-impact', label: 'Document Impact', x: 88, y: 28 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 62 }
    ],
    connections: [
      ['start', 'confirmed-finding'],
      ['confirmed-finding', 'prepare-validation'],
      ['prepare-validation', 'execute-safely'],
      ['execute-safely', 'impact-observed'],
      ['impact-observed', 'document-impact'],
      ['document-impact', 'next-step']
    ]
  },
  'info-disclosure': {
    label: 'Information Disclosure Flow',
    group: 'recon',
    summary: 'Find and assess leaked information such as source comments, debug endpoints, exposed config files, error traces, and version headers.',
    suggestedSkills: [
      { name: 'Source Code Review', difficulty: 'beginner', reason: 'Catches developer comments, hardcoded secrets, and logic hints in client-side code.' },
      { name: 'Git Repository Mining', difficulty: 'intermediate', reason: 'Exposed .git directories can leak full source history, credentials, and internal paths.' },
      { name: 'Error-Based Information Gathering', difficulty: 'beginner', reason: 'Stack traces and verbose errors reveal frameworks, file paths, and database details.' }
    ],
    tools: [
      { name: 'Browser DevTools', purpose: 'Inspect page source, console output, and network responses for leaked data.' },
      { name: 'curl', purpose: 'Probe common sensitive paths like /.git/HEAD, /.env, /debug, and compare responses.' },
      { name: 'ffuf', purpose: 'Fuzz for backup files, config endpoints, and debug routes using targeted wordlists.' }
    ],
    stages: ['start', 'source-found', 'inspect-source', 'sensitive-data', 'assess-exposure', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'source-found', label: 'Source Found', x: 28, y: 30 },
      { id: 'inspect-source', label: 'Inspect Source', x: 48, y: 26 },
      { id: 'sensitive-data', label: 'Sensitive Data?', x: 68, y: 40 },
      { id: 'assess-exposure', label: 'Assess Exposure', x: 82, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'source-found'],
      ['source-found', 'inspect-source'],
      ['inspect-source', 'sensitive-data'],
      ['sensitive-data', 'assess-exposure'],
      ['assess-exposure', 'next-step']
    ]
  },
  session: {
    label: 'Session Testing Flow',
    group: 'testing',
    summary: 'Evaluate session management by inspecting cookie flags, testing fixation and expiry, and validating CSRF protections.',
    suggestedSkills: [
      { name: 'Cookie Security Analysis', difficulty: 'beginner', reason: 'Checks Secure, HttpOnly, SameSite flags and cookie scope for session tokens.' },
      { name: 'CSRF Testing', difficulty: 'intermediate', reason: 'Validates whether state-changing actions enforce anti-forgery tokens correctly.' },
      { name: 'Session Fixation', difficulty: 'intermediate', reason: 'Tests whether the application rotates session IDs after authentication.' }
    ],
    tools: [
      { name: 'Browser DevTools', purpose: 'Inspect cookie attributes, storage, and session behavior across tabs and domains.' },
      { name: 'Burp Suite Repeater', purpose: 'Replay requests with swapped or expired session tokens to test enforcement.' },
      { name: 'curl', purpose: 'Send requests with crafted cookie headers to verify server-side session handling.' }
    ],
    stages: ['start', 'session-captured', 'inspect-session', 'test-session', 'session-result', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'session-captured', label: 'Session Captured', x: 28, y: 30 },
      { id: 'inspect-session', label: 'Inspect Session', x: 48, y: 26 },
      { id: 'test-session', label: 'Test Session', x: 68, y: 34 },
      { id: 'session-result', label: 'Session Result', x: 80, y: 50 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'session-captured'],
      ['session-captured', 'inspect-session'],
      ['inspect-session', 'test-session'],
      ['test-session', 'session-result'],
      ['session-result', 'next-step']
    ]
  },
  upload: {
    label: 'File Upload Testing Flow',
    group: 'entry-point',
    summary: 'Test file upload endpoints for extension bypass, MIME confusion, path traversal in filenames, oversized payloads, and content-based execution.',
    suggestedSkills: [
      { name: 'File Type Bypass', difficulty: 'intermediate', reason: 'Tests whether the server relies on extension or Content-Type alone for filtering.' },
      { name: 'Webshell Detection', difficulty: 'intermediate', reason: 'Validates whether uploaded code can be executed through the web server.' },
      { name: 'Content-Type Manipulation', difficulty: 'beginner', reason: 'Changing MIME headers can bypass client-side and weak server-side checks.' }
    ],
    tools: [
      { name: 'Burp Suite Repeater', purpose: 'Modify filename, Content-Type, and body in upload requests to test server filtering.' },
      { name: 'curl', purpose: 'Script upload attempts with controlled filenames and MIME types for clean comparisons.' },
      { name: 'Browser DevTools', purpose: 'Inspect client-side upload validation and observe where uploaded files are served.' }
    ],
    stages: ['start', 'upload-found', 'test-upload', 'upload-result', 'analyze-upload', 'next-step'],
    nodes: [
      { id: 'start', label: 'Start', x: 50, y: 50 },
      { id: 'upload-found', label: 'Upload Found', x: 28, y: 30 },
      { id: 'test-upload', label: 'Test Upload', x: 48, y: 26 },
      { id: 'upload-result', label: 'Upload Result', x: 68, y: 40 },
      { id: 'analyze-upload', label: 'Analyze Upload', x: 82, y: 24 },
      { id: 'next-step', label: 'Next Step', x: 90, y: 60 }
    ],
    connections: [
      ['start', 'upload-found'],
      ['upload-found', 'test-upload'],
      ['test-upload', 'upload-result'],
      ['upload-result', 'analyze-upload'],
      ['analyze-upload', 'next-step']
    ]
  }
}

export const ACTIVE_FLOW_GROUP_KEYS = new Set(FLOW_GROUPS.map(([groupKey]) => groupKey))

export const FINDING_QUICK_STARTS = [
  {
    id: 'finding-token',
    label: 'I found a token/value',
    description: 'Jump into response analysis to classify and trace suspicious values.',
    category: 'analysis',
    flowKey: 'response',
    stageId: 'response-data-found',
    confidence: 'high'
  },
  {
    id: 'finding-login',
    label: 'I found a login page',
    description: 'Start directly at login testing for auth behavior checks.',
    category: 'authentication',
    flowKey: 'login',
    stageId: 'login-page',
    confidence: 'high'
  },
  {
    id: 'finding-403',
    label: 'I got 403 / access denied',
    description: 'Branch into authorization and request tampering validation.',
    category: 'authorization',
    flowKey: 'authz',
    stageId: 'privileged-action-found',
    confidence: 'medium'
  },
  {
    id: 'finding-api',
    label: 'I saw an API endpoint',
    description: 'Start from API inspection and auth behavior checks.',
    category: 'enumeration',
    flowKey: 'api',
    stageId: 'api-endpoint-found',
    confidence: 'medium'
  },
  {
    id: 'finding-upload',
    label: 'I found file upload',
    description: 'Jump into upload validation and controlled exploitation.',
    category: 'vulnerability',
    flowKey: 'upload',
    stageId: 'upload-found',
    confidence: 'high'
  }
]

export const FLOW_OUTCOME_PHRASE_STARTS = [
  {
    id: 'outcome-token-extracted',
    phrase: 'token found in response',
    description: 'Investigate token semantics, replay behavior, and trust boundaries.',
    flowKey: 'response',
    stageId: 'interesting-data',
    confidence: 'high',
    category: 'analysis'
  },
  {
    id: 'outcome-authz-denied',
    phrase: '403 after role change',
    description: 'Validate access-control logic and ownership boundaries.',
    flowKey: 'authz',
    stageId: 'access-result',
    confidence: 'medium',
    category: 'authorization'
  },
  {
    id: 'outcome-upload-anomaly',
    phrase: 'upload accepted unexpected file type',
    description: 'Test extension and MIME handling for execution risk.',
    flowKey: 'upload',
    stageId: 'upload-result',
    confidence: 'high',
    category: 'vulnerability'
  },
  {
    id: 'outcome-input-anomaly',
    phrase: 'input changed server behavior',
    description: 'Branch into deeper input-validation and vulnerability analysis.',
    flowKey: 'input',
    stageId: 'response-change',
    confidence: 'medium',
    category: 'testing'
  },
  {
    id: 'outcome-session-weakness',
    phrase: 'session cookie missing secure flags',
    description: 'Assess session fixation, expiry, and cross-site protections.',
    flowKey: 'session',
    stageId: 'inspect-session',
    confidence: 'high',
    category: 'testing'
  }
]

export const VULNERABILITY_TYPE_STARTS = [
  {
    id: 'vuln-sqli',
    type: 'SQL injection',
    description: 'Test user input and backend query behavior for SQLi indicators.',
    flowKey: 'input',
    stageId: 'input-field-found',
    confidence: 'medium',
    category: 'vulnerability'
  },
  {
    id: 'vuln-broken-access-control',
    type: 'Broken access control',
    description: 'Validate role and object authorization enforcement paths.',
    flowKey: 'authz',
    stageId: 'privileged-action-found',
    confidence: 'high',
    category: 'authorization'
  },
  {
    id: 'vuln-info-disclosure',
    type: 'Information disclosure',
    description: 'Investigate leaked source, configs, and verbose error artifacts.',
    flowKey: 'info-disclosure',
    stageId: 'source-found',
    confidence: 'high',
    category: 'recon'
  },
  {
    id: 'vuln-insecure-upload',
    type: 'Insecure file upload',
    description: 'Check upload filters and server-side execution controls.',
    flowKey: 'upload',
    stageId: 'upload-found',
    confidence: 'high',
    category: 'vulnerability'
  },
  {
    id: 'vuln-session-management',
    type: 'Session management weakness',
    description: 'Assess cookie attributes, fixation, and expiration enforcement.',
    flowKey: 'session',
    stageId: 'session-captured',
    confidence: 'medium',
    category: 'testing'
  },
  {
    id: 'vuln-ssrf',
    type: 'SSRF behavior',
    description: 'Inspect request tampering paths for server-side fetch indicators.',
    flowKey: 'request',
    stageId: 'http-request-observed',
    confidence: 'low',
    category: 'vulnerability'
  }
]
