import { useState } from 'react'
import Header from './components/Header'
import ToolCard from './components/ToolCard'
import ROT from './pages/ROT'
import Base64 from './pages/Base64'
import URLEncoder from './pages/URLEncoder'
import HashGenerator from './pages/HashGenerator'
import './App.css'

export default function App() {
  const [currentTool, setCurrentTool] = useState(null)

  const tools = [
    {
      icon: '🔄',
      title: 'ROT',
      description: 'Encode and decode ROT13 and ROT47 cipher text.'
    },
    {
      icon: '📝',
      title: 'Base64',
      description: 'Encode and decode Base64 strings.'
    },
    {
      icon: '🔗',
      title: 'URL Encoder',
      description: 'Encode and decode URLs for safe web transmission.'
    },
    {
      icon: '#️⃣',
      title: 'Hash Generator',
      description: 'Generate MD5, SHA1, SHA256, and more hash algorithms.'
    },
    {
      icon: '⏰',
      title: 'Cron Parser',
      description: 'Parse and understand cron expressions easily.'
    }
  ]

  const handleToolClick = (title) => {
    setCurrentTool(title)
  }

  const handleLogoClick = () => {
    setCurrentTool(null)
  }

  if (currentTool === 'ROT') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} />
        <div className="main-content">
          <ROT />
        </div>
      </div>
    )
  }

  if (currentTool === 'Base64') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} />
        <div className="main-content">
          <Base64 />
        </div>
      </div>
    )
  }

  if (currentTool === 'URL Encoder') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} />
        <div className="main-content">
          <URLEncoder />
        </div>
      </div>
    )
  }

  if (currentTool === 'Hash Generator') {
    return (
      <div className="app">
        <Header onLogoClick={handleLogoClick} />
        <div className="main-content">
          <HashGenerator />
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header onLogoClick={handleLogoClick} />
      <main className="main-content">
        <section className="hero">
          <h2>Welcome to CyberLock Tools</h2>
          <p>Your toolkit for encoding, hashing, and automation utilities</p>
        </section>

        <section className="tools-grid">
          <h3>Our Tools</h3>
          <div className="cards-container">
            {tools.map((tool, idx) => (
              <div 
                key={idx}
                onClick={() => handleToolClick(tool.title)}
              >
                <ToolCard 
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="cta">
          <h3>Ready to Use CyberLock Tools?</h3>
          <p>Select a tool above to get started with encoding, decoding, hashing, and automation.</p>
          <button className="cta-button">Explore Tools</button>
        </section>
      </main>
    </div>
  )
}
