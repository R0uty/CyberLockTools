import React from 'react'
import { useState } from 'react'
import { useSEO } from '../hooks/useSEO';
import PageHeader from '../components/PageHeader';
import ToolCard from '../components/ToolCard';
import { Search01Icon, ArrowDataTransferHorizontalIcon, LockKeyIcon, BookOpen01Icon, SmileIcon, CheckmarkBadge01Icon, GlobeIcon } from 'hugeicons-react'
import '../styles/pages/Tools.css'
import {
  RotateClockwiseIcon,
  File01Icon,
  Link01Icon,
  HashtagIcon,
  Clock01Icon,
  LockIcon,
  FileScriptIcon,
  DocumentCodeIcon,
  Xml01Icon,
  Database01Icon,
  GridIcon,
  IdentityCardIcon,
  Calendar01Icon,
  PasswordValidationIcon,
  Ticket01Icon,
  MobileNavigator02Icon,
  IdeaIcon,
  CssFile02Icon,
  CommandLineIcon,
  AiSecurity02Icon,
  Bug02Icon,
  CodeIcon,
  GitPullRequestIcon,
  ComputerTerminal01Icon,
  Folder01Icon,
  BinaryCodeIcon,
  CellularNetworkIcon,
  DatabaseIcon,
  HtmlFiveIcon
} from 'hugeicons-react'

const iconMap = {
  RotateClockwiseIcon,
  File01Icon,
  Link01Icon,
  HashtagIcon,
  Clock01Icon,
  LockIcon,
  FileScriptIcon,
  DocumentCodeIcon,
  Search01Icon,
  Xml01Icon,
  Database01Icon,
  GridIcon,
  IdentityCardIcon,
  Calendar01Icon,
  PasswordValidationIcon,
  Ticket01Icon,
  MobileNavigator02Icon,
  IdeaIcon,
  CssFile02Icon,
  ArrowDataTransferHorizontalIcon,
  LockKeyIcon,
  BookOpen01Icon,
  SmileIcon,
  CheckmarkBadge01Icon,
  GlobeIcon,
  CommandLineIcon,
  AiSecurity02Icon,
  Bug02Icon,
  CodeIcon,
  GitPullRequestIcon,
  ComputerTerminal01Icon,
  Folder01Icon,
  BinaryCodeIcon,
  CellularNetworkIcon,
  DatabaseIcon,
  HtmlFiveIcon
}

export default function Tools({ tools, onToolClick, initialCategory = null }) {
  const [searchQuery, setSearchQuery] = useState('')

  useSEO({
    title: 'General Tools & Payloads - Personal Lab Collection',
    description: 'Browse my browser-based tool and payload collection for encoding, analysis, formatting, and practical security workflows.',
    keywords: 'general tools, payload generators, encoder, decoder, formatter, generator, browser tools, utilities',
  })

  const categories = [...new Set(tools.map(tool => tool.category))].sort()

  const getDefaultCategory = (catList, preferred) =>
    preferred && catList.includes(preferred) ? preferred : catList[0] ?? ''

  const [selectedCategory, setSelectedCategory] = useState(
    () => getDefaultCategory(categories, initialCategory)
  )

  const [prevInitialCategory, setPrevInitialCategory] = useState(initialCategory)
  if (prevInitialCategory !== initialCategory) {
    setPrevInitialCategory(initialCategory)
    const next = getDefaultCategory(categories, initialCategory)
    if (next !== selectedCategory) {
      setSelectedCategory(next)
    }
  }

  const hasSearchQuery = searchQuery.trim() !== ''
  const normalizedSearchQuery = searchQuery.toLowerCase()

  const filteredTools = tools.filter(tool => {
    const matchesCategory = hasSearchQuery ? true : tool.category === selectedCategory
    const matchesSearch = hasSearchQuery
      ? tool.title.toLowerCase().includes(normalizedSearchQuery) ||
        tool.description.toLowerCase().includes(normalizedSearchQuery) ||
        tool.category.toLowerCase().includes(normalizedSearchQuery)
      : true
    return matchesCategory && matchesSearch
  })
  const activeCategory = hasSearchQuery && filteredTools.length > 0
    ? filteredTools[0].category
    : selectedCategory
  const categoryCount = categories.length

  return (
    <div className="tool-page tools-page">
      <PageHeader
        kicker="Tool index"
        title="General Tools & Payloads"
        subtitle="Browser-based utilities and payload helpers for practical analysis. Everything runs locally."
        pills={[
          { label: 'Tools & Payloads', value: String(tools.length) },
          { label: 'Categories', value: String(categoryCount) },
          { label: 'Processing', value: 'Local' },
        ]}
      />

      <div className="tool-container">
        <section className="tools-grid tools-panel">
          <div className="tools-controls">
            <div className="tools-search-wrapper">
              <div className="tools-search-container">
                <Search01Icon
                  size={20}
                  color="#c0c0c0"
                  className="tools-search-icon"
                />
                <input
                  type="text"
                  placeholder="Search general tools and payloads across all categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="tools-search-input"
                  aria-label="Search tools and payloads"
                />
              </div>
              {filteredTools.length > 0 && (
                <p className="tools-search-results">
                  {hasSearchQuery
                    ? `Found ${filteredTools.length} matching entr${filteredTools.length !== 1 ? 'ies' : 'y'} across all categories`
                    : `Found ${filteredTools.length} entr${filteredTools.length !== 1 ? 'ies' : 'y'}`}
                </p>
              )}
              {filteredTools.length === 0 && hasSearchQuery && (
                <p className="tools-search-no-results">
                  No tools or payloads match your search. Try different keywords.
                </p>
              )}
            </div>

            <div className="tools-category-tabs">
              <div className="tools-category-list">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category)
                    }}
                    className={activeCategory === category ? 'tools-category-btn tools-category-btn--active' : 'tools-category-btn'}
                    aria-pressed={activeCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="tools-intro">
            <p>
              {hasSearchQuery
                ? `${filteredTools.length} matching entr${filteredTools.length !== 1 ? 'ies' : 'y'} across all categories, starting with ${activeCategory}:`
                : `${filteredTools.length} entr${filteredTools.length !== 1 ? 'ies' : 'y'} available in ${selectedCategory}:`}
            </p>
          </div>

          <div className="cards-container" role="list" aria-label="Tools listing">
            {filteredTools.map((tool) => {
              const IconComponent = iconMap[tool.iconName] ?? Search01Icon
              return (
                <div key={tool.title} role="listitem" className="tool-card-list-item">
                  <button
                    type="button"
                    onClick={() => onToolClick(tool.title)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onToolClick(tool.title)
                      }
                    }}
                    className="tool-card-wrapper tool-card-button"
                    aria-label={`Open ${tool.title} tool`}
                  >
                    <ToolCard
                      icon={<IconComponent size={32} color="currentColor" />}
                      title={tool.title}
                      description={tool.description}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
