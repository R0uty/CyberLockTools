import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import '../styles/pages/Contact.css'

export default function Contact() {
  useSEO({
    title: 'Contact R0uty - Cyber Lab',
    description: 'Send feedback about flows, tools, bugs, and workflow ideas for R0uty\'s Cyber Lab.',
    keywords: 'contact, feedback, workflow ideas, bug report, feature request'
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields')
      return
    }

    // Require at least one character before @, a label with no dots at the
    // start/end and no consecutive dots in the domain, and a TLD of 2+ chars.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email) || /\.{2,}/.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // For now, just show a success message (no actual email sending)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="tool-page contact-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <span className="contact-kicker">Get in touch</span>
        <h1>Get In Touch</h1>
        <p>Send feedback on the Flow Map, the browser tools, or the overall workflow experience you want this suite to support.</p>
        <div className="contact-header-meta">
          <div className="contact-header-pill"><span>Channel</span><strong>Demo inbox</strong></div>
          <div className="contact-header-pill"><span>Validation</span><strong>Browser-side</strong></div>
          <div className="contact-header-pill"><span>Best for</span><strong>Flows, bugs, ideas</strong></div>
        </div>
      </div>

      <div className="tool-container contact-container contact-layout">
        <section className="contact-form-panel">
          {submitted && (
            <div className="contact-success">
              Thank you for your message! Feedback on the suite, flows, and tools is always helpful.
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="textarea-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="contact-input"
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="contact-input"
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., New Flow Idea, Tool Feedback, Bug Report"
                className="contact-input"
              />
            </div>

            <div className="textarea-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me what flow is missing, what tool needs work, or what feels unclear..."
                className="textarea contact-input"
                rows="6"
              />
            </div>

            <button
              type="submit"
              className="contact-submit-btn"
            >
              Send Message
            </button>
          </form>
        </section>

        <aside className="contact-side-panel">
          <section className="info-box contact-info-box">
            <h2>What to send</h2>
            <p>
              Share bug reports, new flow ideas, missing tool suggestions, workflow pain points, copy issues, or anything that would make the suite easier to use.
            </p>
          </section>

          <section className="info-box contact-info-box">
            <h2>How this page works</h2>
            <p>
              The form validates locally in your browser. It is still a demo surface, so nothing is actually delivered anywhere, but the intent is to model a feedback channel for the suite.
            </p>
          </section>

          <section className="info-box contact-info-box">
            <h2>Good Feedback Topics</h2>
            <ul className="contact-list">
              <li><strong>Report a Bug:</strong> Let me know if a flow, page, or utility behaves incorrectly</li>
              <li><strong>Request a Flow:</strong> Suggest a missing recon, testing, or validation path</li>
              <li><strong>Request a Tool:</strong> Point out a browser-side helper that would support the workflows better</li>
              <li><strong>Share UX Feedback:</strong> Tell me where the suite feels clear, confusing, too big, or too thin</li>
            </ul>
            <p className="contact-note">
              In a production setup, this would connect to a real inbox or issue intake flow for the project.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
