import { useState } from 'react'
import { useSEO } from '../hooks/useSEO';
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

  // Get unique categories
  const categories = [...new Set(tools.map(tool => tool.category))].sort()

  const getDefaultCategory = (catList, preferred) =>
    preferred && catList.includes(preferred) ? preferred : catList[0] ?? ''

  const [selectedCategory, setSelectedCategory] = useState(
    () => getDefaultCategory(categories, initialCategory)
  )

  // Synchronize with initialCategory changes using previous-value tracking
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

  // Filter tools based on category and search query
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
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
        <div className="tool-header">
          <span className="tools-kicker">Tool index</span>
          <h1>General Tools &amp; Payloads</h1>
          <p>This is my working collection of browser-based utilities and payload helpers for practical analysis. Everything runs locally in your browser.</p>
          <div className="tools-header-meta">
            <div className="tools-header-pill">
              <span>Tools &amp; Payloads</span>
              <strong>{tools.length}</strong>
            </div>
          <div className="tools-header-pill">
            <span>Categories</span>
            <strong>{categoryCount}</strong>
          </div>
          <div className="tools-header-pill">
            <span>Processing</span>
            <strong>Local</strong>
          </div>
        </div>
      </div>

      <div className="tool-container">
        <section className="tools-grid tools-panel">
          <div className="tools-controls">
            {/* Search Bar */}
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

            {/* Category Tabs */}
            <div className="tools-category-tabs">
              <div className="tools-category-list">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                    }}
                    className={activeCategory === category ? 'tools-category-btn tools-category-btn--active' : 'tools-category-btn'}
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

          <div className="cards-container">
            {filteredTools.map((tool) => {
              const IconComponent = iconMap[tool.iconName] ?? Search01Icon
              return (
                <div
                  key={tool.title}
                  onClick={() => onToolClick(tool.title)}
                  className="tool-card-wrapper"
                >
                  <ToolCard
                    icon={<IconComponent size={32} color="currentColor" />}
                    title={tool.title}
                    description={tool.description}
                  />
                </div>
              )
            })}
          </div>
        </section>

        <section className="tools-benefits tools-panel">
          <span className="tools-section-kicker">Browse by focus</span>
          <h2>Tool Categories</h2>
          <div className="category-grid">
            <div className="category-item">
              <div className="icon-wrapper"><ArrowDataTransferHorizontalIcon size={32} color="#c0c0c0" /></div>
              <h3>Encoders & Decoders</h3>
              <ul>
                <li>ROT13 / Caesar Cipher</li>
                <li>Base64 Encoder/Decoder</li>
                <li>URL Encoder/Decoder</li>
              </ul>
            </div>
            <div className="category-item">
              <div className="icon-wrapper"><LockKeyIcon size={32} color="#c0c0c0" /></div>
              <h3>Hash & Cryptography</h3>
              <ul>
                <li>Hash Generator (MD5, SHA-1-512)</li>
                <li>JWT Debugger & Decoder</li>
              </ul>
            </div>
            <div className="category-item">
              <div className="icon-wrapper"><FileScriptIcon size={32} color="#c0c0c0" /></div>
              <h3>Formatters & Converters</h3>
              <ul>
                <li>JSON Formatter & Validator</li>
                <li>YAML Formatter & Converter</li>
                <li>Markdown Preview</li>
              </ul>
            </div>
            <div className="category-item">
              <div className="icon-wrapper"><Search01Icon size={32} color="#c0c0c0" /></div>
              <h3>Testers & Parsers</h3>
              <ul>
                <li>Regex Tester & Matcher</li>
                <li>Cron Expression Parser</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="tools-features tools-panel">
          <span className="tools-section-kicker">Why it works</span>
          <h2>Why These General Tools &amp; Payloads?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-wrapper"><LockKeyIcon size={32} color="#c0c0c0" /></div>
              <h3>100% Private & Secure</h3>
              <p>All processing happens in your browser. Your data never leaves your device.</p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><CheckmarkBadge01Icon size={32} color="#c0c0c0" /></div>
              <h3>Lightning Fast</h3>
              <p>Instant results with no queue or upload delay. Computation runs locally in your browser.</p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><BookOpen01Icon size={32} color="#c0c0c0" /></div>
              <h3>Educational</h3>
              <p>Use these tools to understand encoding, hashing, formatting, and pattern-matching behavior step by step.</p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><SmileIcon size={32} color="#c0c0c0" /></div>
              <h3>User-Friendly</h3>
              <p>Simple interfaces with clear input fields, readable output, and practical hints.</p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><CheckmarkBadge01Icon size={32} color="#c0c0c0" /></div>
              <h3>Built for Utility</h3>
              <p>This collection is maintained to be useful in real workflows, not to sell access.</p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><GlobeIcon size={32} color="#c0c0c0" /></div>
              <h3>Browser-Based</h3>
              <p>Works on any device with a modern web browser. No installation or downloads needed.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
