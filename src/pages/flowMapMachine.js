function withFollowUpFlows(transition, followUpFlows = []) {
  return {
    ...transition,
    followUpFlows,
  }
}

const OUTCOME_SIGNAL_DEFINITIONS = {
  'decode.result': {
    readable: { confidence: 'high', severity: 'low' },
    'still-encoded': { confidence: 'medium', severity: 'low' },
    default: { confidence: 'low', severity: 'low' }
  },
  'login.result': {
    'error-message': { confidence: 'medium', severity: 'medium' },
    'login-success': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'discovery.result': {
    'found-endpoint': { confidence: 'high', severity: 'medium' },
    'got-403': { confidence: 'medium', severity: 'medium' },
    default: { confidence: 'low', severity: 'low' }
  },
  'enumeration.result': {
    'found-users': { confidence: 'medium', severity: 'medium' },
    'found-share': { confidence: 'medium', severity: 'medium' },
    'found-config': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'input.result': {
    'page-changed': { confidence: 'medium', severity: 'medium' },
    'error-shown': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'api.result': {
    'auth-bypass-signals': { confidence: 'high', severity: 'high' },
    'schema-leak': { confidence: 'medium', severity: 'medium' },
    default: { confidence: 'low', severity: 'low' }
  },
  'response.result': {
    'found-token': { confidence: 'high', severity: 'high' },
    'found-encoded-value': { confidence: 'medium', severity: 'medium' },
    default: { confidence: 'low', severity: 'low' }
  },
  'request.result': {
    'different-data-returned': { confidence: 'high', severity: 'high' },
    'error-message': { confidence: 'medium', severity: 'medium' },
    default: { confidence: 'low', severity: 'low' }
  },
  'authz.result': {
    'unauthorized-access': { confidence: 'high', severity: 'critical' },
    'partial-bypass': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'exploitation.result': {
    'confirmed-impact': { confidence: 'high', severity: 'critical' },
    'partial-impact': { confidence: 'medium', severity: 'high' },
    default: { confidence: 'medium', severity: 'medium' }
  },
  'info-disclosure.result': {
    'found-secrets': { confidence: 'high', severity: 'high' },
    'found-source': { confidence: 'medium', severity: 'medium' },
    default: { confidence: 'low', severity: 'low' }
  },
  'session.result': {
    'fixation-possible': { confidence: 'high', severity: 'high' },
    'missing-flags': { confidence: 'medium', severity: 'medium' },
    'csrf-missing': { confidence: 'high', severity: 'high' },
    default: { confidence: 'medium', severity: 'low' }
  },
  'upload.result': {
    'file-executed': { confidence: 'high', severity: 'critical' },
    'filter-bypassed': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'jwt.result': {
    'token-forged': { confidence: 'high', severity: 'critical' },
    'partial-bypass': { confidence: 'medium', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'xxe.result': {
    'file-read': { confidence: 'high', severity: 'critical' },
    'oob-confirmed': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'ssrf.result': {
    'metadata-read': { confidence: 'high', severity: 'critical' },
    'internal-reached': { confidence: 'high', severity: 'high' },
    'oob-confirmed': { confidence: 'medium', severity: 'medium' },
    default: { confidence: 'low', severity: 'low' }
  },
  'cors.result': {
    'credentialed-leak': { confidence: 'high', severity: 'critical' },
    'reflected-origin': { confidence: 'high', severity: 'high' },
    'null-origin': { confidence: 'medium', severity: 'medium' },
    default: { confidence: 'low', severity: 'low' }
  },
  'oauth.result': {
    'state-bypass': { confidence: 'high', severity: 'high' },
    'redirect-uri-bypass': { confidence: 'high', severity: 'critical' },
    'code-reuse': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'privesc.result': {
    'vertical-escalation': { confidence: 'high', severity: 'critical' },
    'horizontal-escalation': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'crypto.result': {
    'plaintext-recovered': { confidence: 'high', severity: 'high' },
    'algorithm-identified': { confidence: 'medium', severity: 'low' },
    default: { confidence: 'low', severity: 'low' }
  },
  'race.result': {
    'logic-flaw-confirmed': { confidence: 'high', severity: 'high' },
    'inconsistent-outcome': { confidence: 'medium', severity: 'medium' },
    default: { confidence: 'low', severity: 'low' }
  },
  'xss.result': {
    'script-executed': { confidence: 'high', severity: 'critical' },
    'filter-bypassed': { confidence: 'high', severity: 'high' },
    'dom-sink-found': { confidence: 'medium', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'csrf.result': {
    'poc-succeeded': { confidence: 'high', severity: 'high' },
    'token-bypass': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'deserialize.result': {
    'rce-confirmed': { confidence: 'high', severity: 'critical' },
    'object-injected': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  },
  'ctf-stego.result': {
    'flag-found': { confidence: 'high', severity: 'medium' },
    'hidden-data-extracted': { confidence: 'medium', severity: 'medium' },
    default: { confidence: 'low', severity: 'low' }
  },
  'ctf-web.result': {
    'flag-found': { confidence: 'high', severity: 'medium' },
    'chain-confirmed': { confidence: 'high', severity: 'high' },
    default: { confidence: 'low', severity: 'low' }
  }
}

const GENERIC_EVIDENCE_CHECKLIST = [
  'Capture the exact request and response pair that produced this behavior.',
  'Record the affected user role, tenant, or ownership context.',
  'Confirm the behavior is reproducible at least twice.'
]

const OUTCOME_PROFILE_DEFINITIONS = {
  'decode.result': {
    readable: {
      confidence: 'high',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'response', reason: 'Use decoded output to inspect surrounding response data.' },
        { flowKey: 'session', reason: 'Validate token/session handling if decoded value looks auth-related.' }
      ],
      evidenceChecklist: [
        'Save encoded input and decoded output side by side.',
        'Show why the decoded content is meaningful (token, URL, claim, or identifier).',
        'Note decoder/tool used to avoid ambiguity.'
      ],
      reportingHint: 'Include both encoded and decoded values to keep the report reproducible.'
    },
    default: {
      confidence: 'medium',
      severity: 'low',
      recommendedNextFlows: [{ flowKey: 'decode', reason: 'Try alternate decoding strategy or layered decoding.' }],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document failed decoding attempts and why they were inconclusive.'
    }
  },
  'login.result': {
    'login-success': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'authz', reason: 'Test role and ownership boundaries after successful login.' },
        { flowKey: 'session', reason: 'Validate session rotation and token lifecycle after auth.' }
      ],
      evidenceChecklist: [
        'Capture baseline login request and successful response evidence.',
        'Show role/privilege context after login succeeds.',
        'Verify whether success is repeatable and scope-limited.'
      ],
      reportingHint: 'Clearly distinguish expected login success from weak-authentication indicators.'
    },
    'error-message': {
      confidence: 'medium',
      severity: 'medium',
      recommendedNextFlows: [{ flowKey: 'input', reason: 'Analyze input handling around the login boundary.' }],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Keep exact error string and request delta to avoid false positives.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [{ flowKey: 'login', reason: 'Broaden login-path testing before escalation.' }],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Mark this as inconclusive and list attempted login variations.'
    }
  },
  'discovery.result': {
    'found-endpoint': {
      confidence: 'high',
      severity: 'medium',
      recommendedNextFlows: [
        { flowKey: 'request', reason: 'Tamper with endpoint requests to validate trust boundaries.' },
        { flowKey: 'authz', reason: 'Check access control around the discovered endpoint.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Include endpoint path, method, and response status in baseline evidence.'
    },
    default: {
      confidence: 'medium',
      severity: 'low',
      recommendedNextFlows: [{ flowKey: 'discovery', reason: 'Expand route/content discovery breadth.' }],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Report discovery signal quality and list paths tested.'
    }
  },
  'enumeration.result': {
    default: {
      confidence: 'medium',
      severity: 'medium',
      recommendedNextFlows: [{ flowKey: 'request', reason: 'Validate whether enumerated assets are trusted unsafely.' }],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Tie each enumerated finding to a concrete follow-up validation step.'
    }
  },
  'input.result': {
    'error-shown': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'request', reason: 'Confirm backend behavior by replaying controlled payloads.' },
        { flowKey: 'exploitation', reason: 'Validate impact safely if behavior indicates exploitable condition.' }
      ],
      evidenceChecklist: [
        'Capture input payload and exact server or UI error output.',
        'Verify behavior with minimally changed payload variants.',
        'Record whether behavior differs by role or endpoint.'
      ],
      reportingHint: 'Show payload-to-response linkage and avoid claiming impact until validated.'
    },
    default: {
      confidence: 'medium',
      severity: 'medium',
      recommendedNextFlows: [{ flowKey: 'input', reason: 'Continue controlled input mutation and comparison.' }],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Use side-by-side normal vs tampered input evidence to reduce false positives.'
    }
  },
  'api.result': {
    default: {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'authz', reason: 'Validate object and function-level authorization boundaries.' },
        { flowKey: 'request', reason: 'Tamper key request fields and IDs for impact validation.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Include endpoint, method, auth context, and object identifier evidence.'
    }
  },
  'response.result': {
    'found-token': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'decode', reason: 'Decode token and inspect claim/data structure.' },
        { flowKey: 'session', reason: 'Validate token lifecycle and session controls.' },
        { flowKey: 'authz', reason: 'Check whether token claims permit unauthorized access.' }
      ],
      evidenceChecklist: [
        'Capture response location of the token and associated endpoint.',
        'Record token structure indicators (header, claims, entropy, expiry hints).',
        'Show whether replay/alteration changes authorization behavior.'
      ],
      reportingHint: 'Explain token context and misuse potential, not just token presence.'
    },
    default: {
      confidence: 'medium',
      severity: 'medium',
      recommendedNextFlows: [{ flowKey: 'decode', reason: 'Classify encoded values before deeper testing.' }],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Tie suspicious response fields to concrete validation steps.'
    }
  },
  'request.result': {
    default: {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'authz', reason: 'Check if request deltas bypass authorization boundaries.' },
        { flowKey: 'exploitation', reason: 'Validate confirmed behavior impact in a controlled way.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Keep original and tampered requests paired with exact diff notes.'
    }
  },
  'authz.result': {
    default: {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Document controlled impact using unauthorized access evidence.' }
      ],
      evidenceChecklist: [
        'Capture baseline authorized request and unauthorized replay.',
        'Record role/account context for both requests.',
        'Show concrete unauthorized data/action impact.'
      ],
      reportingHint: 'State authorization boundary and business impact explicitly.'
    }
  },
  'exploitation.result': {
    default: {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [{ flowKey: 'session', reason: 'Validate containment and session invalidation after impact proof.' }],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document controlled impact, scope boundaries, and safe reproduction steps.'
    }
  },
  'info-disclosure.result': {
    default: {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'login', reason: 'Leaked credentials/usernames should be validated in auth flow.' },
        { flowKey: 'api', reason: 'Leaked docs/routes often expand API testing surface.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Classify leaked asset type and explain realistic abuse path.'
    }
  },
  'session.result': {
    default: {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [{ flowKey: 'authz', reason: 'Session weaknesses often impact authorization boundaries.' }],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Include cookie/token attributes and session transition evidence.'
    }
  },
  'upload.result': {
    default: {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [{ flowKey: 'exploitation', reason: 'Upload bypasses require controlled impact validation and scope checks.' }],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Capture upload restrictions, bypass vector, and resulting execution/access behavior.'
    }
  },
  'jwt.result': {
    'token-forged': {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [
        { flowKey: 'authz', reason: 'Validate whether the forged token grants access to unauthorized resources.' },
        { flowKey: 'exploitation', reason: 'Move to controlled exploitation to document the confirmed authentication bypass.' }
      ],
      evidenceChecklist: [
        'Save the original JWT and the forged version side by side.',
        'Record the exact algorithm change or secret used to sign the forged token.',
        'Show the server response confirming the forged token was accepted.'
      ],
      reportingHint: 'Include the attack type (alg:none, weak secret, key confusion) and the exact forged payload for reproducibility.'
    },
    'partial-bypass': {
      confidence: 'medium',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'authz', reason: 'Check whether partial claim manipulation yields unauthorized access to specific resources.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document which claim was modified, the expected vs. actual server behavior, and why it represents a trust boundary failure.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'response', reason: 'Re-inspect response data to confirm the JWT scope and claims before retrying attacks.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'List the attack vectors tried and why the token validation appeared robust.'
    }
  },
  'xxe.result': {
    'file-read': {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'File read is critical impact — escalate to SSH keys, secrets, and shadow files.' }
      ],
      evidenceChecklist: [
        'Capture the exact payload DOCTYPE and entity declaration used.',
        'Show the file content returned in the response.',
        'Test a second file path to confirm arbitrary read, not just /etc/passwd.'
      ],
      reportingHint: 'Include the full XXE payload and the server response showing file content. Note the XML parser and affected endpoint.'
    },
    'oob-confirmed': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'OOB XXE is exploitable — chain with parameter entities to exfiltrate file contents.' }
      ],
      evidenceChecklist: [
        'Show the OOB callback log (DNS or HTTP) confirming the server made the request.',
        'Record the exact payload and the interactsh/collaborator host used.',
        'Attempt a follow-up payload to exfiltrate file content via the OOB channel.'
      ],
      reportingHint: 'Include the OOB interaction log as proof. Distinguish DNS-only from full HTTP callback with body.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'input', reason: 'If entity injection is blocked, test other input vectors on the same endpoint.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document every payload variant tested and parser behavior observed, including any error messages.'
    }
  },
  'ssrf.result': {
    'metadata-read': {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Cloud metadata access is critical \u2014 extract credentials and escalate immediately.' }
      ],
      evidenceChecklist: [
        'Capture the exact URL payload and the metadata API response body.',
        'Record whether IAM credentials, tokens, or role names were returned.',
        'Test a second internal target to confirm generalized internal network access.'
      ],
      reportingHint: 'Include the full metadata URL used and any credentials or role info returned. Note the cloud provider and affected endpoint.'
    },
    'internal-reached': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Internal host access confirms SSRF \u2014 map the internal network and document reachable services.' }
      ],
      evidenceChecklist: [
        'Show a response from an internal IP or hostname not accessible from the internet.',
        'Record latency or response-size differences for hit vs. miss targets.',
        'Test whether POST requests can reach internal services, not just GET.'
      ],
      reportingHint: 'Clearly distinguish internal responses from external. Include at least two different internal targets as proof.'
    },
    'oob-confirmed': {
      confidence: 'medium',
      severity: 'medium',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'OOB SSRF is confirmed \u2014 escalate to internal host enumeration and metadata probing.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Include the OOB interaction log. Note whether DNS-only or full HTTP body was received.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'request', reason: 'If direct SSRF probes fail, test request header injection and redirect-based SSRF variants.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'List all probed targets and response differences. Consider filter bypass techniques for next attempt.'
    }
  },
  'cors.result': {
    'credentialed-leak': {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Credentialed CORS leak can expose session data and authenticated API responses — document and escalate.' }
      ],
      evidenceChecklist: [
        'Capture the request with Origin header and the response showing Access-Control-Allow-Credentials: true.',
        'Show Access-Control-Allow-Origin reflecting the attacker origin, not a wildcard.',
        'Demonstrate a follow-up cross-origin request that returns authenticated data.'
      ],
      reportingHint: 'Include both the preflight OPTIONS response and the actual credentialed response. Confirm with a PoC HTML page if possible.'
    },
    'reflected-origin': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Origin reflection without credentials is still exploitable for unauthenticated data if the endpoint returns sensitive content.' }
      ],
      evidenceChecklist: [
        'Show the request with custom Origin and the response reflecting it exactly.',
        'Confirm whether Access-Control-Allow-Credentials is present.',
        'Test whether the endpoint returns any user-specific data without auth.'
      ],
      reportingHint: 'Distinguish reflected origin with credentials true (critical) from reflected without credentials (medium/high depending on content).'
    },
    'null-origin': {
      confidence: 'medium',
      severity: 'medium',
      recommendedNextFlows: [],
      evidenceChecklist: [
        'Show the request with Origin: null and the response allowing it.',
        'Note whether Access-Control-Allow-Credentials is set.',
        'Document the endpoint and the sensitivity of data accessible from a null origin context.'
      ],
      reportingHint: 'Null origin allowlisting is exploitable via sandboxed iframes. Include a PoC showing the attack vector.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'response', reason: 'Re-inspect response headers for indirect CORS indicators before concluding no misconfiguration exists.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document all origin values tested and the server responses. Note if CORS headers are absent entirely.'
    }
  },
  'oauth.result': {
    'redirect-uri-bypass': {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Redirect URI bypass enables authorization code theft and account takeover — escalate immediately.' }
      ],
      evidenceChecklist: [
        'Show the authorization request with the manipulated redirect URI the server accepted.',
        'Capture the authorization code delivered to the attacker-controlled endpoint.',
        'Demonstrate code exchange producing valid access tokens.'
      ],
      reportingHint: 'Include the full redirect URI payload, the authorization response, and the token exchange. Note the bypass technique used (path traversal, open redirect, partial match).'
    },
    'state-bypass': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'authz', reason: 'Missing state enables CSRF on the callback — test whether forced account linking or session fixation is achievable.' }
      ],
      evidenceChecklist: [
        'Confirm the authorization request was accepted without a state parameter or with a replayed state value.',
        'Show the callback completes the flow without state validation.',
        'Attempt to force-link an attacker account to a victim session.'
      ],
      reportingHint: 'Clearly show that state is absent, constant, or not validated on the callback endpoint.'
    },
    'code-reuse': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Authorization code reuse allows replaying old codes for new token issuance — document and escalate.' }
      ],
      evidenceChecklist: [
        'Show the same authorization code was accepted on a second token exchange request.',
        'Record timestamps of both exchanges to confirm the code was not expired.',
        'Test whether the server revokes previously issued tokens after code reuse is detected.'
      ],
      reportingHint: 'Include both token exchange requests and responses. Note whether the server returns an error on the second attempt or silently issues another token.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'session', reason: 'If OAuth flow appears secure, validate session and token handling post-authentication.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'List all tested vectors with expected vs. actual behavior. Note which grant types and endpoints were covered.'
    }
  },
  'privesc.result': {
    'vertical-escalation': {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Vertical escalation to admin is critical impact — document accessible admin functions and data.' }
      ],
      evidenceChecklist: [
        'Show the low-privilege request and the elevated response side by side.',
        'Confirm the endpoint or resource is documented as admin-only.',
        'Demonstrate accessing at least two distinct admin-only functions or data objects.'
      ],
      reportingHint: 'Clearly distinguish your test account privilege level from the admin functionality accessed. Include the exact request and response.'
    },
    'horizontal-escalation': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'authz', reason: 'Horizontal escalation is an IDOR — validate the full authz boundary and enumerate other affected object types.' }
      ],
      evidenceChecklist: [
        'Show account A accessing account B\'s resource using a direct object reference.',
        'Confirm the accessed data belongs to a different user or tenant.',
        'Test at least two different object IDs to confirm the pattern is systematic, not a one-off.'
      ],
      reportingHint: 'Include both user account identifiers and the object reference used. Confirm the data accessed is not publicly available.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'authz', reason: 'Continue authorization boundary testing with the authz flow if direct escalation did not succeed.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document all escalation paths tested and observed enforcement behavior. Note any role parameters or headers that affected responses.'
    }
  },
  'crypto.result': {
    'plaintext-recovered': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'login', reason: 'Use recovered plaintext credentials to test authentication endpoints.' },
        { flowKey: 'exploitation', reason: 'Recovered secrets or keys may unlock other attack surfaces — assess and escalate.' }
      ],
      evidenceChecklist: [
        'Show the original hash and the recovered plaintext side by side.',
        'Document the cracking method, tool, and wordlist/rule set used.',
        'Confirm the plaintext is valid by testing it against the application or service it was sourced from.'
      ],
      reportingHint: 'Include the hash type, cracking method, and time-to-crack. Note whether the hash was salted and whether the salt was user-specific.'
    },
    'algorithm-identified': {
      confidence: 'medium',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'decode', reason: 'If encoding is layered with the hash, try the decode flow before cracking.' }
      ],
      evidenceChecklist: [
        'Record the hash value, length, and character set that led to the algorithm identification.',
        'Note whether the hash appears salted and how the salt is structured.',
        'Document any tool or library used for identification.'
      ],
      reportingHint: 'Clearly state the identified algorithm and the confidence level. Note if identification is ambiguous between multiple candidates.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'decode', reason: 'If the value is not a standard hash, try the decode flow for encoding-based analysis.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document the artifact, all identification attempts, and why the algorithm could not be determined.'
    }
  },
  'race.result': {
    'logic-flaw-confirmed': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Confirmed business logic flaw — document the exact race window, impact scope, and reproducibility.' }
      ],
      evidenceChecklist: [
        'Show baseline sequential behavior (correct enforcement) vs. concurrent behavior (bypass).',
        'Record the exact number of concurrent requests and the timing method used.',
        'Quantify the impact: amount double-spent, rate-limit bypass count, or resource accessed incorrectly.'
      ],
      reportingHint: 'Include both the baseline and the concurrent request logs. Note the success rate across multiple attempts to convey reliability.'
    },
    'inconsistent-outcome': {
      confidence: 'medium',
      severity: 'medium',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Inconsistent outcomes suggest a real race window — refine timing and retry to confirm a reliable exploit.' }
      ],
      evidenceChecklist: [
        'Show at least one instance of the unexpected outcome vs. the expected sequential outcome.',
        'Record the concurrency level and timing approach used.',
        'Note whether the anomaly is reproducible or appears intermittent.'
      ],
      reportingHint: 'Distinguish confirmed exploitation from intermittent anomalies. Even low-reliability races may be reportable depending on business impact.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'input', reason: 'If race window is not exploitable, test standard input validation on the same endpoint.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document the action tested, concurrency level, timing method, and why no race window was observed.'
    }
  },
  'xss.result': {
    'script-executed': {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Confirmed XSS execution \u2014 assess cookie theft, credential harvesting, and DOM manipulation impact.' }
      ],
      evidenceChecklist: [
        'Show the payload injected and the rendered HTML or JS that executed.',
        'Confirm the context: reflected, stored, or DOM-based.',
        'Demonstrate at least one practical impact such as alert() with document.cookie or a redirect.'
      ],
      reportingHint: 'Include the injection point, full payload, and a screen recording or screenshot showing execution. For stored XSS, show the storage and retrieval steps separately.'
    },
    'filter-bypassed': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Filter bypass confirms the XSS surface is exploitable with crafted payloads \u2014 document the bypass and escalate.' }
      ],
      evidenceChecklist: [
        'Show the original blocked payload and the bypass variant that succeeded.',
        'Document the WAF rule or filter that was circumvented.',
        'Confirm the bypass produces actual script execution, not just reflection.'
      ],
      reportingHint: 'Clearly distinguish filter bypass (partial) from full execution (critical). Include both the blocked and working payload.'
    },
    'dom-sink-found': {
      confidence: 'medium',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'DOM sink identified \u2014 trace source-to-sink data flow and craft a working exploitation PoC.' }
      ],
      evidenceChecklist: [
        'Identify the DOM source (location.hash, document.referrer, postMessage, etc.) and the sink (innerHTML, eval, etc.).',
        'Show the data flow from source to sink in DevTools.',
        'Attempt a PoC payload through the identified source.'
      ],
      reportingHint: 'Include a DevTools trace showing the source value flowing into the sink. Note whether the sink sanitizes input.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'input', reason: 'If XSS reflection is present but not exploitable, continue input testing for other injection classes.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document all reflection points tested, payloads used, and why execution was not achievable (encoding, CSP, etc.).'
    }
  },
  'csrf.result': {
    'poc-succeeded': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Confirmed CSRF \u2014 assess state-changing impact and identify highest-value actions (password change, account takeover).' }
      ],
      evidenceChecklist: [
        'Show the PoC HTML page and the forged request it sends.',
        'Confirm the server accepted and executed the forged request.',
        'Document which account performed the action vs. which account triggered the PoC.'
      ],
      reportingHint: 'Include the full PoC HTML, the resulting request, and the server response confirming the state change. Note the SameSite cookie value observed.'
    },
    'token-bypass': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'session', reason: 'Token bypass may indicate broader session management weaknesses \u2014 validate token binding and rotation.' }
      ],
      evidenceChecklist: [
        'Show the request with the token removed or tampered and the server accepting it.',
        'Confirm the endpoint performs a state change (not just a read).',
        'Test at least two different endpoints to confirm the bypass is systematic.'
      ],
      reportingHint: 'Distinguish absent token (not implemented) from present but unvalidated token (broken implementation). Both are reportable but carry different severity context.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'request', reason: 'If CSRF tokens appear valid, test request header and origin manipulation to find alternate bypass vectors.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document all state-changing actions tested, CSRF token behavior observed, and SameSite attributes on all session cookies.'
    }
  },
  'deserialize.result': {
    'rce-confirmed': {
      confidence: 'high',
      severity: 'critical',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Deserialization RCE is critical \u2014 document the gadget chain, execution evidence, and full impact scope.' }
      ],
      evidenceChecklist: [
        'Show the serialized payload injected and the command execution evidence (DNS callback, file write, or response).',
        'Identify the gadget chain used and the library version it targets.',
        'Confirm the execution context: which user account, OS, and application server.'
      ],
      reportingHint: 'Include the full gadget chain payload, the injection point, and out-of-band evidence of execution. Note the Java/PHP/Python library version and CVE if applicable.'
    },
    'object-injected': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'authz', reason: 'Object injection without RCE may still enable privilege escalation through class property manipulation \u2014 test access control impact.' }
      ],
      evidenceChecklist: [
        'Show the serialized object before and after modification.',
        'Confirm the server deserializes the modified object and reflects the change in application behavior.',
        'Document which object properties were modified and the resulting access or behavior change.'
      ],
      reportingHint: 'Clearly distinguish RCE gadget chain (critical) from property manipulation (high). Include the modified payload and the behavioral diff.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'input', reason: 'If serialized data is present but no gadget chains apply, continue input testing for other injection classes on the same endpoint.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document the serialization format detected, gadget chains researched and tested, and why exploitation was not achieved.'
    }
  },
  'ctf-stego.result': {
    'flag-found': {
      confidence: 'high',
      severity: 'medium',
      recommendedNextFlows: [],
      evidenceChecklist: [
        'Record the file artifact and the tool/technique used to extract the hidden data.',
        'Show the raw extracted output and the decoded flag value.',
        'Note any passphrase, key, or secondary hint required to complete extraction.'
      ],
      reportingHint: 'Document the full solution path: file \u2192 tool \u2192 technique \u2192 flag. Include command lines used.'
    },
    'hidden-data-extracted': {
      confidence: 'medium',
      severity: 'medium',
      recommendedNextFlows: [
        { flowKey: 'crypto', reason: 'Extracted data may be encoded or encrypted \u2014 run it through the crypto flow to identify the format and recover the flag.' },
        { flowKey: 'decode', reason: 'If the extracted data looks encoded, try the decode flow to identify and reverse the encoding.' }
      ],
      evidenceChecklist: [
        'Show the extracted binary or text data.',
        'Document the tool and extraction method used.',
        'Note whether a passphrase was needed and how it was obtained.'
      ],
      reportingHint: 'Record the extraction steps and the raw output. If the data requires further decoding, document each decoding layer separately.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'decode', reason: 'If steganography tools found nothing, try the decode flow on any visible encoded strings in the file.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'List all tools and techniques attempted. Consider alternate file views: strings output, hex dump, and file carving.'
    }
  },
  'ctf-web.result': {
    'flag-found': {
      confidence: 'high',
      severity: 'medium',
      recommendedNextFlows: [],
      evidenceChecklist: [
        'Document each vulnerability in the chain and how it was discovered.',
        'Show the full exploit path from initial access to flag extraction.',
        'Note any credentials, tokens, or secondary hints obtained along the chain.'
      ],
      reportingHint: 'Write up the full chain clearly: vuln 1 \u2192 impact \u2192 pivot \u2192 vuln 2 \u2192 flag. Include all request/response pairs.'
    },
    'chain-confirmed': {
      confidence: 'high',
      severity: 'high',
      recommendedNextFlows: [
        { flowKey: 'exploitation', reason: 'Vulnerability chain confirmed \u2014 pivot through the final stage to extract the flag or privileged data.' }
      ],
      evidenceChecklist: [
        'Show each link in the vulnerability chain with evidence.',
        'Confirm the chain is reproducible end-to-end.',
        'Document any timing or ordering dependencies in the chain.'
      ],
      reportingHint: 'Present the chain as a numbered sequence. Show how each vulnerability\'s output feeds the next step\'s input.'
    },
    default: {
      confidence: 'low',
      severity: 'low',
      recommendedNextFlows: [
        { flowKey: 'discovery', reason: 'If chaining stalled, broaden discovery \u2014 look for hidden files, backup sources, or alternate endpoints.' }
      ],
      evidenceChecklist: GENERIC_EVIDENCE_CHECKLIST,
      reportingHint: 'Document all source hints found, vulnerabilities identified, and where the chain broke down. Look for alternate entry points.'
    }
  }
}

function resolveOutcomeSignal(eventName, payload) {
  const signalSet = OUTCOME_SIGNAL_DEFINITIONS[eventName]
  if (!signalSet) {
    return null
  }

  return signalSet[payload] ?? signalSet.default
}

function resolveOutcomeProfile(eventName, payload, context = {}) {
  const profileSet = OUTCOME_PROFILE_DEFINITIONS[eventName]
  if (!profileSet) {
    return null
  }

  const profile = profileSet[payload] ?? profileSet.default
  if (!profile) {
    return null
  }

  const fallbackRelatedTools = Array.isArray(context.currentFlowTools)
    ? context.currentFlowTools.slice(0, 3).map((tool) => tool.name)
    : []

  return {
    confidence: profile.confidence,
    severity: profile.severity,
    recommendedNextFlows: profile.recommendedNextFlows ?? [],
    evidenceChecklist: profile.evidenceChecklist ?? GENERIC_EVIDENCE_CHECKLIST,
    relatedTools: profile.relatedTools ?? fallbackRelatedTools,
    reportingHint: profile.reportingHint ?? ''
  }
}

const TRANSITION_DEFINITIONS = {
  startFlow: ({ selectedFlow }) => ({
    nextStage: FLOW_START_STAGE_BY_KEY[selectedFlow] ?? 'encoded',
    feedback: ''
  }),
  'decode.continue': () => ({ nextStage: 'decode', feedback: '' }),
  'decode.openTool': ({ payload }) => ({
    nextStage: 'result',
    selectedTool: payload,
    feedback: `You opened ${payload}. Come back here after trying it, then choose what result you got.`
  }),
  'decode.result': ({ payload }) => {
    if (payload === 'readable') {
      return { nextStage: 'success', feedback: '' }
    }

    if (payload === 'still-encoded') {
      return {
        nextStage: 'decode',
        feedback: 'The output still looks encoded. Try another simple decoder and compare the result.'
      }
    }

    return {
      nextStage: 'decode',
      feedback: 'The output looks random. That usually means the wrong decoder or the wrong input format, so try another decoder next.'
    }
  },
  'login.actionSelect': ({ payload }) => ({ nextStage: 'test-login', selectedAction: payload, feedback: '' }),
  'login.testContinue': () => ({ nextStage: 'result', feedback: '' }),
  'login.result': ({ payload }) => {
    if (payload === 'error-message') {
      return { nextStage: 'analyze-error', selectedOutcome: payload }
    }

    if (payload === 'login-success') {
      return withFollowUpFlows({
        nextStage: 'next-step',
        selectedOutcome: payload,
        feedback: 'A basic or default login working is already a strong sign of weak authentication and should be validated carefully.'
      }, [
        { flowKey: 'authz', reason: 'Validate whether the authenticated user can reach unauthorized resources.' },
        { flowKey: 'session', reason: 'Check cookie, token rotation, and session fixation controls after login.' }
      ])
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No visible change does not mean the login is safe. Small input changes, timing differences, and hidden validation issues can still matter.'
    }
  },
  'login.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Different login behaviors can reveal weaknesses, so the next step is to test basic injection or bypass ideas carefully.'
  }),
  'discovery.actionSelect': () => ({ nextStage: 'discovery', selectedAction: 'hidden-content', feedback: '' }),
  'discovery.enumerate': () => ({ nextStage: 'enumerate', feedback: '' }),
  'discovery.result': ({ payload }) => {
    if (payload === 'found-endpoint') {
      return { nextStage: 'investigate', selectedOutcome: payload, feedback: '' }
    }

    if (payload === 'got-403') {
      return withFollowUpFlows({
        nextStage: 'next-step',
        selectedOutcome: payload,
        feedback: 'A 403 can still be useful. It proves something exists there, so note it and keep exploring related paths or access patterns.'
      }, [
        { flowKey: 'authz', reason: 'A 403 often indicates an authorization boundary worth validating.' },
        { flowKey: 'request', reason: 'Test request variations to confirm whether access checks are consistent.' }
      ])
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'Nothing found yet usually means the obvious guesses were not enough. Broaden the wordlist, vary extensions, and keep exploring adjacent paths.'
    }
  },
  'discovery.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Keep exploring what you found and switch to other flows when the new content suggests login testing, decoding, or deeper inspection.'
  }),
  'enumeration.actionSelect': ({ payload }) => ({ nextStage: 'identify-service', selectedAction: payload, feedback: '' }),
  'enumeration.continue': () => ({ nextStage: 'enumerate-service', feedback: '' }),
  'enumeration.result': ({ payload }) => {
    if (payload === 'found-users' || payload === 'found-share' || payload === 'found-config') {
      return { nextStage: 'inspect-findings', selectedOutcome: payload, feedback: '' }
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'Even when enumeration looks quiet, record the service details and try a different protocol-specific tool or script set before moving on.'
    }
  },
  'enumeration.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Use the strongest finding as your next entry point: valid usernames, readable shares, config files, and protocol details often unlock the next flow.'
  }),
  'input.actionSelect': () => ({ nextStage: 'test-input', selectedAction: 'test-input-handling', feedback: '' }),
  'input.continue': () => ({ nextStage: 'response-change', feedback: '' }),
  'input.result': ({ payload }) => {
    if (payload === 'page-changed' || payload === 'error-shown') {
      return { nextStage: 'analyze-behavior', selectedOutcome: payload, feedback: '' }
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No visible difference can still mean filtering or normalization is happening behind the scenes, so keep comparing how different inputs are handled.'
    }
  },
  'input.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'The next step is to test for common input handling weaknesses, such as injection or filtering issues, or switch into a more specific flow based on what changed.'
  }),
  'api.actionSelect': ({ payload }) => ({ nextStage: 'inspect-spec', selectedAction: payload, feedback: '' }),
  'api.continue': () => ({ nextStage: 'test-auth', feedback: '' }),
  'api.result': ({ payload }) => {
    if (payload === 'auth-bypass-signals' || payload === 'schema-leak') {
      return withFollowUpFlows({ nextStage: 'classify-risk', selectedOutcome: payload, feedback: '' }, [
        { flowKey: 'authz', reason: 'Follow up with role and ownership checks on exposed API objects.' },
        { flowKey: 'request', reason: 'Tamper headers, methods, and object IDs to verify practical impact.' }
      ])
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'If the endpoint looks stable, keep testing method changes, missing-token behavior, and object-level access checks before closing the path.'
    }
  },
  'api.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Carry the strongest API finding into vulnerability validation and document exact request and response pairs for reproducibility.'
  }),
  'response.actionSelect': () => ({ nextStage: 'analyze-data', selectedAction: 'inspect-response', feedback: '' }),
  'response.continue': () => ({ nextStage: 'interesting-data', feedback: '' }),
  'response.result': ({ payload }) => {
    if (payload === 'found-token' || payload === 'found-encoded-value') {
      if (payload === 'found-token') {
        return withFollowUpFlows({ nextStage: 'investigate-value', selectedOutcome: payload, feedback: '' }, [
          { flowKey: 'decode', reason: 'Determine whether the token contains encoded or structured claims.' },
          { flowKey: 'session', reason: 'Validate token/session handling, expiration, and protection flags.' },
          { flowKey: 'authz', reason: 'Check whether token claims can access unauthorized resources.' }
        ])
      }

      return withFollowUpFlows({ nextStage: 'investigate-value', selectedOutcome: payload, feedback: '' }, [
        { flowKey: 'decode', reason: 'Decode the value to classify whether it reveals useful context.' },
        { flowKey: 'request', reason: 'Replay requests with adjusted value to test trust boundaries.' }
      ])
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'If nothing stands out yet, keep comparing fields, formatting the response, and checking whether hidden values appear in related requests.'
    }
  },
  'response.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Use the data you found in follow-up requests, validation points, or another flow that matches the value type you discovered.'
  }),
  'request.actionSelect': () => ({ nextStage: 'tamper-request', selectedAction: 'modify-request', feedback: '' }),
  'request.continue': () => ({ nextStage: 'response-changed', feedback: '' }),
  'request.result': ({ payload }) => {
    if (payload === 'different-data-returned' || payload === 'error-message') {
      return { nextStage: 'analyze-impact', selectedOutcome: payload, feedback: '' }
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No visible change can still be useful. Keep adjusting one part of the request at a time and compare IDs, headers, methods, or removed fields carefully.'
    }
  },
  'request.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Keep manipulating the request and combine this with input testing or enumeration flows when the behavior suggests deeper validation or access control issues.'
  }),
  'authz.actionSelect': ({ payload }) => ({ nextStage: 'baseline-request', selectedAction: payload, feedback: '' }),
  'authz.continue': () => ({ nextStage: 'role-switch-test', feedback: '' }),
  'authz.result': ({ payload }) => {
    if (payload === 'unauthorized-access' || payload === 'partial-bypass') {
      return { nextStage: 'confirm-impact', selectedOutcome: payload, feedback: '' }
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No bypass yet. Keep varying resource ownership, role claims, and direct object references while changing one factor at a time.'
    }
  },
  'authz.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document the exact privilege context, request delta, and impact scope so remediation can enforce server-side authorization checks.'
  }),
  'exploitation.actionSelect': ({ payload }) => ({ nextStage: 'prepare-validation', selectedAction: payload, feedback: '' }),
  'exploitation.continue': () => ({ nextStage: 'execute-safely', feedback: '' }),
  'exploitation.result': ({ payload }) => {
    if (payload === 'confirmed-impact' || payload === 'partial-impact') {
      return { nextStage: 'document-impact', selectedOutcome: payload, feedback: '' }
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'Pause and tighten the validation plan before retrying. A clean proof matters more than forcing the result.'
    }
  },
  'exploitation.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Preserve the exact proof, record scope, and hand off clear remediation details so the issue can be fixed without repeating unnecessary impact.'
  }),
  'info-disclosure.actionSelect': ({ payload }) => ({ nextStage: 'inspect-source', selectedAction: payload, feedback: '' }),
  'info-disclosure.continue': () => ({ nextStage: 'sensitive-data', feedback: '' }),
  'info-disclosure.result': ({ payload }) => {
    if (payload === 'found-secrets' || payload === 'found-source') {
      return withFollowUpFlows({ nextStage: 'assess-exposure', selectedOutcome: payload, feedback: '' }, [
        { flowKey: 'login', reason: 'Leaked credentials or usernames can change auth testing priority.' },
        { flowKey: 'api', reason: 'Exposed source or docs often reveal hidden API routes to validate.' },
        { flowKey: 'session', reason: 'Leaked token/session hints are best validated in session testing.' }
      ])
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No clear leak yet. Broaden the search to backup files, error-triggering inputs, and alternate response formats before closing this path.'
    }
  },
  'info-disclosure.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Use leaked details to feed other flows: credentials go to login testing, internal paths to discovery, and exposed logic to input or API testing.'
  }),
  'session.actionSelect': ({ payload }) => ({ nextStage: 'inspect-session', selectedAction: payload, feedback: '' }),
  'session.continue': () => ({ nextStage: 'test-session', feedback: '' }),
  'session.result': ({ payload }) => {
    if (payload === 'fixation-possible' || payload === 'missing-flags') {
      return { nextStage: 'next-step', selectedOutcome: payload, feedback: '' }
    }

    if (payload === 'csrf-missing') {
      return {
        nextStage: 'next-step',
        selectedOutcome: payload,
        feedback: 'Missing CSRF protection on state-changing actions is a real finding. Document the exact endpoint and method before moving to exploitation.'
      }
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'Session controls look solid for this endpoint. Keep sampling other actions and check whether token rotation happens after privilege changes.'
    }
  },
  'session.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Carry session findings into authorization testing or exploitation depending on severity.'
  }),
  'upload.actionSelect': ({ payload }) => ({ nextStage: 'test-upload', selectedAction: payload, feedback: '' }),
  'upload.continue': () => ({ nextStage: 'upload-result', feedback: '' }),
  'upload.result': ({ payload }) => {
    if (payload === 'file-executed' || payload === 'filter-bypassed') {
      return { nextStage: 'analyze-upload', selectedOutcome: payload, feedback: '' }
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'Upload was blocked or sanitized. Try alternate extensions, double extensions, null bytes, or different Content-Type values before closing.'
    }
  },
  'upload.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'If the upload bypass succeeded, move into controlled exploitation to prove impact safely and document the chain.'
  }),
  'jwt.actionSelect': ({ payload }) => ({ nextStage: 'inspect-claims', selectedAction: payload, feedback: '' }),
  'jwt.continue': () => ({ nextStage: 'test-attacks', feedback: '' }),
  'jwt.result': ({ payload }) => {
    if (payload === 'token-forged' || payload === 'partial-bypass') {
      return withFollowUpFlows({ nextStage: 'forge-token', selectedOutcome: payload, feedback: '' }, [
        { flowKey: 'authz', reason: 'Validate whether the forged token accesses unauthorized resources.' },
        { flowKey: 'exploitation', reason: 'Prove impact safely with a controlled exploitation step.' }
      ])
    }

    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'Token validation appears robust for this attack vector. Try key confusion, kid injection, or check whether a different endpoint accepts unsigned tokens.'
    }
  },
  'jwt.forge': () => ({ nextStage: 'confirm-access', feedback: '' }),
  'jwt.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document the signing algorithm, tested attack vectors, and whether claim manipulation affected server-side authorization decisions.'
  }),
  'xxe.injectEntity': () => ({ nextStage: 'inject-entity', feedback: '' }),
  'xxe.testFileRead': () => ({ nextStage: 'test-file-read', feedback: '' }),
  'xxe.testSsrfDtd': () => ({ nextStage: 'test-ssrf-dtd', feedback: '' }),
  'xxe.oobExfil': () => ({ nextStage: 'oob-exfil', feedback: '' }),
  'xxe.result': ({ payload }) => {
    if (payload === 'file-read') {
      return withFollowUpFlows({
        nextStage: 'confirm-xxe',
        selectedOutcome: payload,
        feedback: 'File read confirmed. Escalate to /etc/shadow, application config files, and SSH keys. Test whether the same entity works for SSRF.'
      }, [
        { flowKey: 'exploitation', reason: 'Confirmed file read is critical impact — document and escalate.' }
      ])
    }
    if (payload === 'oob-confirmed') {
      return withFollowUpFlows({
        nextStage: 'confirm-xxe',
        selectedOutcome: payload,
        feedback: 'OOB callback received. The parser is reaching your server. Now chain with file read via parameter entities to exfiltrate content.'
      }, [
        { flowKey: 'exploitation', reason: 'OOB XXE is exploitable — escalate to data exfiltration.' }
      ])
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No visible output yet. The parser may still be vulnerable but output is suppressed. Try OOB techniques or error-based extraction.'
    }
  },
  'xxe.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document every payload variant tested, server responses, and any OOB interaction received. Note which XML parsers and content types were tested.'
  }),
  'ssrf.probeLoopback': () => ({ nextStage: 'probe-loopback', feedback: '' }),
  'ssrf.probeCloudMetadata': () => ({ nextStage: 'probe-cloud-metadata', feedback: '' }),
  'ssrf.internalHostScan': () => ({ nextStage: 'internal-host-scan', feedback: '' }),
  'ssrf.result': ({ payload }) => {
    if (payload === 'metadata-read') {
      return withFollowUpFlows({
        nextStage: 'confirm-ssrf',
        selectedOutcome: payload,
        feedback: 'Cloud metadata read confirmed. Extract IAM credentials or role information immediately and assess blast radius before further testing.'
      }, [
        { flowKey: 'exploitation', reason: 'Credential access via cloud metadata is critical impact \u2014 escalate and document.' }
      ])
    }
    if (payload === 'internal-reached') {
      return withFollowUpFlows({
        nextStage: 'confirm-ssrf',
        selectedOutcome: payload,
        feedback: 'Internal host reached. Map additional ports and services on the same host, then pivot to adjacent internal IPs to scope the network access.'
      }, [
        { flowKey: 'exploitation', reason: 'Internal network access via SSRF is high impact \u2014 document reachable services.' }
      ])
    }
    if (payload === 'oob-confirmed') {
      return {
        nextStage: 'confirm-ssrf',
        selectedOutcome: payload,
        feedback: 'OOB callback received. The server is making requests to your host. Escalate to internal IP probing and cloud metadata endpoints to maximize impact.'
      }
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No direct response yet. Try DNS rebinding, URL redirect chains, and protocol-specific payloads (gopher://, file://) if the parameter accepts them.'
    }
  },
  'ssrf.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document all tested targets, response timing/size deltas, and any OOB interactions. Note which URL schemas and bypass techniques were attempted.'
  }),
  'cors.testWildcard': () => ({ nextStage: 'test-wildcard', feedback: '' }),
  'cors.testNullOrigin': () => ({ nextStage: 'test-null-origin', feedback: '' }),
  'cors.testReflection': () => ({ nextStage: 'test-reflection', feedback: '' }),
  'cors.result': ({ payload }) => {
    if (payload === 'credentialed-leak') {
      return withFollowUpFlows({
        nextStage: 'confirm-cors',
        selectedOutcome: payload,
        feedback: 'Credentialed CORS leak confirmed. The server reflects your origin and allows credentials, so authenticated responses are accessible cross-origin. Document with a PoC HTML page.'
      }, [
        { flowKey: 'exploitation', reason: 'Credentialed cross-origin data access is critical impact — escalate.' }
      ])
    }
    if (payload === 'reflected-origin') {
      return {
        nextStage: 'confirm-cors',
        selectedOutcome: payload,
        feedback: 'Origin reflected without credentials. Check whether the response body contains user-specific data. Without Allow-Credentials: true, exploitability depends on endpoint sensitivity.'
      }
    }
    if (payload === 'null-origin') {
      return {
        nextStage: 'confirm-cors',
        selectedOutcome: payload,
        feedback: 'Null origin accepted. This is exploitable from a sandboxed iframe. Build a PoC and confirm whether credentials are also allowed.'
      }
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No obvious misconfiguration. Try subdomain-based origin variations and confirm whether any pre-flight OPTIONS responses expose weaknesses.'
    }
  },
  'cors.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document all origin values tested, server responses, and whether credentials were allowed. Note endpoints where CORS headers were absent.'
  }),
  'oauth.mapEndpoints': () => ({ nextStage: 'map-endpoints', feedback: '' }),
  'oauth.testStateParam': () => ({ nextStage: 'test-state-param', feedback: '' }),
  'oauth.testRedirectUri': () => ({ nextStage: 'test-redirect-uri', feedback: '' }),
  'oauth.testCodeReuse': () => ({ nextStage: 'test-code-reuse', feedback: '' }),
  'oauth.result': ({ payload }) => {
    if (payload === 'redirect-uri-bypass') {
      return withFollowUpFlows({
        nextStage: 'confirm-oauth',
        selectedOutcome: payload,
        feedback: 'Redirect URI bypass confirmed. The server accepted a manipulated redirect target. Capture the authorization code delivered to your endpoint and attempt token exchange.'
      }, [
        { flowKey: 'exploitation', reason: 'Redirect URI bypass is account takeover territory — escalate and document the full code theft chain.' }
      ])
    }
    if (payload === 'state-bypass') {
      return withFollowUpFlows({
        nextStage: 'confirm-oauth',
        selectedOutcome: payload,
        feedback: 'State parameter missing or not validated. This enables CSRF on the callback endpoint. Test whether an attacker can force-link their account to a victim session.'
      }, [
        { flowKey: 'authz', reason: 'Validate whether state bypass allows unauthorized account linking or session hijacking.' }
      ])
    }
    if (payload === 'code-reuse') {
      return {
        nextStage: 'confirm-oauth',
        selectedOutcome: payload,
        feedback: 'Authorization code accepted on second exchange. RFC 6749 requires codes to be single-use. Document both requests and verify whether previously issued tokens were revoked.'
      }
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No obvious weakness found. Check for token leakage in Referer headers, fragment vs. query parameter handling, and implicit flow token exposure in browser history.'
    }
  },
  'oauth.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document the full OAuth flow map, every parameter tested, and server behavior. Include token lifetime and refresh token handling observations.'
  }),
  'privesc.enumerateRoles': () => ({ nextStage: 'enumerate-roles', feedback: '' }),
  'privesc.testHorizontal': () => ({ nextStage: 'test-horizontal', feedback: '' }),
  'privesc.testVertical': () => ({ nextStage: 'test-vertical', feedback: '' }),
  'privesc.result': ({ payload }) => {
    if (payload === 'vertical-escalation') {
      return withFollowUpFlows({
        nextStage: 'confirm-escalation',
        selectedOutcome: payload,
        feedback: 'Vertical escalation confirmed. You reached a higher privilege context. Document the exact endpoint, the role assumed, and all functions accessible that should be restricted to admins.'
      }, [
        { flowKey: 'exploitation', reason: 'Admin access is critical — enumerate all accessible admin functionality and sensitive data.' }
      ])
    }
    if (payload === 'horizontal-escalation') {
      return withFollowUpFlows({
        nextStage: 'confirm-escalation',
        selectedOutcome: payload,
        feedback: 'Horizontal escalation confirmed. You accessed another user\'s resource using a predictable or guessable reference. Test additional object types and assess the full data exposure scope.'
      }, [
        { flowKey: 'authz', reason: 'Horizontal escalation is an IDOR — map all affected endpoints and object types.' }
      ])
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No direct escalation found. Check for role parameters in request bodies, admin endpoints with inconsistent enforcement, and mass assignment vulnerabilities.'
    }
  },
  'privesc.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document all tested endpoints, role parameters, and enforcement behavior. Note whether privilege checks are enforced server-side or rely on client-side role hints.'
  }),
  'crypto.identifyType': () => ({ nextStage: 'identify-type', feedback: '' }),
  'crypto.checkKnownList': () => ({ nextStage: 'check-known-list', feedback: '' }),
  'crypto.wordlistCrack': () => ({ nextStage: 'wordlist-crack', feedback: '' }),
  'crypto.rainbowTable': () => ({ nextStage: 'rainbow-table', feedback: '' }),
  'crypto.result': ({ payload }) => {
    if (payload === 'plaintext-recovered') {
      return withFollowUpFlows({
        nextStage: 'result',
        selectedOutcome: payload,
        feedback: 'Plaintext recovered. Validate the credential against the application immediately. Document the hash type, cracking method, and time-to-crack for the report.'
      }, [
        { flowKey: 'login', reason: 'Test the recovered credential against authentication endpoints.' },
        { flowKey: 'exploitation', reason: 'Recovered secrets may unlock additional attack surfaces.' }
      ])
    }
    if (payload === 'algorithm-identified') {
      return {
        nextStage: 'result',
        selectedOutcome: payload,
        feedback: 'Algorithm identified. If unsalted or weakly salted, proceed with targeted wordlist attacks. If bcrypt or Argon2, assess the cost factor before attempting a crack.'
      }
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'Identification inconclusive. Try hash-identifier or haiti for broader algorithm coverage. Consider whether the value may be encoded rather than hashed.'
    }
  },
  'crypto.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document the artifact, all identification and cracking attempts, tools used, and outcomes. Note algorithm strength and whether salt was present.'
  }),
  'race.baseline': () => ({ nextStage: 'baseline', feedback: '' }),
  'race.concurrentRequests': () => ({ nextStage: 'concurrent-requests', feedback: '' }),
  'race.compareOutcomes': () => ({ nextStage: 'compare-outcomes', feedback: '' }),
  'race.result': ({ payload }) => {
    if (payload === 'logic-flaw-confirmed') {
      return withFollowUpFlows({
        nextStage: 'confirm-race',
        selectedOutcome: payload,
        feedback: 'Race condition confirmed. The concurrent requests produced an outcome that violates the intended business logic. Document the request count, timing method, and exact impact for the report.'
      }, [
        { flowKey: 'exploitation', reason: 'Confirmed logic flaw — quantify the full impact and document for escalation.' }
      ])
    }
    if (payload === 'inconsistent-outcome') {
      return {
        nextStage: 'confirm-race',
        selectedOutcome: payload,
        feedback: 'Inconsistent outcome observed. A real race window likely exists but timing needs refinement. Try HTTP/2 last-byte synchronization via Turbo Intruder for more reliable triggering.'
      }
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No anomaly detected. The enforcement appears atomic. Consider whether the constraint is checked server-side or enforced at the database level with transactions.'
    }
  },
  'race.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document the action tested, concurrency approach, observed outcomes, and whether server-side or DB-level enforcement was inferred.'
  }),
  'xss.actionSelect': ({ payload }) => ({ nextStage: 'reflection-found', selectedAction: payload, feedback: '' }),
  'xss.contextIdentified': () => ({ nextStage: 'identify-context', feedback: '' }),
  'xss.testStored': () => ({ nextStage: 'test-stored', feedback: 'Test both stored (persisted across requests) and DOM-based (client-side source-to-sink) variants in addition to reflected.' }),
  'xss.bypassFilters': () => ({ nextStage: 'bypass-filters', feedback: 'Try alternate encoding, tag/attribute permutations, and event handler injection if simple payloads are blocked.' }),
  'xss.result': ({ payload }) => {
    if (payload === 'script-executed') {
      return withFollowUpFlows({
        nextStage: 'confirm-xss',
        selectedOutcome: payload,
        feedback: 'Script executed. Confirm the context (reflected, stored, DOM) and document the injection point, payload, and impact for reporting.'
      }, [
        { flowKey: 'exploitation', reason: 'Confirmed XSS \u2014 assess session hijacking, credential harvesting, and DOM manipulation impact.' }
      ])
    }
    if (payload === 'filter-bypassed') {
      return {
        nextStage: 'confirm-xss',
        selectedOutcome: payload,
        feedback: 'Filter bypassed. Confirm that the bypass produces actual script execution in the browser before reporting.'
      }
    }
    if (payload === 'dom-sink-found') {
      return {
        nextStage: 'confirm-xss',
        selectedOutcome: payload,
        feedback: 'DOM sink identified. Trace the full source-to-sink data flow in DevTools and attempt a working PoC through the identified source.'
      }
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No XSS found yet. Check for alternate injection points, different request parameters, or POST body fields that may reflect into the response.'
    }
  },
  'xss.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document all reflection points tested, payloads used, context identified, and whether execution was achievable or blocked by CSP or encoding.'
  }),
  'csrf.actionSelect': ({ payload }) => ({ nextStage: 'state-action-found', selectedAction: payload, feedback: '' }),
  'csrf.checkTokens': () => ({ nextStage: 'check-tokens', feedback: 'Check whether CSRF tokens are present, bound to the session, single-use, and actually validated server-side.' }),
  'csrf.testSameSite': () => ({ nextStage: 'test-samesite', feedback: 'Check SameSite cookie attributes on all session cookies. Lax blocks most CSRF; None with Secure allows cross-origin cookies.' }),
  'csrf.craftPoc': () => ({ nextStage: 'craft-poc', feedback: 'Build an HTML form PoC that submits the forged request from a cross-origin page. Use Burp Suite\u2019s CSRF PoC generator or craft manually.' }),
  'csrf.result': ({ payload }) => {
    if (payload === 'poc-succeeded') {
      return withFollowUpFlows({
        nextStage: 'confirm-csrf',
        selectedOutcome: payload,
        feedback: 'CSRF PoC succeeded. Confirm the forged request executed a state change on behalf of the victim account. Identify the highest-impact action for reporting.'
      }, [
        { flowKey: 'exploitation', reason: 'Confirmed CSRF \u2014 identify password change, account takeover, and other high-value forged actions.' }
      ])
    }
    if (payload === 'token-bypass') {
      return {
        nextStage: 'confirm-csrf',
        selectedOutcome: payload,
        feedback: 'CSRF token bypassed. The token is present but not properly validated. Confirm this is consistent across multiple endpoints.'
      }
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'CSRF mitigations appear effective. Verify SameSite=Strict or Lax is set and tokens are properly bound to the session before concluding.'
    }
  },
  'csrf.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document all state-changing actions tested, CSRF token behavior, SameSite cookie values, and PoC attempt outcomes.'
  }),
  'deserialize.actionSelect': ({ payload }) => ({ nextStage: 'serialized-data-found', selectedAction: payload, feedback: '' }),
  'deserialize.identifyFormat': () => ({ nextStage: 'identify-format', feedback: 'Identify the serialization format: Java (rO0AB), PHP (O:4: or a:), Python pickle (\\x80\\x04), .NET (AAEAAAD). Each requires different tooling.' }),
  'deserialize.inspectGadgets': () => ({ nextStage: 'inspect-gadgets', feedback: 'Research gadget chains for the detected framework version. Use ysoserial for Java, phpggc for PHP, or pickle-tools for Python.' }),
  'deserialize.craftPayload': () => ({ nextStage: 'craft-payload', feedback: 'Generate a gadget chain payload targeting a DNS callback or file write first \u2014 avoid destructive payloads during testing.' }),
  'deserialize.result': ({ payload }) => {
    if (payload === 'rce-confirmed') {
      return withFollowUpFlows({
        nextStage: 'test-execution',
        selectedOutcome: payload,
        feedback: 'RCE confirmed via deserialization. Document the gadget chain, library version, injection point, and execution evidence. This is a critical severity finding.'
      }, [
        { flowKey: 'exploitation', reason: 'Deserialization RCE is critical \u2014 document the full gadget chain and impact scope.' }
      ])
    }
    if (payload === 'object-injected') {
      return {
        nextStage: 'test-execution',
        selectedOutcome: payload,
        feedback: 'Object injection confirmed without RCE. Assess whether property manipulation enables privilege escalation or authentication bypass before concluding severity.'
      }
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'No gadget chain succeeded. Verify the library versions present in the classpath and consider whether custom gadget research is warranted.'
    }
  },
  'deserialize.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document the serialization format, libraries and versions identified, gadget chains tested, and execution or injection evidence.'
  }),
  'ctf-stego.actionSelect': ({ payload }) => ({ nextStage: 'artifact-found', selectedAction: payload, feedback: '' }),
  'ctf-stego.identifyStego': () => ({ nextStage: 'identify-stego', feedback: 'Run strings, file, and binwalk first for quick wins. Then match the file type to the appropriate stego tool: zsteg for PNG/BMP, steghide for JPEG.' }),
  'ctf-stego.extractMetadata': () => ({ nextStage: 'extract-metadata', feedback: 'Run exiftool to dump all metadata fields. Check for embedded GPS, comments, software fields, and unusual tags that may carry hints.' }),
  'ctf-stego.decodeHidden': () => ({ nextStage: 'decode-hidden', feedback: 'Attempt extraction with all relevant tools. Try common passphrases (challenge name, author, "password") if steghide requires one.' }),
  'ctf-stego.result': ({ payload }) => {
    if (payload === 'flag-found') {
      return {
        nextStage: 'confirm-flag',
        selectedOutcome: payload,
        feedback: 'Flag found. Record the full solution path for writeup: file \u2192 tool \u2192 technique \u2192 flag value.'
      }
    }
    if (payload === 'hidden-data-extracted') {
      return withFollowUpFlows({
        nextStage: 'confirm-flag',
        selectedOutcome: payload,
        feedback: 'Hidden data extracted but flag not yet recovered. The extracted data may be encoded or encrypted \u2014 run it through decode or crypto flow.'
      }, [
        { flowKey: 'crypto', reason: 'Extracted data may be hashed or encrypted \u2014 identify the format and attempt recovery.' },
        { flowKey: 'decode', reason: 'If the extracted data looks encoded (base64, hex, etc.), try the decode flow.' }
      ])
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'Nothing found yet. Try alternate tools, different extraction parameters, and look for multiple layers. LSB stego may require custom scripts if standard tools miss it.'
    }
  },
  'ctf-stego.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Review strings output, hex dump for appended data, and try all matching stego tools before concluding the file contains no hidden data.'
  }),
  'ctf-web.actionSelect': ({ payload }) => ({ nextStage: 'source-hint-found', selectedAction: payload, feedback: '' }),
  'ctf-web.chainFirstVuln': () => ({ nextStage: 'chain-first-vuln', feedback: 'Use the first vulnerability to gain initial access, leaked credentials, or an elevated token. Document the exact exploit and output.' }),
  'ctf-web.chainSecondVuln': () => ({ nextStage: 'chain-second-vuln', feedback: 'Chain the second vulnerability using the output of the first. Common patterns: IDOR \u2192 credential leak \u2192 login, or LFI \u2192 source read \u2192 SSTI.' }),
  'ctf-web.pivot': () => ({ nextStage: 'pivot', feedback: 'Use the chained access to pivot toward the flag. Look for admin panels, /flag.txt, environment variables, or database records.' }),
  'ctf-web.result': ({ payload }) => {
    if (payload === 'flag-found') {
      return {
        nextStage: 'confirm-flag',
        selectedOutcome: payload,
        feedback: 'Flag found. Write up the full chain clearly: each vulnerability, its output, and how it fed the next step.'
      }
    }
    if (payload === 'chain-confirmed') {
      return withFollowUpFlows({
        nextStage: 'confirm-flag',
        selectedOutcome: payload,
        feedback: 'Vulnerability chain confirmed. Pivot through the final stage to extract the flag.'
      }, [
        { flowKey: 'exploitation', reason: 'Chain is confirmed \u2014 execute the final stage to reach the flag.' }
      ])
    }
    return {
      nextStage: 'next-step',
      selectedOutcome: payload,
      feedback: 'Chain broken. Broaden discovery for alternate entry points \u2014 check .git exposure, backup files, hidden parameters, and alternate HTTP methods.'
    }
  },
  'ctf-web.nextStep': () => ({
    nextStage: 'next-step',
    feedback: 'Document all hints found, vulnerabilities identified, and where the chain stalled. Look for alternate entry points and expand enumeration.'
  })
}

export const FLOW_START_STAGE_BY_KEY = {
  decode: 'encoded',
  login: 'login-page',
  discovery: 'web-page-found',
  enumeration: 'service-found',
  input: 'input-field-found',
  api: 'api-endpoint-found',
  response: 'response-data-found',
  request: 'http-request-observed',
  authz: 'privileged-action-found',
  exploitation: 'confirmed-finding',
  'info-disclosure': 'source-found',
  session: 'session-captured',
  upload: 'upload-found',
  jwt: 'jwt-discovered',
  xxe: 'xml-input-found',
  ssrf: 'url-param-found',
  cors: 'cors-headers-observed',
  oauth: 'oauth-flow-found',
  privesc: 'low-priv-access',
  crypto: 'hash-found',
  race: 'state-action-found',
  xss: 'reflection-found',
  csrf: 'state-action-found',
  deserialize: 'serialized-data-found',
  'ctf-stego': 'artifact-found',
  'ctf-web': 'source-hint-found'
}

export const DEFAULT_MACHINE_STATE = {
  selectedFlow: '',
  currentStage: 'start',
  stageHistory: [],
  decisionHistory: [],
  stageEvidence: {},
  outcomeSignal: null,
  outcomeProfile: null,
  selectedTool: '',
  feedback: '',
  selectedAction: '',
  selectedOutcome: '',
  followUpFlows: [],
  notes: '',
  zoomLevel: 1
}

export function flowMapReducer(state, action) {
  switch (action.type) {
    case 'MACHINE_INIT':
      return { ...state, ...action.payload }
    case 'FLOW_SELECT':
      return {
        ...state,
        selectedFlow: action.flowKey,
        currentStage: 'start',
        stageHistory: ['start'],
        decisionHistory: [],
        stageEvidence: {},
        outcomeSignal: null,
        outcomeProfile: null,
        selectedTool: '',
        feedback: '',
        selectedAction: '',
        selectedOutcome: '',
        followUpFlows: [],
        notes: '',
        zoomLevel: action.defaultZoom
      }
    case 'FLOW_CLEAR':
      return {
        ...state,
        selectedFlow: '',
        currentStage: 'start',
        stageHistory: [],
        decisionHistory: [],
        stageEvidence: {},
        outcomeSignal: null,
        outcomeProfile: null,
        selectedTool: '',
        feedback: '',
        selectedAction: '',
        selectedOutcome: '',
        followUpFlows: [],
        notes: '',
        zoomLevel: action.defaultZoom
      }
    case 'FLOW_RESET':
      return {
        ...state,
        currentStage: 'start',
        stageHistory: ['start'],
        decisionHistory: [],
        stageEvidence: {},
        outcomeSignal: null,
        outcomeProfile: null,
        selectedTool: '',
        feedback: '',
        selectedAction: '',
        selectedOutcome: '',
        followUpFlows: [],
        notes: ''
      }
    case 'STAGE_SET':
      return {
        ...state,
        currentStage: action.stage,
        stageHistory: [...state.stageHistory, action.stage]
      }
    case 'FLOW_EVENT_APPLY': {
      const nextState = {
        ...state,
        ...(action.patch ?? {})
      }

      if (typeof action.nextStage === 'string') {
        nextState.currentStage = action.nextStage
        nextState.stageHistory = [...state.stageHistory, action.nextStage]
      }

      if (action.decision) {
        nextState.decisionHistory = [...state.decisionHistory, action.decision]
      }

      return nextState
    }
    case 'ZOOM_SET':
      return { ...state, zoomLevel: action.zoomLevel }
    case 'CONTEXT_PATCH':
      return { ...state, ...action.patch }
    default:
      return state
  }
}

export function resolveFlowTransition(eventName, context) {
  const resolver = TRANSITION_DEFINITIONS[eventName]
  if (!resolver) {
    return null
  }

  const transition = resolver(context)
  if (!transition) {
    return transition
  }

  let resolvedTransition = { ...transition }

  if (resolvedTransition.outcomeProfile === undefined) {
    const outcomeProfile = resolveOutcomeProfile(eventName, context?.payload, context)
    if (outcomeProfile) {
      resolvedTransition.outcomeProfile = outcomeProfile
    }
  }

  if (resolvedTransition.outcomeSignal === undefined) {
    const outcomeSignal = resolveOutcomeSignal(eventName, context?.payload)
    if (outcomeSignal) {
      resolvedTransition.outcomeSignal = outcomeSignal
    } else if (resolvedTransition.outcomeProfile) {
      resolvedTransition.outcomeSignal = {
        confidence: resolvedTransition.outcomeProfile.confidence,
        severity: resolvedTransition.outcomeProfile.severity
      }
    }
  }

  if (resolvedTransition.followUpFlows === undefined && resolvedTransition.outcomeProfile?.recommendedNextFlows) {
    resolvedTransition.followUpFlows = resolvedTransition.outcomeProfile.recommendedNextFlows
  }

  return resolvedTransition
}

export function validateFlowConfigConsistency({ flows, activeGroupKeys, startStageByFlow }) {
  const issues = []

  for (const [flowKey, flow] of Object.entries(flows)) {
    const active = activeGroupKeys.has(flow.group)
    const stageSet = new Set(flow.stages)
    const nodeIdSet = new Set(flow.nodes.map((node) => node.id))

    if (active && !stageSet.has('start')) {
      issues.push(`[${flowKey}] missing required stage "start".`)
    }

    for (const stageId of flow.stages) {
      if (!nodeIdSet.has(stageId)) {
        issues.push(`[${flowKey}] stage "${stageId}" has no matching node.`)
      }
    }

    for (const nodeId of nodeIdSet) {
      if (!stageSet.has(nodeId)) {
        issues.push(`[${flowKey}] node "${nodeId}" is not declared in stages.`)
      }
    }

    for (const [startId, endId] of flow.connections) {
      if (!nodeIdSet.has(startId) || !nodeIdSet.has(endId)) {
        issues.push(`[${flowKey}] connection "${startId} -> ${endId}" points to unknown node(s).`)
      }
    }

    if (active && flowKey in startStageByFlow && !stageSet.has(startStageByFlow[flowKey])) {
      issues.push(`[${flowKey}] start stage mapping points to unknown stage "${startStageByFlow[flowKey]}".`)
    }

    if (active && !(flowKey in startStageByFlow)) {
      issues.push(`[${flowKey}] missing start stage mapping.`)
    }
  }

  return issues
}
