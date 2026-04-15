import { useSEO } from '../hooks/useSEO'
import '../styles/pages/About.css'

export default function About() {
  useSEO({
    title: 'About R0uty\'s Cyber Lab',
    description: 'Learn about R0uty\'s Cyber Lab - a browser-first suite for guided security workflows, recon support, and privacy-friendly utility tools.',
    keywords: 'about r0utys cyber lab, security workflow tools, browser-first lab, recon tools'
  })

  return (
    <div className="tool-page about-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <span className="about-kicker">About the lab</span>
        <h1>About R0uty's Cyber Lab</h1>
        <p>A flow-driven browser suite for guided security work, learning, and fast local analysis.</p>
        <div className="about-header-meta">
          <div className="about-header-pill"><span>Privacy</span><strong>Browser-first</strong></div>
          <div className="about-header-pill"><span>Cost</span><strong>Free</strong></div>
          <div className="about-header-pill"><span>Focus</span><strong>Workflows + tools</strong></div>
        </div>
      </div>

      <div className="tool-container about-layout">
        <section className="info-box about-intro-panel">
          <h2>My Mission</h2>
          <p>
            R0uty's Cyber Lab exists to make repeatable security workflows easier to follow. Instead of offering only disconnected utilities, the lab combines guided Flow Maps with browser-first tools that support recon, enumeration, entry-point review, testing, vulnerability validation, and controlled proof work.
          </p>
        </section>

        <section className="info-box">
          <h2>Why I Built This</h2>
          <p>
            Too many online tools either ship your data to a server or help with only one tiny step in a larger process. I built this lab to give practitioners and learners a better alternative: clear workflow guidance paired with tools that run locally in the browser, so notes, tokens, payloads, and samples stay on your device.
          </p>
        </section>

        <section className="info-box">
          <h2>How the Suite Works</h2>
          <p>
            The lab is organized around two layers that work together:
          </p>
          <ul className="about-list">
            <li><strong>Flow Maps:</strong> Guided paths for recon, enumeration, entry-point analysis, testing, vulnerability review, and controlled validation</li>
            <li><strong>Browser utilities:</strong> Decoders, formatters, generators, parsers, and helpers you can open while following a flow or working a standalone task</li>
            <li><strong>Recommended external tools:</strong> Some flows call out tools like Nmap, ffuf, dirb, curl, or Burp Suite so users know what usually fits the step</li>
            <li><strong>Lab notes and context:</strong> The suite is designed to keep the next step visible instead of leaving users to rebuild the process from memory</li>
          </ul>
        </section>

        <section className="info-box">
          <h2>Privacy & Security</h2>
          <p>
            <strong>I take privacy seriously:</strong>
          </p>
          <ul className="about-list">
            <li>All built-in processing happens in your browser using JavaScript</li>
            <li>No data is sent to my servers or any third parties</li>
            <li>No cookies or tracking of any kind</li>
            <li>You can use these tools completely offline</li>
            <li>Your input is never logged or stored anywhere</li>
          </ul>
        </section>

        <section className="info-box">
          <h2>Educational Purpose</h2>
          <p>
            R0uty's Cyber Lab is designed to be useful in both practice and learning. The flows are meant to show how an authorized assessment can move from discovery to verification, while the supporting tools make it easy to inspect data and understand what you are seeing.
          </p>
          <p>
            <strong>Important Note:</strong> This suite is intended for authorized security work, training, and local analysis. Some tools include legacy algorithms or simplified examples for learning, and flows should be used responsibly inside approved environments.
          </p>
        </section>

        <section className="info-box">
          <h2>Technologies</h2>
          <p>
            R0uty's Cyber Lab is built with:
          </p>
          <ul className="about-list">
            <li><strong>React:</strong> Modern JavaScript library for building user interfaces</li>
            <li><strong>Vite:</strong> Fast, next-generation build tool</li>
            <li><strong>Browser APIs:</strong> Native web APIs for cryptography and utilities</li>
            <li><strong>crypto-js:</strong> JavaScript library for cryptographic functions</li>
            <li><strong>cronstrue:</strong> Library for parsing cron expressions to English</li>
          </ul>
        </section>

        <section className="info-box about-wide-panel">
          <h2>Why the Browser-First Model Matters</h2>
          <p>
            The lab stays fast because there is no upload queue or remote processing layer between you and the result. That makes it easier to move through a workflow quickly while keeping sensitive inputs local. The goal is simple: clear paths, useful tools, and less friction.
          </p>
        </section>
      </div>
    </div>
  )
}
