import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useSEO } from './hooks/useSEO'
import Header from './components/Header'
import PageHeader from './components/PageHeader'
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
const Skills = lazy(() => import('./pages/Skills'))
const ToolGuides = lazy(() => import('./pages/ToolGuides'))

export default function App() {
  const [currentTool, setCurrentTool] = useState(() => window.history.state?.tool ?? null)
  const [currentPage, setCurrentPage] = useState(() => window.history.state?.page ?? 'home')
  const [currentCategory, setCurrentCategory] = useState(() => window.history.state?.category ?? null)

  useSEO({
    title: "R0uty's Cyber Lab - Flow-Driven Security Toolkit",
    description: "My personal cyber lab with practical flow maps, browser-based tools, and pentesting references for authorized testing.",
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

  const handleLogoClick = () => {
    navigateTo('home', null, null)
  }

  const handleToolReferenceClick = (toolGuideName) => {
    navigateTo('tool-guides', null, toolGuideName)
  }

  const handleCategoryClick = (category) => {
    if (category === 'skills') navigateTo('skills')
    else navigateTo('tools', null, category)
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
        <span className="site-footer-brand">R0uty&apos;s Cyber Lab</span>
        <nav className="site-footer-links">
          <button className="site-footer-link" onClick={() => handlePageChange('flow-map')}>Flow Map</button>
          <button className="site-footer-link" onClick={() => handlePageChange('tools')}>Tools</button>
          <button className="site-footer-link" onClick={() => handlePageChange('skills')}>Skills</button>
          <button className="site-footer-link" onClick={() => handlePageChange('tool-guides')}>Pentesting Tools</button>
          <button className="site-footer-link" onClick={() => handlePageChange('lab-notes')}>Lab Notes</button>
          <button className="site-footer-link" onClick={() => handlePageChange('about')}>About</button>
        </nav>
        <span className="site-footer-note">Browser-only · No data sent</span>
      </div>
    </footer>
  )

  const renderAppShell = (content) => {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} currentPage={currentPage} onPageChange={handlePageChange} />
        <FeedbackToast />
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

  if (currentPage === 'skills') {
    return renderAppShell(<Skills />)
  }

  if (currentPage === 'tool-guides') {
    return renderAppShell(<ToolGuides initialToolName={currentCategory} />)
  }

  return renderAppShell(
    <>
      <HomeToolMap
        onCategoryClick={handleCategoryClick}
        onFlowMapClick={() => handlePageChange('flow-map')}
      />
      <section className="home-landing">
        <PageHeader
        kicker="My personal lab"
        title="A Practical Cyber Lab I Built for Real Testing Work"
        subtitle="Flow maps, browser tools, payload helpers, and agent skills — built for authorized testing with zero signup friction."
        pills={[
          { label: 'Flows', value: '13 paths' },
          { label: 'Tools', value: `${tools.length}+` },
          { label: 'Skills', value: '51' },
          { label: 'Privacy', value: '100 %' },
        ]}
      />

      <div className="home-actions">
        <button className="home-action-card" onClick={() => handlePageChange('flow-map')}>
          <strong>Flow Map</strong>
          <p>Stage-by-stage paths for recon, enumeration, entry points, testing, and exploitation.</p>
        </button>
        <button className="home-action-card" onClick={() => handlePageChange('tools')}>
          <strong>General Tools &amp; Payloads</strong>
          <p>Browser-side utilities and payload builders for analysis work.</p>
        </button>
        <button className="home-action-card" onClick={() => handlePageChange('skills')}>
          <strong>Agent Skills</strong>
          <p>Structured pentesting and bug bounty skills for agent workflows.</p>
        </button>
      </div>

      <div className="privacy-badge">
        All processing happens in your browser · No data is sent to any server
      </div>
    </section>
    </>
  )
}
