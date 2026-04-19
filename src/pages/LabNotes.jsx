import { useMemo, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import PageHeader from '../components/PageHeader'
import { getLabNote } from '../data/labNotes'
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

export default function LabNotes({ tools, onToolClick }) {
  useSEO({
    title: 'Lab Notes - Tool Explanations and Use Cases',
    description: 'Browse lab notes for every tool in R0uty\'s Cyber Lab, with simple explanations of what each tool is and where it is commonly used.',
    keywords: 'lab notes, cyber lab reference, tool explanations, what is base64, what is cron, security tool notes'
  })

  const [searchQuery, setSearchQuery] = useState('')
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
