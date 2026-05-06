import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSEO } from './hooks/useSEO'
import Header from './components/Header'
import PageHeader from './components/PageHeader'
import HomeToolMap from './components/HomeToolMap'
import FeedbackToast from './components/FeedbackToast'
import ToolContextPanel from './components/ToolContextPanel'
import { TOOL_CATALOG, buildToolComponentsFromModules } from './data/toolRegistry'
import { getRelatedFlowStages, getRelatedGuides } from './data/toolContext'
import {
  STORAGE_FLOW_KEY,
  STORAGE_OUTCOME_PROFILE_KEY,
  STORAGE_STAGE_KEY,
  STORAGE_TOOL_FLOW_ORIGIN_KEY
} from './data/flowMapConfig'
import { restoreWorkspaceCaseSession } from './utils/labWorkspace'
import { readSessionValue, writeSessionValue } from './utils/sessionStorage'
import './styles/app/App.css'
import './styles/app/App.extra.css'

const TOOL_MODULE_LOADERS = import.meta.glob('./tools/*.jsx')
const TOOL_COMPONENTS = buildToolComponentsFromModules(TOOL_MODULE_LOADERS, (moduleLoader) => lazy(moduleLoader))

const Tools = lazy(() => import('./pages/Tools'))
const FlowMap = lazy(() => import('./pages/FlowMap'))
const LabNotes = lazy(() => import('./pages/LabNotes'))
const About = lazy(() => import('./pages/About'))
const Skills = lazy(() => import('./pages/Skills'))
const ToolGuides = lazy(() => import('./pages/ToolGuides'))

function readJsonValue(key) {
  try {
    const raw = readSessionValue(key, '')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

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

  const handleToolClick = (title, flowOrigin = null) => {
    if (flowOrigin && typeof flowOrigin === 'object') {
      writeSessionValue(STORAGE_TOOL_FLOW_ORIGIN_KEY, JSON.stringify({
        ...flowOrigin,
        toolTitle: title,
        timestamp: new Date().toISOString()
      }))
    } else {
      writeSessionValue(STORAGE_TOOL_FLOW_ORIGIN_KEY, '')
    }

    navigateTo('tools', title, null)
  }

  const handleLogoClick = () => {
    navigateTo('home', null, null)
  }

  const handleToolReferenceClick = (toolGuideName) => {
    navigateTo('tool-guides', null, toolGuideName)
  }

  const handleFlowStageReferenceClick = (flowKey, stageId) => {
    writeSessionValue(STORAGE_FLOW_KEY, flowKey)
    writeSessionValue(STORAGE_STAGE_KEY, stageId)
    navigateTo('flow-map', null, null)
  }

  const handleWorkspaceCaseOpen = useCallback((caseFile) => {
    restoreWorkspaceCaseSession(caseFile)
    navigateTo('flow-map', null, null)
  }, [navigateTo])

  const handleCategoryClick = (category) => {
    if (category === 'skills') navigateTo('skills')
    else navigateTo('tools', null, category)
  }

  const tools = TOOL_CATALOG
  const activeToolMeta = currentTool ? tools.find((tool) => tool.title === currentTool) : null

  const flowOriginContext = useMemo(() => {
    if (!currentTool) {
      return null
    }

    const origin = readJsonValue(STORAGE_TOOL_FLOW_ORIGIN_KEY)
    if (!origin || typeof origin !== 'object') {
      return null
    }

    if (origin.toolTitle && origin.toolTitle !== currentTool) {
      return null
    }

    const flowKey = typeof origin.flowKey === 'string' ? origin.flowKey : ''
    const stageId = typeof origin.stageId === 'string' ? origin.stageId : ''
    if (!flowKey || !stageId) {
      return null
    }

    let recommendedFlowKey = typeof origin.recommendedFlowKey === 'string' ? origin.recommendedFlowKey : ''
    let recommendedStageId = typeof origin.recommendedStageId === 'string' ? origin.recommendedStageId : ''

    if (!recommendedFlowKey || !recommendedStageId) {
      const outcomeProfile = readJsonValue(STORAGE_OUTCOME_PROFILE_KEY)
      const firstRecommendation = outcomeProfile?.recommendedNextFlows?.[0]
      if (firstRecommendation?.flowKey) {
        recommendedFlowKey = firstRecommendation.flowKey
        recommendedStageId = typeof firstRecommendation.stageId === 'string'
          ? firstRecommendation.stageId
          : stageId
      }
    }

    return {
      flowKey,
      stageId,
      recommendedFlowKey,
      recommendedStageId,
      recommendationReason: typeof origin.recommendationReason === 'string' ? origin.recommendationReason : ''
    }
  }, [currentTool])

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

  const ActiveToolComponent = currentTool ? TOOL_COMPONENTS[currentTool] : null

  if (ActiveToolComponent) {
    const relatedGuides = getRelatedGuides(activeToolMeta?.title ?? currentTool)
    const relatedFlowStages = getRelatedFlowStages(activeToolMeta?.title ?? currentTool)

    return renderAppShell(
      <>
        <ActiveToolComponent />
        <ToolContextPanel
          toolTitle={activeToolMeta?.title ?? currentTool}
          relatedGuides={relatedGuides}
          relatedFlowStages={relatedFlowStages}
          flowOriginContext={flowOriginContext}
          onOpenGuide={handleToolReferenceClick}
          onOpenFlowStage={handleFlowStageReferenceClick}
        />
      </>
    )
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
        onOpenWorkspaceCase={handleWorkspaceCaseOpen}
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
    </section>,
    { showMap: true }
  )
}
