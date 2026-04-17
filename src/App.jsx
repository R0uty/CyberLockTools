import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import {
  LockKeyIcon,
  CheckmarkBadge01Icon,
  BookOpen01Icon,
  SmileIcon,
  GitPullRequestIcon,
  AiBrain01Icon,
} from 'hugeicons-react'
import { useSEO } from './hooks/useSEO'
import Header from './components/Header'
import HomeToolMap from './components/HomeToolMap'
import FeedbackToast from './components/FeedbackToast'
import { TOOL_CATALOG, buildToolComponents } from './data/toolRegistry'
import './styles/app/App.css'
import './styles/app/App.extra.css'

const ROT = lazy(() => import('./tools/ROT'))
const Base64 = lazy(() => import('./tools/Base64'))
const URLEncoder = lazy(() => import('./tools/URLEncoder'))
const HashGenerator = lazy(() => import('./tools/HashGenerator'))
const CronParser = lazy(() => import('./tools/CronParser'))
const JWTDebugger = lazy(() => import('./tools/JWTDebugger'))
const JSONFormatter = lazy(() => import('./tools/JSONFormatter'))
const YAMLFormatter = lazy(() => import('./tools/YAMLFormatter'))
const MarkdownPreview = lazy(() => import('./tools/MarkdownPreview'))
const RegexTester = lazy(() => import('./tools/RegexTester'))
const XMLFormatter = lazy(() => import('./tools/XMLFormatter'))
const SQLFormatter = lazy(() => import('./tools/SQLFormatter'))
const CSVFormatter = lazy(() => import('./tools/CSVFormatter'))
const UUIDGenerator = lazy(() => import('./tools/UUIDGenerator'))
const TimestampConverter = lazy(() => import('./tools/TimestampConverter'))
const PasswordGenerator = lazy(() => import('./tools/PasswordGenerator'))
const JWTEncoder = lazy(() => import('./tools/JWTEncoder'))
const QRCodeGenerator = lazy(() => import('./tools/QRCodeGenerator'))
const ColorConverter = lazy(() => import('./tools/ColorConverter'))
const CSSBeautifier = lazy(() => import('./tools/CSSBeautifier'))
const HTMLEncoder = lazy(() => import('./tools/HTMLEncoder'))
const CSPGenerator = lazy(() => import('./tools/CSPGenerator'))
const ReverseShellGenerator = lazy(() => import('./tools/ReverseShellGenerator'))
const XXEGenerator = lazy(() => import('./tools/XXEGenerator'))
const XSSGenerator = lazy(() => import('./tools/XSSGenerator'))
const SQLInjectionGenerator = lazy(() => import('./tools/SQLInjectionGenerator'))
const NoSQLInjectionGenerator = lazy(() => import('./tools/NoSQLInjectionGenerator'))
const GraphQLInjectionGenerator = lazy(() => import('./tools/GraphQLInjectionGenerator'))
const SSTIGenerator = lazy(() => import('./tools/SSTIGenerator'))
const HTTPParameterPollutionGenerator = lazy(() => import('./tools/HTTPParameterPollutionGenerator'))
const CommandInjectionGenerator = lazy(() => import('./tools/CommandInjectionGenerator'))
const LDAPInjectionGenerator = lazy(() => import('./tools/LDAPInjectionGenerator'))
const PathTraversalGenerator = lazy(() => import('./tools/PathTraversalGenerator'))
const SSRFGenerator = lazy(() => import('./tools/SSRFGenerator'))
const NumberBaseConverter = lazy(() => import('./tools/NumberBaseConverter'))
const SubnetCalculator = lazy(() => import('./tools/SubnetCalculator'))
const TextToDSL = lazy(() => import('./tools/TextToDSL'))
const DiffViewer = lazy(() => import('./tools/DiffViewer'))
const HTTPHeadersParser = lazy(() => import('./tools/HTTPHeadersParser'))
const Tools = lazy(() => import('./pages/Tools'))
const FlowMap = lazy(() => import('./pages/FlowMap'))
const LabNotes = lazy(() => import('./pages/LabNotes'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Skills = lazy(() => import('./pages/Skills'))
const ToolGuides = lazy(() => import('./pages/ToolGuides'))

export default function App() {
  const [currentTool, setCurrentTool] = useState(() => window.history.state?.tool ?? null)
  const [currentPage, setCurrentPage] = useState(() => window.history.state?.page ?? 'home')
  const [currentCategory, setCurrentCategory] = useState(() => window.history.state?.category ?? null)

  useSEO({
    title: "R0uty's Cyber Lab - Flow-Driven Security Toolkit",
    description: "R0uty's Cyber Lab is a browser-first suite for guided recon, enumeration, entry-point, testing, vulnerability, and validation workflows.",
    keywords: 'security workflow tools, recon flow, enumeration flow, browser tools, cyber lab, r0uty'
  })

  const applyNavigationState = useCallback((state) => {
    setCurrentPage(state?.page ?? 'home')
    setCurrentTool(state?.tool ?? null)
    setCurrentCategory(state?.category ?? null)
  }, [])

  const navigateTo = useCallback((page, tool = null, category = null, options = {}) => {
    const nextState = { page, tool, category }
    const currentState = window.history.state

    applyNavigationState(nextState)

    if (
      currentState?.page === nextState.page &&
      currentState?.tool === nextState.tool &&
      currentState?.category === nextState.category
    ) {
      return
    }

    const historyMethod = options.replace ? 'replaceState' : 'pushState'
    window.history[historyMethod](nextState, '')
    window.scrollTo(0, 0)
  }, [applyNavigationState])

  useEffect(() => {
    const initialState = window.history.state?.page
      ? window.history.state
      : { page: 'home', tool: null, category: null }

    window.history.replaceState(initialState, '')

    const handlePopState = (event) => {
      applyNavigationState(event.state ?? { page: 'home', tool: null, category: null })
      window.scrollTo(0, 0)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [applyNavigationState])

  const handlePageChange = (page) => {
    navigateTo(page, null, null)
  }

  const handleToolClick = (title) => {
    navigateTo('tools', title, null)
  }

  const handleCategoryClick = (category) => {
    if (category === 'skills') {
      navigateTo('skills', null, null)
    } else {
      navigateTo('tools', null, category)
    }
  }

  const handleLogoClick = () => {
    navigateTo('home', null, null)
  }

  const handleToolReferenceClick = (toolGuideName) => {
    navigateTo('tool-guides', null, toolGuideName)
  }

  const tools = TOOL_CATALOG

  const toolComponents = buildToolComponents({
    ROT,
    Base64,
    URLEncoder,
    HashGenerator,
    CronParser,
    JWTDebugger,
    JSONFormatter,
    YAMLFormatter,
    MarkdownPreview,
    RegexTester,
    DiffViewer,
    HTTPHeadersParser,
    XMLFormatter,
    SQLFormatter,
    CSVFormatter,
    UUIDGenerator,
    TimestampConverter,
    PasswordGenerator,
    JWTEncoder,
    QRCodeGenerator,
    ColorConverter,
    CSSBeautifier,
    HTMLEncoder,
    CSPGenerator,
    ReverseShellGenerator,
    XXEGenerator,
    XSSGenerator,
    SQLInjectionGenerator,
    NoSQLInjectionGenerator,
    GraphQLInjectionGenerator,
    SSTIGenerator,
    HTTPParameterPollutionGenerator,
    SSRFGenerator,
    CommandInjectionGenerator,
    LDAPInjectionGenerator,
    PathTraversalGenerator,
    NumberBaseConverter,
    SubnetCalculator,
    TextToDSL
  })

  const renderFooter = () => (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <strong>R0uty&apos;s Cyber Lab</strong>
          <p>{tools.length}+ browser-based general tools and payload generators for encoding, analysis, formatting, and security workflows.</p>
        </div>
        <div className="site-footer-links">
          <button className="site-footer-link" onClick={() => handlePageChange('tools')}>General Tools &amp; Payloads</button>
          <button className="site-footer-link" onClick={() => handlePageChange('flow-map')}>Flow Map</button>
          <button className="site-footer-link" onClick={() => handlePageChange('tool-guides')}>Pentesting Tools</button>
          <button className="site-footer-link" onClick={() => handlePageChange('lab-notes')}>Lab Notes</button>
          <button className="site-footer-link" onClick={() => handlePageChange('about')}>About</button>
          <button className="site-footer-link" onClick={() => handlePageChange('contact')}>Contact</button>
          <button className="site-footer-link" onClick={() => handlePageChange('skills')}>Agent Skills</button>
        </div>
        <p className="site-footer-note">All processing happens locally in your browser.</p>
      </div>
    </footer>
  )

  const renderAppShell = (content, options = {}) => {
    const { showMap = false } = options

    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <FeedbackToast />
        {showMap && (
          <HomeToolMap
            onCategoryClick={handleCategoryClick}
            onFlowMapClick={() => handlePageChange('flow-map')}
          />
        )}
        <div className="main-content">
          <Suspense fallback={<div className="page-loading" role="status" aria-live="polite">Loading…</div>}>
            {content}
          </Suspense>
        </div>
        {renderFooter()}
      </div>
    )
  }

  const ActiveToolComponent = currentTool ? toolComponents[currentTool] : null

  if (ActiveToolComponent) {
    return renderAppShell(<ActiveToolComponent />)
  }

  if (currentPage === 'tools' && !currentTool) {
    return renderAppShell(
      <Tools
        tools={tools}
        onToolClick={handleToolClick}
        initialCategory={currentCategory}
      />
    )
  }

  if (currentPage === 'about') {
    return renderAppShell(<About />)
  }

  if (currentPage === 'flow-map') {
    return renderAppShell(
        <FlowMap
          tools={tools}
          onToolClick={handleToolClick}
          onToolReferenceClick={handleToolReferenceClick}
        />
      )
  }

  if (currentPage === 'lab-notes') {
    return renderAppShell(
      <LabNotes
        tools={tools}
        onToolClick={handleToolClick}
      />
    )
  }

  if (currentPage === 'contact') {
    return renderAppShell(<Contact />)
  }

  if (currentPage === 'skills') {
    return renderAppShell(<Skills />)
  }

  if (currentPage === 'tool-guides') {
    return renderAppShell(<ToolGuides initialToolName={currentCategory} />)
  }

  return renderAppShell(
    <>
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">Flow-first cyber lab</span>
            <h1>Guided Security Workflows, General Tools &amp; Payloads, and Agent Skills for Authorized Testing</h1>
            <p>R0uty&apos;s Cyber Lab is a browser-first suite for walking through recon, enumeration, entry-point analysis, testing, and vulnerability validation. The Flow Map gives you the path, the general tool and payload set supports each step, and the agent skill library arms AI agents with structured pentesting and bug bounty knowledge.</p>
            <div className="privacy-badge hero-privacy-badge">
              All processing happens in your browser • No data is sent to server
            </div>
            <div className="hero-actions">
              <button className="cta-button" onClick={() => handlePageChange('flow-map')}>Open Flow Map</button>
              <button className="hero-secondary-button" onClick={() => handlePageChange('skills')}>Browse Agent Skills</button>
              <button className="hero-secondary-button" onClick={() => handlePageChange('tools')}>Browse General Tools &amp; Payloads</button>
            </div>
          </div>

          <div className="hero-summary">
            <div className="hero-summary-card">
              <span className="hero-summary-label">Flow Map</span>
              <strong>10 flows</strong>
              <p>Recon, enumeration, entry-point, testing, vulnerability, and exploitation paths with stage-by-stage guidance.</p>
            </div>
            <div className="hero-summary-card">
              <span className="hero-summary-label">General Tools &amp; Payloads</span>
              <strong>{tools.length}+</strong>
              <p>Browser utilities for decoding, formatting, inspection, generation, and payload crafting.</p>
            </div>
            <div className="hero-summary-card">
              <span className="hero-summary-label">Agent Skills</span>
              <strong>51 skills</strong>
              <p>Structured pentesting and bug bounty definitions with agent hints, ready to copy as JSON.</p>
            </div>
            <div className="hero-summary-card">
              <span className="hero-summary-label">Privacy</span>
              <strong>100%</strong>
              <p>Browser-side processing keeps payloads, tokens, and samples off the server.</p>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-intro">
            <span className="features-kicker">What the lab gives you</span>
            <h2>Workflows, general tools, payloads, and agent skills in one place</h2>
            <p>Common assessment paths made visual, backed by fast browser tools and payload generators, and paired with a structured skill library you can feed directly to AI agents.</p>
          </div>

          <div className="features-grid">
            <article className="feature-item">
              <div className="feature-icon-wrapper"><GitPullRequestIcon size={28} color="#c0c0c0" /></div>
              <div className="feature-copy">
                <h3>Guided flow maps</h3>
                <p>10 flows covering recon, enumeration, entry-point, testing, vulnerability, and exploitation. Each stage links to relevant tools and gives you clear next steps.</p>
              </div>
            </article>
            <article className="feature-item">
              <div className="feature-icon-wrapper"><AiBrain01Icon size={28} color="#22b8ff" /></div>
              <div className="feature-copy">
                <h3>Agent skills for AI workflows</h3>
                <p>51 structured pentesting and bug bounty skills with agent hints. Filter by category or difficulty, then copy any skill as JSON to paste into a prompt.</p>
              </div>
            </article>
            <article className="feature-item">
              <div className="feature-icon-wrapper"><BookOpen01Icon size={28} color="#c0c0c0" /></div>
              <div className="feature-copy">
                <h3>Made to teach</h3>
                <p>Flows and skill definitions are written to help both working practitioners and people learning how structured assessments unfold step by step.</p>
              </div>
            </article>
            <article className="feature-item">
              <div className="feature-icon-wrapper"><LockKeyIcon size={28} color="#c0c0c0" /></div>
              <div className="feature-copy">
                <h3>Privacy first</h3>
                <p>Everything runs in the browser. Payloads, tokens, samples, and notes never leave your machine.</p>
              </div>
            </article>
            <article className="feature-item">
              <div className="feature-icon-wrapper"><CheckmarkBadge01Icon size={28} color="#c0c0c0" /></div>
              <div className="feature-copy">
                <h3>Fast by default</h3>
                <p>No uploads, queues, or back-and-forth. Paste input, get the result immediately, move on.</p>
              </div>
            </article>
            <article className="feature-item">
              <div className="feature-icon-wrapper"><SmileIcon size={28} color="#c0c0c0" /></div>
              <div className="feature-copy">
                <h3>Low-friction UX</h3>
                <p>Simple inputs, clear outputs, and focused flows. No noise, no accounts, no tracking.</p>
              </div>
            </article>
          </div>
        </section>
    </>,
    { showMap: true }
  )
}
