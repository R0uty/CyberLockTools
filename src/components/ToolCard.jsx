import React from 'react'

export default function ToolCard({ icon, title, description }) {
  return (
    <div className="tool-card">
      <div className="tool-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  )
}
