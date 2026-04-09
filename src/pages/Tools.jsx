import { useState } from 'react'
import { useSEO } from '../hooks/useSEO';
import ToolCard from '../components/ToolCard';
import { Search01Icon, ArrowDataTransferHorizontalIcon, LockKeyIcon, BookOpen01Icon, SmileIcon, CheckmarkBadge01Icon, GlobeIcon } from 'hugeicons-react'
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
  CssFile02Icon
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
  GlobeIcon
}

export default function Tools({ tools, onToolClick }) {
  const [searchQuery, setSearchQuery] = useState('')

  useSEO({
    title: 'All Online Tools - Free Encoder, Decoder, Generator, Formatter',
    description: 'Browse all free online tools - ROT13, Base64, URL Encoder, Hash Generator, Cron Parser, JWT Debugger, JSON/YAML Formatter, Markdown Preview, and Regex Tester. Everything runs in your browser.',
    keywords: 'online tools, encoder, decoder, formatter, generator, parser, free tools, browser tools, utilities',
  });

  // Filter tools based on search query
  const filteredTools = searchQuery.trim() === '' 
    ? tools 
    : tools.filter(tool => 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>My Online Tools</h1>
        <p>Browse my complete collection of free online utilities for developers, security professionals, and students. All tools are secure, private, and run entirely in your browser.</p>
      </div>

      <div className="tool-container">
        <section className="tools-grid">
          {/* Search Bar */}
          <div style={{ marginBottom: '2rem', width: '100%' }}>
            <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
              <Search01Icon 
                size={20} 
                color="#c0c0c0" 
                style={{ 
                  position: 'absolute', 
                  left: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Search tools by name or function..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 20px 12px 50px',
                  fontSize: '16px',
                  border: '2px solid #4a4a4a',
                  borderRadius: '8px',
                  backgroundColor: '#1a1a1a',
                  color: '#e8e8e8',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#c0c0c0'}
                onBlur={(e) => e.target.style.borderColor = '#4a4a4a'}
              />
            </div>
            {filteredTools.length > 0 && (
              <p style={{ textAlign: 'center', color: '#a0a0a0', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
              </p>
            )}
            {filteredTools.length === 0 && searchQuery.trim() !== '' && (
              <p style={{ textAlign: 'center', color: '#808080', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                No tools match your search. Try different keywords.
              </p>
            )}
          </div>

          <div className="tools-intro">
            <p>{filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} available:</p>
          </div>

          <div className="cards-container">
            {filteredTools.map((tool, idx) => {
              const IconComponent = iconMap[tool.iconName]
              return (
                <div
                  key={idx}
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

        <section className="tools-benefits">
          <h2>Tool Categories</h2>
          <div className="category-grid">
            <div className="category-item">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><ArrowDataTransferHorizontalIcon size={32} color="#c0c0c0" /></div>
              <h3>Encoders & Decoders</h3>
              <ul>
                <li>ROT13 / Caesar Cipher</li>
                <li>Base64 Encoder/Decoder</li>
                <li>URL Encoder/Decoder</li>
              </ul>
            </div>
            <div className="category-item">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><LockKeyIcon size={32} color="#c0c0c0" /></div>
              <h3>Hash & Cryptography</h3>
              <ul>
                <li>Hash Generator (MD5, SHA-1-512)</li>
                <li>JWT Debugger & Decoder</li>
              </ul>
            </div>
            <div className="category-item">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><FileScriptIcon size={32} color="#c0c0c0" /></div>
              <h3>Formatters & Converters</h3>
              <ul>
                <li>JSON Formatter & Validator</li>
                <li>YAML Formatter & Converter</li>
                <li>Markdown Preview</li>
              </ul>
            </div>
            <div className="category-item">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><SearchRegexIcon size={32} color="#c0c0c0" /></div>
              <h3>Testers & Parsers</h3>
              <ul>
                <li>Regex Tester & Matcher</li>
                <li>Cron Expression Parser</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="tools-features">
          <h2>Why These Tools?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><LockKeyIcon size={32} color="#c0c0c0" /></div>
              <h3>100% Private & Secure</h3>
              <p>All processing happens in your browser. Your data never reaches our servers or leaves your device.</p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><BadgeCheckIcon size={32} color="#c0c0c0" /></div>
              <h3>Lightning Fast</h3>
              <p>Instant results with no waiting. All computations run locally in your web browser.</p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><BookIcon size={32} color="#c0c0c0" /></div>
              <h3>Educational</h3>
              <p>Learn about encoding, hashing, formatting, and pattern matching with built-in explanations.</p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><SmileIcon size={32} color="#c0c0c0" /></div>
              <h3>User-Friendly</h3>
              <p>Intuitive interfaces with clear inputs, live previews, and helpful tips for each tool.</p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><BadgeCheckIcon size={32} color="#c0c0c0" /></div>
              <h3>Free & Open</h3>
              <p>Completely free with no ads, registrations, or subscriptions required.</p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><GlobeIcon size={32} color="#c0c0c0" /></div>
              <h3>Browser-Based</h3>
              <p>Works on any device with a modern web browser. No installation or downloads needed.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
