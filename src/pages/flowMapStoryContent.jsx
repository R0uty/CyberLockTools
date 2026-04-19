import React from 'react'

const DECODE_TOOLS = ['ROT', 'Base64', 'URL Encoder']

export function renderStartStoryContent({ currentFlow, handleStartClick, clearFlow }) {
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
        <h2>Encoded?</h2>
        <p>You found a suspicious string: <strong>uryyb</strong> — this might be encoded data.</p>
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
        <p>Use a simple decoder first. Try ROT, Base64, or URL decode and see if the suspicious string becomes readable.</p>
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
            ? `After trying ${selectedTool}, choose the result that matches what you saw.`
            : 'Choose the result that best matches what you got back from the decoder.'}
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
      <p>You decoded the string (<strong>hello</strong>) and now have a useful value. Next step: test it in input fields or validation points.</p>
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
        <p>You found a login form on a web page. Start simple and choose how you want to probe the behavior first.</p>
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
      ? 'Try basic usernames and passwords, then use slight variations and watch for changes in messaging, timing, or validation behavior.'
      : 'Start with simple combinations like admin/admin or admin/password, then try slight variations such as admin/admin123 or blank values.'

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
        <p>Look for differences like wrong username versus wrong password responses. Even small wording or timing changes can reveal useful behavior in the login logic.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleLoginNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'login-success'
    ? 'A successful login with simple credentials points to a real weakness. Next, verify what access was gained and whether weak defaults can be repeated elsewhere.'
    : selectedOutcome === 'error-message'
      ? 'Different login errors can reveal weakness in how authentication is checked. The next step is to test basic injection or bypass ideas and compare responses carefully.'
      : 'Even without visible changes, login behavior should still be tested further. Small bypass attempts or basic injection checks may expose weaknesses hidden behind generic responses.'

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
        <p>You discovered a website or endpoint but nothing obvious is visible. Start by checking host and service exposure with <strong>Nmap</strong>, then move into hidden content discovery.</p>
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
        <p>Check common paths, hidden files, backup names, and likely directories. Tools like <strong>ffuf</strong> or <strong>dirb</strong> make this faster by applying wordlists against likely routes and filenames.</p>
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
        <p>Run directory or file discovery with <strong>ffuf</strong> or <strong>dirb</strong>, and use <strong>curl</strong> to confirm status codes, redirects, headers, and response differences for interesting hits.</p>
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
            Got forbidden / 403
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
        <p>Open the new endpoint, inspect the content, and look for clues such as parameters, downloadable files, references to hidden areas, or flag-like values.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleDiscoveryNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'found-endpoint'
    ? 'Keep exploring the content you discovered, then apply other flows if the new page suggests login testing, decoding, or deeper analysis.'
    : selectedOutcome === 'got-403'
      ? 'A forbidden response still reveals useful structure. Continue exploration around that area and apply other flows if the endpoint suggests authentication or hidden content.'
      : 'If nothing useful appeared yet, expand the discovery approach and keep exploring nearby paths. Switch to other flows when new clues appear.'

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
              Continue to Login Entry
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
      ? 'Confirm SMB versions, shares, and account exposure with Nmap scripts, enum4linux-ng, and smbclient.'
      : selectedAction === 'directory'
        ? 'Confirm bind options, naming context, and exposed users or groups with ldapsearch and basic service fingerprinting.'
        : 'Confirm ports, banners, and protocol details with Nmap plus service-aware checks like snmpwalk when they fit the target.'

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
        <p>Pull concrete data now: usernames, shares, naming contexts, community strings, version details, or readable files that can become your next foothold.</p>
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
        <p>Validate what you found and decide how it can be reused. Usernames can feed login testing, shares can expose credentials or code, and config details can reveal the right vulnerability path.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleEnumerationNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'nothing-useful'
    ? 'Try another enumeration angle, widen the script set, or pivot back into recon until a better service or host stands out.'
    : 'Take the best artifact you found and pivot into the matching flow, such as an entry point, testing, or vulnerability path.'

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
              Continue to Login Entry
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
        <p>A visible page change or error can indicate improper input handling. Compare responses carefully and consider trying structured inputs or encoded variations to learn how the field is processed.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleInputNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'no-difference'
    ? 'Even when nothing obvious changes, keep testing for common filtering issues or move into a more specific flow if later responses reveal more clues.'
    : 'Use what you observed to test for common vulnerabilities like injection or filtering issues, or switch into a more specific flow that matches the response behavior.'

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
      ? 'Review schema fields, required auth headers, and response models. Look for endpoints exposing debug, admin, or internal actions.'
      : 'Capture a valid request/response pair first so you can compare auth and payload changes without extra noise.'

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
        <p>Try missing token, expired token, role-swapped token, and method changes. Keep one variable per request so you can attribute behavior precisely.</p>
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
        <p>Choose the strongest signal from your auth and request variation checks.</p>
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
    ? 'If behavior looked stable, expand coverage to related endpoints, methods, and object IDs before marking the path low-risk.'
    : 'Preserve request/response evidence, then pivot into vulnerability validation with minimal reproducible API calls.'

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
        <p>Change one part of the request at a time. Try adjusting parameters, headers, IDs, or values such as <strong>id=1</strong> to <strong>id=2</strong>, or remove and alter fields to compare the server response.</p>
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
        <h2>Response Changed?</h2>
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
        <p>A changed response or error can indicate weak validation, missing access control, or trust in client-controlled values. Keep testing careful variations to learn what the server is really checking.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleRequestNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'no-change'
    ? 'Keep manipulating the request and compare one change at a time. If later responses shift, move into deeper testing with input or enumeration flows.'
    : 'Continue manipulating requests and combine what you learned with other flows like input testing or enumeration to deepen the finding.'

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
        <p>You found an action that should be restricted. Start by choosing what privilege boundary you want to validate first.</p>
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
      ? 'Capture a valid request for your own object first, then prepare the same request against another object ID.'
      : 'Capture one allowed request from a privileged account and one denied request from a lower role if possible.'

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
        <p>Replay the baseline request with lower-privileged tokens, altered object IDs, or removed role hints while keeping request structure constant.</p>
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
        <p>Select what happened after role and ownership changes.</p>
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
        <p>Verify exactly what unauthorized read or write scope is exposed, then capture minimal evidence that proves impact without broad data access.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleAuthzNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'blocked-correctly'
    ? 'Authorization controls look correct for this path, but keep sampling nearby endpoints and object types before closing.'
    : 'Document the privilege context, request difference, and affected scope, then move to remediation guidance for server-side authorization enforcement.'

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
        <p>You already have a validated issue in an authorized target. Start by deciding how to prove impact with the least-disruptive action that still demonstrates the problem clearly.</p>
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
      : 'Use a minimal request or interaction that reveals the issue without changing data when possible, and capture exactly what success will look like.'

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
        <p>Run the proof once in a controlled way, watch the exact response, and avoid broad or repeated actions that go beyond the approved validation plan.</p>
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
        <p>Choose the outcome that best matches the controlled proof so the flow can guide the right wrap-up.</p>
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
    ? 'Refine the validation plan, tighten scope, and return only when you can demonstrate impact safely and clearly.'
    : 'Package the proof with remediation notes, scope, and evidence so the finding can move cleanly into triage and fixing.'

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
      ? 'Look for HTML comments, hardcoded API keys, internal URLs, developer TODO notes, and JS files that reveal endpoint paths or tokens.'
      : selectedAction === 'error-response'
        ? 'Force errors with malformed input, invalid paths, or missing parameters. Watch for stack traces, framework versions, file paths, and database details.'
        : 'Check for .git/HEAD, .env, .DS_Store, backup files (.bak, .old, ~), and common debug endpoints like /debug, /actuator, or /elmah.'

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
        <p>Evaluate the scope: can leaked credentials be used elsewhere? Do internal paths reveal hidden endpoints? Document exactly what is exposed and how it extends the attack surface.</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleInfoDisclosureNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'found-secrets'
    ? 'Leaked credentials or keys should be tested immediately. Use the Login flow for credential pairs, or the API Testing flow for API keys and tokens.'
    : selectedOutcome === 'found-source'
      ? 'Internal paths and source code can reveal hidden endpoints, logic flaws, and parameter names. Feed them into Discovery or Input Testing flows.'
      : 'No clear leak yet. Broaden the search to alternate error conditions, backup files, and different response formats before closing.'

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
              Continue to Login Entry
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
      ? 'Check Secure, HttpOnly, SameSite attributes, cookie domain and path scope, and whether the session ID has enough entropy.'
      : selectedAction === 'session-lifecycle'
        ? 'Test whether session IDs rotate after login, whether old tokens remain valid after logout, and how the server handles expired sessions.'
        : 'Identify state-changing endpoints and check whether they enforce anti-CSRF tokens. Try removing or modifying the token to see if the action still succeeds.'

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
        <p>Run the test and compare before/after behavior. Change one thing at a time: swap tokens between users, replay expired tokens, or remove CSRF fields entirely.</p>
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
      ? 'Session fixation means an attacker can set a known session ID before login. This is a real finding if the token is not rotated on authentication.'
      : selectedOutcome === 'missing-flags'
        ? 'Missing Secure, HttpOnly, or SameSite flags increase the risk of session theft through XSS or insecure transport.'
        : selectedOutcome === 'csrf-missing'
          ? 'State-changing actions without CSRF protection can be exploited via cross-site requests from attacker-controlled pages.'
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
    ? 'Session controls look solid here. Keep sampling other endpoints and check whether token behavior changes under different privilege levels.'
    : 'Document the session weakness and consider moving into Authorization Testing to check if the issue compounds with privilege boundary problems.'

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
        <p>You found a file upload endpoint. Choose the first testing angle based on what the upload appears to accept.</p>
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
      ? 'Try double extensions (.php.jpg), null bytes (file.php%00.jpg), case variations (.PhP), and uncommon executable extensions (.phtml, .shtml).'
      : selectedAction === 'mime-confusion'
        ? 'Upload a file with a safe extension but change the Content-Type header to something executable, or vice versa. Compare how the server stores and serves it.'
        : 'Upload files with valid image headers but embedded code (polyglot files), or files that start with valid magic bytes but contain payloads after the header.'

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
        <p>Determine the full scope: where is the file stored, can it be accessed directly, does the server parse or render it, and what content types are served back to the browser?</p>
        <div className="flow-map-actions">
          <button type="button" className="flow-map-button" onClick={handleUploadNextStep}>
            Continue to Next Step
          </button>
        </div>
      </>
    )
  }

  const nextStepCopy = selectedOutcome === 'file-executed'
    ? 'Server-side execution through upload is a critical finding. Move directly to controlled exploitation to prove impact safely and document the chain.'
    : selectedOutcome === 'filter-bypassed'
      ? 'A bypassed filter is still a finding even without execution. Document the bypass method and check if the stored file can be weaponized through other means.'
      : 'Upload was blocked. Try alternate bypass techniques, different file types, or check whether the filtering changes based on request context or user role.'

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
  if (selectedFlow === 'login') {
    return renderLoginStoryContent(storyProps)
  }

  if (selectedFlow === 'discovery') {
    return renderDiscoveryStoryContent(storyProps)
  }

  if (selectedFlow === 'enumeration') {
    return renderEnumerationStoryContent(storyProps)
  }

  if (selectedFlow === 'input') {
    return renderInputStoryContent(storyProps)
  }

  if (selectedFlow === 'api') {
    return renderApiStoryContent(storyProps)
  }

  if (selectedFlow === 'response') {
    return renderResponseStoryContent(storyProps)
  }

  if (selectedFlow === 'request') {
    return renderRequestStoryContent(storyProps)
  }

  if (selectedFlow === 'authz') {
    return renderAuthzStoryContent(storyProps)
  }

  if (selectedFlow === 'exploitation') {
    return renderExploitationStoryContent(storyProps)
  }

  if (selectedFlow === 'info-disclosure') {
    return renderInfoDisclosureStoryContent(storyProps)
  }

  if (selectedFlow === 'session') {
    return renderSessionStoryContent(storyProps)
  }

  if (selectedFlow === 'upload') {
    return renderUploadStoryContent(storyProps)
  }

  return renderDecodeStoryContent(storyProps)
}
