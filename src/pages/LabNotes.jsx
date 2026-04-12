import { useMemo, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { getLabNote } from '../data/labNotes'
import './LabNotes.css'

const CATEGORY_NOTES = {
  'Penetration Testing': 'These notes are for authorized testing, education, and lab work only.'
}

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
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>

      <div className="tool-header">
        <span className="lab-notes-kicker">Lab reference</span>
        <h1>Lab Notes</h1>
        <p>Simple notes for every tool in the lab: what it is, where it is used, and a quick example to make the collection easier to learn and browse.</p>
        <div className="lab-notes-header-meta">
          <div className="lab-notes-header-pill"><span>Notes</span><strong>{filteredTools.length}</strong></div>
          <div className="lab-notes-header-pill"><span>Categories</span><strong>{categories.length}</strong></div>
          <div className="lab-notes-header-pill"><span>Style</span><strong>Reference first</strong></div>
        </div>
      </div>

      <div className="tool-container">
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
