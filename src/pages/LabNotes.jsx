import React, { useMemo, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import PageHeader from '../components/PageHeader'
import { getLabNote } from '../data/labNotes'
import {
  buildWorkspaceExport,
  clearWorkspaceCases,
  createWorkspaceCaseFromSession,
  deleteWorkspaceCase,
  getCurrentWorkspaceDraft,
  readWorkspaceCases,
  saveWorkspaceCase
} from '../utils/labWorkspace'
import { showFeedback } from '../utils/feedback'
import '../styles/pages/LabNotes.css'

const CATEGORY_NOTES = {
  'Penetration Testing': 'These notes are for authorized testing, education, and lab work only.'
}

const FLOW_SKILL_NOTES = [
  {
    title: 'Flow Map Guidance',
    summary: 'Flow Map now includes guided paths for recon, enumeration, entry-point, testing, vulnerability, and controlled exploitation.',
    highlights: [
      'Each flow has stage-by-stage story guidance so next actions stay clear.',
      'Recommended tools are shown inline with concrete usage examples.',
      'API and authorization testing paths are now part of the active flow set.'
    ]
  },
  {
    title: 'Agent Skills Suggestions',
    summary: 'Selected flows now surface agent skill suggestions that map directly to the current testing objective.',
    highlights: [
      'Skill cards include difficulty labels (beginner, intermediate, advanced).',
      'Suggestions help bridge from “what tool to use” to “what capability to apply”.',
      'Use this section as a quick checklist while walking through a flow.'
    ]
  }
]

function downloadWorkspaceExport(content) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = objectUrl
  link.download = `lab-workspace-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  link.rel = 'noopener'
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}

function formatCaseTimestamp(value) {
  if (!value) {
    return 'Unknown'
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString()
}

export default function LabNotes({ tools, onToolClick, onOpenWorkspaceCase }) {
  useSEO({
    title: 'Lab Notes & Workspace - Tool Explanations and Saved Cases',
    description: 'Browse tool notes and save browser-only case files from Flow Map state inside R0uty\'s Cyber Lab workspace.',
    keywords: 'lab notes, cyber lab workspace, saved case files, flow map notes, browser-only security notes'
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [workspaceCases, setWorkspaceCases] = useState(() => readWorkspaceCases())
  const [caseTitle, setCaseTitle] = useState('')
  const [caseTags, setCaseTags] = useState('')
  const [currentDraft, setCurrentDraft] = useState(() => getCurrentWorkspaceDraft())
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredTools = useMemo(() => {
    if (!normalizedQuery) return tools

    return tools.filter((tool) => {
      const note = getLabNote(tool)
      return (
        tool.title.toLowerCase().includes(normalizedQuery) ||
        tool.category.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery) ||
        note.what.toLowerCase().includes(normalizedQuery) ||
        note.usedFor.toLowerCase().includes(normalizedQuery) ||
        note.example.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [normalizedQuery, tools])

  const groupedTools = useMemo(() => (
    filteredTools.reduce((acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = []
      }
      acc[tool.category].push(tool)
      return acc
    }, {})
  ), [filteredTools])

  const categories = Object.keys(groupedTools)

  return (
    <div className="tool-page lab-notes-page">
      <PageHeader
        kicker="Lab reference"
        title="Lab Notes"
        subtitle="Simple notes for every tool in the lab: what it is, where it is used, and a quick example."
        pills={[
          { label: 'Notes', value: String(filteredTools.length) },
          { label: 'Categories', value: String(categories.length) },
          { label: 'Style', value: 'Reference first' },
        ]}
      />

      <div className="tool-container">
        <section className="tool-section lab-workspace-panel">
          <div className="lab-workspace-header">
            <div>
              <span className="lab-notes-category-kicker">Browser workspace</span>
              <h2>Saved Case Files</h2>
              <p>Save the current Flow Map session into a persistent browser-only case file, then reopen it later without re-entering the details by hand.</p>
            </div>
            <div className="lab-workspace-header-meta">
              <span>{workspaceCases.length} saved case{workspaceCases.length !== 1 ? 's' : ''}</span>
              <span>{currentDraft ? 'Flow draft ready' : 'No active Flow Map draft'}</span>
            </div>
          </div>

          {currentDraft ? (
            <div className="lab-workspace-draft">
              <div className="lab-workspace-draft-grid">
                <div>
                  <strong>Flow</strong>
                  <span>{currentDraft.flowLabel}</span>
                </div>
                <div>
                  <strong>Stage</strong>
                  <span>{currentDraft.currentStageLabel}</span>
                </div>
                <div>
                  <strong>Evidence</strong>
                  <span>{currentDraft.evidenceCount}</span>
                </div>
                <div>
                  <strong>Decisions</strong>
                  <span>{currentDraft.decisionCount}</span>
                </div>
              </div>

              <div className="lab-workspace-form">
                <div className="textarea-group">
                  <label htmlFor="lab-workspace-title">Case title</label>
                  <input
                    id="lab-workspace-title"
                    type="text"
                    value={caseTitle}
                    onChange={(event) => setCaseTitle(event.target.value)}
                    placeholder={currentDraft.titleSuggestion}
                  />
                </div>
                <div className="textarea-group">
                  <label htmlFor="lab-workspace-tags">Tags</label>
                  <input
                    id="lab-workspace-tags"
                    type="text"
                    value={caseTags}
                    onChange={(event) => setCaseTags(event.target.value)}
                    placeholder="auth, idor, cors"
                  />
                </div>
              </div>

              <div className="button-group lab-workspace-actions">
                <button
                  type="button"
                  className="action-btn encode-btn"
                  onClick={() => {
                    try {
                      const caseFile = createWorkspaceCaseFromSession({
                        title: caseTitle,
                        tags: caseTags
                      })
                      setWorkspaceCases(saveWorkspaceCase(caseFile))
                      setCaseTitle('')
                      setCaseTags('')
                      setCurrentDraft(getCurrentWorkspaceDraft())
                      showFeedback('Case file saved to browser workspace')
                    } catch (error) {
                      showFeedback(error.message, 'error')
                    }
                  }}
                >
                  Save current Flow Map snapshot
                </button>
                <button
                  type="button"
                  className="action-btn clear-btn"
                  onClick={() => setCurrentDraft(getCurrentWorkspaceDraft())}
                >
                  Refresh snapshot
                </button>
                <button
                  type="button"
                  className="action-btn decode-btn"
                  onClick={() => {
                    if (workspaceCases.length === 0) {
                      showFeedback('Save at least one case before exporting the workspace', 'error')
                      return
                    }

                    downloadWorkspaceExport(buildWorkspaceExport(workspaceCases))
                    showFeedback('Workspace export downloaded')
                  }}
                >
                  Export workspace JSON
                </button>
                <button
                  type="button"
                  className="action-btn clear-btn"
                  onClick={() => {
                    setWorkspaceCases(clearWorkspaceCases())
                    showFeedback('Workspace cleared')
                  }}
                >
                  Clear workspace
                </button>
              </div>
            </div>
          ) : (
            <div className="lab-workspace-empty">
              <h3>No current Flow Map draft</h3>
              <p>Open Flow Map, walk through a path, add notes or evidence, then return here to save it as a case file.</p>
            </div>
          )}

          {workspaceCases.length > 0 ? (
            <div className="lab-workspace-cases">
              {workspaceCases.map((caseFile) => (
                <article key={caseFile.id} className="lab-workspace-case-card">
                  <div className="lab-workspace-case-top">
                    <div>
                      <span className="lab-note-card-label">{caseFile.flowLabel}</span>
                      <h3>{caseFile.title}</h3>
                    </div>
                    <span className="lab-workspace-case-time">{formatCaseTimestamp(caseFile.updatedAt)}</span>
                  </div>

                  <div className="lab-workspace-case-metadata">
                    <span><strong>Stage:</strong> {caseFile.currentStageLabel}</span>
                    <span><strong>Evidence:</strong> {caseFile.evidenceCount}</span>
                    <span><strong>Decisions:</strong> {caseFile.decisionCount}</span>
                    <span><strong>Visited stages:</strong> {caseFile.visitedStageCount}</span>
                  </div>

                  {caseFile.tags?.length ? (
                    <div className="lab-workspace-tag-list" aria-label="Case tags">
                      {caseFile.tags.map((tag) => (
                        <span key={`${caseFile.id}-${tag}`} className="lab-workspace-tag">{tag}</span>
                      ))}
                    </div>
                  ) : null}

                  {caseFile.notes ? (
                    <p className="lab-workspace-case-notes">{caseFile.notes}</p>
                  ) : (
                    <p className="lab-workspace-case-notes lab-workspace-case-notes--empty">No saved notes for this case yet.</p>
                  )}

                  <div className="button-group lab-workspace-case-actions">
                    <button
                      type="button"
                      className="action-btn encode-btn"
                      onClick={() => onOpenWorkspaceCase?.(caseFile)}
                    >
                      Reopen in Flow Map
                    </button>
                    {caseFile.selectedTool ? (
                      <button
                        type="button"
                        className="action-btn decode-btn"
                        onClick={() => onToolClick(caseFile.selectedTool)}
                      >
                        Open {caseFile.selectedTool}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="action-btn clear-btn"
                      onClick={() => {
                        setWorkspaceCases(deleteWorkspaceCase(caseFile.id))
                        showFeedback('Case file removed from workspace')
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="lab-workspace-empty lab-workspace-empty--saved">
              <h3>No saved case files yet</h3>
              <p>Your saved browser workspace will appear here after you capture a Flow Map snapshot.</p>
            </div>
          )}
        </section>

        <section className="tool-section lab-notes-updates-panel">
          <div className="lab-notes-updates-header">
            <span className="lab-notes-category-kicker">Platform updates</span>
            <h2>Flow + Agent Skills Notes</h2>
            <p>Quick reference for recent workflow and agent skill integration updates across the lab.</p>
          </div>
          <div className="lab-notes-updates-grid">
            {FLOW_SKILL_NOTES.map((note) => (
              <article key={note.title} className="lab-notes-update-card">
                <h3>{note.title}</h3>
                <p>{note.summary}</p>
                <ul>
                  {note.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="tool-section lab-notes-search-panel">
          <div className="textarea-group">
            <label htmlFor="lab-notes-search">Search the notes</label>
            <input
              id="lab-notes-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by tool name, category, use case, or explanation..."
            />
          </div>
          <p className="lab-notes-search-copy">
            {normalizedQuery
              ? `Showing ${filteredTools.length} matching note${filteredTools.length !== 1 ? 's' : ''}.`
              : `Showing all ${tools.length} tool notes across the lab.`}
          </p>
        </section>

        {categories.length > 0 ? (
          categories.map((category) => (
            <section key={category} className="tool-section lab-notes-category-section">
              <div className="lab-notes-category-header">
                <div>
                  <span className="lab-notes-category-kicker">Category</span>
                  <h2>{category}</h2>
                </div>
                <div className="lab-notes-category-count">
                  {groupedTools[category].length} note{groupedTools[category].length !== 1 ? 's' : ''}
                </div>
              </div>

              {CATEGORY_NOTES[category] && (
                <div className="lab-notes-category-callout">
                  {CATEGORY_NOTES[category]}
                </div>
              )}

              <div className="lab-notes-grid">
                {groupedTools[category].map((tool) => {
                  const note = getLabNote(tool)

                  return (
                    <article key={tool.title} className="lab-note-card">
                      <div className="lab-note-card-top">
                        <div>
                          <span className="lab-note-card-label">{tool.category}</span>
                          <h3>{tool.title}</h3>
                        </div>
                        <button
                          className="action-btn clear-btn lab-note-open-btn"
                          onClick={() => onToolClick(tool.title)}
                        >
                          Open Tool
                        </button>
                      </div>

                      <p className="lab-note-card-description">{tool.description}</p>

                      <div className="lab-note-detail">
                        <strong>What it is</strong>
                        <p>{note.what}</p>
                      </div>

                      <div className="lab-note-detail">
                        <strong>Where it is used</strong>
                        <p>{note.usedFor}</p>
                      </div>

                      <div className="lab-note-example">
                        <strong>Example</strong>
                        <p>{note.example}</p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))
        ) : (
          <section className="tool-section lab-notes-empty-state">
            <h2>No notes matched your search</h2>
            <p>Try a broader keyword such as parser, encoder, security, token, formatter, or network.</p>
          </section>
        )}
      </div>
    </div>
  )
}
