import { useSEO } from '../hooks/useSEO'
import '../styles/pages/About.css'

export default function About() {
  useSEO({
    title: 'About R0uty\'s Cyber Lab',
    description: 'Why I built this personal cyber lab, how I use it, and what you can expect from the flows, tools, and skill references.',
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
        <p>This is my personal cyber lab: a practical workspace I keep refining for authorized security testing and learning.</p>
        <div className="about-header-meta">
          <div className="about-header-pill"><span>Privacy</span><strong>Browser-first</strong></div>
          <div className="about-header-pill"><span>Cost</span><strong>Free</strong></div>
          <div className="about-header-pill"><span>Focus</span><strong>Usefulness</strong></div>
        </div>
      </div>

      <div className="tool-container about-layout">
        <section className="info-box about-intro-panel">
          <h2>My Mission</h2>
          <p>
            I built this lab to make repeatable security workflows easier to run. Instead of only collecting isolated utilities, I combine guided Flow Maps with browser-first tools so each step has practical support.
          </p>
        </section>

        <section className="info-box">
          <h2>Why I Built This</h2>
          <p>
            Most online tools either send data to a server or solve only one tiny part of the process. This lab is my answer: a personal collection I actually use, where guidance and utilities live together and your working data stays local.
          </p>
        </section>

        <section className="info-box">
          <h2>How the Suite Works</h2>
          <p>
            The lab is organized as connected building blocks:
          </p>
          <ul className="about-list">
            <li><strong>Flow Maps:</strong> Guided paths for recon, enumeration, entry-point analysis, testing, and validation</li>
            <li><strong>Browser utilities:</strong> Decoders, formatters, generators, parsers, and helpers for quick analysis</li>
            <li><strong>Pentesting references:</strong> Practical notes for tools like Nmap, ffuf, dirb, curl, and Burp Suite</li>
            <li><strong>Skill library:</strong> Structured skill cards for agent-assisted workflows and repeatable testing</li>
          </ul>
        </section>

        <section className="info-box">
          <h2>Privacy & Security</h2>
          <p>
            <strong>Privacy is a core rule in this project:</strong>
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
            I designed this lab to be useful in both real practice and learning. The flows show how an authorized assessment can move from discovery to verification, while the tools help you inspect data quickly and clearly.
          </p>
          <p>
            <strong>Important note:</strong> This suite is intended for authorized security work, training, and local analysis. Use it responsibly inside approved environments.
          </p>
        </section>

        <section className="info-box">
          <h2>Technologies</h2>
          <p>
            This lab is built with:
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
            Keeping the tools in the browser removes upload delays and keeps sensitive input local. The goal is simple: make this lab genuinely useful, not commercial noise.
          </p>
        </section>
      </div>
    </div>
  )
}
