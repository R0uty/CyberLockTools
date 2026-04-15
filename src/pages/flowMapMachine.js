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
      return {
        nextStage: 'next-step',
        selectedOutcome: payload,
        feedback: 'A basic or default login working is already a strong sign of weak authentication and should be validated carefully.'
      }
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
      return {
        nextStage: 'next-step',
        selectedOutcome: payload,
        feedback: 'A 403 can still be useful. It proves something exists there, so note it and keep exploring related paths or access patterns.'
      }
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
      return { nextStage: 'classify-risk', selectedOutcome: payload, feedback: '' }
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
      return { nextStage: 'investigate-value', selectedOutcome: payload, feedback: '' }
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
  exploitation: 'confirmed-finding'
}

export const DEFAULT_MACHINE_STATE = {
  selectedFlow: '',
  currentStage: 'start',
  selectedTool: '',
  feedback: '',
  selectedAction: '',
  selectedOutcome: '',
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
        selectedTool: '',
        feedback: '',
        selectedAction: '',
        selectedOutcome: '',
        zoomLevel: action.defaultZoom
      }
    case 'FLOW_CLEAR':
      return {
        ...state,
        selectedFlow: '',
        currentStage: 'start',
        selectedTool: '',
        feedback: '',
        selectedAction: '',
        selectedOutcome: '',
        zoomLevel: action.defaultZoom
      }
    case 'FLOW_RESET':
      return {
        ...state,
        currentStage: 'start',
        selectedTool: '',
        feedback: '',
        selectedAction: '',
        selectedOutcome: ''
      }
    case 'STAGE_SET':
      return { ...state, currentStage: action.stage }
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

  return resolver(context)
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
