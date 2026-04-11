import { useCallback, useEffect, useState } from 'react'
import { useSEO } from './hooks/useSEO'
import Header from './components/Header'
import HomeToolMap from './components/HomeToolMap'
import ROT from './pages/ROT'
import Base64 from './pages/Base64'
import URLEncoder from './pages/URLEncoder'
import HashGenerator from './pages/HashGenerator'
import CronParser from './pages/CronParser'
import JWTDebugger from './pages/JWTDebugger'
import JSONFormatter from './pages/JSONFormatter'
import YAMLFormatter from './pages/YAMLFormatter'
import MarkdownPreview from './pages/MarkdownPreview'
import RegexTester from './pages/RegexTester'
import XMLFormatter from './pages/XMLFormatter'
import SQLFormatter from './pages/SQLFormatter'
import CSVFormatter from './pages/CSVFormatter'
import UUIDGenerator from './pages/UUIDGenerator'
import TimestampConverter from './pages/TimestampConverter'
import PasswordGenerator from './pages/PasswordGenerator'
import JWTEncoder from './pages/JWTEncoder'
import {
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
  LockKeyIcon,
  CheckmarkBadge01Icon,
  BookOpen01Icon,
  SmileIcon,
  ArrowDataTransferHorizontalIcon,
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
  DatabaseIcon
} from 'hugeicons-react'
import QRCodeGenerator from './pages/QRCodeGenerator'
import ColorConverter from './pages/ColorConverter'
import CSSBeautifier from './pages/CSSBeautifier'
import HTMLEncoder from './pages/HTMLEncoder'
import CSPGenerator from './pages/CSPGenerator'
import ReverseShellGenerator from './pages/ReverseShellGenerator'
import XXEGenerator from './pages/XXEGenerator'
import XSSGenerator from './pages/XSSGenerator'
import SQLInjectionGenerator from './pages/SQLInjectionGenerator'
import GraphQLInjectionGenerator from './pages/GraphQLInjectionGenerator'
import HTTPParameterPollutionGenerator from './pages/HTTPParameterPollutionGenerator'
import CommandInjectionGenerator from './pages/CommandInjectionGenerator'
import LDAPInjectionGenerator from './pages/LDAPInjectionGenerator'
import PathTraversalGenerator from './pages/PathTraversalGenerator'
import NumberBaseConverter from './pages/NumberBaseConverter'
import SubnetCalculator from './pages/SubnetCalculator'
import Tools from './pages/Tools'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'
import './App.extra.css'

export default function App() {
  const [currentTool, setCurrentTool] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [currentCategory, setCurrentCategory] = useState(null)

  useSEO({
    title: "R0uty's Cyber Lab - My Free Online Tools Suite",
    description: "R0uty's Cyber Lab - My collection of powerful online utilities for encoding, hashing, formatting, and generation. All tools run securely in your browser with zero server uploads.",
    keywords: 'online tools, encoder decoder, hash generator, base64, rot13, url encoder, cron parser, free tools, r0uty'
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
    applyNavigationState(initialState)

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

  const tools = [
    // Encoding & Decoding
    {
      category: 'Encoding & Decoding',
      iconName: 'RotateClockwiseIcon',
      title: 'ROT',
      description: 'Encode and decode ROT13 and ROT47 cipher text.'
    },
    {
      category: 'Encoding & Decoding',
      iconName: 'File01Icon',
      title: 'Base64',
      description: 'Encode and decode Base64 strings.'
    },
    {
      category: 'Encoding & Decoding',
      iconName: 'Link01Icon',
      title: 'URL Encoder',
      description: 'Encode and decode URLs for safe web transmission.'
    },
    {
      category: 'Encoding & Decoding',
      iconName: 'HtmlFiveIcon',
      title: 'HTML Encoder',
      description: 'Encode text to HTML entities and decode HTML entities back to plain text.'
    },
    // Hashing & Tokens
    {
      category: 'Hashing & Tokens',
      iconName: 'HashtagIcon',
      title: 'Hash Generator',
      description: 'Generate MD5, SHA1, SHA256, and more hash algorithms.'
    },
    {
      category: 'Hashing & Tokens',
      iconName: 'LockIcon',
      title: 'JWT Debugger',
      description: 'Decode and debug JWT tokens to see their content.'
    },
    {
      category: 'Hashing & Tokens',
      iconName: 'Ticket01Icon',
      title: 'JWT Encoder',
      description: 'Create and verify JWT tokens with custom payload and signature.'
    },
    // Formatters & Converters
    {
      category: 'Formatters & Converters',
      iconName: 'FileScriptIcon',
      title: 'JSON Formatter',
      description: 'Format and validate JSON with proper indentation.'
    },
    {
      category: 'Formatters & Converters',
      iconName: 'File01Icon',
      title: 'YAML Formatter',
      description: 'Format YAML files and convert to JSON.'
    },
    {
      category: 'Formatters & Converters',
      iconName: 'DocumentCodeIcon',
      title: 'Markdown Preview',
      description: 'Convert and preview markdown with live rendering.'
    },
    {
      category: 'Formatters & Converters',
      iconName: 'Xml01Icon',
      title: 'XML Formatter',
      description: 'Format and validate XML with proper indentation.'
    },
    {
      category: 'Formatters & Converters',
      iconName: 'Database01Icon',
      title: 'SQL Formatter',
      description: 'Format and validate SQL queries with proper indentation.'
    },
    {
      category: 'Formatters & Converters',
      iconName: 'GridIcon',
      title: 'CSV Formatter',
      description: 'Parse, format, and convert CSV to/from JSON.'
    },
    {
      category: 'Formatters & Converters',
      iconName: 'IdeaIcon',
      title: 'Color Converter',
      description: 'Convert between HEX, RGB, HSL, and HSV color formats with live preview.'
    },
    {
      category: 'Formatters & Converters',
      iconName: 'CssFile02Icon',
      title: 'CSS Beautifier',
      description: 'Format, minify, and validate CSS with file size optimization analysis.'
    },
    {
      category: 'Formatters & Converters',
      iconName: 'BinaryCodeIcon',
      title: 'Number Base Converter',
      description: 'Convert numbers between binary, octal, decimal, and hexadecimal with prefix and bit-length output.'
    },
    // Generators
    {
      category: 'Generators',
      iconName: 'IdentityCardIcon',
      title: 'UUID Generator',
      description: 'Generate and validate UUID v1 and v4 identifiers.'
    },
    {
      category: 'Generators',
      iconName: 'PasswordValidationIcon',
      title: 'Password Generator',
      description: 'Generate secure passwords with customizable options and strength analysis.'
    },
    {
      category: 'Generators',
      iconName: 'MobileNavigator02Icon',
      title: 'QR Code Generator',
      description: 'Generate QR codes from text, URLs, and contact information.'
    },
    // Analyzers & Parsers
    {
      category: 'Analyzers & Parsers',
      iconName: 'Clock01Icon',
      title: 'Cron Parser',
      description: 'Parse and understand cron expressions easily.'
    },
    {
      category: 'Analyzers & Parsers',
      iconName: 'Search01Icon',
      title: 'Regex Tester',
      description: 'Test regex patterns with live matching and highlighting.'
    },
    {
      category: 'Analyzers & Parsers',
      iconName: 'Calendar01Icon',
      title: 'Timestamp Converter',
      description: 'Convert between Unix timestamps and human-readable dates.'
    },
    {
      category: 'Analyzers & Parsers',
      iconName: 'LockKeyIcon',
      title: 'CSP Generator & Analyzer',
      description: 'Build Content-Security-Policy headers, generate meta tags, and analyze pasted CSP strings for risky directives.'
    },
    // Penetration Testing Tools
    {
      category: 'Penetration Testing',
      iconName: 'CommandLineIcon',
      title: 'Reverse Shell Generator',
      description: 'Generate reverse shell payloads for authorized penetration testing. Supports bash, python, PHP, perl, ruby, netcat, and PowerShell.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'AiSecurity02Icon',
      title: 'XXE Generator',
      description: 'Generate XXE (XML External Entity) payloads for authorized security testing. Includes file disclosure, SSRF, and blind XXE techniques.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'Bug02Icon',
      title: 'XSS Generator',
      description: 'Generate XSS (Cross-Site Scripting) payloads for authorized web security testing. Includes stored, reflected, DOM-based, and WAF bypass techniques.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'Database01Icon',
      title: 'SQL Injection Generator',
      description: 'Generate SQL injection payloads for authorized security testing. Includes union-based, blind, time-based, and error-based techniques.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'CodeIcon',
      title: 'GraphQL Injection Generator',
      description: 'Generate GraphQL injection and introspection payloads for authorized security testing. Includes schema enumeration, authentication bypass, and DoS techniques.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'GitPullRequestIcon',
      title: 'HTTP Parameter Pollution Generator',
      description: 'Generate HTTP parameter pollution payloads for authorized security testing. Includes WAF bypass, cache poisoning, and backend confusion techniques.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'ComputerTerminal01Icon',
      title: 'Command Injection Generator',
      description: 'Generate OS command injection payloads for authorized security testing. Includes basic, blind, filter bypass, Windows, Linux, data exfiltration, and OOB techniques.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'DatabaseIcon',
      title: 'LDAP Injection Generator',
      description: 'Generate LDAP injection payloads for authorized security testing. Includes authentication bypass, information disclosure, blind injection, and search filter manipulation.'
    },
    {
      category: 'Penetration Testing',
      iconName: 'Folder01Icon',
      title: 'Path Traversal Generator',
      description: 'Generate path traversal (directory traversal / LFI) payloads for authorized security testing. Includes basic, encoded, filter-bypass, Windows, Linux, and null-byte techniques.'
    },
    {
      category: 'Analyzers & Parsers',
      iconName: 'CellularNetworkIcon',
      title: 'IP Subnet Calculator',
      description: 'Calculate subnet details from CIDR notation: network address, broadcast, subnet mask, usable hosts, and more.'
    }
  ]
  const toolCategoryCount = [...new Set(tools.map((tool) => tool.category))].length

  const toolComponents = {
    ROT,
    Base64,
    'URL Encoder': URLEncoder,
    'Hash Generator': HashGenerator,
    'Cron Parser': CronParser,
    'JWT Debugger': JWTDebugger,
    'JSON Formatter': JSONFormatter,
    'YAML Formatter': YAMLFormatter,
    'Markdown Preview': MarkdownPreview,
    'Regex Tester': RegexTester,
    'XML Formatter': XMLFormatter,
    'SQL Formatter': SQLFormatter,
    'CSV Formatter': CSVFormatter,
    'UUID Generator': UUIDGenerator,
    'Timestamp Converter': TimestampConverter,
    'Password Generator': PasswordGenerator,
    'JWT Encoder': JWTEncoder,
    'QR Code Generator': QRCodeGenerator,
    'Color Converter': ColorConverter,
    'CSS Beautifier': CSSBeautifier,
    'HTML Encoder': HTMLEncoder,
    'CSP Generator & Analyzer': CSPGenerator,
    'Reverse Shell Generator': ReverseShellGenerator,
    'XXE Generator': XXEGenerator,
    'XSS Generator': XSSGenerator,
    'SQL Injection Generator': SQLInjectionGenerator,
    'GraphQL Injection Generator': GraphQLInjectionGenerator,
    'HTTP Parameter Pollution Generator': HTTPParameterPollutionGenerator,
    'Command Injection Generator': CommandInjectionGenerator,
    'LDAP Injection Generator': LDAPInjectionGenerator,
    'Path Traversal Generator': PathTraversalGenerator,
    'Number Base Converter': NumberBaseConverter,
    'IP Subnet Calculator': SubnetCalculator
  }

  const renderFooter = () => (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <strong>R0uty&apos;s Cyber Lab</strong>
          <p>{tools.length}+ browser-based tools for encoding, analysis, formatting, generation, and security workflows.</p>
        </div>
        <div className="site-footer-links">
          <button className="site-footer-link" onClick={() => handlePageChange('tools')}>Tools</button>
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
        {showMap && (
          <HomeToolMap
            tools={tools}
            onToolClick={handleToolClick}
            onCategoryClick={handleCategoryClick}
          />
        )}
        <div className="main-content">
          {content}
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

  if (currentPage === 'contact') {
    return renderAppShell(<Contact />)
  }

  return renderAppShell(
    <>
      <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">Browser-first cyber lab</span>
            <h1>Welcome to My Cyber Lab</h1>
            <p>Hey there! I&apos;m R0uty, and this is my collection of {tools.length}+ browser-based utilities for encoding, analysis, formatting, generation, and security testing workflows. Everything runs locally in your browser, so your data stays on your device.</p>
            <div className="hero-actions">
              <button className="cta-button" onClick={() => handlePageChange('tools')}>Browse My Tools</button>
              <button className="hero-secondary-button" onClick={() => handlePageChange('about')}>About the Lab</button>
            </div>
          </div>

          <div className="hero-summary">
            <div className="hero-summary-card">
              <span className="hero-summary-label">Tools</span>
              <strong>{tools.length}+</strong>
              <p>Utilities for daily dev work and security workflows.</p>
            </div>
            <div className="hero-summary-card">
              <span className="hero-summary-label">Categories</span>
              <strong>{toolCategoryCount}</strong>
              <p>Structured into focused sections so the lab stays easy to browse.</p>
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
            <h2>Built to feel fast, private, and useful every time you open it</h2>
            <p>I wanted one place for the kinds of tools I keep reaching for during development, debugging, studying, and security work — without uploads, clutter, or unnecessary friction.</p>
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
                <p>Many tools include context and examples so the lab is useful both for work and for learning.</p>
              </div>
            </article>
            <article className="feature-item">
              <div className="feature-icon-wrapper"><SmileIcon size={28} color="#c0c0c0" /></div>
              <div className="feature-copy">
                <h3>Low-friction UX</h3>
                <p>Simple inputs, clear outputs, and focused flows keep the experience lightweight instead of noisy.</p>
              </div>
            </article>
          </div>
        </section>
    </>,
    { showMap: true }
  )
}
