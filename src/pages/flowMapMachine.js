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
  upload: 'upload-found'
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
