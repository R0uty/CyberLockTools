import React, { useEffect, useMemo, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import PageHeader from '../components/PageHeader'
import { TOOL_GUIDES, TOOL_GUIDE_CATEGORY_ORDER } from '../data/toolGuides'
import '../styles/pages/Skills.css'
import '../styles/pages/ToolGuides.css'

function slugify(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ToolGuides({ initialToolName = '' }) {
  useSEO({
    title: 'Pentesting Tools — R0uty\'s Cyber Lab',
    description: 'My pentesting tool quick-reference with concise usage examples and practical notes.',
    keywords: 'nmap, dirbuster, ffuf, burp suite, recon tools, security tool examples'
  })

  const [copiedExampleKey, setCopiedExampleKey] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const highlightedId = useMemo(() => slugify(initialToolName), [initialToolName])

  const visibleTools = useMemo(() => (
    activeCategory === 'all'
      ? TOOL_GUIDES
      : TOOL_GUIDES.filter((tool) => tool.category === activeCategory)
  ), [activeCategory])

  useEffect(() => {
    if (!highlightedId) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const card = document.getElementById(`tool-guide-${highlightedId}`)
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [highlightedId])

  const copyExample = (example, key) => {
    navigator.clipboard.writeText(example).then(() => {
      setCopiedExampleKey(key)
      window.setTimeout(() => setCopiedExampleKey(''), 1400)
    })
  }

  return (
    <div className="tool-page skills-page tool-guides-page">
      <PageHeader
        kicker="Pentesting reference"
        title="Pentesting Tools for Recon and Testing"
        subtitle="Quick-reference list. Command-style examples can be copied directly."
        pills={[
          { label: 'Pentesting Tools', value: String(TOOL_GUIDES.length) },
          { label: 'Categories', value: String(TOOL_GUIDE_CATEGORY_ORDER.length - 1) },
          { label: 'Format', value: 'Examples + notes' },
        ]}
      />

      <div className="skills-controls">
        <div className="skills-filter-group">
          <span className="skills-filter-label">Category</span>
          <div className="skills-filter-pills">
            {TOOL_GUIDE_CATEGORY_ORDER.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? 'skills-filter-pill active' : 'skills-filter-pill'}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="skills-grid">
        {visibleTools.map((tool) => (
          <article
            key={tool.id}
            id={`tool-guide-${tool.id}`}
            className={`skills-card tool-guides-card${highlightedId === tool.id ? ' tool-guides-card--highlighted' : ''}`}
          >
            <div className="skills-card-header">
              <div className="skills-card-labels">
                <span className="skills-cat-badge">{tool.category}</span>
              </div>
            </div>

            <h3 className="skills-card-name">{tool.name}</h3>

            <div className="tool-guides-examples" aria-label={`${tool.name} examples`}>
              <span className="tool-guides-examples-label">Examples</span>
              {tool.examples.map((example, index) => {
                const copyKey = `${tool.id}-${index}`
                return (
                  <div key={copyKey} className="tool-guides-example-row">
                    <code>{example}</code>
                    {tool.copyEnabled !== false && (
                      <button
                        type="button"
                        className="skills-copy-btn"
                        onClick={() => copyExample(example, copyKey)}
                      >
                        {copiedExampleKey === copyKey ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="skills-card-desc tool-guides-description">{tool.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
