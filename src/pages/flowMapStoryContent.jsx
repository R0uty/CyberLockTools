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
          Begin flow
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
            Reset flow
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
        <h2>Result?</h2>
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
      <p>You decoded the string (<strong>hello</strong>) — this could be a flag, password, or key; next step is to use it in input fields or validation points.</p>
      <div className="flow-map-actions">
        <button type="button" className="flow-map-button" onClick={resetFlowState}>
          Restart flow
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
  handleLoginNextStep
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
            Continue to result
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Reset flow
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'result') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Result?</h2>
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
            Continue to next step
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
        <button type="button" className="flow-map-button" onClick={resetFlowState}>
          Restart flow
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
  handleDiscoveryNextStep
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
            Reset flow
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
            Continue to enumerate
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
            Continue to result
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'result') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Result?</h2>
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
            Continue to next step
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
        <button type="button" className="flow-map-button" onClick={resetFlowState}>
          Restart flow
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
  handleEnumerationNextStep
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
            Continue to enumeration
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Reset flow
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
            Continue to result
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'result') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Result?</h2>
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
            Continue to next step
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
        <button type="button" className="flow-map-button" onClick={resetFlowState}>
          Restart flow
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
  handleInputNextStep
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
            Reset flow
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
            Continue to response check
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'response-change') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Response Change?</h2>
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
            Continue to next step
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
        <button type="button" className="flow-map-button" onClick={resetFlowState}>
          Restart flow
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
  handleResponseNextStep
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
            Reset flow
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
            Continue to data check
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'interesting-data') {
    return (
      <>
        <span className="flow-map-story-step">Step 4</span>
        <h2>Interesting Data?</h2>
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
            Continue to next step
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
        <button type="button" className="flow-map-button" onClick={resetFlowState}>
          Restart flow
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
  handleRequestNextStep
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
            Reset flow
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
            Continue to response check
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
            Continue to next step
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
        <button type="button" className="flow-map-button" onClick={resetFlowState}>
          Restart flow
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
            Continue to execution
          </button>
          <button type="button" className="flow-map-button flow-map-button--ghost" onClick={resetFlowState}>
            Reset flow
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
            Continue to result
          </button>
        </div>
      </>
    )
  }

  if (currentStage === 'impact-observed') {
    return (
      <>
        <span className="flow-map-story-step">Step 5</span>
        <h2>Impact Observed?</h2>
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
            Continue to next step
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
          Restart flow
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

  if (selectedFlow === 'response') {
    return renderResponseStoryContent(storyProps)
  }

  if (selectedFlow === 'request') {
    return renderRequestStoryContent(storyProps)
  }

  if (selectedFlow === 'exploitation') {
    return renderExploitationStoryContent(storyProps)
  }

  return renderDecodeStoryContent(storyProps)
}
