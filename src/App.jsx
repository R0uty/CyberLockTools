import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import {
  LockKeyIcon,
  CheckmarkBadge01Icon,
  BookOpen01Icon,
  SmileIcon,
  GitPullRequestIcon,
} from 'hugeicons-react'
import { useSEO } from './hooks/useSEO'
import Header from './components/Header'
import HomeToolMap from './components/HomeToolMap'
import FeedbackToast from './components/FeedbackToast'
import { TOOL_CATALOG, buildToolComponents } from './data/toolRegistry'
import './App.css'
import './App.extra.css'

const ROT = lazy(() => import('./pages/ROT'))
const Base64 = lazy(() => import('./pages/Base64'))
const URLEncoder = lazy(() => import('./pages/URLEncoder'))
const HashGenerator = lazy(() => import('./pages/HashGenerator'))
const CronParser = lazy(() => import('./pages/CronParser'))
const JWTDebugger = lazy(() => import('./pages/JWTDebugger'))
const JSONFormatter = lazy(() => import('./pages/JSONFormatter'))
const YAMLFormatter = lazy(() => import('./pages/YAMLFormatter'))
const MarkdownPreview = lazy(() => import('./pages/MarkdownPreview'))
const RegexTester = lazy(() => import('./pages/RegexTester'))
const XMLFormatter = lazy(() => import('./pages/XMLFormatter'))
const SQLFormatter = lazy(() => import('./pages/SQLFormatter'))
const CSVFormatter = lazy(() => import('./pages/CSVFormatter'))
const UUIDGenerator = lazy(() => import('./pages/UUIDGenerator'))
const TimestampConverter = lazy(() => import('./pages/TimestampConverter'))
const PasswordGenerator = lazy(() => import('./pages/PasswordGenerator'))
const JWTEncoder = lazy(() => import('./pages/JWTEncoder'))
const QRCodeGenerator = lazy(() => import('./pages/QRCodeGenerator'))
const ColorConverter = lazy(() => import('./pages/ColorConverter'))
const CSSBeautifier = lazy(() => import('./pages/CSSBeautifier'))
const HTMLEncoder = lazy(() => import('./pages/HTMLEncoder'))
const CSPGenerator = lazy(() => import('./pages/CSPGenerator'))
const ReverseShellGenerator = lazy(() => import('./pages/ReverseShellGenerator'))
const XXEGenerator = lazy(() => import('./pages/XXEGenerator'))
const XSSGenerator = lazy(() => import('./pages/XSSGenerator'))
const SQLInjectionGenerator = lazy(() => import('./pages/SQLInjectionGenerator'))
const NoSQLInjectionGenerator = lazy(() => import('./pages/NoSQLInjectionGenerator'))
const GraphQLInjectionGenerator = lazy(() => import('./pages/GraphQLInjectionGenerator'))
const SSTIGenerator = lazy(() => import('./pages/SSTIGenerator'))
const HTTPParameterPollutionGenerator = lazy(() => import('./pages/HTTPParameterPollutionGenerator'))
const CommandInjectionGenerator = lazy(() => import('./pages/CommandInjectionGenerator'))
const LDAPInjectionGenerator = lazy(() => import('./pages/LDAPInjectionGenerator'))
const PathTraversalGenerator = lazy(() => import('./pages/PathTraversalGenerator'))
const SSRFGenerator = lazy(() => import('./pages/SSRFGenerator'))
const NumberBaseConverter = lazy(() => import('./pages/NumberBaseConverter'))
const SubnetCalculator = lazy(() => import('./pages/SubnetCalculator'))
const TextToDSL = lazy(() => import('./pages/TextToDSL'))
const DiffViewer = lazy(() => import('./pages/DiffViewer'))
const HTTPHeadersParser = lazy(() => import('./pages/HTTPHeadersParser'))
const Tools = lazy(() => import('./pages/Tools'))
const FlowMap = lazy(() => import('./pages/FlowMap'))
const LabNotes = lazy(() => import('./pages/LabNotes'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

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
    navigateTo('tools', null, category)
  }

  const handleLogoClick = () => {
    navigateTo('home', null, null)
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
          <p>{tools.length}+ browser-based tools for encoding, analysis, formatting, generation, and security workflows.</p>
        </div>
        <div className="site-footer-links">
          <button className="site-footer-link" onClick={() => handlePageChange('tools')}>Tools</button>
          <button className="site-footer-link" onClick={() => handlePageChange('flow-map')}>Flow Map</button>
          <button className="site-footer-link" onClick={() => handlePageChange('lab-notes')}>Lab Notes</button>
          <button className="site-footer-link" onClick={() => handlePageChange('about')}>About</button>
          <button className="site-footer-link" onClick={() => handlePageChange('contact')}>Contact</button>
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
            tools={tools}
            onToolClick={handleToolClick}
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

  return renderAppShell(
    <>
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">Flow-first cyber lab</span>
            <h1>Guided Security Workflows With the Right Tools Underneath</h1>
            <p>R0uty&apos;s Cyber Lab is a browser-first suite for walking through recon, enumeration, entry-point analysis, testing, vulnerability validation, and controlled proof workflows. The Flow Map gives you the path, and the toolset supports the work at each step.</p>
            <div className="privacy-badge hero-privacy-badge">
              All processing happens in your browser • No data is sent to server
            </div>
            <div className="hero-actions">
              <button className="cta-button" onClick={() => handlePageChange('flow-map')}>Open Flow Map</button>
              <button className="hero-secondary-button" onClick={() => handlePageChange('tools')}>Browse My Tools</button>
              <button className="hero-secondary-button" onClick={() => handlePageChange('about')}>About the Lab</button>
            </div>
          </div>

          <div className="hero-summary">
            <div className="hero-summary-card">
              <span className="hero-summary-label">Main Feature</span>
              <strong>Flow Map</strong>
              <p>Guided, visual paths for authorized security workflows directly in the browser.</p>
            </div>
            <div className="hero-summary-card">
              <span className="hero-summary-label">Categories</span>
              <strong>6 live</strong>
              <p>Recon, enumeration, entry point, testing, vulnerability, and exploitation flows now anchor the suite.</p>
            </div>
            <div className="hero-summary-card">
              <span className="hero-summary-label">Tools</span>
              <strong>{tools.length}+</strong>
              <p>Browser utilities stay available for decoding, formatting, inspection, and standalone tasks.</p>
            </div>
            <div className="hero-summary-card">
              <span className="hero-summary-label">Privacy</span>
              <strong>100%</strong>
              <p>Browser-side processing keeps payloads, text, and tokens off the server.</p>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-intro">
            <span className="features-kicker">Why this lab exists</span>
            <h2>Built for repeatable security workflows, not just isolated utilities</h2>
            <p>The goal is to make common assessment paths easier to follow visually, then back them with fast browser tools so you can inspect, compare, decode, and document without losing context.</p>
          </div>

          <div className="features-grid">
            <article className="feature-item">
              <div className="feature-icon-wrapper"><LockKeyIcon size={28} color="#c0c0c0" /></div>
              <div className="feature-copy">
                <h3>Privacy first</h3>
                <p>Everything runs in the browser so sensitive text, payloads, tokens, and samples stay on your machine.</p>
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
              <div className="feature-icon-wrapper"><BookOpen01Icon size={28} color="#c0c0c0" /></div>
              <div className="feature-copy">
                <h3>Made to teach</h3>
                <p>Flows and tools are written to help both working practitioners and people learning how structured assessments unfold.</p>
              </div>
            </article>
            <article className="feature-item">
              <div className="feature-icon-wrapper"><SmileIcon size={28} color="#c0c0c0" /></div>
              <div className="feature-copy">
                <h3>Low-friction UX</h3>
                <p>Simple inputs, clear outputs, and focused flows keep the experience lightweight instead of noisy.</p>
              </div>
            </article>
            <article className="feature-item">
              <div className="feature-icon-wrapper"><GitPullRequestIcon size={28} color="#c0c0c0" /></div>
              <div className="feature-copy">
                <h3>Guided flow maps</h3>
                <p>Use the Flow Map to move through recon, enumeration, testing, and validation decisions with clear next steps and recommended tooling.</p>
              </div>
            </article>
          </div>
        </section>
    </>,
    { showMap: true }
  )
}
