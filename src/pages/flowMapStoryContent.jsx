import React from 'react'

const DECODE_TOOLS = ['ROT', 'Base64', 'URL Encoder']

const STAGE_GUIDANCE_OVERRIDES = {
  decode: {
    result: {
      why: 'Selecting an accurate decoder outcome prevents false positives and points you to the right verification path.',
      signal: 'Readable output that is reproducible with the same transform and remains meaningful in surrounding context.'
    }
  },
  login: {
    result: {
      why: 'Authentication result differences reveal whether controls are weak, inconsistent, or simply noisy.',
      signal: 'Consistent success or consistently different error/timing behavior across repeated controlled attempts.'
    }
  },
  response: {
    result: {
      why: 'Response outcomes often indicate whether sensitive data exposure or token misuse risk is real.',
      signal: 'Sensitive fields, tokens, or role data repeatedly appearing for similar requests and user states.'
    }
  },
  request: {
    result: {
      why: 'Tampering outcomes can confirm trust-boundary weaknesses between client and server validation.',
      signal: 'Modified parameters are accepted server-side and produce repeatable privilege or behavior changes.'
    }
  },
  authz: {
    result: {
      why: 'Authorization outcomes separate legitimate access from broken access control hypotheses.',
      signal: 'Cross-role requests reliably return data or actions that should require stronger permissions.'
    }
  },
  session: {
    result: {
      why: 'Session findings are high impact only when token lifecycle flaws can be reproduced safely.',
      signal: 'Session token reuse, fixation, or invalidation failures that repeat after logout, role change, or timeout.'
    }
  },
  upload: {
    'upload-result': {
      why: 'Upload outcomes distinguish harmless filter behavior from exploitable server-side handling gaps.',
      signal: 'File acceptance, storage, execution, or direct retrieval behaviors that are consistent across controlled variants.'
    }
  },
  exploitation: {
    result: {
      why: 'Validation outcomes confirm impact while keeping demonstrations within safe, approved boundaries.',
      signal: 'Read-only proof actions produce deterministic impact without destructive effects or uncontrolled execution.'
    }
  }
}

const STAGE_GUIDANCE_DEFAULTS = {
  start: {
    why: 'Starting with a clear baseline keeps later conclusions tied to evidence instead of assumptions.',
    signal: 'A defined objective, known starting state, and a repeatable first action before branching.'
  },
  result: {
    why: 'Result selection drives the next branch, so this is where many false positives can be avoided.',
    signal: 'Observed outcomes can be reproduced at least twice under the same conditions.'
  },
  'next-step': {
    why: 'A deliberate next step keeps the investigation focused on validation instead of random exploration.',
    signal: 'The chosen follow-up is directly justified by prior observed behavior and recorded evidence.'
  },
  analyze: {
    why: 'Analysis stages turn raw observations into defensible conclusions.',
    signal: 'Clear deltas in payload, status, timing, or content that remain stable across retries.'
  },
  test: {
    why: 'Testing stages establish controlled comparisons that separate expected behavior from flaws.',
    signal: 'Input or request variations produce specific, repeatable behavior differences.'
  },
  inspect: {
    why: 'Inspection stages reduce guesswork by confirming assumptions against real data.',
    signal: 'Artifacts such as headers, tokens, parameters, or source patterns support the hypothesis.'
  },
  fallback: {
    why: 'This step helps tighten your hypothesis before committing to a branch or claim.',
    signal: 'At least one reproducible indicator supports your conclusion, and contradictory signals are noted.'
  }
}

function resolveDefaultGuidance(currentStage = '') {
  if (currentStage === 'start') {
    return STAGE_GUIDANCE_DEFAULTS.start
  }

  if (currentStage === 'result' || currentStage.endsWith('-result')) {
    return STAGE_GUIDANCE_DEFAULTS.result
  }

  if (currentStage === 'next-step') {
    return STAGE_GUIDANCE_DEFAULTS['next-step']
  }

  if (currentStage.startsWith('analyze-') || currentStage.includes('analyze')) {
    return STAGE_GUIDANCE_DEFAULTS.analyze
  }

  if (currentStage.startsWith('test-') || currentStage.includes('test')) {
    return STAGE_GUIDANCE_DEFAULTS.test
  }

  if (currentStage.startsWith('inspect-') || currentStage.includes('inspect')) {
    return STAGE_GUIDANCE_DEFAULTS.inspect
  }

  return STAGE_GUIDANCE_DEFAULTS.fallback
}

function getStageGuidance(selectedFlow, currentStage) {
  const flowGuidance = STAGE_GUIDANCE_OVERRIDES[selectedFlow] ?? {}
  const override = flowGuidance[currentStage]

  if (override) {
    return override
  }

  return resolveDefaultGuidance(currentStage)
}

function renderStageGuidance(guidance) {
  if (!guidance) {
    return null
  }

  return (
    <section className="flow-map-guidance" aria-label="Stage guidance">
      <div className="flow-map-guidance-card">
        <h3>Why this matters</h3>
        <p>{guidance.why}</p>
      </div>
      <div className="flow-map-guidance-card">
        <h3>What would count as a real signal</h3>
        <p>{guidance.signal}</p>
      </div>
    </section>
  )
}

export function renderStartStoryContent({ currentFlow, handleStartClick, clearFlow }) {
  const stageGuidance = getStageGuidance(currentFlow?.key ?? '', 'start')

  return (
    <>
      <span className="flow-map-story-step">Step 1</span>
      <h2>{currentFlow.label}</h2>
      <p>{currentFlow.summary}</p>
      <p className="flow-map-feedback">
        Begin here, then use the progress tracker or any unlocked node to move back through the flow without losing your place.
      </p>
      <div className="flow-map-actions">
        <button type="button" className="flow-map-button" onClick={handleStartClick}>
          Start flow
        </button>
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={clearFlow}>
          Choose another flow
        </button>
      </div>
      {renderStageGuidance(stageGuidance)}
    </>
  )
}

export function renderDecodeStoryContent({
  currentStage,
  selectedTool,
  feedback,
  handleContinueToDecode,
  resetFlowState,
  handleDecoderOpen,
  handleDecodeResultChoice
}) {
  if (currentStage === 'encoded') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Possible Encoding</h2>
        <p>You found a suspicious string: <strong>uryyb</strong>. It may be encoded rather than plain text.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleContinueToDecode}>
            Try decoding
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'decode') {
    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Decode</h2>
        <p>Start with simple decoding checks. Try ROT, Base64, or the URL Encoder/Decoder tool and see whether the string becomes readable.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          {DECODE_TOOLS.map((toolName) => (
            <button
              key={toolName}
              type="button"
              className="flow-map-button"
              onClick={() => handleDecoderOpen(toolName)}
            >
              Open {toolName}
            </button>
          ))}
        </div>
        {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      </>
    )
  }

  if (currentStage === 'result') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Result</h2>
        <p>
          {selectedTool
            ? `After trying ${selectedTool}, choose the result that best matches what you observed.`
            : 'Choose the result that best matches what you observed from the decoder.'}
        </p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleDecodeResultChoice('readable')}>
            Readable text
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleDecodeResultChoice('still-encoded')}>
            Still encoded
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleDecodeResultChoice('random')}>
            Random output
          </button>
        </div>
        {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      </>
    )
  }

  return (
    <>
      <span className="flow-map-story-step">Step 5</span>
      <h2>Success</h2>
      <p>You decoded the string (<strong>hello</strong>) and now have a useful value. Next, check where that value appears in the page flow, input handling, or validation logic.</p>
      <div className="flow-map-actions">
        <button type="button" className="flow-map-button" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderLoginStoryContent({
  currentStage,
  selectedAction,
  selectedOutcome,
  feedback,
  handleLoginActionSelect,
  handleLoginTestContinue,
  resetFlowState,
  handleLoginResultChoice,
  handleLoginNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'login-page') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Login Page</h2>
        <p>You found a login form on a web page. Start with simple checks and choose how you want to compare the behavior first.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleLoginActionSelect('common-creds')}>
            Try common/default credentials
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleLoginActionSelect('input-behavior')}>
            Test input behavior
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'test-login') {
    const description = selectedAction === 'input-behavior'
      ? 'Try basic usernames and passwords, then make small changes and watch for differences in messages, timing, or validation behavior.'
      : 'Start with simple combinations like admin/admin or admin/password, then try small variations such as admin/admin123 or blank values.'

    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Test Login</h2>
        <p>{description}</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleLoginTestContinue}>
            Continue to Result
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'result') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Result</h2>
        <p>Choose what happened after testing the login form so the flow can guide the next branch.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleLoginResultChoice('login-success')}>
            Login success
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleLoginResultChoice('error-message')}>
            Error message
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleLoginResultChoice('no-change')}>
            No change
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'analyze-error') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Analyze Error</h2>
        <p>Look for differences such as wrong username versus wrong password responses. Even small wording or timing changes can reveal useful clues about the login logic.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleLoginNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'login-success'
    ? 'A successful login with simple credentials is a meaningful signal. Next, confirm what access was granted and whether the same weakness appears elsewhere in the authorized test scope.'
    : selectedOutcome === 'error-message'
      ? 'Different login errors can reveal how authentication decisions are made. Next, compare responses carefully and use that signal to choose the most relevant follow-up flow.'
      : 'Even without visible changes, the login flow may still reveal useful patterns. Keep comparing behavior carefully and move into a more specific follow-up flow if new signals appear.'

  return (
    <>
      <span className="flow-map-story-step">Step 6</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome === 'login-success' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('authz')}>
              Continue to Authorization Testing
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('session')}>
              Continue to Session Testing
            </button>
          </>
        ) : (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('input')}>
              Continue to Input Testing
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('request')}>
              Continue to Request Tampering
            </button>
          </>
        )}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderDiscoveryStoryContent({
  currentStage,
  selectedOutcome,
  feedback,
  handleDiscoveryActionSelect,
  resetFlowState,
  handleDiscoveryEnumerate,
  goToStage,
  handleDiscoveryResultChoice,
  handleDiscoveryNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'web-page-found') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Web Page Found</h2>
        <p>You discovered a website or endpoint, but nothing obvious is visible. Start by confirming what is exposed, then move into hidden content discovery within the authorized scope.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleDiscoveryActionSelect}>
            Look for hidden content
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'discovery') {
    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Discovery</h2>
        <p>Check common paths, hidden files, backup names, and likely directories. Tools such as <strong>ffuf</strong> or <strong>dirb</strong> can help you compare likely routes and filenames more efficiently.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleDiscoveryEnumerate}>
            Continue to Enumerate
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'enumerate') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Enumerate</h2>
        <p>Use directory or file discovery results to compare status codes, redirects, headers, and response differences for interesting hits.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={() => goToStage('result')}>
            Continue to Result
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'result') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Result</h2>
        <p>Select the outcome that best matches what happened during discovery so the flow can guide the next move.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleDiscoveryResultChoice('found-endpoint')}>
            Found new endpoint
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleDiscoveryResultChoice('got-403')}>
            Found a restricted page
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleDiscoveryResultChoice('nothing-found')}>
            Nothing found
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'investigate') {
    return (
      <>
        <span className="flow-map-story-step">Step 6</span>
        <h2>Investigate</h2>
        <p>Open the new endpoint, inspect the content, and look for clues such as parameters, downloadable files, references to hidden areas, or other reusable signals.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleDiscoveryNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'found-endpoint'
    ? 'Keep exploring the content you discovered, then move into other flows if the new page suggests login testing, decoding, or deeper analysis.'
    : selectedOutcome === 'got-403'
      ? 'A restricted response still reveals useful structure. Keep comparing nearby paths and move into other flows if the endpoint suggests authentication or access control checks.'
      : 'If nothing useful appeared yet, broaden the discovery approach and keep exploring nearby paths. Move into other flows when new clues appear.'

  return (
    <>
      <span className="flow-map-story-step">Step 7</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome === 'found-endpoint' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('login')}>
              Continue to Login Testing
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('api')}>
              Continue to API Testing
            </button>
          </>
        ) : selectedOutcome === 'got-403' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('authz')}>
              Continue to Authorization Testing
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('request')}>
              Continue to Request Tampering
            </button>
          </>
        ) : null}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderEnumerationStoryContent({
  currentStage,
  selectedAction,
  selectedOutcome,
  feedback,
  handleEnumerationActionSelect,
  handleEnumerationContinue,
  resetFlowState,
  goToStage,
  handleEnumerationResultChoice,
  handleEnumerationNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'service-found') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Service Found</h2>
        <p>You found an exposed service or host worth exploring. Choose the service family first so the flow can point you toward the most useful enumeration path.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleEnumerationActionSelect('smb')}>
            SMB or Windows service
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleEnumerationActionSelect('directory')}>
            LDAP or directory service
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleEnumerationActionSelect('network')}>
            SNMP or generic network service
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'identify-service') {
    const description = selectedAction === 'smb'
      ? 'Confirm SMB versions, shares, and account exposure with service-aware checks such as Nmap scripts, enum4linux-ng, or smbclient.'
      : selectedAction === 'directory'
        ? 'Confirm bind options, naming context, and exposed users or groups with ldapsearch and basic service fingerprinting.'
        : 'Confirm ports, banners, and protocol details with Nmap and other service-aware checks when they fit the target.'

    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Identify Service</h2>
        <p>{description}</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleEnumerationContinue}>
            Continue to Enumeration
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'enumerate-service') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Enumerate Service</h2>
        <p>Gather concrete data now: usernames, shares, naming contexts, community strings, version details, or readable files that can inform the next step.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={() => goToStage('result')}>
            Continue to Result
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'result') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Result</h2>
        <p>Select the strongest thing you uncovered during enumeration so the flow can steer the follow-up.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleEnumerationResultChoice('found-users')}>
            Found usernames or groups
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleEnumerationResultChoice('found-share')}>
            Found accessible share or files
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleEnumerationResultChoice('found-config')}>
            Found config or version detail
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleEnumerationResultChoice('nothing-useful')}>
            Nothing useful yet
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'inspect-findings') {
    return (
      <>
        <span className="flow-map-story-step">Step 6</span>
        <h2>Inspect Findings</h2>
        <p>Validate what you found and decide how it can be reused. Usernames can inform login testing, shares can expose useful data, and config details can help identify the right follow-up path.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleEnumerationNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'nothing-useful'
    ? 'Try another enumeration angle, widen the checks, or pivot back into recon until a stronger lead stands out.'
    : 'Take the strongest artifact you found and move into the matching follow-up flow, such as login testing, authorization checks, or deeper analysis.'

  return (
    <>
      <span className="flow-map-story-step">Step 7</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome !== 'nothing-useful' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('login')}>
              Continue to Login Testing
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('authz')}>
              Continue to Authorization Testing
            </button>
          </>
        ) : null}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderInputStoryContent({
  currentStage,
  selectedOutcome,
  feedback,
  handleInputActionSelect,
  resetFlowState,
  handleInputContinue,
  handleInputResultChoice,
  handleInputNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'input-field-found') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Input Field Found</h2>
        <p>You found a search box, form, or URL parameter that accepts user input. Start by checking how the application handles simple input changes.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleInputActionSelect}>
            Test how input is handled
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'test-input') {
    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Test Input</h2>
        <p>Enter simple values like normal text, special characters, or quotes such as <strong>&apos;</strong> or <strong>&quot;</strong> and watch how the page reacts.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleInputContinue}>
            Continue to Response Check
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'response-change') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Response Change</h2>
        <p>Select the outcome that best matches what happened after you tested the input field.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleInputResultChoice('page-changed')}>
            Page changed
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleInputResultChoice('error-shown')}>
            Error shown
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleInputResultChoice('no-difference')}>
            No difference
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'analyze-behavior') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Analyze Behavior</h2>
        <p>A visible page change or error can indicate weak input handling. Compare responses carefully and consider trying structured or encoded variations to better understand how the field is processed.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleInputNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'no-difference'
    ? 'Even when nothing obvious changes, keep comparing how the application handles different inputs and move into a more specific flow if stronger signals appear.'
    : 'Use what you observed to guide the next step, especially if the response suggests validation issues, filtering differences, or unsafe input handling.'

  return (
    <>
      <span className="flow-map-story-step">Step 6</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome !== 'no-difference' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('request')}>
              Continue to Request Tampering
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('response')}>
              Continue to Response Analysis
            </button>
          </>
        ) : null}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderApiStoryContent({
  currentStage,
  selectedAction,
  selectedOutcome,
  feedback,
  handleApiActionSelect,
  resetFlowState,
  handleApiContinue,
  goToStage,
  handleApiResultChoice,
  handleApiNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'api-endpoint-found') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>API Endpoint Found</h2>
        <p>You discovered an API endpoint. Choose the first check to understand how the endpoint defines expected inputs and access rules.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleApiActionSelect('openapi-spec')}>
            Check OpenAPI or docs
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleApiActionSelect('traffic-baseline')}>
            Baseline live request traffic
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'inspect-spec') {
    const description = selectedAction === 'openapi-spec'
      ? 'Review schema fields, required auth headers, and response models. Look for endpoints that expose debug, admin, or internal behavior.'
      : 'Capture a valid request and response pair first so you can compare auth and payload changes without extra noise.'

    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Inspect Spec</h2>
        <p>{description}</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleApiContinue}>
            Continue to Auth Testing
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'test-auth') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Test Auth</h2>
        <p>Compare missing tokens, expired tokens, role changes, and method changes. Keep one variable per request so you can attribute behavior clearly.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={() => goToStage('response-review')}>
            Continue to Response Review
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'response-review') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Response Review</h2>
        <p>Choose the strongest signal from your authentication and request-variation checks.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleApiResultChoice('auth-bypass-signals')}>
            Auth bypass signals
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleApiResultChoice('schema-leak')}>
            Schema or debug leak
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleApiResultChoice('stable-response')}>
            Stable response only
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'classify-risk') {
    return (
      <>
        <span className="flow-map-story-step">Step 6</span>
        <h2>Classify Risk</h2>
        <p>Map the behavior to likely issue classes such as broken auth, broken object-level authorization, excessive data exposure, or unsafe debug output.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleApiNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'stable-response'
    ? 'If behavior looked stable, expand coverage to related endpoints, methods, and object IDs before treating the path as lower risk.'
    : 'Preserve the request and response evidence, then move into the most relevant follow-up flow for validation and impact assessment.'

  return (
    <>
      <span className="flow-map-story-step">Step 7</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome !== 'stable-response' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('authz')}>
              Continue to Authorization Testing
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('exploitation')}>
              Continue to Exploitation
            </button>
          </>
        ) : null}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderResponseStoryContent({
  currentStage,
  selectedOutcome,
  feedback,
  handleResponseActionSelect,
  resetFlowState,
  handleResponseContinue,
  handleResponseResultChoice,
  handleResponseNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'response-data-found') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Response Data Found</h2>
        <p>You received a response from a server, API, request, or page that contains structured or unusual data. Start by inspecting the response closely.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleResponseActionSelect}>
            Inspect the response
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'analyze-data') {
    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Analyze Data</h2>
        <p>Look for patterns such as JSON structures, tokens, encoded values, IDs, hidden fields, or anything that seems reusable in later requests.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleResponseContinue}>
            Continue to Data Check
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'interesting-data') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Interesting Data</h2>
        <p>Select the outcome that best matches what you found in the response.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleResponseResultChoice('found-token')}>
            Found token
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleResponseResultChoice('found-encoded-value')}>
            Found encoded value
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleResponseResultChoice('nothing-useful')}>
            Nothing useful
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'investigate-value') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Investigate Value</h2>
        <p>Try decoding, formatting, or identifying the value type. Check whether it looks like a JWT, Base64 blob, JSON object, token, or another reusable value with a clear purpose.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleResponseNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'nothing-useful'
    ? 'Keep reviewing related responses and compare values across requests. If more structure appears later, move into a more specific flow.'
    : 'Use the data you discovered in further requests, validation points, or another flow depending on whether it behaves like a token, encoded value, or structured object.'

  return (
    <>
      <span className="flow-map-story-step">Step 6</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome === 'found-token' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('authz')}>
              Continue to Authorization Testing
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('session')}>
              Continue to Session Testing
            </button>
          </>
        ) : selectedOutcome === 'found-encoded-value' ? (
          <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('decode')}>
            Continue to Decode Flow
          </button>
        ) : null}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderRequestStoryContent({
  currentStage,
  selectedOutcome,
  feedback,
  handleRequestActionSelect,
  resetFlowState,
  handleRequestContinue,
  handleRequestResultChoice,
  handleRequestNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'http-request-observed') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>HTTP Request Observed</h2>
        <p>You captured or noticed a request being sent to the server. Start by choosing whether you want to modify the request and see how the application reacts.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleRequestActionSelect}>
            Modify the request
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'tamper-request') {
    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Tamper Request</h2>
        <p>Change one part of the request at a time. Compare adjustments to parameters, headers, IDs, or values such as <strong>id=1</strong> to <strong>id=2</strong>, and watch how the server responds.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleRequestContinue}>
            Continue to Response Check
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'response-changed') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Response Difference</h2>
        <p>Select the outcome that best matches what happened after you modified the request.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleRequestResultChoice('different-data-returned')}>
            Different data returned
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleRequestResultChoice('error-message')}>
            Error message
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleRequestResultChoice('no-change')}>
            No change
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'analyze-impact') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Analyze Impact</h2>
        <p>A changed response or error can indicate weak validation, missing access control, or trust in client-controlled values. Keep comparing careful variations to understand what the server is actually checking.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleRequestNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'no-change'
    ? 'Keep comparing one change at a time. If later responses begin to differ, move into a more specific follow-up flow.'
    : 'Use the response differences you observed to guide the next step, especially where access control, validation, or data exposure may be involved.'

  return (
    <>
      <span className="flow-map-story-step">Step 6</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome !== 'no-change' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('authz')}>
              Continue to Authorization Testing
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('exploitation')}>
              Continue to Exploitation
            </button>
          </>
        ) : null}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderAuthzStoryContent({
  currentStage,
  selectedAction,
  selectedOutcome,
  feedback,
  handleAuthzActionSelect,
  resetFlowState,
  handleAuthzContinue,
  goToStage,
  handleAuthzResultChoice,
  handleAuthzNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'privileged-action-found') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Privileged Action Found</h2>
        <p>You found an action that should be restricted. Start by choosing which privilege boundary you want to validate first.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleAuthzActionSelect('role-boundary')}>
            Test role boundary
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleAuthzActionSelect('ownership-boundary')}>
            Test ownership boundary
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'baseline-request') {
    const description = selectedAction === 'ownership-boundary'
      ? 'Capture a valid request for your own object first, then compare the same request against another object ID.'
      : 'Capture one allowed request from a privileged account and one denied request from a lower-privileged account if possible.'

    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Baseline Request</h2>
        <p>{description}</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleAuthzContinue}>
            Continue to Role Switch Test
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'role-switch-test') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Role Switch Test</h2>
        <p>Compare the baseline request against lower-privileged tokens, different object IDs, or reduced role context while keeping the request structure consistent.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={() => goToStage('access-result')}>
            Continue to Access Result
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'access-result') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Access Result</h2>
        <p>Select what happened after role or ownership changes.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleAuthzResultChoice('unauthorized-access')}>
            Unauthorized access granted
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleAuthzResultChoice('partial-bypass')}>
            Partial bypass behavior
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleAuthzResultChoice('blocked-correctly')}>
            Blocked correctly
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'confirm-impact') {
    return (
      <>
        <span className="flow-map-story-step">Step 6</span>
        <h2>Confirm Impact</h2>
        <p>Verify exactly what unauthorized read or write scope is exposed, then capture minimal evidence that shows impact without broad data access.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleAuthzNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'blocked-correctly'
    ? 'Authorization controls look correct for this path, but keep sampling nearby endpoints and object types before closing it out.'
    : 'Document the privilege context, request difference, and affected scope, then move into remediation-focused follow-up and controlled impact validation.'

  return (
    <>
      <span className="flow-map-story-step">Step 7</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome !== 'blocked-correctly' ? (
          <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('exploitation')}>
            Continue to Exploitation
          </button>
        ) : null}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderExploitationStoryContent({
  currentStage,
  selectedAction,
  selectedOutcome,
  feedback,
  handleExploitationActionSelect,
  handleExploitationContinue,
  resetFlowState,
  goToStage,
  handleExploitationResultChoice,
  handleExploitationNextStep
}) {
  if (currentStage === 'confirmed-finding') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Confirmed Finding</h2>
        <p>You already have a validated issue in an authorized target. Start by deciding how to demonstrate impact with the least disruptive action that still makes the finding clear.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleExploitationActionSelect('read-only-proof')}>
            Use a read-only proof
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleExploitationActionSelect('bounded-change')}>
            Use a tightly bounded change
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'prepare-validation') {
    const description = selectedAction === 'bounded-change'
      ? 'Define the smallest allowed state change, how you will verify it, and how you will restore the target immediately after the proof.'
      : 'Use the smallest request or interaction that demonstrates the issue without changing data when possible, and define exactly what success should look like.'

    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Prepare Validation</h2>
        <p>{description}</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleExploitationContinue}>
            Continue to Execution
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'execute-safely') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Execute Safely</h2>
        <p>Carry out the approved validation step once, observe the exact response, and avoid repeated or broader actions beyond the agreed test plan.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={() => goToStage('impact-observed')}>
            Continue to Result
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'impact-observed') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Impact Observed</h2>
        <p>Choose the outcome that best matches the controlled validation so the flow can guide the right wrap-up.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleExploitationResultChoice('confirmed-impact')}>
            Clear impact confirmed
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleExploitationResultChoice('partial-impact')}>
            Partial impact only
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleExploitationResultChoice('no-safe-proof')}>
            No safe proof yet
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'document-impact') {
    return (
      <>
        <span className="flow-map-story-step">Step 6</span>
        <h2>Document Impact</h2>
        <p>Capture the exact request, response, observed effect, scope, and cleanup details. A good record should let another reviewer understand the issue without recreating broad impact.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleExploitationNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'no-safe-proof'
    ? 'Refine the validation plan, tighten the scope, and return only when you can demonstrate the issue clearly and safely.'
    : 'Package the evidence, scope, impact, and remediation notes so the finding can move cleanly into review and fixing.'

  return (
    <>
      <span className="flow-map-story-step">Step 7</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        <button type="button" className="flow-map-button" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderInfoDisclosureStoryContent({
  currentStage,
  selectedAction,
  selectedOutcome,
  feedback,
  handleInfoDisclosureActionSelect,
  resetFlowState,
  handleInfoDisclosureContinue,
  handleInfoDisclosureResultChoice,
  handleInfoDisclosureNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'source-found') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Source Found</h2>
        <p>You found client-side code, an error page, or a response that might leak internal details. Choose where to start looking.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleInfoDisclosureActionSelect('page-source')}>
            Review page source and JS files
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleInfoDisclosureActionSelect('error-response')}>
            Trigger and inspect error responses
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleInfoDisclosureActionSelect('config-files')}>
            Probe for exposed config files
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'inspect-source') {
    const description = selectedAction === 'page-source'
      ? 'Look for HTML comments, hardcoded API keys, internal URLs, developer notes, and JS files that reveal endpoint paths or tokens.'
      : selectedAction === 'error-response'
        ? 'Trigger error conditions with malformed input, invalid paths, or missing parameters. Watch for stack traces, framework versions, file paths, and database details.'
        : 'Check for exposed config and support files such as .git/HEAD, .env, .DS_Store, backups (.bak, .old, ~), and common debug endpoints.'

    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Inspect Source</h2>
        <p>{description}</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleInfoDisclosureContinue}>
            Continue to Data Check
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'sensitive-data') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Sensitive Data?</h2>
        <p>Select what you found so the flow can guide the right next move.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleInfoDisclosureResultChoice('found-secrets')}>
            Found credentials or keys
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleInfoDisclosureResultChoice('found-source')}>
            Found source code or internal paths
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleInfoDisclosureResultChoice('nothing-sensitive')}>
            Nothing sensitive
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'assess-exposure') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Assess Exposure</h2>
        <p>Evaluate the scope: can leaked credentials be reused elsewhere? Do internal paths reveal hidden endpoints? Document exactly what is exposed and how it expands the attack surface.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleInfoDisclosureNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'found-secrets'
    ? 'Leaked credentials or keys should be assessed carefully. Use the Login flow for credential pairs or the API Testing flow for API keys and tokens.'
    : selectedOutcome === 'found-source'
      ? 'Internal paths and source code can reveal hidden endpoints, logic clues, and parameter names. Feed those signals into Discovery or Input Testing flows.'
      : 'No clear leak appeared yet. Broaden the search to alternate error conditions, backup files, and other response formats before closing.'

  return (
    <>
      <span className="flow-map-story-step">Step 6</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome === 'found-secrets' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('login')}>
              Continue to Login Testing
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('api')}>
              Continue to API Testing
            </button>
          </>
        ) : selectedOutcome === 'found-source' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('discovery')}>
              Continue to Discovery
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('input')}>
              Continue to Input Testing
            </button>
          </>
        ) : null}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderSessionStoryContent({
  currentStage,
  selectedAction,
  selectedOutcome,
  feedback,
  handleSessionActionSelect,
  resetFlowState,
  handleSessionContinue,
  handleSessionResultChoice,
  handleSessionNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'session-captured') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Session Captured</h2>
        <p>You have an active session token or cookie. Choose what to check first.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleSessionActionSelect('cookie-flags')}>
            Check cookie flags and scope
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleSessionActionSelect('session-lifecycle')}>
            Test session lifecycle
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleSessionActionSelect('csrf-check')}>
            Check CSRF protection
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'inspect-session') {
    const description = selectedAction === 'cookie-flags'
      ? 'Check Secure, HttpOnly, and SameSite attributes, along with cookie domain, path scope, and whether the session ID appears strong enough.'
      : selectedAction === 'session-lifecycle'
        ? 'Check whether session IDs rotate after login, whether old tokens remain valid after logout, and how expired sessions are handled.'
        : 'Identify state-changing endpoints and check whether anti-CSRF protections are enforced. Compare behavior when the token is missing or changed.'

    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Inspect Session</h2>
        <p>{description}</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleSessionContinue}>
            Continue to Test
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'test-session') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Test Session</h2>
        <p>Run the check and compare before and after behavior. Change one variable at a time, such as swapping tokens between users, replaying expired tokens, or removing CSRF fields.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={() => handleSessionResultChoice('fixation-possible')}>
            Session fixation possible
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleSessionResultChoice('missing-flags')}>
            Missing security flags
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleSessionResultChoice('csrf-missing')}>
            CSRF protection missing
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleSessionResultChoice('session-secure')}>
            Session looks secure
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'session-result') {
    const resultCopy = selectedOutcome === 'fixation-possible'
      ? 'Session fixation means a known session ID may be usable before login. This is a meaningful finding if the token is not rotated during authentication.'
      : selectedOutcome === 'missing-flags'
        ? 'Missing Secure, HttpOnly, or SameSite flags increase the risk of session theft or misuse.'
        : selectedOutcome === 'csrf-missing'
          ? 'State-changing actions without CSRF protection may be vulnerable to cross-site request submission.'
          : 'Session handling looks correct for this endpoint. Keep checking other actions and edge cases.'

    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Session Result</h2>
        <p>{resultCopy}</p>
        {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleSessionNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'session-secure'
    ? 'Session controls look solid here. Keep sampling other endpoints and check whether token behavior changes across privilege levels.'
    : 'Document the session weakness and consider moving into Authorization Testing to see whether it compounds with privilege boundary issues.'

  return (
    <>
      <span className="flow-map-story-step">Step 6</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome !== 'session-secure' ? (
          <>
            <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('authz')}>
              Continue to Authorization Testing
            </button>
            <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleFollowUpFlow('exploitation')}>
              Continue to Exploitation
            </button>
          </>
        ) : null}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderUploadStoryContent({
  currentStage,
  selectedAction,
  selectedOutcome,
  feedback,
  handleUploadActionSelect,
  resetFlowState,
  handleUploadContinue,
  handleUploadResultChoice,
  handleUploadNextStep,
  handleFollowUpFlow
}) {
  if (currentStage === 'upload-found') {
    return (
      <>
        <span className="flow-map-story-step">Step 2</span>
        <h2>Upload Found</h2>
        <p>You found a file upload endpoint. Choose the first angle based on what the upload appears to accept.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleUploadActionSelect('extension-bypass')}>
            Test extension filtering
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleUploadActionSelect('mime-confusion')}>
            Test MIME type handling
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleUploadActionSelect('content-check')}>
            Test content-based validation
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'test-upload') {
    const description = selectedAction === 'extension-bypass'
      ? 'Compare how the upload handles double extensions, null-byte variants, case changes, and uncommon executable extensions.'
      : selectedAction === 'mime-confusion'
        ? 'Compare how the server handles differences between the file extension and the declared Content-Type header.'
        : 'Compare how the upload handles valid file headers, mixed-content files, or files whose content does not fully match their apparent type.'

    return (
      <>
        <span className="flow-map-story-step">Step 3</span>
        <h2>Test Upload</h2>
        <p>{description}</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleUploadContinue}>
            Continue to Result
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Restart
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'upload-result') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Upload Result</h2>
        <p>Select what happened after your upload attempt.</p>
        <div className="flow-map-actions flow-map-actions--stacked">
          <button type="button" className="flow-map-button" onClick={() => handleUploadResultChoice('file-executed')}>
            File was executed server-side
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleUploadResultChoice('filter-bypassed')}>
            Filter bypassed but not executed
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={() => handleUploadResultChoice('upload-blocked')}>
            Upload was blocked
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'analyze-upload') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Analyze Upload</h2>
        <p>Determine the full scope: where the file is stored, whether it can be accessed directly, whether the server parses or renders it, and what content types are served back to the browser.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleUploadNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'file-executed'
    ? 'Server-side execution through upload is a serious finding. Move into controlled validation so you can demonstrate impact safely and document the full chain.'
    : selectedOutcome === 'filter-bypassed'
      ? 'A bypassed filter is still a meaningful finding even without execution. Document the bypass method and assess whether the stored file creates additional risk.'
      : 'If the upload was blocked, compare alternate file types, validation paths, and request context to see whether the filtering changes under different conditions.'

  return (
    <>
      <span className="flow-map-story-step">Step 6</span>
      <h2>Next Step</h2>
      <p>{nextStepCopy}</p>
      {feedback ? <p className="flow-map-feedback">{feedback}</p> : null}
      <div className="flow-map-actions">
        {selectedOutcome === 'file-executed' ? (
          <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('exploitation')}>
            Continue to Exploitation
          </button>
        ) : selectedOutcome === 'filter-bypassed' ? (
          <button type="button" className="flow-map-button" onClick={() => handleFollowUpFlow('request')}>
            Continue to Request Tampering
          </button>
        ) : null}
        <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
          Restart
        </button>
      </div>
    </>
  )
}

export function renderFlowStoryContent({ selectedFlow, storyProps }) {
  let content

  if (selectedFlow === 'login') {
    content = renderLoginStoryContent(storyProps)
  } else if (selectedFlow === 'discovery') {
    content = renderDiscoveryStoryContent(storyProps)
  } else if (selectedFlow === 'enumeration') {
    content = renderEnumerationStoryContent(storyProps)
  } else if (selectedFlow === 'input') {
    content = renderInputStoryContent(storyProps)
  } else if (selectedFlow === 'api') {
    content = renderApiStoryContent(storyProps)
  } else if (selectedFlow === 'response') {
    content = renderResponseStoryContent(storyProps)
  } else if (selectedFlow === 'request') {
    content = renderRequestStoryContent(storyProps)
  } else if (selectedFlow === 'authz') {
    content = renderAuthzStoryContent(storyProps)
  } else if (selectedFlow === 'exploitation') {
    content = renderExploitationStoryContent(storyProps)
  } else if (selectedFlow === 'info-disclosure') {
    content = renderInfoDisclosureStoryContent(storyProps)
  } else if (selectedFlow === 'session') {
    content = renderSessionStoryContent(storyProps)
  } else if (selectedFlow === 'upload') {
    content = renderUploadStoryContent(storyProps)
  } else {
    content = renderDecodeStoryContent(storyProps)
  }

  const stageGuidance = getStageGuidance(selectedFlow, storyProps.currentStage)

  return (
    <>
      {content}
      {renderStageGuidance(stageGuidance)}
    </>
  )
}
